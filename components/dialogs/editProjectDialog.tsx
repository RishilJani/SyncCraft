"use client";

import React from "react";
import { Project } from "@/app/(utils)/myTypes";
import AddProjectDialog from "./addProjectDialog";

export default function EditProjectForm({
    children,
    data,
    open,
    setOpen
}: { children: React.ReactNode; data: Project; setOpen: Function; open: boolean; }) {

    return (
        <>
            <AddProjectDialog data={data} open={open} setOpen={setOpen} >
                {children}
            </AddProjectDialog>
        </>
    );
}