"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Search, User as UserIcon, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, Project } from "@/app/(utils)/myTypes";
import CustomLoader from "@/components/custom_loader";
import { useMyContext } from "@/app/(utils)/myContext";

export default function ViewProjectTeam({ params }: { params: Promise<{ id: string }> }) {
    const { projects, setSpecificProject, loading: contextLoading } = useMyContext();
    const resolvedParams = use(params);
    const projectId = Number(resolvedParams.id);

    const [searchQuery, setSearchQuery] = useState("");
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProject() {
            setLoading(true);
            try {
                // Check if project exists in context and has members
                const existingProject = projects.find((p) => p.projectId === projectId);
                if (existingProject && existingProject.members) {
                    setProject(existingProject);
                } else {
                    // Fetch specific project detail if not in context or members missing
                    await setSpecificProject({ projectId });
                }
            } catch (error) {
                console.error("Failed to load project team:", error);
            } finally {
                setLoading(false);
            }
        }
        loadProject();
    }, [projectId, projects, setSpecificProject]);

    // Combined list of manager and members, ensuring uniqueness by userId
    const allMembersMap = new Map<number, User>();
    if (project) {
        if (project.manager && project.manager.userId) {
            allMembersMap.set(project.manager.userId, project.manager);
        }
        if (project.members) {
            project.members.forEach((member) => {
                if (member.userId) {
                    allMembersMap.set(member.userId, member);
                }
            });
        }
    }
    const allMembers = Array.from(allMembersMap.values());

    const filteredMembers = allMembers.filter((member) =>
        member.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading || contextLoading) {
        return <CustomLoader message="Loading team members..." />;
    }

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <h2 className="text-2xl font-bold">Project Not Found</h2>
                <Button asChild variant="outline">
                    <Link href="/manager">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 p-4 md:p-8 max-w-7xl mx-auto w-full">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/manager">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{project.projectName}</h1>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search team members..."
                        className="w-full pl-9 bg-background"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredMembers.length > 0 ? (
                    filteredMembers.map((member: User) => (
                        <Card key={member.userId} className="hover:shadow-lg transition-all duration-300 border-border/50 overflow-hidden">
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold text-xl uppercase">
                                    {member.userName?.charAt(0) || "U"}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-lg truncate">{member.userName}</CardTitle>
                                        {member.role === "manager" && (
                                            <ShieldCheck className="h-4 w-4 text-blue-500" />
                                        )}
                                    </div>
                                    <CardDescription className="flex items-center gap-2 uppercase text-[10px] font-bold tracking-wider">
                                        <span className='text-muted-foreground'>
                                            {member.role}
                                        </span>
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="grid gap-2.5 text-sm text-muted-foreground mt-4">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 opacity-70" />
                                    <span className="truncate">{member.email}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 bg-background/50 rounded-xl border-2 border-dashed border-muted">
                        <UserIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <p className="text-muted-foreground">No team members found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
