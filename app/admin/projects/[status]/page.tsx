// "use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default async function ProjectListPage({ params }: { params: Promise<{ status: "completed" | "running" | "upcoming" }> }) {

    const { status } = (await params);

    const completedProjects = [
        { id: 1, title: "Website Redesign", description: "Revamped the corporate website with a fresh look." },
        { id: 2, title: "Mobile App Launch", description: "Released the MVP for both iOS and Android platforms." },
        { id: 3, title: "Database Migration", description: "Transferred legacy data to the new cloud cluster." },
        { id: 4, title: "API Refactor", description: "Optimized backend endpoints for faster response times." }
    ];

    const runningProjects = [
        { id: 6, title: "AI Integration", description: "Implementing predictive models for user behavior." },
        { id: 7, title: "User Dashboard", description: "Building a customizable analytics view for users." },
        { id: 8, title: "Payment Gateway", description: "Adding support for international currencies." },
        { id: 9, title: "Analytics Features", description: "Tracking real-time events and conversion metrics." },
        { id: 10, title: "Customer Support Bot", description: "Training the chatbot on the new knowledge base." },
        { id: 11, title: "New Demo Bot", description: "Training the chatbot on the new knowledge base." }
    ];

    const upcomingProjects = [
        { id: 11, title: "Dark Mode Support", description: "Adding a system-wide theme toggle preference." },
        { id: 12, title: "Localization", description: "Translating the platform into Spanish and French." },
        { id: 13, title: "Performance Optimization", description: "Reducing bundle size and improving core web vitals." },
        { id: 14, title: "Email Marketing Tool", description: "Integrating a drag-and-drop email builder." },
        { id: 15, title: "Referral Program", description: "Designing a reward system for user invites." }
    ];

    let projects: any[] = [];
    let title = "";
    let colorClass = "";
    let bgClass = "";

    switch (status) {
        case "completed":
            projects = completedProjects;
            title = "Completed Projects";
            colorClass = "text-green-600";
            bgClass = "bg-green-500";
            break;
        case "running":
            projects = runningProjects;
            title = "Running Projects";
            colorClass = "text-blue-600";
            bgClass = "bg-blue-500";
            break;
        case "upcoming":
            projects = upcomingProjects;
            title = "Upcoming Projects";
            colorClass = "text-orange-600";
            bgClass = "bg-orange-500";
            break;
        default:
            title = "Projects";
            projects = [];
    }

    return (
        <section className="min-h-screen bg-muted/40 p-4 md:p-8">
            <div className="mx-auto w-full max-w-4xl space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin">
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <h1 className={`text-2xl font-bold tracking-tight ${colorClass}`}>{title}</h1>
                </div>

                <div className="grid gap-4">
                    {projects.map((project) => (
                        <Link
                            key={project.id}
                            href={`/admin/project/${project.id}`}
                            className="block group bg-card p-4 rounded-lg border shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${bgClass} ${status === 'running' ? 'animate-pulse' : ''}`} />
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                        {project.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {project.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {projects.length === 0 && (
                        <p className="text-muted-foreground text-center py-8">No projects found.</p>
                    )}
                </div>
            </div>
        </section>
    );
}
