"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Ticket, ArrowLeft, Mail, Lock } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error || "Login failed");
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
                    <CardTitle className="text-2xl font-light text-slate-900">Welcome back</CardTitle>
                    <CardDescription className="text-slate-600 font-light mt-2">Login to manage your events</CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="pt-8 space-y-6">
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
                                className="h-12 rounded-none border-slate-300 focus:border-slate-900"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-normal text-slate-900 flex items-center gap-2">
                                <Lock className="h-4 w-4" /> Password
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                className="h-12 rounded-none border-slate-300 focus:border-slate-900"
                            />
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
                            Login
                        </Button>

                        <p className="text-slate-600 text-sm text-center font-light">
                            Don't have an account?{" "}
                            <Link href="/signup" className="text-slate-900 hover:underline font-normal">Sign up</Link>
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
