import { getAllUsers } from "@/app/actions/users/Users";
import { prisma } from "@/lib/prisma";
import EditProjectForm from "./edit-project-form";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { role_enum } from "@/app/generated/prisma/enums";
import { Project, Status, User } from "@/app/(types)/myTypes";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const users = await getAllUsers();

    const AllManagers = users.filter((u) => u.role === role_enum.manager);
    const AllMembers = users.filter((u) => u.role === role_enum.member);

    // ::::::: API fetch here :::::::

    const manager : User = {
        userId : 2,
        userName: "Demo Manager",
        createdAt : new Date(2025,11,31),
        email : "Demo Email",
        role : role_enum.manager
    }
    const members : User[]= [
        {
            userId : 3,
            userName : "Demo Member 1",
            createdAt : new Date(2025,11,30),
            email : "Demo Member email 1",
            role : role_enum.member
        },
        {
            userId : 4,
            userName : "Demo Member 2",
            createdAt : new Date(2025,11,29),
            email : "Demo Member email 2",
            role : role_enum.member
        },
    ];


    const project : Project= {
        projectId : 1,
        projectName : "Demo Project",
        description : "Demo description",
        dueDate : new Date(2026,4,13),
        createdAt : new Date(),
        createdBy : 1,
        status: Status.Todo,
        manager : manager,
        members : members,
    } 


    if (!project) {
        notFound();
    }

    // Find the manager among associated users
    // const projectManager = project.user_projects.find(up => up.Users?.role === role_enum.manager);

    // Find the members among associated users
    // const projectMembers = project.user_projects
    //     .filter(up => up.Users?.role === role_enum.member)
    //     .map(up => up.userid as number);

    return (
        <EditProjectForm
           data={project}
        ><Button>Update Project</Button>

        </EditProjectForm>
    );
}
