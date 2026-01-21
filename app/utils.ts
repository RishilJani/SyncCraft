enum Role{ Admin = "admin", Manager = "manager", Member= "member" }
enum Priority{ Low = "low", Medium = "medium", High = "high" } 
enum Status{ Todo = "todo", Pending = "pending", Completed = "completed" }

/* Types */
type Task = {
  taskId: string;
  title: string;
  description: string;
  priority: Priority;
  assignedTo : number | null;
  dueDate : Date;
  createdDae : Date | null;
  complitionDate : Date | null;
  status: Status;
};

export {Role , Priority, Status};
export type {Task};