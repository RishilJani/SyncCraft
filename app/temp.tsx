import { prisma } from "@/lib/prisma";
import { MyResponse, ErrorResponse, customLog } from "@/app/(utils)/utils";
import { Priority, Project, Status, Task } from "@/app/(types)/myTypes";
import { role_enum } from "@/app/generated/prisma/enums";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const userId = parseInt(id);

        if (isNaN(userId)) {
            return MyResponse(true, "Invalid user ID", null, { status: 400 });
        }

        const user = await prisma.users.findUnique({
            where: { userId: userId },
            select: { role: true }
        });

        if (!user) {
            return MyResponse(true, "User not found", null, { status: 404 });
        }

        let projects;

        if (user.role === 'admin') {
            const adminProjects = await prisma.projects.findMany({
                include: {
                    Users: {
                        select: {
                            userId: true,
                            userName: true,
                            email: true,
                            role: true
                        }
                    },
                    tasks: true
                }
            });

            console.log("Admin Projects = ", adminProjects);

            projects = adminProjects.map((p) => {
                console.log("Admin p = ", p);

                let temp: Project = {
                    projectId: p.projectId,
                    projectName: p.projectName,
                    description: p.description,
                    createdBy: p.createdBy,
                    createdAt: p.createdAt,
                    completionDate: p.completionDate,
                    dueDate: p.dueDate,
                    status: p.status as Status,
                    tasks: p.tasks?.map(task => ({
                        taskId: task.taskId,
                        title: task.title,
                        description: task.description ?? "",
                        assignedTo: task.assignedto,
                        dueDate: task.dueDate,
                        createdAt: task.createdAt,
                        completionDate: task.completionDate,
                        points: task.points,
                        priority: task.priority as Priority,
                        status: task.status as Status,
                    })),

                }
                return temp;
            }
            );


        }
        else {

            const userProjects = await prisma.user_projects.findMany({
                where: { userid: userId },
                include: {
                    Projects: {
                        include: {
                            user_projects: {
                                include: {
                                    Users: true,
                                }
                            },
                            tasks: true,
                        }
                    }
                }
            });



            projects = userProjects.map((up) => {
                if (up.Projects == undefined) {
                    return null;
                }
                // const projectManager = up.Projects?.user_projects.filter((e)=>e.Users?.role == role_enum.manager && e.projectid == up.projectid);
                console.log("Project id = ", up.projectid);
                console.log("Projects = ", up.Projects.user_projects);

                const proj: Project = {
                    ...up.Projects,
                    status: up.Projects.status as Status,
                    tasks: up.Projects.tasks?.map(task => ({
                        taskId: task.taskId,
                        title: task.title,
                        description: task.description ?? "",
                        assignedTo: task.assignedto,
                        dueDate: task.dueDate,
                        createdAt: task.createdAt,
                        completionDate: task.completionDate,
                        points: task.points,
                        priority: task.priority as Priority,
                        status: task.status as Status,
                    })),

                };

                return proj;
            });
            console.log("projects  = ", projects);
        }
        return MyResponse(false, "Projects Found", projects, { status: 200 });
    } catch (err) {
        console.error('Error in GET /api/projects/user/[id]:', err);
        return ErrorResponse(err);
    }
}
