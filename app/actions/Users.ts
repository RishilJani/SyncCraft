"use server";

import { prisma } from "@/lib/prisma";
import { Role } from "@/app/utils";
import bcrypt from 'bcryptjs';

// Login Logic
async function checkLogin(data: { userName: string, password: string, role: Role }): Promise<boolean> {
    const { userName, password, role } = data;
    // const password = formData.get("password") as string;
    // const role = formData.get("role") as Role;

    const us = await prisma.users.findUnique({
        select: {
            userName: true,
            passwordHash: true,
            userId: true,
        },
        where: {
            userName: userName,
        }
    });
    console.log("User = ", us);

    if (!us) {
        return false;
    }
    if (! await bcrypt.compare(password, us.passwordHash)) {
        console.log("password not matched");
        return false;
    }

    const roleResult = await prisma.userRoles.findFirst({
        where: {
            AND: {
                userId: us?.userId,
                roleName: role,
            }
        }
    });

    console.log("role = ", role);
    if (!role) {
        return false;
    }
    return true;
}

// sign up Logic
async function addUser(userName: string, password: string, email: string, role: Role) {

    const us = await prisma.users.create({
        data: {
            userName: userName,
            passwordHash: bcrypt.hashSync(password, Number.parseInt(process.env.SALT!)),
            email: email,
            createdAt: new Date(),
        }
    });

    console.log("user Id ", us);
    const res = await prisma.userRoles.create({
        data: {
            userId: us.userId,
            roleName: role
        }
    });
    const allusers = await prisma.users.findMany();
    console.log("data = ", allusers);

}

// to delete a user
async function deleteUser(userId: number) {
    const us = await prisma.users.delete({
        where: {
            userId: userId
        }
    });

    const allusers = await prisma.users.findMany();
    console.log("data = ", allusers);
}

export { checkLogin, addUser, deleteUser }