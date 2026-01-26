"use server";

import { prisma } from "@/lib/prisma";
import { Role, Users } from "@/app/utils";
import bcrypt from 'bcryptjs';
import { cookies } from "next/headers";


// Cookie consts
const USER_ID = "userId";
const USER_NAME = "userName";
const EMAIL = "email";
const ROLE = "role";
const CREATED_AT = "createdAt";


// sign up Logic
export async function addUser(userName: string, password: string, email: string, role: Role) {
    try {
        const salt = process.env.SALT ? Number.parseInt(process.env.SALT) : 10;
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = await prisma.users.create({
            data: {
                userName: userName,
                passwordHash: hashedPassword,
                email: email,
                createdAt: new Date(),
                role: role
            }
        });
        console.log("User created:", user.userId);

        await putUserCookie(user);
        return true;
    } catch (err) {
        console.error("Error creating user:", err);
        return false;
    }
}

// Logout Logic
export async function logout() {
    const cookie = await cookies();
    cookie.delete(USER_ID);
    cookie.delete(USER_NAME);
    cookie.delete(EMAIL);
    cookie.delete(ROLE);
    cookie.delete(CREATED_AT);
}

// to delete a user
export async function deleteUser(userId: number) {
    try {
        await prisma.users.delete({
            where: {
                userId: userId
            }
        });
    } catch (error) {
        console.error("Error deleting user:", error);
    }
}

export async function getAllUsers() {
    try {
        const users = await prisma.users.findMany({
            select: {
                userId: true,
                userName: true,
                email: true,
                role: true,
            }
        });

        return users;
    } catch (err) {
        console.error('Error fetching all users:', err);
        return [];
    }
}

export async function getUser() {
    try {
        const user = await getUserCookie();
        return user;
    } catch (err) {
        console.error("Error getting current user:", err);
        return null; // Return null instead of throwing to handle UI gracefully
    }
}

export async function getUserCookie() {
    try {
        const cookieStore = await cookies();
        const userIdVal = cookieStore.get(USER_ID)?.value;
        if (!userIdVal) return null;

        const user: Users = {
            userId: Number(userIdVal),
            userName: cookieStore.get(USER_NAME)?.value,
            email: cookieStore.get(EMAIL)?.value,
            role: cookieStore.get(ROLE)?.value as Role,
            createdAt: cookieStore.get(CREATED_AT)?.value ? new Date(cookieStore.get(CREATED_AT)?.value!) : undefined,
        };

        return user;
    } catch (err) {
        console.error('Error reading user cookie:', err);
        return null;
    }
}

export async function putUserCookie(user: any) {
    const cookieStore = await cookies();
    const oneDay = 24 * 60 * 60 * 1000;
    const expires = Date.now() + oneDay;

    const options = {
        path: '/',
        expires: expires,
    };

    cookieStore.set(USER_ID, user.userId.toString(), options);
    cookieStore.set(USER_NAME, user.userName, options);
    cookieStore.set(EMAIL, user.email, options);
    cookieStore.set(ROLE, user.role, options);
    if (user.createdAt) {
        cookieStore.set(CREATED_AT, user.createdAt.toString(), options);
    }
}

