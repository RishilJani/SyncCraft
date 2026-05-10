import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, Tooltip, XAxis, YAxis } from "recharts";

export default function DashboardCharts({ data, COLORS }: {
    data: {
        totalProjects: number;
        activeProjects: number;
        completedProjects: number;
        totalEmployees: number;
        projectStatusDistribution: { name: string; value: number }[];
        taskPriorityDistribution: { name: string; value: number }[];
    },
    COLORS: string[]
}) {

    return (
        <>
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 mt-6">
                {/* Status Distribution - Bar Chart */}
                <div className="min-w-0 min-h-0 rounded-xl border bg-card text-card-foreground shadow col-span-1 p-6">
                    <h3 className="font-semibold leading-none tracking-tight mb-6">Project Status Distribution</h3>
                    <div className="h-[300px] w-full">
                        <BarChart
                            width={550}
                            height={300}
                            data={data.projectStatusDistribution}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }} >
                            <CartesianGrid strokeDasharray="4 4" opacity={0.75} />
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                            <Tooltip cursor={{ fill: 'var(--muted)' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }} />
                            <Legend />
                            <Bar dataKey="value" name="Projects" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>


                    </div>
                </div>

                {/* Task Priority Distribution - Pie Chart */}
                <div className="min-w-0 min-h-0 rounded-xl border bg-card text-card-foreground shadow col-span-1 p-6">
                    <h3 className="font-semibold leading-none tracking-tight mb-6">Task Priority Distribution</h3>
                    <div className="h-[300px] w-full">

                        <PieChart width={550} height={300}>
                            <Pie
                                data={data.taskPriorityDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent! * 100).toFixed(0)}%`}
                                labelLine={false} >

                                {data.taskPriorityDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }} />
                            <Legend />
                        </PieChart>


                    </div>
                </div>
            </div>
        </>
    );
}