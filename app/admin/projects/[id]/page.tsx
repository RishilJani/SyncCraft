"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Flag, CheckCircle2 } from "lucide-react";
import MyKanbanBoard from "@/components/custom_kanban";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { use } from "react";

export default function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params using React.use()
    const { id } = use(params);
    const router = useRouter();
    // Mock Data Lookup (In a real app, fetch this from API/DB)
    const project = getProjectById(Number(id));

    const handleBack = () => { router.back(); };

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
                <Button asChild onClick={handleBack}>
                    Return to Dashboard
                </Button>
            </div>
        );
    }

    return (

        <>
            {/* <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4 md:p-8">
            <div className="w-full space-y-8 mx-auto max-w-6xl"> */}
            {/* Header Section */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/projects">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight">{project.title}</h1>
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


                {/* Task List Section - Replaced by Kanban */}
                <div className="flex-1 w-full mx-auto">
                    <MyKanbanBoard role={false} projectId={Number(id)} />
                </div>

            </div>
            {/* </div>
        </div> */}
        </>
    );
}

// Helper Components & Data

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

