import { MyResponse, ErrorResponse } from "@/app/(utils)/utils";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        const user = await prisma.users.findUnique({
            where: { email },
        });

        if (!user) {
            // Always return success even if user doesn't exist to prevent email enumeration
            return MyResponse(false, "If that email exists, a reset link was sent.", null, { status: 200 });
        }

        // Create a stateless token using email and expiration time
        const payload = JSON.stringify({
            email: user.email,
            exp: Date.now() + 15 * 60 * 1000 // 15 mins
        });
        const base64Payload = Buffer.from(payload).toString('base64url');

        // Sign the token with a secret that includes the user's current password hash.
        // This ensures the token becomes invalid IMMEDIATELY after the password is changed.
        const tokenSecret = `${process.env.JWT_SECRET || 'secret'}-${user.passwordHash}`;
        const signature = crypto.createHmac('sha256', tokenSecret).update(base64Payload).digest('base64url');

        const resetToken = `${base64Payload}.${signature}`;

        // Use Ethereal for testing or configure your real SMTP
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const resetUrl = `${process.env.PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

        const info = await transporter.sendMail({
            from: '"SyncCraft Admin" <admin@synccraft.com>',
            to: email,
            subject: "Password Reset Request <no-reply>",
            text: `You requested a password reset. Please click the following link to reset your password: ${resetUrl}`,
            html: `<p>You requested a password reset. Please click the following link to reset your password: <a href="${resetUrl}">Reset Password</a></p><p>This link is valid for 15 minutes.</p>`,
        });

        return MyResponse(false, "Reset link sent.", null, { status: 200 });
    } catch (err) {
        console.error('Error at forgot-password/POST:', err);
        return ErrorResponse(err);
    }
}
