import { ErrorResponse, MyResponse, Status } from "@/app/utils";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET() {
    try{
        const projects = await prisma.projects.findMany();
        return MyResponse(false,"Projects Found", projects, {status : 200});
    }catch(err){
        console.log('Some Error Occured at api/projets/GET');
        console.log(err)
        return ErrorResponse(err);
    }
}

export async function POST(request : Request) {
    const { projectName, description,  createdBy,  dueDate ,managerId,memberIds } = await request.json();
    const createdAt = new Date();
    try{
        console.log("Creating Project");
        const project = await prisma.projects.create({
            data: {
                projectName : projectName,
                description : description,
                createdBy :createdBy,
                createdAt : createdAt,
                dueDate : dueDate,
                status: Status.Todo,
            }
        });
        console.log(`Project = ${project}`);
        const userProject = await prisma.user_projects.create({
            data:{
                userid: managerId,
                projectid: project.projectId
            }
        });

        memberIds.forEach(async (id : number)=>{
            await prisma.user_projects.create({
                data:{
                    userid: id,
                    projectid : project.projectId
                }
            });
        });
        console.log("Members and Manger added");
    
        revalidatePath("/admin/projects");
        return MyResponse(false,"Project Added Successfully" , project , {status : 200});

    }catch(err){

        console.log('Some Error Occured at api/projects/POST');
        console.log(err)
        return ErrorResponse(err);
    }
    
}