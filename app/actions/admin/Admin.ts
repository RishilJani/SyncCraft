"use server"

import { Status } from "@/app/utils";
import { prisma } from "@/lib/prisma";


async function addProject(
    { 
        projectName,
        description, 
        createdBy, 
        dueDate ,
        managerId,
        memberIds,
    }: { 
        projectName: string, 
        description: string, 
        createdBy: number, 
        dueDate: Date,
        managerId : number,
        memberIds: number[]
    }) {
    const createdAt = Date();
    try {
        const project = await prisma.projects.create({
            data: {
                projectName,
                description,
                createdBy,
                createdAt,
                dueDate,
                status: Status.Todo,
            }
        });

        const userProject =await  prisma.user_projects.create({

        });

        console.log("Project Added ");
        console.log(project);
        
        return true;
    } catch (err) {
        console.log("Some Error Occured at actions/admin/Admin.ts/addProject");
        console.log(err);
        return false;
    }
}

export { addProject };