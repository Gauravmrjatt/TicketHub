"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Upload, CheckCircle, Loader2, User, CreditCard, Ticket } from "lucide-react";

export default function BookPage() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSettings, setIsLoadingSettings] = useState(true);
    const [ticketData, setTicketData] = useState(null);
    const [error, setError] = useState("");

    const [paymentSettings, setPaymentSettings] = useState({
        upiAddress: "",
        qrCodeImage: "",
    });

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        utr: "",
        paymentImage: "",
        paymentImagePreview: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/settings");
                const data = await res.json();
                if (data.success) {
                    setPaymentSettings(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch settings:", err);
            } finally {
                setIsLoadingSettings(false);
            }
        };
        fetchSettings();
    }, []);

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.utr.trim()) {
            newErrors.utr = "UTR number is required";
        }
        if (!formData.paymentImage) {
            newErrors.paymentImage = "Payment screenshot is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                setErrors((prev) => ({ ...prev, paymentImage: "Please upload an image file" }));
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setErrors((prev) => ({ ...prev, paymentImage: "Image must be less than 5MB" }));
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({
                    ...prev,
                    paymentImage: reader.result,
                    paymentImagePreview: reader.result,
                }));
                setErrors((prev) => ({ ...prev, paymentImage: "" }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
        } else if (step === 2 && validateStep2()) {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError("");
        try {
            const res = await fetch("/api/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    utr: formData.utr,
                    paymentImage: formData.paymentImage,
                }),
            });
            const data = await res.json();
            if (!data.success) {
                throw new Error(data.error || "Failed to create ticket");
            }
            setTicketData(data.data);
            setStep(3);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const steps = [
        { number: 1, title: "Details", icon: User },
        { number: 2, title: "Payment", icon: CreditCard },
        { number: 3, title: "Complete", icon: Ticket },
    ];

    return (
        <div className="min-h-screen bg-white">
            <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]"></div>

            <div className="container max-w-2xl mx-auto px-4 py-12 relative">
                <Link href="/">
                    <Button variant="ghost" className="mb-8 -ml-2 text-slate-600 hover:text-slate-900">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                </Link>

                <div className="mb-12">
                    <h1 className="text-4xl font-light text-slate-900 mb-2">Book ticket</h1>
                    <p className="text-slate-600 font-light">Complete in three steps</p>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-between mb-12">
                    {steps.map((s, index) => (
                        <div key={s.number} className="flex items-center flex-1">
                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 border flex items-center justify-center transition-all ${
                                    step >= s.number ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-400"
                                }`}>
                                    {step > s.number ? (
                                        <CheckCircle className="h-5 w-5" />
                                    ) : (
                                        <s.icon className="h-4 w-4" />
                                    )}
                                </div>
                                <span className={`text-xs mt-2 font-light ${step >= s.number ? "text-slate-900" : "text-slate-400"}`}>
                                    {s.title}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-1 h-px mx-4 ${step > s.number ? "bg-slate-900" : "bg-slate-300"}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step 1: User Details */}
                {step === 1 && (
                    <Card className="border-slate-200 rounded-none shadow-none">
                        <CardHeader className="border-b border-slate-200">
                            <CardTitle className="text-xl font-normal text-slate-900">Your details</CardTitle>
                            <CardDescription className="text-slate-600 font-light">Enter your contact information</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-8 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-normal text-slate-900">Full name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`h-12 rounded-none border-slate-300 focus:border-slate-900 ${errors.name ? "border-red-500" : ""}`}
                                />
                                {errors.name && <p className="text-sm text-red-600 font-light">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-normal text-slate-900">Email address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`h-12 rounded-none border-slate-300 focus:border-slate-900 ${errors.email ? "border-red-500" : ""}`}
                                />
                                {errors.email && <p className="text-sm text-red-600 font-light">{errors.email}</p>}
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-slate-200 pt-6">
                            <Button onClick={handleNext} className="ml-auto bg-slate-900 hover:bg-slate-800 text-white rounded-none h-12 px-8">
                                Continue
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {/* Step 2: Payment */}
                {step === 2 && (
                    <Card className="border-slate-200 rounded-none shadow-none">
                        <CardHeader className="border-b border-slate-200">
                            <CardTitle className="text-xl font-normal text-slate-900">Payment</CardTitle>
                            <CardDescription className="text-slate-600 font-light">Complete payment via UPI</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-8 space-y-6">
                            <div className="bg-slate-50 p-8 text-center border border-slate-200">
                                {isLoadingSettings ? (
                                    <div className="flex items-center justify-center h-48">
                                        <Loader2 className="h-8 w-8 animate-spin text-slate-900" />
                                    </div>
                                ) : paymentSettings.qrCodeImage ? (
                                    <div className="space-y-4">
                                        <div className="inline-block bg-white p-4 border border-slate-200">
                                            <img src={paymentSettings.qrCodeImage} alt="UPI QR Code" className="w-48 h-48 object-contain mx-auto" />
                                        </div>
                                        {paymentSettings.upiAddress && (
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-wide mb-2 font-light">UPI Address</p>
                                                <p className="font-mono text-base text-slate-900 font-normal">{paymentSettings.upiAddress}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-slate-600 font-light py-8">Payment QR code not configured</p>
                                )}
                            </div>

                            <div className="border border-slate-200 p-4">
                                <h4 className="font-normal text-slate-900 mb-3">Instructions</h4>
                                <ol className="list-decimal list-inside text-sm text-slate-600 space-y-1 font-light">
                                    <li>Scan QR or copy UPI address</li>
                                    <li>Complete payment on UPI app</li>
                                    <li>Note UTR/Transaction ID</li>
                                    <li>Upload payment screenshot</li>
                                </ol>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="utr" className="text-sm font-normal text-slate-900">UTR / Transaction ID</Label>
                                <Input
                                    id="utr"
                                    name="utr"
                                    placeholder="Enter 12-digit UTR number"
                                    value={formData.utr}
                                    onChange={handleChange}
                                    className={`h-12 rounded-none border-slate-300 focus:border-slate-900 ${errors.utr ? "border-red-500" : ""}`}
                                />
                                {errors.utr && <p className="text-sm text-red-600 font-light">{errors.utr}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-normal text-slate-900">Payment screenshot</Label>
                                <div className={`border-2 border-dashed p-8 text-center transition-colors ${
                                    errors.paymentImage ? "border-red-500" : "border-slate-300 hover:border-slate-900"
                                }`}>
                                    {formData.paymentImagePreview ? (
                                        <div className="space-y-4">
                                            <img src={formData.paymentImagePreview} alt="Payment screenshot" className="max-h-48 mx-auto" />
                                            <Button
                                                variant="outline"
                                                className="border-slate-300 text-slate-900 hover:bg-slate-50 rounded-none"
                                                onClick={() => setFormData((prev) => ({ ...prev, paymentImage: "", paymentImagePreview: "" }))}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer block">
                                            <div className="flex flex-col items-center gap-2">
                                                <Upload className="h-10 w-10 text-slate-400" />
                                                <p className="text-sm text-slate-600 font-light">Upload screenshot</p>
                                                <p className="text-xs text-slate-400 font-light">PNG, JPG up to 5MB</p>
                                            </div>
                                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                        </label>
                                    )}
                                </div>
                                {errors.paymentImage && <p className="text-sm text-red-600 font-light">{errors.paymentImage}</p>}
                            </div>

                            {error && (
                                <div className="border border-red-500 bg-red-50 text-red-600 p-4 text-sm font-light">
                                    {error}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="border-t border-slate-200 pt-6 flex justify-between">
                            <Button variant="outline" onClick={() => setStep(1)} className="border-slate-300 text-slate-900 hover:bg-slate-50 rounded-none h-12 px-8">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                            <Button onClick={handleNext} disabled={isLoading} className="bg-slate-900 hover:bg-slate-800 text-white rounded-none h-12 px-8">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        Submit
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {/* Step 3: Confirmation */}
                {step === 3 && ticketData && (
                    <Card className="border-slate-200 rounded-none shadow-none">
                        <CardHeader className="text-center border-b border-slate-200 py-12">
                            <div className="w-16 h-16 border border-slate-900 mx-auto mb-6 flex items-center justify-center">
                                <CheckCircle className="h-8 w-8 text-slate-900" />
                            </div>
                            <CardTitle className="text-2xl font-light text-slate-900">Booking submitted</CardTitle>
                            <CardDescription className="text-slate-600 font-light mt-2">Your ticket is under review</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-8 space-y-6">
                            <div className="bg-slate-50 p-6 text-center border border-slate-200">
                                <p className="text-xs text-slate-500 uppercase tracking-wide mb-2 font-light">Ticket ID</p>
                                <p className="text-3xl font-mono font-light text-slate-900">{ticketData.ticketId}</p>
                            </div>
                            <div className="flex justify-center">
                                <Badge variant="outline" className="border-slate-300 text-slate-600 font-light px-4 py-1">
                                    Pending review
                                </Badge>
                            </div>
                            <div className="border border-slate-200 p-4 text-center">
                                <p className="text-sm text-slate-600 font-light">
                                    Your ticket is being reviewed. Track status using the ID above.
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-slate-200 pt-6 flex flex-col gap-3">
                            <Link href={`/track/${ticketData.ticketId}`} className="w-full">
                                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-none h-12">
                                    Track your ticket
                                </Button>
                            </Link>
                            <Link href="/" className="w-full">
                                <Button variant="outline" className="w-full border-slate-300 text-slate-900 hover:bg-slate-50 rounded-none h-12">
                                    Back to home
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    );
}