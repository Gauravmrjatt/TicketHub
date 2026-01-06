"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Upload, CheckCircle, Loader2, User, CreditCard, Ticket, Calendar, MapPin } from "lucide-react";

export default function EventBookPage({ params }) {
    const { eventId } = use(params);
    const [event, setEvent] = useState(null);
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingEvent, setIsLoadingEvent] = useState(true);
    const [ticketData, setTicketData] = useState(null);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        utr: "",
        paymentImage: "",
        paymentImagePreview: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchEvent();
    }, [eventId]);

    const fetchEvent = async () => {
        try {
            const res = await fetch(`/api/events/${eventId}`);
            const data = await res.json();
            if (!data.success) throw new Error(data.error);
            setEvent(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoadingEvent(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
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

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (event.price > 0) {
            if (!formData.utr.trim()) newErrors.utr = "UTR number is required";
            if (!formData.paymentImage) newErrors.paymentImage = "Payment screenshot is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            if (event.price === 0) {
                handleSubmit();
            } else {
                setStep(2);
            }
        } else if (step === 2 && validateStep2()) {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError("");
        try {
            const res = await fetch(`/api/events/${eventId}/tickets`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    utr: formData.utr || "FREE",
                    paymentImage: formData.paymentImage || "FREE_TICKET",
                }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.error);
            setTicketData(data.data);
            setStep(3);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingEvent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]"></div>
                <Loader2 className="h-10 w-10 animate-spin text-slate-900" />
            </div>
        );
    }

    if (error && !event) {
        return (
            <div className="min-h-screen bg-white py-8 px-4">
                <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]"></div>
                <div className="container max-w-xl mx-auto text-center relative">
                    <h1 className="text-2xl font-light text-slate-900 mb-4">Error</h1>
                    <p className="text-slate-600 mb-6 font-light">{error}</p>
                    <Link href="/">
                        <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-none h-12 px-8">Back to Events</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const steps = [
        { number: 1, title: "Details", icon: User },
        { number: 2, title: "Payment", icon: CreditCard },
        { number: 3, title: "Done", icon: Ticket },
    ];

    const visibleSteps = event.price === 0 ? [steps[0], steps[2]] : steps;

    return (
        <div className="min-h-screen bg-white py-4 sm:py-8 px-4">
            <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]"></div>

            <div className="container max-w-2xl mx-auto relative">
                {/* Header */}
                <div className="mb-8">
                    <Link href={`/events/${eventId}`}>
                        <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Event
                        </Button>
                    </Link>

                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-light text-slate-900">{event.name}</h1>
                            <div className="flex flex-wrap items-center gap-2 mt-2 text-slate-600 text-sm font-light">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(event.date).toLocaleDateString()}
                                </span>
                                {event.venue && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {event.venue}
                                    </span>
                                )}
                            </div>
                        </div>
                        <Badge variant="outline" className="border-slate-300 text-slate-900 flex-shrink-0">
                            {event.price > 0 ? `₹${event.price}` : "Free"}
                        </Badge>
                    </div>
                </div>

                {/* Step Indicator */}
                {step < 3 && (
                    <div className="flex items-center justify-center mb-12">
                        {visibleSteps.map((s, index) => (
                            <div key={s.number} className="flex items-center">
                                <div className="flex flex-col items-center">
                                    <div className={`w-10 h-10 border flex items-center justify-center transition-all ${step >= s.number ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-400"
                                        }`}>
                                        {step > s.number ? <CheckCircle className="h-5 w-5" /> : <s.icon className="h-4 w-4" />}
                                    </div>
                                    <span className={`text-xs mt-2 font-light ${step >= s.number ? "text-slate-900" : "text-slate-400"}`}>
                                        {s.title}
                                    </span>
                                </div>
                                {index < visibleSteps.length - 1 && (
                                    <div className={`w-16 sm:w-24 h-px mx-2 ${step > s.number ? "bg-slate-900" : "bg-slate-300"}`} />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Step 1: User Details */}
                {step === 1 && (
                    <Card className="border-slate-200 rounded-none shadow-none">
                        <CardHeader className="border-b border-slate-200">
                            <CardTitle className="flex items-center gap-2 text-xl font-normal text-slate-900">
                                <User className="h-5 w-5" />
                                Your Details
                            </CardTitle>
                            <CardDescription className="text-slate-600 font-light">Enter your contact information</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-8 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-normal text-slate-900">Full Name *</Label>
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
                                <Label htmlFor="email" className="text-sm font-normal text-slate-900">Email *</Label>
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
                                <Label htmlFor="phone" className="text-sm font-normal text-slate-900">Phone (Optional)</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    placeholder="+91 9876543210"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="h-12 rounded-none border-slate-300 focus:border-slate-900"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-slate-200 pt-6">
                            <Button onClick={handleNext} className="ml-auto bg-slate-900 hover:bg-slate-800 text-white rounded-none h-12 px-8">
                                {event.price === 0 ? "Book Free Ticket" : "Next: Payment"}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {/* Step 2: Payment */}
                {step === 2 && event.price > 0 && (
                    <Card className="border-slate-200 rounded-none shadow-none">
                        <CardHeader className="border-b border-slate-200">
                            <CardTitle className="flex items-center gap-2 text-xl font-normal text-slate-900">
                                <CreditCard className="h-5 w-5" />
                                Payment
                            </CardTitle>
                            <CardDescription className="text-slate-600 font-light">Pay ₹{event.price} via UPI</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-8 space-y-6">
                            {/* QR Code */}
                            <div className="bg-slate-50 border border-slate-200 p-8 text-center">
                                {event.qrCodeImage ? (
                                    <div className="space-y-4">
                                        <div className="inline-block bg-white p-4 border border-slate-200">
                                            <img src={event.qrCodeImage} alt="UPI QR" className="w-40 h-40 sm:w-48 sm:h-48 object-contain" />
                                        </div>
                                        {event.upiAddress && (
                                            <p className="font-mono text-sm text-slate-900 bg-white px-4 py-2 border border-slate-200 inline-block">{event.upiAddress}</p>
                                        )}
                                    </div>
                                ) : event.upiAddress ? (
                                    <div className="py-6">
                                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-2 font-light">UPI Address</p>
                                        <p className="font-mono text-lg text-slate-900">{event.upiAddress}</p>
                                    </div>
                                ) : (
                                    <p className="text-slate-600 py-6 font-light">Contact organizer for payment details</p>
                                )}
                            </div>

                            <div className="border border-slate-200 p-4">
                                <h4 className="font-normal text-slate-900 mb-3">Instructions</h4>
                                <ol className="list-decimal list-inside text-sm text-slate-600 space-y-1 font-light">
                                    <li>Pay ₹{event.price} using any UPI app</li>
                                    <li>Note down the UTR/Transaction ID</li>
                                    <li>Upload payment screenshot</li>
                                </ol>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="utr" className="text-sm font-normal text-slate-900">UTR / Transaction ID *</Label>
                                <Input
                                    id="utr"
                                    name="utr"
                                    placeholder="12 digit UTR number"
                                    value={formData.utr}
                                    onChange={handleChange}
                                    className={`h-12 rounded-none border-slate-300 focus:border-slate-900 ${errors.utr ? "border-red-500" : ""}`}
                                />
                                {errors.utr && <p className="text-red-600 text-sm font-light">{errors.utr}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-normal text-slate-900">Payment Screenshot *</Label>
                                <div className={`border-2 border-dashed p-8 text-center transition-colors ${errors.paymentImage ? "border-red-500" : "border-slate-300 hover:border-slate-900"
                                    }`}>
                                    {formData.paymentImagePreview ? (
                                        <div className="space-y-4">
                                            <img src={formData.paymentImagePreview} alt="Screenshot" className="max-h-40 mx-auto" />
                                            <Button variant="outline" size="sm" onClick={() => setFormData((prev) => ({ ...prev, paymentImage: "", paymentImagePreview: "" }))} className="border-slate-300 text-slate-900 hover:bg-slate-50 rounded-none">
                                                Remove
                                            </Button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer block py-4">
                                            <Upload className="h-10 w-10 mx-auto text-slate-400 mb-2" />
                                            <p className="text-slate-600 text-sm font-light">Tap to upload screenshot</p>
                                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                        </label>
                                    )}
                                </div>
                                {errors.paymentImage && <p className="text-red-600 text-sm font-light">{errors.paymentImage}</p>}
                            </div>

                            {error && (
                                <div className="border border-red-500 bg-red-50 text-red-600 p-4 text-sm font-light">{error}</div>
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
                                        Booking...
                                    </>
                                ) : (
                                    <>
                                        Confirm Booking
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
                            <div className="bg-slate-50 border border-slate-200 p-6 text-center">
                                <p className="text-xs text-slate-500 uppercase tracking-wide mb-2 font-light">Your Ticket ID</p>
                                <p className="text-2xl sm:text-3xl font-mono font-light text-slate-900">{ticketData.ticketId}</p>
                            </div>

                            <div className="flex justify-center">
                                <Badge variant="outline" className="border-slate-300 text-slate-600 font-light px-4 py-1">
                                    Pending review
                                </Badge>
                            </div>

                            <div className="border border-slate-200 p-4 text-center">
                                <p className="text-slate-600 text-sm font-light">
                                    Save your Ticket ID! Use it to track your booking status.
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-slate-200 pt-6 flex flex-col gap-3">
                            <Link href={`/track/${ticketData.ticketId}`} className="w-full">
                                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-none h-12">
                                    Track Your Ticket
                                </Button>
                            </Link>
                            <Link href={`/events/${eventId}`} className="w-full">
                                <Button variant="outline" className="w-full border-slate-300 text-slate-900 hover:bg-slate-50 rounded-none h-12">
                                    Back to Event
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    );
}
