import { Status, User, Project, Task } from "@/app/(utils)/myTypes";
import { ErrorResponse, MyResponse } from "@/app/(utils)/utils";
import { prisma } from "@/lib/prisma";
import { role_enum } from "@/app/generated/prisma/enums";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const uid = Number((await params).id);
        const user = await prisma.users.findUnique({
            where: {
                userId: uid
            }
        });

        if (!user) {
            return MyResponse(true, "User not found", null, { status: 404 });
        }

        const points = await prisma.tasks.aggregate({
            _sum: { points: true },
            where: { AND: { status: Status.Completed, assignedto: uid } }
        });

        let projects: Project[] | undefined = undefined;
        let tasks: Task[] | undefined = undefined;

        if (user.role === role_enum.manager) {
            const user_projects = await prisma.user_projects.findMany({
                where: { userid: uid },
                include: { Projects: true }
            });
            projects = user_projects.map(up => up.Projects).filter(p => p !== null) as Project[];
        } else if (user.role === role_enum.member) {
            tasks = await prisma.tasks.findMany({
                where: { assignedto: uid },
                orderBy: { createdAt: 'desc' }
            }) as unknown as Task[];
        }

        const res: User = {
            userId: user.userId,
            userName: user.userName,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            points: points._sum.points ?? 0,
            projects: projects,
            tasks: tasks
        }

        return MyResponse(false, "User found", res, { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return ErrorResponse(error);
    }
}


export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const uid = Number((await params).id);
        const { userName, email, role } = await request.json();
        const updatedUser = await prisma.users.update({
            where: {
                userId: uid
            },
            data: {
                userName,
                email,
                role
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

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const uid = Number((await params).id);

        const res = await prisma.user_projects.findMany({
            where: {
                userid: uid
            },
        });
        if (res.length == 0) {
            const result = await prisma.users.delete({
                where: {
                    userId: uid
                }
            });
            return MyResponse(false, "Delete Succesfull", { id: uid }, { status: 200 });
        }

        return MyResponse(true, "User is assigned to one or more project/tasks", res, { status: 400 });
    } catch (err) {

        console.log('Some Error Occured at delete /api/user/id');
        console.log(err)
        return ErrorResponse(err);
    }

}