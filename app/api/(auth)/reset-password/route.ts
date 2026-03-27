import { MyResponse, ErrorResponse } from "@/app/(utils)/utils";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { token, newPassword } = body;

        if (!token || !newPassword) {
            return MyResponse(true, "Token and new password are required", null, { status: 400 });
        }

        const [base64Payload, signature] = token.split('.');

        if (!base64Payload || !signature) {
            return MyResponse(true, "Invalid token format", null, { status: 400 });
        }

        let payload;
        try {
            const decodedPayload = Buffer.from(base64Payload, 'base64url').toString('utf-8');
            payload = JSON.parse(decodedPayload);
        } catch (err) {
            return MyResponse(true, "Invalid token payload", null, { status: 400 });
        }

        const { email, exp } = payload;

        if (!email || !exp || Date.now() > exp) {
            return MyResponse(true, "Token is invalid or has expired", null, { status: 400 });
        }

        const user = await prisma.users.findUnique({
            where: { email }
        });

        if (!user) {
            return MyResponse(true, "Invalid or expired reset token", null, { status: 400 });
        }

        const tokenSecret = `${process.env.JWT_SECRET || 'secret'}-${user.passwordHash}`;
        const expectedSignature = crypto.createHmac('sha256', tokenSecret).update(base64Payload).digest('base64url');

        if (signature !== expectedSignature) {
            return MyResponse(true, "Invalid or expired reset token", null, { status: 400 });
        }

        const salt = process.env.SALT ? Number.parseInt(process.env.SALT) : 10;
        const hashedPassword = bcrypt.hashSync(newPassword, salt);

        await prisma.users.update({
            where: { userId: user.userId },
            data: {
                passwordHash: hashedPassword,
            }
        });

        return MyResponse(false, "Password reset successfully", null, { status: 200 });
    } catch (err) {
        console.error('Error at reset-password/POST:', err);
        return ErrorResponse(err);
    }
}
