"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, Flag, Clock, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { use, useState } from "react";
import * as React from "react";

export default function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params using React.use()
    const { id } = use(params);

    // Mock Data Lookup (In a real app, fetch this from API/DB)
    const project = getProjectById(Number(id));
    const tasks = project ? getTasksByProjectId(project.id) : [];

    // State for selected task modal
    // State for selected task modal
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
                <Button asChild>
                    <Link href="/admin">Return to Dashboard</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4 md:p-8">
            <div className="mx-auto w-full max-w-4xl space-y-8">
                {/* Header Section */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
                            <StatusBadge status={project.status} className="text-md" />
                        </div>
                    </div>
                </div>

                <div className="grid gap-6">
                    {/* Main Details Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-wider">Description</h3>
                                <p className="text-base leading-relaxed">{project.description}</p>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span className="text-sm font-medium">Created At</span>
                                    </div>
                                    <p className="pl-6 font-medium">{project.createdAt}</p>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Flag className="h-4 w-4" />
                                        <span className="text-sm font-medium">Due Date</span>
                                    </div>
                                    <p className="pl-6 font-medium">{project.dueDate}</p>
                                </div>

                                {project.completedAt && (
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <CheckCircle2 className="h-4 w-4" />
                                            <span className="text-sm font-medium">Completed At</span>
                                        </div>
                                        <p className="pl-6 font-medium text-green-600">{project.completedAt}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Task List Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tasks</CardTitle>
                            <CardDescription>All tasks associated with this project.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <div className="grid grid-cols-12 gap-4 p-4 font-medium text-sm text-muted-foreground border-b bg-muted/50">
                                    <div className="col-span-5">Task</div>
                                    <div className="col-span-2">Status</div>
                                    <div className="col-span-2">Priority</div>
                                    <div className="col-span-3 text-right">Assignee</div>
                                </div>
                                <div className="divide-y">
                                    {tasks.map((task) => (
                                        <div key={task.taskId} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => setSelectedTask(task)} >
                                            <div className="col-span-5 font-medium">
                                                {task.title}
                                            </div>
                                            <div className="col-span-2">
                                                <StatusBadge status={task.status} />
                                            </div>
                                            <div className="col-span-2">
                                                <PriorityBadge priority={task.priority} />
                                            </div>
                                            <div className="col-span-3 flex justify-end items-center gap-2">
                                                <span className="text-[16px]">{task.assignee.name}</span>
                                                {/* <div className="h-6 w-6 rounded-full bg-slate-100 border flex items-center justify-center text-[10px] font-bold">
                                                    {task.assignee.name.charAt(0)}
                                                </div> */}
                                            </div>
                                        </div>
                                    ))}
                                    {tasks.length === 0 && (
                                        <div className="p-8 text-center text-muted-foreground">
                                            No tasks found for this project.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>

            {/* Custom Modal for Task Details */}
            {selectedTask && (
                <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />
            )}
        </div>
    );
}

// Helper Components & Data
function PriorityBadge({ priority }: { priority: Task["priority"] }) {
    const colors = {
        Low: "bg-slate-100 text-slate-700 border-slate-200",
        Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
        High: "bg-red-100 text-red-700 border-red-200",
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[priority]}`}>
            {priority}
        </span>
    );
}

function TaskDetailModal({ task, onClose }: { task: Task; onClose: () => void }) {
    if (!task) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-xl bg-background border shadow-lg p-6 space-y-6 animate-in zoom-in-95 duration-200 sm:p-8">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight">{task.title}</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <StatusBadge status={task.status} />
                            <PriorityBadge priority={task.priority} />
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
                        {/* <span className="sr-only">Close</span> */}
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Description</h3>
                        <p className="text-base leading-relaxed">{task.description}</p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Due Date</h3>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{task.dueDate}</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Assignee</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-[16px]">{task.assignee.name}</span>
                            </div>
                        </div>
                        {task.completedAt && (
                            <div className="col-span-2">
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Completed</h3>
                                <div className="flex items-center gap-2 text-green-600">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>{task.completedAt}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <Button onClick={onClose}>Close</Button>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status, className }: { status: string; className?: string }) {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        Completed: "default",
        Running: "secondary",
        Upcoming: "outline",
        "Done": "default",
        "In Progress": "secondary",
        "Todo": "outline"
    };

    let colorClass = "";
    // Project Status Colors
    if (status === "Completed") colorClass = "bg-green-500 hover:bg-green-600 border-transparent";
    if (status === "Running") colorClass = "bg-blue-500 hover:bg-blue-600 text-white border-transparent";
    if (status === "Upcoming") colorClass = "text-orange-600 border-orange-200 bg-orange-50";

    // Task Status Colors
    if (status === "Done") colorClass = "bg-green-100 text-green-700 hover:bg-green-200 border-transparent";
    if (status === "In Progress") colorClass = "bg-blue-100 text-blue-700 hover:bg-blue-200 border-transparent";
    if (status === "Todo") colorClass = "bg-slate-100 text-slate-700 hover:bg-slate-200 border-transparent";

    return (
        <Badge variant={variants[status] || "outline"} className={colorClass + " " + className}>
            {status}
        </Badge>
    );
}

function getProjectById(id: number) {
    const allProjects = [
        { id: 1, title: "Website Redesign", description: "Revamped the corporate website with a fresh look, improved navigation, and mobile responsiveness.", status: "Completed", createdAt: "2024-01-10", dueDate: "2024-03-01", completedAt: "2024-02-28" },
        { id: 2, title: "Mobile App Launch", description: "Released the MVP for both iOS and Android platforms including core authentication and user profile features.", status: "Completed", createdAt: "2024-02-15", dueDate: "2024-04-15", completedAt: "2024-04-10" },
        { id: 3, title: "Database Migration", description: "Transferred legacy data to the new cloud cluster, ensuring data integrity and zero downtime.", status: "Completed", createdAt: "2024-03-01", dueDate: "2024-03-10", completedAt: "2024-03-09" },
        { id: 4, title: "API Refactor", description: "Optimized backend endpoints for faster response times and better error handling.", status: "Completed", createdAt: "2024-03-05", dueDate: "2024-04-01", completedAt: "2024-03-30" },
        { id: 6, title: "AI Integration", description: "Implementing predictive models for user behavior analysis to improve recommendation engine.", status: "Running", createdAt: "2024-05-01", dueDate: "2024-08-01" },
        { id: 7, title: "User Dashboard", description: "Building a customizable analytics view for users to track their own usage stats.", status: "Running", createdAt: "2024-05-10", dueDate: "2024-07-20" },
        { id: 8, title: "Payment Gateway", description: "Adding support for international currencies and multiple payment providers.", status: "Running", createdAt: "2024-05-15", dueDate: "2024-06-30" },
        { id: 9, title: "Analytics Features", description: "Tracking real-time events and conversion metrics for the admin reporting tools.", status: "Running", createdAt: "2024-05-20", dueDate: "2024-09-01" },
        { id: 10, title: "Customer Support Bot", description: "Training the chatbot on the new knowledge base to handle L1 support queries automatically.", status: "Running", createdAt: "2024-06-01", dueDate: "2024-08-15" },
        { id: 11, title: "New Demo Bot", description: "Experimental bot for demo purposes.", status: "Running", createdAt: "2024-06-05", dueDate: "2024-06-25" },
        { id: 11, title: "Dark Mode Support", description: "Adding a system-wide theme toggle preference that persists across sessions.", status: "Upcoming", createdAt: "2024-07-01", dueDate: "2024-08-01" },
        { id: 12, title: "Localization", description: "Translating the platform into Spanish and French to expand market reach.", status: "Upcoming", createdAt: "2024-07-15", dueDate: "2024-09-15" },
        { id: 13, title: "Performance Optimization", description: "Reducing bundle size and improving core web vitals for better SEO ranking.", status: "Upcoming", createdAt: "2024-08-01", dueDate: "2024-09-01" },
        { id: 14, title: "Email Marketing Tool", description: "Integrating a drag-and-drop email builder for marketing campaigns.", status: "Upcoming", createdAt: "2024-08-10", dueDate: "2024-10-01" },
        { id: 15, title: "Referral Program", description: "Designing a reward system for user invites to drive organic growth.", status: "Upcoming", createdAt: "2024-08-20", dueDate: "2024-10-15" }
    ];

    return allProjects.find(p => p.id === id);
}

// Mock Tasks Data
interface Task {
    taskId: number;
    title: string;
    description: string;
    dueDate: string;
    completedAt?: string;
    assignee: {
        name: string;
        avatar?: string;
    };
    status: "Todo" | "In Progress" | "Done";
    priority: "Low" | "Medium" | "High";
}

function getTasksByProjectId(projectId: number): Task[] {
    const allTasks: Record<number, Task[]> = {
        1: [
            { taskId: 101, title: "Design Homepage", description: "Create figma mockups for the new homepage.", dueDate: "2024-01-15", completedAt: "2024-01-14", assignee: { name: "Alice" }, status: "Done", priority: "High" },
            { taskId: 102, title: "Implement Hero Section", description: "Convert design to React code.", dueDate: "2024-01-20", completedAt: "2024-01-19", assignee: { name: "Bob" }, status: "Done", priority: "Medium" },
            { taskId: 103, title: "Fix Mobile Navigation", description: "Menu not opening on iOS.", dueDate: "2024-02-01", completedAt: "2024-01-30", assignee: { name: "Charlie" }, status: "Done", priority: "High" },
        ],
        6: [
            { taskId: 201, title: "Model Research", description: "Compare different ML models.", dueDate: "2024-05-15", assignee: { name: "David" }, status: "In Progress", priority: "High" },
            { taskId: 202, title: "Data Cleaning", description: "Prepare dataset for training.", dueDate: "2024-05-20", assignee: { name: "Eve" }, status: "Todo", priority: "Medium" },
        ],
    };
    return allTasks[projectId] || [];
}