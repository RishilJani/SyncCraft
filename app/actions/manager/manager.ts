import { prisma } from "@/lib/prisma";

export async function getManagerProject(managerId : number){
    try{
        const projs = await prisma.user_projects.findMany({
            where: {
                userid : managerId
            }
        });
        console.log("projs =  ", projs );


        var res = await (await fetch("/api/projects/" + projs[0].projectid)).json();
        console.log("Res = ", res);
        if(!res.error){
            const project = res.data;
            return project;
        }else{
            return null;
        }
    }catch(err){
    
        console.log('Some Error Occured at manager/getManagerProject');
        console.log(err)
    }
    
}