"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Project, User } from "../(types)/myTypes";

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    projects: Project[];
    setProjects: (projects: Project[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    refreshData: () => Promise<void>;
    setSpecificProject: ({ projectId }: { projectId: number }) => void;
}

const MyContext = createContext<UserContextType | undefined>(undefined);

export function MyContextProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);


    const refreshData = async () => {
        setLoading(true);
        try {
            const userRes = await fetch("/api/user/current", { cache: 'no-store' });
            const userData = await userRes.json();

            if (userData && !userData.error) {
                setUser(userData.data);

                if (userData.data.userId) {
                    const projectsRes = await fetch(`/api/projects/user/${userData.data.userId}`, { cache: 'no-store' });
                    const projectsData = await projectsRes.json();
                    if (projectsData && !projectsData.error) {
                        setProjects(projectsData.data);
                    }
                }
            } else {
                setUser(null);
                setProjects([]);
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        } finally {
            setLoading(false);
        }
    };
    const setSpecificProject = async ({ projectId }: { projectId: number }) => {
        if (!projectId) return;
        try {
            const res = await (await fetch("/api/projects/" + projectId, { cache: 'no-store' })).json();
            if (!res || res.error) {
                return;
            }

            setProjects(prevProjects => prevProjects.map(e => e.projectId == res.data.projectId ? res.data : e));
        } catch (err) {
            console.log('Some Error Occured at myContextProvider');
            console.log(err)
        }

    }

    useEffect(() => {
        refreshData();
    }, []);

    return (
        <MyContext.Provider value={{
            user,
            projects,
            loading,
            setUser,
            setProjects,
            setLoading,
            refreshData,
            setSpecificProject
        }}>
            {children}
        </MyContext.Provider>
    );
}

export const useMyContext = () => {
    const context = useContext(MyContext);
    if (context === undefined) {
        throw new Error("useMyContext must be used within a MyContextProvider");
    }
    return context;
};