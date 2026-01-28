import { ErrorResponse, MyResponse } from "@/app/utils";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(request :Request, {params} : {params : Promise<{id : string}>}) {
    try{
        const {id} = await params;
        
        const project = await prisma.projects.findFirst({
            where:{
                projectId : Number(id),
            }
        });
        console.log("Project = ", project);
        if(!project){
            return MyResponse(true,"Project not found", null, {status : 404});
        }
        return MyResponse(false,"Project Found", project, {status : 200});
    }catch(err){
    
        console.log('Some Error Occured at api/projects/ Get by ID');
        console.log(err)
        return ErrorResponse(err);
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { projectName, description, dueDate, managerId, memberIds } = await request.json();

        // Update project details
        const project = await prisma.projects.update({
            where: {
                projectId: Number(id),
            },
            data: {
                projectName: projectName,
                description: description,
                dueDate: dueDate,
            }
        });

        // Update user_projects (Members and Manager)
        // First delete all existing associations for this project
        await prisma.user_projects.deleteMany({
            where: {
                projectid: Number(id),
            }
        });

        // Add manager
        await prisma.user_projects.create({
            data: {
                userid: Number(managerId),
                projectid: project.projectId
            }
        });

        // Add members
        if (memberIds && Array.isArray(memberIds)) {
            for (const memberId of memberIds) {
                await prisma.user_projects.create({
                    data: {
                        userid: Number(memberId),
                        projectid: project.projectId
                    }
                });
            }
        }

        revalidatePath("/admin/projects");
        return MyResponse(false, "Project Updated Successfully", project, { status: 200 });
    } catch (err) {
        console.log('Some Error Occured at api/projects/PUT');
        console.log(err)
        return ErrorResponse(err);
    }
}
