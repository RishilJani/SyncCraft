"use server";

import { prisma } from "@/lib/prisma";
import { Role } from "@/app/utils";
import bcrypt from 'bcryptjs';
import { cookies } from "next/headers";

// Login Logic
async function checkLogin(data: { userName: string, password: string, role: Role }): Promise<boolean> {
    const { userName, password, role } = data;

    const user = await prisma.users.findUnique({
        select: {
            userName: true,
            passwordHash: true,
            role : true,
            userId: true,
        },
        where: {
            userName: userName,
            role: role 
        }
    });
    console.log("User = ", user);

    if (!user) {
        return false;
    }
    if (! await bcrypt.compare(password, user.passwordHash)) {
        console.log("password not matched");
        return false;
    }
    console.log("role = ", role);
    const cookie = await cookies();  
    cookie.set("id",user.userId+"");
    cookie.set("userName",user.userName);
    cookie.set("role",user.role);
    return true;
}

// sign up Logic
async function addUser(userName: string, password: string, email: string, role: Role) {

    try {
        const user = await prisma.users.create({
            data: {
                userName: userName,
                passwordHash: bcrypt.hashSync(password, Number.parseInt(process.env.SALT!)),
                email: email,
                createdAt: new Date(),
                role : role
            }
        });
        console.log("user Id ", user);
        const cookie = await cookies();  
        cookie.set("id",user.userId+"");
        cookie.set("userName",user.userName);
        cookie.set("role",user.role);
    } catch (err) {
        console.log("Some Error Occured in add User ");
        console.log(err);
    }
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



async function getAllUsers(){
    
}

async function getUser() {
    try {
        const cookie = await cookies();
        const id = cookie.get("id")?.value;
        const name = cookie.get("userName")?.value;
        const role = cookie.get("role")?.value;
        console.log("GetUser = ");
        console.log(id,name,role);
        if(id && name && role){
            return {
                id,
                name,
                role
            };
        }else{
            throw Error("User Not Found");
        }
    } catch (err) {
        console.log("Some Error Occured in get User ");
        console.log(err);
    }
}
export { checkLogin, addUser, deleteUser, getUser }