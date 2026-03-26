'use client'

import { Project, User } from "@/app/(types)/myTypes";
import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "../ui/dialog";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardFooter } from "../ui/card";

export default function SelectManagerDialog({user_id}:{user_id:number}){
    const [managers, setManagers] = useState<User[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);



    useEffect(()=>{
        setIsLoading(true);
        fetch('/api/manager').then(res=>res.json()).then(async mangs=>{
            let res = await fetch(`/api/projects/user/${user_id}`);
            let data = await res.json();
            setManagers((mangs.data as User[]).filter(mang=>mang.userId!=user_id) as User[]);
            setProjects(data.data as Project[]);
            setIsLoading(false);
            
        });
    },[]);

    return (
        <>
        <Dialog>
            <DialogTrigger asChild>
                <Button type="button" variant='default'>
                    Select new Manager
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                        Select manager for all projects of user:
                        </DialogTitle>
                {isLoading && <Skeleton className="border rounded-3xl h-400 w-300">
                    </Skeleton>}
                    {
                        !isLoading && <>
                        
                        {projects.length>0 &&
                            projects.map(project=>{
                                return <Card key={project.projectId}>
                                        <CardContent>
                                            
                                            <h2 className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
                                            {project.projectName}
                                            </h2>
                                        </CardContent>
                                        <CardFooter>
                                            <Select>
                                        <SelectTrigger className="w-full max-w-48">
                                            <SelectValue placeholder="Select a fruit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                            
                                            {
                                                managers.map(val=>{
                                                return <>
                                                <SelectItem value={(val.userId??0).toString()} > {val.userName} </SelectItem>
                                                </>
                                            })
                                            }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                        </CardFooter>
                                    </Card>
                            })
                        }
                        {
                            projects.length==0 && <h1 className="text-3xl">No project available</h1>
                        }
                        <Button> Set all managers </Button>
                        </>
                    }
            </DialogContent>
        </Dialog>
        </>
    );
}