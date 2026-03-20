import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { role_enum } from "@/app/generated/prisma/enums";

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
