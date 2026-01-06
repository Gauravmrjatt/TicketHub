"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
    ArrowLeft,
    ArrowRight,
    Upload,
    Loader2,
    Ticket,
    Calendar,
    MapPin,
    DollarSign,
    Users,
    Lock,
    Image,
    CheckCircle,
    Copy,
    ExternalLink
} from "lucide-react";

export default function CreateEventPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [createdEvent, setCreatedEvent] = useState(null);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        date: "",
        venue: "",
        image: "",
        imagePreview: "",
        price: "",
        capacity: "",
        password: "",
        confirmPassword: "",
        upiAddress: "",
        qrCodeImage: "",
        qrPreview: "",
        isPublic: true,
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsCheckingAuth(false);
    }, []);

    // Redirect if not logged in
    useEffect(() => {
        if (!isCheckingAuth && !user) {
            router.push("/login");
        }
    }, [isCheckingAuth, user, router]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleImageUpload = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors((prev) => ({ ...prev, [field]: "Image must be less than 5MB" }));
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                if (field === "image") {
                    setFormData((prev) => ({ ...prev, image: reader.result, imagePreview: reader.result }));
                } else {
                    setFormData((prev) => ({ ...prev, qrCodeImage: reader.result, qrPreview: reader.result }));
                }
                setErrors((prev) => ({ ...prev, [field]: "" }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Event name is required";
        if (!formData.date) newErrors.date = "Event date is required";
        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 4) newErrors.password = "Password must be at least 4 characters";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (formData.price && parseFloat(formData.price) > 0) {
            if (!formData.upiAddress && !formData.qrCodeImage) {
                newErrors.upiAddress = "UPI address or QR code required for paid events";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
            const res = await fetch("/api/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    date: formData.date,
                    venue: formData.venue,
                    image: formData.image,
                    price: parseFloat(formData.price) || 0,
                    capacity: parseInt(formData.capacity) || 0,
                    password: formData.password,
                    upiAddress: formData.upiAddress,
                    qrCodeImage: formData.qrCodeImage,
                    isPublic: formData.isPublic,
                    userId: user.id,
                }),
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error || "Failed to create event");
            }

            setCreatedEvent(data.data);
            setStep(3);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    if (isCheckingAuth || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]"></div>
                <Loader2 className="h-10 w-10 animate-spin text-slate-900" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-4 sm:py-8 px-4">
            <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]"></div>

            <div className="container max-w-2xl mx-auto relative">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Events
                        </Button>
                    </Link>

                    <h1 className="text-3xl font-light text-slate-900">Create new event</h1>
                    <p className="text-slate-600 font-light mt-2">Set up your event in just 2 steps</p>
                </div>

                {/* Step Indicator */}
                {step < 3 && (
                    <div className="flex items-center justify-center mb-12">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 border flex items-center justify-center transition-all ${step >= 1 ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-400"
                                }`}>
                                1
                            </div>
                            <div className={`w-16 h-px ${step >= 2 ? "bg-slate-900" : "bg-slate-300"}`} />
                            <div className={`w-10 h-10 border flex items-center justify-center transition-all ${step >= 2 ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-400"
                                }`}>
                                2
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 1: Basic Info */}
                {step === 1 && (
                    <Card className="border-slate-200 rounded-none shadow-none">
                        <CardHeader className="border-b border-slate-200">
                            <CardTitle className="flex items-center gap-2 text-xl font-normal text-slate-900">
                                <Calendar className="h-5 w-5" />
                                Event Details
                            </CardTitle>
                            <CardDescription className="text-slate-600 font-light">Basic information about your event</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-8 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-normal text-slate-900">Event Name *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="e.g., Annual Tech Conference 2024"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`h-12 rounded-none border-slate-300 focus:border-slate-900 ${errors.name ? "border-red-500" : ""}`}
                                />
                                {errors.name && <p className="text-red-600 text-sm font-light">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-normal text-slate-900">Description</Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder="Tell people about your event..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900"
                                />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date" className="text-sm font-normal text-slate-900">Event Date *</Label>
                                    <Input
                                        id="date"
                                        name="date"
                                        type="datetime-local"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className={`h-12 rounded-none border-slate-300 focus:border-slate-900 ${errors.date ? "border-red-500" : ""}`}
                                    />
                                    {errors.date && <p className="text-red-600 text-sm font-light">{errors.date}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="venue" className="text-sm font-normal text-slate-900">Venue</Label>
                                    <Input
                                        id="venue"
                                        name="venue"
                                        placeholder="Location or online"
                                        value={formData.venue}
                                        onChange={handleChange}
                                        className="h-12 rounded-none border-slate-300 focus:border-slate-900"
                                    />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price" className="text-sm font-normal text-slate-900">Ticket Price (₹)</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        min="0"
                                        placeholder="0 for free"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="h-12 rounded-none border-slate-300 focus:border-slate-900"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="capacity" className="text-sm font-normal text-slate-900">Capacity</Label>
                                    <Input
                                        id="capacity"
                                        name="capacity"
                                        type="number"
                                        min="0"
                                        placeholder="0 for unlimited"
                                        value={formData.capacity}
                                        onChange={handleChange}
                                        className="h-12 rounded-none border-slate-300 focus:border-slate-900"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-normal text-slate-900">Event Banner</Label>
                                <div className="border-2 border-dashed border-slate-300 p-4 text-center hover:border-slate-900 transition-colors">
                                    {formData.imagePreview ? (
                                        <div className="space-y-3">
                                            <img src={formData.imagePreview} alt="Event banner" className="max-h-40 mx-auto" />
                                            <Button variant="outline" size="sm" onClick={() => setFormData((prev) => ({ ...prev, image: "", imagePreview: "" }))} className="border-slate-300 text-slate-900 hover:bg-slate-50 rounded-none">
                                                Remove
                                            </Button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer block py-4">
                                            <Image className="h-10 w-10 mx-auto text-slate-400 mb-2" />
                                            <p className="text-slate-600 text-sm font-light">Click to upload banner</p>
                                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "image")} className="hidden" />
                                        </label>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-slate-200 pt-6">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-sm font-normal text-slate-900 flex items-center gap-2">
                                            <Lock className="h-4 w-4" />
                                            Admin Password *
                                        </Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="Min 4 characters"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`h-12 rounded-none border-slate-300 focus:border-slate-900 ${errors.password ? "border-red-500" : ""}`}
                                        />
                                        {errors.password && <p className="text-red-600 text-sm font-light">{errors.password}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword" className="text-sm font-normal text-slate-900">Confirm Password *</Label>
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
                                </div>
                                <p className="text-slate-500 text-xs mt-2 font-light">You'll need this password to manage your event</p>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-slate-200 pt-6 flex justify-end">
                            <Button onClick={handleNext} className="bg-slate-900 hover:bg-slate-800 text-white rounded-none h-12 px-8">
                                Next Step
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {/* Step 2: Payment Settings */}
                {step === 2 && (
                    <Card className="border-slate-200 rounded-none shadow-none">
                        <CardHeader className="border-b border-slate-200">
                            <CardTitle className="flex items-center gap-2 text-xl font-normal text-slate-900">
                                <DollarSign className="h-5 w-5" />
                                Payment Settings
                            </CardTitle>
                            <CardDescription className="text-slate-600 font-light">
                                {formData.price && parseFloat(formData.price) > 0
                                    ? "Configure how attendees will pay"
                                    : "Optional for free events"
                                }
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-8 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="upiAddress" className="text-sm font-normal text-slate-900">UPI Address</Label>
                                <Input
                                    id="upiAddress"
                                    name="upiAddress"
                                    placeholder="yourname@upi"
                                    value={formData.upiAddress}
                                    onChange={handleChange}
                                    className={`h-12 rounded-none border-slate-300 focus:border-slate-900 ${errors.upiAddress ? "border-red-500" : ""}`}
                                />
                                {errors.upiAddress && <p className="text-red-600 text-sm font-light">{errors.upiAddress}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-normal text-slate-900">Payment QR Code</Label>
                                <div className="border-2 border-dashed border-slate-300 p-4 text-center hover:border-slate-900 transition-colors">
                                    {formData.qrPreview ? (
                                        <div className="space-y-3">
                                            <img src={formData.qrPreview} alt="QR Code" className="max-h-40 mx-auto" />
                                            <Button variant="outline" size="sm" onClick={() => setFormData((prev) => ({ ...prev, qrCodeImage: "", qrPreview: "" }))} className="border-slate-300 text-slate-900 hover:bg-slate-50 rounded-none">
                                                Remove
                                            </Button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer block py-4">
                                            <Upload className="h-10 w-10 mx-auto text-slate-400 mb-2" />
                                            <p className="text-slate-600 text-sm font-light">Upload UPI QR Code</p>
                                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "qrCodeImage")} className="hidden" />
                                        </label>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-4">
                                <input
                                    type="checkbox"
                                    id="isPublic"
                                    name="isPublic"
                                    checked={formData.isPublic}
                                    onChange={handleChange}
                                    className="w-4 h-4"
                                />
                                <Label htmlFor="isPublic" className="text-slate-900 cursor-pointer font-normal">
                                    List event publicly on homepage
                                </Label>
                            </div>

                            {error && (
                                <div className="border border-red-500 bg-red-50 text-red-600 p-4 text-sm font-light">
                                    {error}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row gap-3 sm:justify-between">
                            <Button variant="outline" onClick={() => setStep(1)} className="w-full sm:w-auto border-slate-300 text-slate-900 hover:bg-slate-50 order-2 sm:order-1 rounded-none h-12 px-8">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                            <Button onClick={handleNext} disabled={isLoading} className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white order-1 sm:order-2 rounded-none h-12 px-8">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        Create Event
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {/* Step 3: Success */}
                {step === 3 && createdEvent && (
                    <Card className="border-slate-200 rounded-none shadow-none">
                        <CardHeader className="text-center border-b border-slate-200 py-12">
                            <div className="w-16 h-16 border border-slate-900 mx-auto mb-6 flex items-center justify-center">
                                <CheckCircle className="h-8 w-8 text-slate-900" />
                            </div>
                            <CardTitle className="text-2xl font-light text-slate-900">Event created</CardTitle>
                            <CardDescription className="text-slate-600 font-light mt-2">Your event is now live</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-8 space-y-6">
                            <div className="bg-slate-50 border border-slate-200 p-4 text-center">
                                <p className="text-xs text-slate-500 uppercase tracking-wide mb-2 font-light">Event ID</p>
                                <p className="text-2xl font-mono font-light text-slate-900">{createdEvent.eventId}</p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-4">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-slate-500 font-light">Public Event Page</p>
                                        <p className="text-slate-900 text-sm truncate">{typeof window !== 'undefined' ? window.location.origin : ''}{createdEvent.publicUrl}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(`${window.location.origin}${createdEvent.publicUrl}`)} className="text-slate-600 hover:text-slate-900">
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-4">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-slate-500 font-light">Admin Dashboard</p>
                                        <p className="text-slate-900 text-sm truncate">{typeof window !== 'undefined' ? window.location.origin : ''}{createdEvent.adminUrl}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(`${window.location.origin}${createdEvent.adminUrl}`)} className="text-slate-600 hover:text-slate-900">
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-slate-50 border border-slate-200 p-4 text-center">
                                <p className="text-slate-600 text-sm font-light">
                                    💡 Save your Event ID and Admin URL. You'll need your password to access the dashboard.
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-slate-200 pt-6 flex flex-col gap-3">
                            <Link href={createdEvent.publicUrl} className="w-full">
                                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-none h-12">
                                    View Event Page
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href={createdEvent.adminUrl} className="w-full">
                                <Button variant="outline" className="w-full border-slate-300 text-slate-900 hover:bg-slate-50 rounded-none h-12">
                                    Go to Dashboard
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    );
}
