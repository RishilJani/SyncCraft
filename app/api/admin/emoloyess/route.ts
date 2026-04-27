import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { role_enum } from "@/app/generated/prisma/enums";
import { putUserCookie } from "@/app/actions/users/userFunctions";
import { ErrorResponse, MyResponse } from "@/app/(utils)/utils";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        const users = await prisma.users.findMany({
            where: {
                role: {
                    in: [role_enum.manager, role_enum.member]
                }
            },
            select: {
                userId: true,
                userName: true,
                email: true,
                role: true,
            }
        });
        return NextResponse.json(users);
    } catch (error) {
        console.error("Error fetching employees:", error);
        return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const salt = process.env.SALT ? Number.parseInt(process.env.SALT) : 10;
        const hashedPassword = bcrypt.hashSync(body.password, salt);

        const user = await prisma.users.create({
            data: {
                userName: body.userName,
                passwordHash: hashedPassword,
                email: body.email,
                createdAt: new Date(),
                role: body.role,
            }
        });
        await putUserCookie(user);

        return MyResponse(false, "Added Successfully", user, { status: 200 });
    } catch (err: any) {
        console.error("Error creating user:", err);
        return ErrorResponse(err);

    }
}