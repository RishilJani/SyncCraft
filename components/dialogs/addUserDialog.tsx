"use client";
import { useState } from "react";
import CustomLoader from "../custom_loader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { role_enum } from "@/app/generated/prisma/enums";
import { Errors } from "@/app/(types)/myTypes";
import { PasswordInput } from "../ui/password-input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import { useMyContext } from "@/app/(utils)/myContext";
import { myHeaders } from "@/app/(utils)/utils";

export default function AddUserDialog({
    children,
    open,
    setOpen
}: { children: React.ReactNode, open: boolean, setOpen: Function }) {

    const { refreshData, loading, setLoading } = useMyContext();
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<role_enum>(role_enum.manager);
    const [errors, setErrors] = useState<Errors>({});

    const validateForm = () => {
        const newError: Errors = {};
        if (!userName.trim())
            newError.name = "Name is Required";

        if (!email.trim())
            newError.email = "Email is Required";
        else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
            newError.email = "Invalid email format";


        if (!password.trim())
            newError.password = "Passwprd os Required";
        else if (!/[a-z]/.test(password))
            newError.password = "Password must contain at least one lowercase letter";
        else if (!/[A-Z]/.test(password))
            newError.password = "Password must contain at least one uppercase letter";
        else if (!/\d/.test(password))
            newError.password = "Password must contain at least one digit";
        else if (!/[^A-Za-z0-9]/.test(password))
            newError.password = "Password must contain at least one special character";

        console.log("newError = ", newError);

        setErrors(newError);
        return Object.keys(newError).length == 0;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (validateForm()) {
                setLoading(true);

                const obj = {
                    userName: userName,
                    password: password,
                    email: email,
                    role: role,
                };
                var res = await (await fetch("/api/admin/employess", {
                    method: "POST",
                    headers: myHeaders,
                    body: JSON.stringify(obj)
                })).json();

                if (!res.error) {
                    await refreshData();
                    setOpen();
                }
            }
        } catch (err) {
            console.log('Some Error Occured at addUserDialog');
            console.log(err)
        } finally {
            setLoading(false);
        }

    }

    const handleOpenChange = () => {
        setOpen();
    }

    if (loading) { return (<CustomLoader message="Just a minute" />); }
    console.log("Err= ", errors);

    return (
        <>
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>

                <DialogContent className="sm:max-w-3/8 p-0 max-h-11/12 overflow-auto" style={{ scrollbarWidth: "none" }}>
                    <div>
                        <DialogHeader className="p-6 pb-2">
                            <DialogTitle className="text-2xl font-bold text-center mt-2"> Add Employee </DialogTitle>
                            <p className="text-md text-center text-muted-foreground"> Enter employee details below </p>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="m-auto max-h-fit w-full max-w-lg rounded-[calc(var(--radius)+.125rem)] p-1 pb-5 ">
                            <div className="p-8 pb-6">
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="userName" className="block text-sm"> User Name </Label>
                                        <Input
                                            type="text" required
                                            name="userName"
                                            id="userName"
                                            value={userName}
                                            onChange={(e) => { setUserName(e.target.value); }} />
                                        {errors.name && <p className='text-red-500 text-sm'>{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="block text-sm"> Email</Label>
                                        <Input
                                            type="email" required
                                            name="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => { setEmail(e.target.value); }} />
                                        {errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>}
                                    </div>

                                    <div className="space-y-2">

                                        <Label htmlFor="pwd" className="text-title text-sm"> Password </Label>
                                        <PasswordInput required name="pwd" id="pwd" className="input sz-md variant-mixed" value={password} autoComplete='current-password' onChange={(e) => { setPassword(e.target.value); }} />
                                        {errors.password && <p className='text-red-500 text-sm'>{errors.password}</p>}
                                    </div>

                                    <div className="space-y-2 my-3">
                                        <Label className="text-title text-sm"> Role </Label>
                                        <RadioGroup value={role} onValueChange={(value) => setRole(value as role_enum)} className="flex flex-row justify-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value={role_enum.manager} id="r-manager" />
                                                <Label htmlFor="r-manager">Manager</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value={role_enum.member} id="r-member" />
                                                <Label htmlFor="r-member">Member</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>


                                </div>

                                <div className="pt-2 mt-5">
                                    <Button type="submit" className="w-full text-lg">Add Employee</Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}