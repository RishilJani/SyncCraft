import { Priority, Project, Status, Task, User } from "@/app/(types)/myTypes";
import { role_enum } from "@/app/generated/prisma/enums";
import { ErrorResponse, MyResponse } from "@/app/(utils)/utils";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const userId = Number(id);

        if (isNaN(userId)) {
            return MyResponse(true, "Invalid User ID", null, { status: 400 });
        }
        const curUser = await prisma.users.findUnique({
            where: { userId: userId },
            select: { role: true, userId: true, }
        });
        if (!curUser) {
            return ErrorResponse("User not found");
        }

        let fetchedProjects = [];

        if (curUser.role === role_enum.admin) {
            fetchedProjects = await prisma.projects.findMany({
                where: {
                    createdBy: userId,
                },
                include: {
                    user_projects: {
                        include: {
                            Users: true
                        }
                    },
                    tasks: true
                }
            });
        } else {
            const userProjectsResult = await prisma.user_projects.findMany({
                where: {
                    userid: userId,
                },
                include: {
                    Projects: {
                        include: {
                            user_projects: {
                                include: {
                                    Users: true
                                }
                            },
                            tasks: true
                        }
                    }
                }
            });
            console.log("userProjectResult = ", userProjectsResult);

            // Extract the projects from the user_projects wrapper
            fetchedProjects = userProjectsResult.map(up => up.Projects).filter(Boolean) as any[];
        }

        const projects: Project[] = [];

        for (const projectInfo of fetchedProjects) {
            if (!projectInfo) continue;

            // Find manager and members from included user_projects
            let projectManager: User | undefined;
            const projectMembers: User[] = [];

            for (const pup of projectInfo.user_projects) {
                if (!pup.Users) continue;

                const userObj: User = {
                    userId: pup.Users.userId,
                    userName: pup.Users.userName,
                    email: pup.Users.email,
                    role: pup.Users.role,
                    createdAt: pup.Users.createdAt,
                };

                if (pup.Users.role === role_enum.manager) {
                    projectManager = userObj;
                } else if (pup.Users.role === role_enum.member) {
                    projectMembers.push(userObj);
                }
            }

            const projectTasks: Task[] = projectInfo.tasks.map((e: any) => ({
                taskId: e.taskId,
                title: e.title ?? "",
                description: e.description ?? "",
                assignedTo: e.assignedto,
                dueDate: e.dueDate,
                createdAt: e.createdAt,
                completionDate: e.completionDate,
                points: e.points,
                priority: e.priority as Priority,
                status: e.status as Status,
            }));

            const project: Project = {
                projectId: projectInfo.projectId,
                projectName: projectInfo.projectName,
                description: projectInfo.description,
                dueDate: projectInfo.dueDate,
                createdAt: projectInfo.createdAt,
                createdBy: projectInfo.createdBy,
                completionDate: projectInfo.completionDate,
                status: projectInfo.status as Status,

                manager: projectManager,
                members: projectMembers,
                tasks: projectTasks
            };

            projects.push(project);
        }

        return MyResponse(false, "Projects Found", projects, { status: 200 });

    } catch (err) {
        console.log('Some Error Occured at api/projects/user/[id] Get by ID');
        console.log(err);
        return ErrorResponse(err);
    }
}
