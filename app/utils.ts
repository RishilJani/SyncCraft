import { role_enum } from "./generated/prisma/enums";
enum Role { Admin = "admin", Manager = "manager", Member = "member" }
enum Priority { Low = "low", Medium = "medium", High = "high" }
enum Status { Todo = "todo", Pending = "pending", Completed = "completed" }

/* Types */
export type Task = {
    taskId: string;
    title: string;
    description: string;
    priority: Priority;
    assignedTo: number | null;
    dueDate: Date;
    createdDae: Date | null;
    complitionDate: Date | null;
    status: Status;
};

export type Users = {
    userId?: number,
    userName?: string,
    email?: string,
    passwordHash?: string | undefined,
    role?: role_enum,
    createdAt?: Date
}

export function MyResponse(error: boolean, message: string, data: any, {status} : {status : number}){
    return Response.json({ error, data, message }, {status : status});
}
export function ErrorResponse(data: any){
    return Response.json({ error : true, data, message : "Some Error Occured" }, {status : 500});
}

export const myHeaders = { "Content-Type": "application/json" };

export { Role, Priority, Status };