import { Status } from "@/app/(types)/myTypes";
import { ErrorResponse, MyResponse } from "@/app/(utils)/utils";
import { prisma } from "@/lib/prisma";
import { updateProjectStatusBasedOnTasks } from "@/app/(utils)/projectUtils";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const assignedto = searchParams.get("assignedto");

    try {
        const tasks = await prisma.tasks.findMany({
            where: {
                ...(projectId && { projectId: Number(projectId) }),
                ...(assignedto && { assignedto: Number(assignedto) }),
            },
        });
        return MyResponse(false, "Tasks Found", tasks, { status: 200 });
    } catch (err) {
        console.log('Some Error Occured at api/tasks/GET');
        console.log(err);
        return ErrorResponse(err);
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, priority, dueDate, assignedto, projectId, points, status } = body;

        const task = await prisma.tasks.create({
            data: {
                title,
                description,
                priority,
                projectId: Number(projectId),
                dueDate: dueDate ? new Date(dueDate) : null,
                createdAt: new Date(),
                assignedto: assignedto ? Number(assignedto) : null,
                status: status || Status.Todo,
                points: points ? Number(points) : 0,
            },
        });

        await updateProjectStatusBasedOnTasks(task.projectId);

        return MyResponse(false, "Task Created Successfully", task, { status: 201 });
    } catch (err) {
        console.log('Some Error Occured at api/tasks/POST');
        console.log(err);
        return ErrorResponse(err);
    }
}
