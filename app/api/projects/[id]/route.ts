import { ErrorResponse, MyResponse } from "@/app/utils";
import { prisma } from "@/lib/prisma";

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