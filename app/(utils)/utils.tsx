import { Badge } from '@/components/ui/badge';
import { Status } from './myTypes';

export function MyResponse(error: boolean, message: string, data: any, { status = 200 }: { status: number }) {
    return Response.json({ error, data, message }, { status: status });
}
export function ErrorResponse(data: any) {
    return Response.json({ error: true, data, message: "Some Error Occured" });
}

export const myHeaders = { "Content-Type": "application/json" };

export function formateDate(date: Date | null | undefined) {
    if (date == null || date == undefined) {
        return "00/00/0000";
    }
    const formatedDate = (new Date(date)).toLocaleDateString("en-GB");
    return formatedDate;
}

export const statusColors = {
    [Status.Todo]: "bg-blue-500/10 border-blue-500/20",
    [Status.Pending]: "bg-yellow-500/10 border-yellow-500/20",
    [Status.Completed]: "bg-green-500/10 border-green-500/20",
};
export const statusTextColors = {
    [Status.Todo]: "text-blue-500/90",
    [Status.Pending]: "text-yellow-500/90",
    [Status.Completed]: "text-green-500/90",
}

export function StatusBadge({ status }: { status: string }) {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        completed: "default",
        pending: "default",
        todo: "outline",
    };

    let colorClass = "";
    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus === "completed") colorClass = "bg-green-500 hover:bg-green-600 border-transparent";
    if (normalizedStatus === "pending") colorClass = "bg-blue-500 text-white border-transparent";
    if (normalizedStatus === "todo") colorClass = "text-orange-600 border-orange-200 bg-orange-50";

    return (
        <Badge variant={variants[normalizedStatus] || "outline"} className={colorClass}>
            {status}
        </Badge>
    );
}