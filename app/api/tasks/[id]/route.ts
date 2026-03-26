
import { ErrorResponse, MyResponse } from "@/app/(utils)/utils";
import { prisma } from "@/lib/prisma";
import { updateProjectStatusBasedOnTasks } from "@/app/(utils)/projectUtils";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const taskId = Number(id);
        const task = await prisma.tasks.findUnique({
            where: { taskId },
        });
        if (!task) {
            return MyResponse(true, "Task Not Found", null, { status: 404 });
        }
        return MyResponse(false, "Task Found", task, { status: 200 });
    } catch (err) {
        console.log('Some Error Occured at api/tasks/[id]/GET');
        console.log(err);
        return ErrorResponse(err);
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const taskId = Number(id);
        const body = await request.json();

        // Remove taskId from body to prevent accidental update of primary key
        const { taskId: _, ...updateData } = body;

        // Convert dates if present
        if (updateData.dueDate) updateData.dueDate = new Date(updateData.dueDate);
        if (updateData.completionDate) updateData.completionDate = new Date(updateData.completionDate);

        // Ensure numeric fields are numbers if they come as strings
        if (updateData.assignedto !== undefined) updateData.assignedto = updateData.assignedto ? Number(updateData.assignedto) : null;
        if (updateData.projectId !== undefined) updateData.projectId = Number(updateData.projectId);
        if (updateData.points !== undefined) updateData.points = Number(updateData.points);

        const existingTask = await prisma.tasks.findUnique({ where: { taskId } });
        if (updateData.dueDate && existingTask?.completionDate) {
            if (updateData.dueDate < existingTask?.completionDate) {
                updateData.completionDate = null;
            }
        }

        const task = await prisma.tasks.update({
            where: { taskId },
            data: updateData,
        });

        await updateProjectStatusBasedOnTasks(task.projectId);

        return MyResponse(false, "Task Updated Successfully", task, { status: 200 });
    } catch (err) {
        console.log('Some Error Occured at api/tasks/[id]/PATCH');
        console.log(err);
        return ErrorResponse(err);
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const taskId = Number(id);
        const existingTask = await prisma.tasks.findUnique({ where: { taskId } });

        await prisma.tasks.delete({
            where: { taskId },
        });

        if (existingTask) {
            await updateProjectStatusBasedOnTasks(existingTask.projectId);
        }

        return MyResponse(false, "Task Deleted Successfully", { deleted: true }, { status: 200 });
    } catch (err) {
        console.log('Some Error Occured at api/tasks/[id]/DELETE');
        console.log(err);
        return ErrorResponse(err);
    }
}
