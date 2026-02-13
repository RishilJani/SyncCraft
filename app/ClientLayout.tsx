"use client";

import { MyContextProvider, useMyContext } from "./(utils)/myContext";
import CustomLoader from "@/components/custom_loader";
import React from "react";

function LoaderWrapper({ children }: { children: React.ReactNode }) {
    const { loading } = useMyContext();

    return (
        <>
            {loading && ( <CustomLoader message="Syncing your workspace..." /> )}
            <div className={loading ? "hidden" : "block"}>
                {children}
            </div>
        </>
    );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <MyContextProvider>
            <LoaderWrapper>{children}</LoaderWrapper>
        </MyContextProvider>
    );
}
