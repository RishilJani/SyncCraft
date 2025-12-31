"use client";

import {
  KanbanBoard,
  KanbanBoardCard,
  KanbanBoardCardDescription,
  KanbanBoardCardTitle,
  KanbanBoardColumn,
  KanbanBoardColumnHeader,
  KanbanBoardColumnList,
  KanbanBoardColumnListItem,
  KanbanBoardColumnTitle,
  KanbanBoardProvider,
} from "@/components/kanban";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Priority, Status, Task } from "../utils";

type KanbanTask = Task & { id: string };

type Column = {
  id: string;
  title: string;
  cards: KanbanTask[];
};

export default function ManageDashboard() {
  // Mock data with taskId (DB schema)
  const allTasks: Task[] = [
    {
      taskId: "1", title: "Review Q1 Goals", description: "Analyze the performance reports for the first quarter.",
      status: Status.Todo,
      priority: Priority.Low,
      assignedTo: null,
      dueDate: new Date(),
      createdDae: null,
      complitionDate: null,
    },
    {
      taskId: "2", title: "Team Meeting", description: "Scheduled weekly sync with the development team.",
      status: Status.Todo,
      priority: Priority.Medium,
      assignedTo: null,
      dueDate: new Date(),
      createdDae: null,
      complitionDate: null,
    },
    {
      taskId: "3", title: "Onboard New Hire", description: "Prepare onboarding documents for the new frontend dev.",
      status: Status.Todo,
      priority: Priority.High,
      assignedTo: null,
      dueDate: new Date(),
      createdDae: null,
      complitionDate: null,
    },
    {
      taskId: "4", title: "Task 4", description: "Prepare onboarding documents for the new frontend dev.",
      status: Status.Pending,
      priority: Priority.Medium,
      assignedTo: null,
      dueDate: new Date(),
      createdDae: null,
      complitionDate: null,
    },
    {
      taskId: "5",
      title: "Task 5", description: "Prepare onboarding documents for the new frontend dev.",
      status: Status.Completed,
      priority: Priority.Medium,
      assignedTo: null,
      dueDate: new Date(),
      createdDae: null,
      complitionDate: null,
    }
  ];
  const kanbanTasks: KanbanTask[] = allTasks.map(task => ({ ...task, id: task.taskId }));

  const todosTasks = kanbanTasks.filter((task) => task.status === Status.Todo);
  const pendingTasks = kanbanTasks.filter((task) => task.status === Status.Pending);
  const completedTasks = kanbanTasks.filter((task) => task.status === Status.Completed);
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "todo",
      title: "To Do",
      cards: todosTasks,
    },
    {
      id: "pending",
      title: "Pending",
      cards: pendingTasks,
    },
    {
      id: "completed",
      title: "Completed",
      cards: completedTasks,
    },
  ]);

  const removeCard = (taskId: string) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cards: col.cards.filter((card) => card.taskId !== taskId),
      }))
    );
  };

  const handleDropOverColumn = (dataTransferData: string, targetColumnId: string) => {
    const droppedCard: KanbanTask = JSON.parse(dataTransferData);
    removeCard(droppedCard.taskId);
    setColumns((prev) =>
      prev.map((col) =>
        col.id === targetColumnId
          ? { ...col, cards: [...col.cards, { ...droppedCard, status: targetColumnId as Status }] }
          : col
      )
    );
  };

  const handleDropOverListItem = (
    dataTransferData: string,
    dropDirection: "top" | "bottom",
    targetCardId: string
  ) => {
    const droppedCard: KanbanTask = JSON.parse(dataTransferData);
    removeCard(droppedCard.taskId);
    setColumns((prev) =>
      prev.map((col) => {
        const targetIndex = col.cards.findIndex((card) => card.taskId === targetCardId); // Target lookup by taskId (which matches id)
        if (targetIndex === -1) return col;
        const newCards = [...col.cards];
        const insertIndex = dropDirection === "top" ? targetIndex : targetIndex + 1;
        newCards.splice(insertIndex, 0, { ...droppedCard, status: col.id as Status });
        return { ...col, cards: newCards };
      })
    );
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4 md:p-8">
      <div className="mx-auto w-full space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="gap-1">
              <Link href="/admin/employees">
                <Users className="h-4 w-4" />
                View All Employees
              </Link>
            </Button>
            <Button asChild className="gap-1">
              <Link href="/admin/addProject">
                <Plus className="h-4 w-4" />
                Add Project
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden h-full mx-auto w-full">
          <KanbanBoardProvider>
            <KanbanBoard className="h-full gap-4">
              {columns.map((column) => (
                <KanbanBoardColumn
                  key={column.id}
                  columnId={column.id}
                  onDropOverColumn={(data) => handleDropOverColumn(data, column.id)}
                  className="bg-card/50 backdrop-blur-sm border-border/50 mx-2" >
                  <KanbanBoardColumnHeader>
                    <KanbanBoardColumnTitle columnId={column.id} className="text-lg font-semibold px-2">
                      {column.title}
                    </KanbanBoardColumnTitle>
                  </KanbanBoardColumnHeader>

                  <KanbanBoardColumnList className="px-2 pb-2">
                    {column.cards.map((card) => (
                      <KanbanBoardColumnListItem
                        key={card.id}
                        cardId={card.id}
                        onDropOverListItem={(data, dir) => {
                          if (dir === "top" || dir === "bottom") {
                            handleDropOverListItem(data, dir, card.id);
                          }
                        }}
                      >
                        <KanbanBoardCard data={card} className="cursor-grab active:cursor-grabbing hover:shadow-md transition-all">
                          <div className="flex justify-between items-start">
                            <KanbanBoardCardTitle className="text-base">{card.title}</KanbanBoardCardTitle>
                            <Badge variant={card.priority === Priority.High ? "destructive" : card.priority === Priority.Medium ? "default" : "secondary"} className="text-[12px] px-1.5 py-0">
                              {card.priority}
                            </Badge>
                          </div>
                          <KanbanBoardCardDescription className="mt-2 line-clamp-2">
                            {card.description}
                          </KanbanBoardCardDescription>
                          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                            {/* You can add more metadata here like due date or assignee avatar if available */}
                            {/* <div className="h-4 w-4 rounded-full bg-muted border"></div> */}
                          </div>
                        </KanbanBoardCard>
                      </KanbanBoardColumnListItem>
                    ))}
                  </KanbanBoardColumnList>
                </KanbanBoardColumn>
              ))}
            </KanbanBoard>
          </KanbanBoardProvider>
        </div>
      </div>
    </div>
  );
}