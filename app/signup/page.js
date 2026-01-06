"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Ticket, ArrowLeft, User, Mail, Lock } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email";
        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 6) newErrors.password = "Min 6 characters";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error || "Signup failed");
            }

            // Store user in localStorage
            localStorage.setItem("user", JSON.stringify(data.data));
            router.push("/create-event");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]"></div>

            <Card className="w-full max-w-md border-slate-200 rounded-none shadow-none relative">
                <CardHeader className="text-center border-b border-slate-200 py-8">
                    <Link href="/" className="inline-flex items-center justify-center w-14 h-14 border border-slate-900 mx-auto mb-4">
                        <Ticket className="h-7 w-7 text-slate-900" />
                    </Link>
                    <CardTitle className="text-2xl font-light text-slate-900">Create account</CardTitle>
                    <CardDescription className="text-slate-600 font-light mt-2">Sign up to create and manage events</CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="pt-8 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-normal text-slate-900 flex items-center gap-2">
                                <User className="h-4 w-4" /> Full Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                className={`h-12 rounded-none border-slate-300 focus:border-slate-900 ${errors.name ? "border-red-500" : ""}`}
                            />
                            {errors.name && <p className="text-red-600 text-sm font-light">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-normal text-slate-900 flex items-center gap-2">
                                <Mail className="h-4 w-4" /> Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className={`h-12 rounded-none border-slate-300 focus:border-slate-900 ${errors.email ? "border-red-500" : ""}`}
                            />
                            {errors.email && <p className="text-red-600 text-sm font-light">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-normal text-slate-900 flex items-center gap-2">
                                <Lock className="h-4 w-4" /> Password
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Min 6 characters"
                                value={formData.password}
                                onChange={handleChange}
                                className={`h-12 rounded-none border-slate-300 focus:border-slate-900 ${errors.password ? "border-red-500" : ""}`}
                            />
                            {errors.password && <p className="text-red-600 text-sm font-light">{errors.password}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-normal text-slate-900">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Re-enter password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`h-12 rounded-none border-slate-300 focus:border-slate-900 ${errors.confirmPassword ? "border-red-500" : ""}`}
                            />
                            {errors.confirmPassword && <p className="text-red-600 text-sm font-light">{errors.confirmPassword}</p>}
                        </div>

                        {error && (
                            <div className="border border-red-500 bg-red-50 text-red-600 p-4 text-sm font-light">
                                {error}
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="border-t border-slate-200 pt-6 flex flex-col gap-4">
                        <Button type="submit" disabled={isLoading} className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-none h-12">
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Sign Up
                        </Button>

                        <p className="text-slate-600 text-sm text-center font-light">
                            Already have an account?{" "}
                            <Link href="/login" className="text-slate-900 hover:underline font-normal">Login</Link>
                        </p>

                        <Link href="/" className="w-full">
                            <Button variant="outline" className="w-full border-slate-300 text-slate-900 hover:bg-slate-50 rounded-none h-12">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Home
                            </Button>
                        </Link>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
