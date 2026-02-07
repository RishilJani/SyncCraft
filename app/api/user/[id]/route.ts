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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const uid = Number((await params).id);
        const { userName, email } = await request.json();

        const updatedUser = await prisma.users.update({
            where: {
                userId: uid
            },
            data: {
                userName,
                email
            }
        });

        const res: User = {
            userId: updatedUser.userId,
            userName: updatedUser.userName,
            email: updatedUser.email,
            role: updatedUser.role,
            createdAt: updatedUser.createdAt,
        };

        return MyResponse(false, "User updated successfully", res, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return ErrorResponse(error);
    }
}