
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function AdminDashboard() {
    const [showAllCompleted, setShowAllCompleted] = useState(false);
    const [showAllRunning, setShowAllRunning] = useState(false);
    const [showAllUpcoming, setShowAllUpcoming] = useState(false);

    const completedProjects = [
        { id: 1, title: "Website Redesign", description: "Revamped the corporate website with a fresh look." },
        { id: 2, title: "Mobile App Launch", description: "Released the MVP for both iOS and Android platforms." },
        { id: 3, title: "Database Migration", description: "Transferred legacy data to the new cloud cluster." },
        { id: 4, title: "API Refactor", description: "Optimized backend endpoints for faster response times." }
        // { id: 5, title: "Security Audit", description: "Conducted extensive vulnerability testing and fixes." },
        // { id: 17, title: "Security Alert", description: "Conducted extensive vulnerability testing and fixes." }
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

    const height = 3;
    const getDisplayedProjects = (projects: typeof completedProjects, showAll: boolean) => {
        return showAll ? projects : projects.slice(0, height);
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4 md:p-8">
            <div className="mx-auto w-full max-w-4xl space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <Button asChild className="gap-2">
                        <Link href="/admin/projects/add">
                            <Plus className="h-4 w-4" />
                            Add Project
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-2 md:grid-cols-3 items-start">
                    {/* Completed Projects */}
                    <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
                        <CardHeader className="pb-1 p-3">
                            <CardTitle className="text-lg text-center font-medium text-green-600">Completed Projects</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-2">
                                {getDisplayedProjects(completedProjects, showAllCompleted).map((project) => (
                                    <li key={project.id}>
                                        <Link href={`/admin/projects/${project.id}`} className="block group p-1.5 rounded-lg hover:bg-accent hover:shadow-sm transition-all border border-transparent hover:border-border/50">
                                            <div className="flex items-start gap-2">
                                                <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                                                <div>
                                                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">{project.title}</h3>
                                                    <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        {completedProjects.length > height && (
                            <CardFooter>
                                <Button
                                    variant="ghost"
                                    className="w-full gap-2 text-muted-foreground hover:text-foreground"
                                    onClick={() => setShowAllCompleted(!showAllCompleted)}
                                >
                                    {showAllCompleted ? (
                                        <>Show Less <ChevronUp className="h-4 w-4" /></>
                                    ) : (
                                        <>View All <ChevronDown className="h-4 w-4" /></>
                                    )}
                                </Button>
                            </CardFooter>
                        )}
                    </Card>

                    {/* Running Projects */}
                    <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
                        <CardHeader className="pb-1 p-3">
                            <CardTitle className="text-lg text-center font-medium text-blue-600">Running Projects</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-2">
                                {getDisplayedProjects(runningProjects, showAllRunning).map((project) => (
                                    <li key={project.id}>
                                        <Link href={`/admin/projects/${project.id}`} className="block group p-1.5 rounded-lg hover:bg-accent hover:shadow-sm transition-all border border-transparent hover:border-border/50">
                                            <div className="flex items-start gap-2">
                                                <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500 animate-pulse" />
                                                <div>
                                                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">{project.title}</h3>
                                                    <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        {runningProjects.length > height && (
                            <CardFooter>
                                <Button
                                    variant="ghost"
                                    className="w-full gap-2 text-muted-foreground hover:text-foreground"
                                    onClick={() => setShowAllRunning(!showAllRunning)}
                                >
                                    {showAllRunning ? (
                                        <>Show Less <ChevronUp className="h-4 w-4" /></>
                                    ) : (
                                        <>View All <ChevronDown className="h-4 w-4" /></>
                                    )}
                                </Button>
                            </CardFooter>
                        )}
                    </Card>

                    {/* Upcoming Projects */}
                    <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
                        <CardHeader className="pb-1 p-3">
                            <CardTitle className="text-lg text-center font-medium text-orange-600">Upcoming Projects</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-2">
                                {getDisplayedProjects(upcomingProjects, showAllUpcoming).map((project) => (
                                    <li key={project.id}>
                                        <Link href={`/admin/projects/${project.id}`} className="block group p-1.5 rounded-lg hover:bg-accent hover:shadow-sm transition-all border border-transparent hover:border-border/50">
                                            <div className="flex items-start gap-2">
                                                <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                                                <div>
                                                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">{project.title}</h3>
                                                    <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        {upcomingProjects.length > height && (
                            <CardFooter>
                                <Button
                                    variant="ghost"
                                    className="w-full gap-2 text-muted-foreground hover:text-foreground"
                                    onClick={() => setShowAllUpcoming(!showAllUpcoming)}
                                >
                                    {showAllUpcoming ? (
                                        <>Show Less <ChevronUp className="h-4 w-4" /></>
                                    ) : (
                                        <>View All <ChevronDown className="h-4 w-4" /></>
                                    )}
                                </Button>
                            </CardFooter>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
