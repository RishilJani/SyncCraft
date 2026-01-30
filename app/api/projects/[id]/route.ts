import { Priority, Project, Status, Task, User } from "@/app/(types)/myTypes";
import { role_enum } from "@/app/generated/prisma/enums";
import { ErrorResponse, MyResponse } from "@/app/utils";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(request :Request, {params} : {params : Promise<{id : string}>}) {
    try{
        const {id} = await params;
        
        const projectInfo = await prisma.projects.findFirst({
            where:{
                projectId : Number(id),
            }
        });
        if(!projectInfo){
            return MyResponse(true,"Project not found", null, {status : 404});
        }

        const manager = await prisma.user_projects.findFirst({
            include : {
                Users : {
                    where:{
                        role : role_enum.manager
                    }
                }
            },
            where :{
                AND : {
                    projectid : projectInfo.projectId,
                }
            }
        });

        const porjectManager : User ={
            userId : manager?.Users?.userId,
            userName : manager?.Users?.userName,
            email : manager?.Users?.email,
            role : manager?.Users?.role,
            createdAt: manager?.Users?.createdAt,
        } 
        // console.log("manager = ", porjectManager);


        const members = await prisma.user_projects.findMany({
            include:{ Users:{ where : { role: role_enum.member } } },
            where : { projectid : projectInfo.projectId } 
        });
        
        const projectMembers = members.filter((e)=>{  return e.Users?.userId; }).map((e) => {

            const us : User = {
                userId : e.Users?.userId,
                userName : e.Users?.userName,
                role : e.Users?.role,
                email: e.Users?.email,
                createdAt : e.Users?.createdAt
            }; 
            return us;
            
        });
        // console.log("members = ", projectMembers);

       const tasks = await prisma.tasks.findMany({
            where : {
                projectId : projectInfo.projectId
            }
       });
        const projectTasks: Task[] = tasks.map((e) => ({
            taskId: e.taskId,
            title: e.title ?? "",
            description: e.description ?? "",
            assignedTo: e.assignedto,
            dueDate: e.dueDate,
            createdAt: e.createdAt,
            completionDate: e.completionDate,
            points: e.points,
            priority: e.priority as Priority,
            status: e.status as Status,
        }));
        
        const project : Project = {
            projectId: projectInfo.projectId,
            projectName: projectInfo.projectName,
            description: projectInfo.description,
            dueDate: projectInfo.dueDate,
            createdAt: projectInfo.createdAt,
            createdBy: projectInfo.createdBy,
            completionDate: projectInfo.completionDate,
            status: projectInfo.status as Status,

            manager : porjectManager,
            members : projectMembers,
            tasks : projectTasks
        };
        
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

export async function DELETE(request : Request, {params} : {params : Promise<{id : string}>}) {
    try{
        const projectId = Number( (await params).id );

        await prisma.$transaction( async (tx)=>{
            await tx.user_projects.deleteMany({
                where:{
                    projectid : projectId
                }
            });
            
            console.log("\n Deleted rows from User_Projects \n");
            
            // var res = await tx.taskLists.findMany({select : {listId : true} , where : { projectId : projectId} });
            // var listids = res.map((e)=> e.listId);
            // console.log("List Ids = ",listids);

            await tx.tasks.deleteMany({
                where : {
                    projectId : projectId
                }
            });
            console.log("\n Deleted rows from Tasks  \n");
            
            await tx.projects.delete({
                where : {
                    projectId : projectId
                }
            });
            console.log("\n Deleted row from Project  \n");
        });
        return MyResponse(false, "Project Deleted Succuessfully", {deleted : true} , {status : 200});
    }catch(err){
    
        console.log('Some Error Occured at api/projects/DELETE');
        console.log(err)
        return ErrorResponse(err);
    }
    
}