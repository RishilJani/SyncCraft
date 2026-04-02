"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { format } from "date-fns";

interface TaskDueDateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    taskTitle: string;
    newDate: Date | null;
}

export default function TaskDueDateDialog({ open, onOpenChange, onConfirm, taskTitle, newDate }: TaskDueDateDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Change Due Date for Task?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to change the due date for the task <strong>{taskTitle}</strong> to <strong>{newDate ? format(newDate, "PPP") : 'None'}</strong>?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Confirm
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
