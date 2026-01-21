"use server"

import { Status } from "@/app/utils";
import { prisma } from "@/lib/prisma";

async function getAllProject() {
    try {
        const projects = await prisma.projects.findMany();
        return projects;
    } catch (err) {
        console.log("Some error occured in getAllProject");
        console.log(err);
    }
}

async function addProject({ projectName, description,  createdBy,  dueDate ,managerId,memberIds }: { 
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
        console.log(project);
        const userProject = await prisma.user_projects.create({
            data:{
                userid: managerId,
                projectid: project.projectId
            }
        });

        memberIds.forEach(async (id)=>{
            await prisma.user_projects.create({
                data:{
                    userid: id,
                    projectid : project.projectId
                }
            });
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



export { addProject, getAllProject };