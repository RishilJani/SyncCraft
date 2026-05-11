"use client";
import { useState } from "react";
import CustomLoader from "../custom_loader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { role_enum } from "@/app/generated/prisma/enums";
import { Errors } from "@/app/(utils)/myTypes";
import { PasswordInput } from "../ui/password-input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import { useMyContext } from "@/app/(utils)/myContext";
import { myHeaders } from "@/app/(utils)/utils";
import { DialogDescription } from "@radix-ui/react-dialog";

export default function AddUserDialog({
    children,
    open,
    setOpen,
    onSubmit
}: { children: React.ReactNode, open: boolean, setOpen: Function, onSubmit?: Function }) {

    const { user } = useMyContext();
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<role_enum>(role_enum.manager);
    const [errors, setErrors] = useState<Errors>({});
    const [loading, setLoading] = useState(false);

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
                    organization: user?.organization,
                };
                var res = await (await fetch("/api/admin/employees", {
                    method: "POST",
                    headers: myHeaders,
                    body: JSON.stringify(obj)
                })).json();

                if (!res.error) {
                    if (onSubmit)
                        await onSubmit();
                    setOpen(false);
                } else {
                    console.log('Some Error Occured at addUserDialog');
                    console.log(res.message);
                }
            }
        } catch (err) {
            console.log('Some Error Occured at addUserDialog');
            console.log(err)
        } finally {
            setLoading(false);
        }

    }

    const handleOpenChange = (val: boolean) => {
        setOpen(val);
    }

    if (loading) { return (<CustomLoader message="Just a minute" />); }

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
                            <DialogDescription className="text-md text-center text-muted-foreground"> Enter employee details below </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="bg-card m-auto h-fit w-full max-w-lg rounded-[calc(var(--radius)+.125rem)] p-1 border ">
                            <div className="p-8 pb-6">
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="userName" className="block text-sm font-medium"> User Name </Label>
                                        <Input id="userName" placeholder="Enter username" type="text" required name="userName" value={userName} onChange={(e) => { setUserName(e.target.value); }} />
                                        {errors.name && <p className='text-red-500 text-sm'>{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="block text-sm font-medium"> Email</Label>
                                        <Input id="email" type="email" required placeholder="Enter email" name="email" value={email} onChange={(e) => { setEmail(e.target.value); }} />
                                        {errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="pwd" className="block text-sm font-medium"> Password </Label>
                                        <PasswordInput placeholder="Enter the password" required name="pwd" id="pwd" className="input sz-md variant-mixed" value={password} autoComplete='current-password' onChange={(e) => { setPassword(e.target.value); }} />
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
                                    <Button type="submit" className="w-full text-lg" disabled={loading}>Add Employee</Button>
                                </div>
                            </div>
                        </form>
                        <div className="bg-muted border-t p-3 mt-3">
                            <p className="text-center text-sm">
                                <Button variant="link" onClick={() => handleOpenChange(false)} className="px-2 text-[15px] text-muted-foreground"> Cancel</Button>
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}