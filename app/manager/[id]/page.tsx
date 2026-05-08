import { role_enum } from '@/app/generated/prisma/enums';
import UserProfilePage from '@/components/profilePage'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Folder } from 'lucide-react';
import { Project, Status, User } from '@/app/(types)/myTypes';
import { statusColors, statusTextColors } from '@/app/(utils)/utils';



async function ManagerProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;

    const response = await fetch(`${process.env.PUBLIC_APP_URL || 'http://localhost:3000'}/api/user/${id}`, {
        cache: 'no-store'
    });
    const result = await response.json();
    const user: User | null = result.data;
    const projects = user?.projects == undefined ? [] : user.projects;

    return (
        <div className="flex flex-col gap-6 pb-10">
            <UserProfilePage id={id} viewerRole={role_enum.manager} />
            <ManagerProjectList projects={projects} />
        </div>
    );
}
function ManagerProjectList({ projects }: { projects: Project[] }) {
    return (
        <>

            <div className="container mx-auto max-w-3xl px-4 md:px-0">
                <Card className="shadow-md border-primary/10">
                    <CardHeader className="bg-muted/30">
                        <CardTitle className="flex items-center gap-2">
                            <Folder className="h-5 w-5 text-primary" />
                            Assigned Projects
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {projects.length > 0 ? (
                            <div className="space-y-4">
                                {projects.map((project) => (
                                    <Link key={project.projectId} href={`/project/${project.projectId}`} className="block group">
                                        <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:border-primary/30 hover:bg-muted/50 transition-all shadow-sm">
                                            <div className="flex-1 min-w-0 mr-4">
                                                <h3 className="font-semibold group-hover:text-primary transition-colors truncate">{project.projectName}</h3>
                                                <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                                            </div>
                                            <Badge variant="secondary" className={`capitalize ${statusColors[project.status!]} ${statusTextColors[project.status!]}`}>{project.status}</Badge>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/10">
                                <p className="font-medium text-lg mb-1">No Projects Assigned</p>
                                <p className="text-sm">This manager isn't currently assigned to any projects.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

export default ManagerProfilePage
export { ManagerProjectList };