import { role_enum } from "../generated/prisma/enums";
export enum Priority { Low = "Low", Medium = "Medium", High = "High" }
export enum Status { Todo = "todo", Pending = "pending", Completed = "completed" }

export type User = {
    userId?: number | undefined,
    userName?: string | undefined,
    email?: string | undefined,
    passwordHash?: string | undefined,
    createdAt?: Date | null, 
    role?: role_enum,
}

export type Task = {
    taskId: number;
    assignedTo: number | null;
    title: string;
    description?: string;
    dueDate?: Date | null;
    createdAt?: Date | null;
    completionDate?: Date | null;
    points?: number;
    status: Status;
    projectId? : number 
    priority: Priority;
};

export type Project = {
    projectId?: number,
    projectName: string,
    description?: string | null,
    createdBy?: number | null,
    createdAt?: Date | null,
    dueDate?: Date | null,
    completionDate?: Date | null,
    status?: Status,

    manager?: User,
    members?: User[] | undefined,
    tasks?: Task[]
}
