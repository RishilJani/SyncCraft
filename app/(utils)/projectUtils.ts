import { prisma } from "../../lib/prisma";
import { Status } from "@/app/(types)/myTypes";

export async function updateProjectStatusBasedOnTasks(projectId: number) {
    if (!projectId) return;

    const projId = Number(projectId);

    const tasks = await prisma.tasks.findMany({
        where: { projectId: projId }
    });

    if (tasks.length === 0) {
        await prisma.projects.update({
            where: { projectId: projId },
            data: { status: Status.Todo }
        });
        return;
    }

    const allTodo = tasks.every((t) => t.status === Status.Todo);
    const allCompleted = tasks.every((t) => t.status === Status.Completed);

    let newStatus = Status.Pending;

    if (allTodo) {
        newStatus = Status.Todo;
    } else if (allCompleted) {
        newStatus = Status.Completed;
    }
    console.log("new Status = ", newStatus);


    await prisma.projects.update({
        where: { projectId: projId },
        data: { status: newStatus }
    });
}
