// "use server";

import { Task, Status, Priority } from "@/app/(types)/myTypes";

// import { prisma } from "@/lib/prisma";
// import { Status } from "../utils";

// async function updateTaskStatus(taskId: string, status: Status) {
//     try {
//         await prisma.tasks.update({
//             where: {
//                 taskId: parseInt(taskId),
//             },
//             data: {
//                 status: status as string,
//             }
//         });   
//     } catch (error) {
        
//     }
// }

// export const allTasks: Task[] = [
//         {
//             taskId: 1, title: "Review Q1 Goals", description: "Analyze the performance reports for the first quarter.",
//             status: Status.Todo,
//             priority: Priority.Low,
//             assignedTo: 101, // Alice
//             dueDate: new Date(),
//             createdAt : null,
//             completionDate : null,
//         },
//         {
//             taskId: 2, title: "Team Meeting", description: "Scheduled weekly sync with the development team.",
//             status: Status.Todo,
//             priority: Priority.Medium,
//             assignedTo: 102, // Bob
//             dueDate: new Date(),
//             createdAt: null,
//             completionDate: null,
//         },
//         {
//             taskId: 3, title: "Onboard New Hire", description: "Prepare onboarding documents for the new frontend dev.",
//             status: Status.Todo,
//             priority: Priority.High,
//             assignedTo: 103, // Charlie
//             dueDate: new Date(),
//             createdAt: null,
//             completionDate: null,
//         },
//         {
//             taskId: 4, title: "Task 4", description: "Prepare onboarding documents for the new frontend dev.",
//             status: Status.Pending,
//             priority: Priority.Medium,
//             assignedTo: 104, // Diana
//             dueDate: new Date(),
//             createdAt: null,
//             completionDate: null,
//         },
//         {
//             taskId: 5,
//             title: "Task 5", description: "Prepare onboarding documents for the new frontend dev.",
//             status: Status.Completed,
//             priority: Priority.Medium,
//             assignedTo: 105, // Ethan
//             dueDate: new Date(),
//             createdAt: null,
//             completionDate: null,
//         }
// ];

