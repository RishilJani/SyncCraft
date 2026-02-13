import { ErrorResponse, MyResponse } from "@/app/(utils)/utils";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try{
        const managers = await prisma.users.findMany({
            where:{
                role: 'manager'
            }
        }); // filter managers by admin if needed.
        return MyResponse(false,"Projects Found", managers, {status : 200});
    }catch(err){
        console.log('Some Error Occured at api/projets/GET');
        console.log(err)
        return ErrorResponse(err);
    }
}
