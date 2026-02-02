import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Users, User, Kanban } from "lucide-react";
import { getUser } from "../actions/users/Users";

export default async function AdminDashboard() {
    const data = await getUser();
    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
                <div className="flex gap-2">

                    <Button asChild variant="ghost" className="gap-2">
                        <Link href="/admin/employees">
                            <Users className="h-5 w-5" />
                            View All Employees
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="gap-2">
                        <Link href="/admin/projects">
                            <Kanban className='h-5 w-5' />
                            View All Projects
                        </Link>
                    </Button>
                    {/* <Button asChild className="gap-2">
                        <Link href="/admin/addProject">
                            <Plus className="h-4 w-4" />
                            Add Project
                        </Link>
                    </Button> */}
                    <Button asChild variant="ghost" className="gap-2">
                        <Link href={`/admin/${data?.userId}`}>
                            <User className="h-6 w-6" />
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    );
}

/*
// const completedProjects = [
    //     { id: 1, title: "Website Redesign", description: "Revamped the corporate website with a fresh look." },
    //     { id: 2, title: "Mobile App Launch", description: "Released the MVP for both iOS and Android platforms." },
    //     { id: 3, title: "Database Migration", description: "Transferred legacy data to the new cloud cluster." },
    //     { id: 4, title: "API Refactor", description: "Optimized backend endpoints for faster response times." }
    //     // { id: 5, title: "Security Audit", description: "Conducted extensive vulnerability testing and fixes." },
    //     // { id: 17, title: "Security Alert", description: "Conducted extensive vulnerability testing and fixes." }
    // ];

    // const runningProjects = [
    //     { id: 6, title: "AI Integration", description: "Implementing predictive models for user behavior." },
    //     { id: 7, title: "User Dashboard", description: "Building a customizable analytics view for users." },
    //     { id: 8, title: "Payment Gateway", description: "Adding support for international currencies." },
    //     { id: 9, title: "Analytics Features", description: "Tracking real-time events and conversion metrics." },
    //     { id: 10, title: "Customer Support Bot", description: "Training the chatbot on the new knowledge base." },
    //     { id: 11, title: "New Demo Bot", description: "Training the chatbot on the new knowledge base." }
    // ];

    // const upcomingProjects = [
    //     { id: 11, title: "Dark Mode Support", description: "Adding a system-wide theme toggle preference." },
    //     { id: 12, title: "Localization", description: "Translating the platform into Spanish and French." },
    //     { id: 13, title: "Performance Optimization", description: "Reducing bundle size and improving core web vitals." },
    //     { id: 14, title: "Email Marketing Tool", description: "Integrating a drag-and-drop email builder." },
    //     { id: 15, title: "Referral Program", description: "Designing a reward system for user invites." }
    // ];
    

                <div className="grid gap-2 md:grid-cols-3 items-start">

                    // {/* Upcoming Projects 
                    <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
                        <CardHeader className="pb-1 p-3">
                            <CardTitle className="text-lg text-center font-medium text-orange-600">Upcoming Projects</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-2">
                                {upcomingProjects.slice(0, 3).map((project) => (
                                    <li key={project.id}>
                                        <Link href={`${projectDetailRoute}${project.id}`} className="block group p-1.5 rounded-lg hover:bg-accent hover:shadow-sm transition-all border border-transparent hover:border-border/50">
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
                        {upcomingProjects.length > 3 && (
                            <CardFooter>
                                <Button variant="ghost" className="w-full gap-2 text-muted-foreground hover:text-foreground" asChild >
                                    <Link href="/admin/projects/upcoming">
                                        View All <ChevronDown className="h-4 w-4 -rotate-90" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        )}
                    </Card>
                    // {/* Running Projects 
                    <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
                        <CardHeader className="pb-1 p-3">
                            <CardTitle className="text-lg text-center font-medium text-blue-600">Running Projects</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-2">
                                {runningProjects.slice(0, 3).map((project) => (
                                    <li key={project.id}>
                                        <Link href={`${projectDetailRoute}${project.id}`} className="block group p-1.5 rounded-lg hover:bg-accent hover:shadow-sm transition-all border border-transparent hover:border-border/50">
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
                        {runningProjects.length > 3 && (
                            <CardFooter>
                                <Button variant="ghost" className="w-full gap-2 text-muted-foreground hover:text-foreground" asChild >
                                    <Link href="/admin/projects/running">
                                        View All <ChevronDown className="h-4 w-4 -rotate-90" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        )}
                    </Card>

                    // {/* Completed Projects 
                    <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
                        <CardHeader className="pb-1 p-3">
                            <CardTitle className="text-lg text-center font-medium text-green-600">Completed Projects</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-2">
                                {completedProjects.slice(0, 3).map((project) => (
                                    <li key={project.id}>
                                        <Link href={`${projectDetailRoute}${project.id}`} className="block group p-1.5 rounded-lg hover:bg-accent hover:shadow-sm transition-all border border-transparent hover:border-border/50">
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
                        {completedProjects.length > 3 && (
                            <CardFooter>
                                <Button variant="ghost" className="w-full gap-2 text-muted-foreground hover:text-foreground" asChild >
                                    <Link href="/admin/projects/completed">
                                        View All <ChevronDown className="h-4 w-4 -rotate-90" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        )}
                    </Card>
                </div>
*/