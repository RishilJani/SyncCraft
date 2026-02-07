import { User } from "@/app/(types)/myTypes";
import { ErrorResponse, MyResponse } from "@/app/(utils)/utils";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, {params}: { params : Promise<{id : string}>} ) {
    try {
        const uid = Number((await params).id);
        const user = await prisma.users.findUnique({
            where: {
                userId: uid
            }
        });
        const res : User = {
            userId : user?.userId,
            userName : user?.userName,
            email : user?.email,
            role : user?.role,
            createdAt : user?.createdAt,
        }
        console.log(res);

        return MyResponse(false, "User found" , res , {status : 200});
    } catch (error) {
        console.error("Error fetching user:", error);
        return ErrorResponse(error);
    }
}