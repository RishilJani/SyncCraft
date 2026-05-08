import { Status } from "@/app/(utils)/myTypes";
import { ErrorResponse, MyResponse } from "@/app/(utils)/utils";
import { role_enum } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const organization = searchParams.get("org") ?? "demo";

        const organizationProjects = await prisma.projects.findMany({
            where: {
                Users: {
                    organization: organization
                }
            }
        });

        const activeProjects = organizationProjects.filter((e) => {
            return e.status == Status.Todo || e.status == Status.Pending;
        }).length;


        const totalEmployees = await prisma.users.count({
            where: {
                AND: [
                    { organization: organization },
                    { role: { in: [role_enum.manager, role_enum.member] } }
                ]
            },
        });

        // Get counts grouped by status for charts
        var projectStatusDistribution = [{ name: "Completed", value: 0 }, { name: "Pending", value: 0 }, { name: "Todo", value: 0 }];
        const _ = organizationProjects.forEach((item) => {
            if (item.status == Status.Completed) projectStatusDistribution[0].value++;
            else if (item.status == Status.Pending) projectStatusDistribution[1].value++;
            else if (item.status == Status.Todo) projectStatusDistribution[2].value++;
        });

        const projectIds = organizationProjects.map((e) => e.projectId);
        const totalProjects = organizationProjects.length;
        const completedProjects = totalProjects - activeProjects;

        // Similarly, counting priorities for another chart
        let taskPriorityDistribution: { name: string; value: number }[] = [];
        if (projectIds.length > 0) {
            const taskPriorityDistributionData = await prisma.tasks.groupBy({
                by: ['priority'],
                where: { projectId: { in: projectIds } },
                _count: {
                    priority: true,
                },
            });

            taskPriorityDistribution = taskPriorityDistributionData.map(item => ({
                name: item.priority || "Undefined",
                value: item._count.priority
            }));
        }

        const dashboardData = {
            totalProjects,
            activeProjects,
            completedProjects,
            totalEmployees,
            projectStatusDistribution,
            taskPriorityDistribution
        };

        return MyResponse(false, "Dashboard Data fetched", dashboardData, { status: 200 });

    } catch (err) {
        console.error("Error at api/admin/dashboard/GET = ", err);
        return ErrorResponse(err);
    }
}
