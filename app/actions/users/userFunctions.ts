"use server"

import { cookies } from "next/headers";
import { User } from "../../(types)/myTypes";
import { role_enum } from "../../generated/prisma/enums";
import { prisma } from "@/lib/prisma";

// Cookie consts
const USER_ID = "userId";
const USER_NAME = "userName";
const EMAIL = "email";
const ROLE = "role";
const CREATED_AT = "createdAt";

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




export async function logout() {
    const cookie = await cookies();
    cookie.delete(USER_ID);
    cookie.delete(USER_NAME);
    cookie.delete(EMAIL);
    cookie.delete(ROLE);
    cookie.delete(CREATED_AT);
}

export async function getUser() {
    try {
        const user = await getUserCookie();
        return user;
    } catch (err) {
        console.error("Error getting current user:", err);
        return null;
    }
}

export async function getUserCookie() {
    try {
        const cookieStore = await cookies();
        const userIdVal = cookieStore.get(USER_ID)?.value;
        if (!userIdVal) return null;

        const user: User = {
            userId: Number(userIdVal),
            userName: cookieStore.get(USER_NAME)?.value,
            email: cookieStore.get(EMAIL)?.value,
            role: cookieStore.get(ROLE)?.value as role_enum,
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