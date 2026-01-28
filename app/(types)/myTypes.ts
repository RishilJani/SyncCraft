import { role_enum, status_enum } from "../generated/prisma/enums";

export enum Priority { Low = "low", Medium = "medium", High = "high" }
export enum Status { Todo = "todo", Pending = "pending", Completed = "completed" }


export type User = {
    userId?: number,
    userName?: string,
    email?: string,
    passwordHash?: string | undefined,
    createdAt?: Date
    role?: role_enum,
}

export type Task = {
    taskId: number;
    listId? : number,
    assignedTo: number | null;
    title: string;
    description: string;
    priority: Priority;
    dueDate: Date;
    createdDate: Date | null;
    complitionDate: Date | null;
    status: Status;
    points?: Number
};

export type Project = {
    projectId?: number,
    projectName?: string,
    description?: string,
    createdBy?: number,
    createdAt?: Date,
    dueDate?: Date,
    completionDate?: Date,
    status?: Status,

    manager?: User,
    members?: User[],
    tasks?: Task[]
}
