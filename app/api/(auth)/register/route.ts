import { putUserCookie } from "@/app/actions/users/Users";
import { ErrorResponse, MyResponse } from "@/app/utils";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        // const salt = process.env.SALT ? Number.parseInt(process.env.SALT) : 10;
        // const hashedPassword = bcrypt.hashSync(body.password, salt);
        const hashedPassword = body.password;

        const user = await prisma.users.create({
            data: {
                userName: body.userName,
                passwordHash: hashedPassword,
                email: body.email,
                createdAt: new Date(),
                role: body.role,
            }
        });
        console.log("User created:", user.userId);
        await putUserCookie(user);

        return MyResponse(false,"Added Successfully", user, {status : 200});
    } catch (err : any) {
        console.error("Error creating user:", err);
        return ErrorResponse(err);
        
    }
}