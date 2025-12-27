"use server";

import { prisma } from "@/lib/prisma";
import { Role } from "@/lib/utils";

async function checkLogin(data : { userName : string , password: string, role : "Admin" | "Manager" | "Member"}){
    await prisma.users.findFirst({})
}

async function addUser(userName : string, password : string ,email: string , role : Role) {

    const us = await prisma.users.create({
        data : {
            userName : userName,
            passwordHash : password,
            email : email,
            createdAt : new Date(),
        }
    });

    console.log("user Id ", us);
    const res = await prisma.userRoles.create({
        data:{
            userId : us.userId,
            roleName: role
        }
    });
    const allusers = await prisma.users.findMany();
    console.log("data = ", allusers);
       
}

async function deleteUser(userId : number) {
    const us = await prisma.users.delete({
        where : {
            userId : userId
        }
    });
    
    const allusers = await prisma.users.findMany();
    console.log("data = ", allusers);
}

export {checkLogin, addUser, deleteUser}