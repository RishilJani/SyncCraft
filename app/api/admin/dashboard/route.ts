import { ErrorResponse, MyResponse } from "@/app/(utils)/utils";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return MyResponse(true, "User ID is required", null, { status: 400 });
        }

        const adminId = Number(userId);

        const adminProjects = await prisma.projects.findMany({
            where: { createdBy: adminId },
            select: { projectId: true }
        });
        const projectIds = adminProjects.map(p => p.projectId);

        const totalProjects = adminProjects.length;

        const activeProjects = await prisma.projects.count({
            where: {
                createdBy: adminId,
                status: {
                    in: ["todo", "pending"]
                }
            }
        });

        const completedProjects = await prisma.projects.count({
            where: {
                createdBy: adminId,
                status: "completed"
            }
        });

        const uniqueEmployees = await prisma.user_projects.findMany({
            where: { projectid: { in: projectIds } },
            distinct: ['userid'],
            select: { userid: true }
        });
        const totalEmployees = uniqueEmployees.length;

        // Get counts grouped by status for charts
        const projectStatusDistributionData = await prisma.projects.groupBy({
            by: ['status'],
            where: { createdBy: adminId },
            _count: {
                status: true,
            },
        });

        const projectStatusDistribution = projectStatusDistributionData.map(item => ({
            name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
            value: item._count.status
        }));

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
        console.log('Error at api/admin/dashboard/GET');
        console.log(err);
        return ErrorResponse(err);
    }
}
