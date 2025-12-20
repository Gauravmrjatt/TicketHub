"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Ticket, Users, Check, X, Clock, CheckCircle, XCircle, Settings, Upload, LogOut, Eye, BarChart3, Home, RefreshCw, Search } from "lucide-react";

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminExists, setAdminExists] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [authForm, setAuthForm] = useState({ username: "", password: "" });
    const [authError, setAuthError] = useState("");
    const [isAuthLoading, setIsAuthLoading] = useState(false);
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
    const [tickets, setTickets] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [settings, setSettings] = useState({ upiAddress: "", qrCodeImage: "" });
    const [settingsPreview, setSettingsPreview] = useState("");
    const [isSavingSettings, setIsSavingSettings] = useState(false);
    const [rejectModal, setRejectModal] = useState({ open: false, ticketId: null, reason: "" });
    const [isProcessing, setIsProcessing] = useState(false);
    const [previewModal, setPreviewModal] = useState({ open: false, image: "" });

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const res = await fetch("/api/admin/login");
                const data = await res.json();
                if (data.success) {
                    setAdminExists(data.data.adminExists);
                }
            } catch (err) {
                console.error("Failed to check admin:", err);
            } finally {
                setIsCheckingAuth(false);
            }
        };
        checkAdmin();
    }, []);

    const fetchDashboardData = useCallback(async () => {
        setIsLoadingData(true);
        try {
            const [statsRes, ticketsRes, settingsRes] = await Promise.all([
                fetch("/api/admin/stats"),
                fetch("/api/tickets"),
                fetch("/api/settings"),
            ]);
            const [statsData, ticketsData, settingsData] = await Promise.all([
                statsRes.json(),
                ticketsRes.json(),
                settingsRes.json(),
            ]);
            if (statsData.success) setStats(statsData.data);
            if (ticketsData.success) setTickets(ticketsData.data);
            if (settingsData.success) {
                setSettings(settingsData.data);
                setSettingsPreview(settingsData.data.qrCodeImage);
            }
        } catch (err) {
            console.error("Failed to fetch data:", err);
        } finally {
            setIsLoadingData(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchDashboardData();
        }
    }, [isAuthenticated, fetchDashboardData]);

    const handleAuth = async (isRegister = false) => {
        setAuthError("");
        setIsAuthLoading(true);
        try {
            const endpoint = isRegister ? "/api/admin/register" : "/api/admin/login";
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(authForm),
            });
            const data = await res.json();
            if (!data.success) {
                throw new Error(data.error);
            }
            setIsAuthenticated(true);
            if (isRegister) {
                setAdminExists(true);
            }
        } catch (err) {
            setAuthError(err.message);
        } finally {
            setIsAuthLoading(false);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setAuthForm({ username: "", password: "" });
    };

    const handleApprove = async (ticketId) => {
        setIsProcessing(true);
        try {
            const res = await fetch(`/api/tickets/${ticketId}/approve`, { method: "PATCH" });
            const data = await res.json();
            if (data.success) {
                fetchDashboardData();
            }
        } catch (err) {
            console.error("Failed to approve:", err);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        setIsProcessing(true);
        try {
            const res = await fetch(`/api/tickets/${rejectModal.ticketId}/reject`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason: rejectModal.reason }),
            });
            const data = await res.json();
            if (data.success) {
                setRejectModal({ open: false, ticketId: null, reason: "" });
                fetchDashboardData();
            }
        } catch (err) {
            console.error("Failed to reject:", err);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleQRUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSettings((prev) => ({ ...prev, qrCodeImage: reader.result }));
                setSettingsPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveSettings = async () => {
        setIsSavingSettings(true);
        try {
            const res = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });
            const data = await res.json();
            if (data.success) {
                alert("Settings saved successfully!");
            }
        } catch (err) {
            console.error("Failed to save settings:", err);
        } finally {
            setIsSavingSettings(false);
        }
    };

    const filteredTickets = tickets.filter((ticket) => {
        if (statusFilter !== "all" && ticket.status !== statusFilter) {
            return false;
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                ticket.ticketId.toLowerCase().includes(query) ||
                ticket.name.toLowerCase().includes(query) ||
                ticket.email.toLowerCase().includes(query) ||
                ticket.utr.toLowerCase().includes(query)
            );
        }
        return true;
    });

    const getStatusBadge = (status) => {
        const baseClass = "border font-light text-xs";
        switch (status) {
            case "approved":
                return <Badge variant="outline" className={`${baseClass} border-green-600 text-green-600`}>Approved</Badge>;
            case "rejected":
                return <Badge variant="outline" className={`${baseClass} border-red-600 text-red-600`}>Rejected</Badge>;
            default:
                return <Badge variant="outline" className={`${baseClass} border-slate-600 text-slate-600`}>Pending</Badge>;
        }
    };

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="h-12 w-12 animate-spin text-slate-900" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white p-4">
                <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]"></div>
                <Card className="w-full max-w-md border-slate-200 rounded-none shadow-none relative">
                    <CardHeader className="text-center border-b border-slate-200 py-8">
                        <div className="w-16 h-16 border border-slate-900 mx-auto mb-6 flex items-center justify-center">
                            <Ticket className="h-8 w-8 text-slate-900" />
                        </div>
                        <CardTitle className="text-2xl font-light text-slate-900">
                            {adminExists === false ? "Create admin" : "Admin login"}
                        </CardTitle>
                        <CardDescription className="text-slate-600 font-light mt-2">
                            {adminExists === false ? "Set up your admin account" : "Enter credentials to continue"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-sm font-normal">Username</Label>
                            <Input
                                id="username"
                                placeholder="Enter username"
                                value={authForm.username}
                                onChange={(e) => setAuthForm((prev) => ({ ...prev, username: e.target.value }))}
                                className="h-12 rounded-none border-slate-300 focus:border-slate-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-normal">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter password"
                                value={authForm.password}
                                onChange={(e) => setAuthForm((prev) => ({ ...prev, password: e.target.value }))}
                                className="h-12 rounded-none border-slate-300 focus:border-slate-900"
                            />
                            {adminExists === false && (
                                <p className="text-xs text-slate-500 font-light">Minimum 6 characters</p>
                            )}
                        </div>
                        {authError && (
                            <div className="border border-red-500 bg-red-50 text-red-600 p-4 text-sm font-light">
                                {authError}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="border-t border-slate-200 pt-6 flex flex-col gap-3">
                        <Button
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-none h-12"
                            onClick={() => handleAuth(adminExists === false)}
                            disabled={isAuthLoading || !authForm.username || !authForm.password}
                        >
                            {isAuthLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            {adminExists === false ? "Create account" : "Login"}
                        </Button>
                        <Link href="/" className="w-full">
                            <Button variant="outline" className="w-full border-slate-300 text-slate-900 hover:bg-slate-50 rounded-none h-12">
                                <Home className="mr-2 h-4 w-4" />
                                Back to home
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]"></div>

            <header className="bg-slate-900 text-white sticky top-0 z-50 border-b border-slate-800">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Ticket className="h-6 w-6" />
                        <h1 className="text-xl font-light">Admin</h1>
                    </div>
                    <Button variant="ghost" className="text-white hover:bg-white/10" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 relative">
                <Tabs defaultValue="dashboard" className="space-y-8">
                    <TabsList className="border border-slate-200 rounded-none h-12 bg-white">
                        <TabsTrigger value="dashboard" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white rounded-none font-light">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Dashboard
                        </TabsTrigger>
                        <TabsTrigger value="tickets" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white rounded-none font-light">
                            <Ticket className="h-4 w-4 mr-2" />
                            Tickets
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white rounded-none font-light">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="dashboard" className="space-y-8">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="border-slate-200 rounded-none shadow-none cursor-pointer hover:border-slate-900 transition-colors" onClick={() => setStatusFilter("all")}>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 border border-slate-300 flex items-center justify-center">
                                            <Users className="h-5 w-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wide font-light">Total</p>
                                            <p className="text-2xl font-light text-slate-900">{stats.total}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-slate-200 rounded-none shadow-none cursor-pointer hover:border-slate-900 transition-colors" onClick={() => setStatusFilter("pending")}>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 border border-slate-300 flex items-center justify-center">
                                            <Clock className="h-5 w-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wide font-light">Pending</p>
                                            <p className="text-2xl font-light text-slate-900">{stats.pending}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-slate-200 rounded-none shadow-none cursor-pointer hover:border-slate-900 transition-colors" onClick={() => setStatusFilter("approved")}>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 border border-slate-300 flex items-center justify-center">
                                            <CheckCircle className="h-5 w-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wide font-light">Approved</p>
                                            <p className="text-2xl font-light text-slate-900">{stats.approved}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-slate-200 rounded-none shadow-none cursor-pointer hover:border-slate-900 transition-colors" onClick={() => setStatusFilter("rejected")}>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 border border-slate-300 flex items-center justify-center">
                                            <XCircle className="h-5 w-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wide font-light">Rejected</p>
                                            <p className="text-2xl font-light text-slate-900">{stats.rejected}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="border-slate-200 rounded-none shadow-none">
                            <CardHeader className="border-b border-slate-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl font-normal text-slate-900">Pending tickets</CardTitle>
                                        <CardDescription className="text-slate-600 font-light mt-1">Quick actions for pending tickets</CardDescription>
                                    </div>
                                    <Button variant="outline" className="border-slate-300 rounded-none" onClick={fetchDashboardData} disabled={isLoadingData}>
                                        <RefreshCw className={`h-4 w-4 ${isLoadingData ? 'animate-spin' : ''}`} />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {isLoadingData ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="h-8 w-8 animate-spin text-slate-900" />
                                    </div>
                                ) : tickets.filter(t => t.status === "pending").length === 0 ? (
                                    <div className="text-center py-12 text-slate-600">
                                        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
                                        <p className="font-light">No pending tickets</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {tickets.filter(t => t.status === "pending").slice(0, 5).map((ticket) => (
                                            <div key={ticket.ticketId} className="border border-slate-200 p-4 flex items-center justify-between gap-4">
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-mono text-sm font-normal text-slate-900">{ticket.ticketId}</p>
                                                    <p className="text-sm text-slate-600 font-light">{ticket.name}</p>
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <Button variant="ghost" className="h-10 w-10 p-0" onClick={() => setPreviewModal({ open: true, image: ticket.paymentImage })}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button className="bg-green-600 hover:bg-green-700 text-white h-10 w-10 p-0 rounded-none" onClick={() => handleApprove(ticket.ticketId)} disabled={isProcessing}>
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white h-10 w-10 p-0 rounded-none" onClick={() => setRejectModal({ open: true, ticketId: ticket.ticketId, reason: "" })} disabled={isProcessing}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="tickets">
                        <Card className="border-slate-200 rounded-none shadow-none">
                            <CardHeader className="border-b border-slate-200">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <CardTitle className="text-xl font-normal text-slate-900">All tickets</CardTitle>
                                        <CardDescription className="text-slate-600 font-light mt-1">View and manage all tickets</CardDescription>
                                    </div>
                                    <Button variant="outline" className="border-slate-300 rounded-none" onClick={fetchDashboardData} disabled={isLoadingData}>
                                        <RefreshCw className={`h-4 w-4 ${isLoadingData ? 'animate-spin' : ''}`} />
                                    </Button>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input placeholder="Search by ID, name, email, UTR..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-12 rounded-none border-slate-300 focus:border-slate-900" />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant={statusFilter === "all" ? "default" : "outline"} className="rounded-none border-slate-300 bg-slate-900 hover:bg-slate-800" onClick={() => setStatusFilter("all")}>All</Button>
                                        <Button variant={statusFilter === "pending" ? "default" : "outline"} className="rounded-none border-slate-300" onClick={() => setStatusFilter("pending")}>Pending</Button>
                                        <Button variant={statusFilter === "approved" ? "default" : "outline"} className="rounded-none border-slate-300" onClick={() => setStatusFilter("approved")}>Approved</Button>
                                        <Button variant={statusFilter === "rejected" ? "default" : "outline"} className="rounded-none border-slate-300" onClick={() => setStatusFilter("rejected")}>Rejected</Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {isLoadingData ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="h-8 w-8 animate-spin text-slate-900" />
                                    </div>
                                ) : filteredTickets.length === 0 ? (
                                    <div className="text-center py-12 text-slate-600">
                                        <Ticket className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                                        <p className="font-light">No tickets found</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {filteredTickets.map((ticket) => (
                                            <div key={ticket.ticketId} className="border border-slate-200 p-4">
                                                <div className="flex items-start justify-between gap-4 mb-3">
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <p className="font-mono text-sm font-normal text-slate-900">{ticket.ticketId}</p>
                                                            {getStatusBadge(ticket.status)}
                                                        </div>
                                                        <p className="text-sm font-normal text-slate-900">{ticket.name}</p>
                                                        <p className="text-sm text-slate-600 font-light">{ticket.email}</p>
                                                    </div>
                                                    <Button variant="ghost" className="h-10 w-10 p-0" onClick={() => setPreviewModal({ open: true, image: ticket.paymentImage })}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                                                    <p className="font-mono text-xs text-slate-500 font-light">UTR: {ticket.utr}</p>
                                                    {ticket.status === "pending" && (
                                                        <div className="flex items-center gap-2">
                                                            <Button className="bg-green-600 hover:bg-green-700 text-white h-8 px-3 rounded-none" onClick={() => handleApprove(ticket.ticketId)} disabled={isProcessing}>
                                                                <Check className="h-3 w-3 mr-1" />
                                                                Approve
                                                            </Button>
                                                            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white h-8 px-3 rounded-none" onClick={() => setRejectModal({ open: true, ticketId: ticket.ticketId, reason: "" })} disabled={isProcessing}>
                                                                <X className="h-3 w-3 mr-1" />
                                                                Reject
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="settings">
                        <Card className="border-slate-200 rounded-none shadow-none">
                            <CardHeader className="border-b border-slate-200">
                                <CardTitle className="text-xl font-normal text-slate-900">Payment settings</CardTitle>
                                <CardDescription className="text-slate-600 font-light mt-1">Configure UPI details for booking page</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-8 space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="upiAddress" className="text-sm font-normal">UPI address</Label>
                                    <Input id="upiAddress" placeholder="example@upi" value={settings.upiAddress} onChange={(e) => setSettings((prev) => ({ ...prev, upiAddress: e.target.value }))} className="h-12 rounded-none border-slate-300 focus:border-slate-900" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-normal">UPI QR code</Label>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="border-2 border-dashed border-slate-300 p-8 text-center hover:border-slate-900 transition-colors">
                                            <label className="cursor-pointer block">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Upload className="h-10 w-10 text-slate-400" />
                                                    <p className="text-sm text-slate-600 font-light">Upload QR code</p>
                                                    <p className="text-xs text-slate-400 font-light">PNG, JPG up to 5MB</p>
                                                </div>
                                                <input type="file" accept="image/*" onChange={handleQRUpload} className="hidden" />
                                            </label>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-200 p-4 flex items-center justify-center min-h-[180px]">
                                            {settingsPreview ? (
                                                <img src={settingsPreview} alt="QR Preview" className="max-h-40" />
                                            ) : (
                                                <p className="text-sm text-slate-500 font-light">No QR uploaded</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t border-slate-200 pt-6">
                                <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-none h-12 px-8" onClick={handleSaveSettings} disabled={isSavingSettings}>
                                    {isSavingSettings && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                    Save settings
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>

            <Dialog open={rejectModal.open} onOpenChange={(open) => !open && setRejectModal({ open: false, ticketId: null, reason: "" })}>
                <DialogContent className="border-slate-200 rounded-none max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-normal text-slate-900">Reject ticket</DialogTitle>
                        <DialogDescription className="text-slate-600 font-light">Provide an optional reason for rejection</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="rejectReason" className="text-sm font-normal">Reason (optional)</Label>
                        <Input id="rejectReason" placeholder="Enter reason" value={rejectModal.reason} onChange={(e) => setRejectModal((prev) => ({ ...prev, reason: e.target.value }))} className="mt-2 h-12 rounded-none border-slate-300 focus:border-slate-900" />
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setRejectModal({ open: false, ticketId: null, reason: "" })} className="border-slate-300 text-slate-900 hover:bg-slate-50 rounded-none h-12 px-6">
                            Cancel
                        </Button>
                        <Button className="bg-red-600 hover:bg-red-700 text-white rounded-none h-12 px-6" onClick={handleReject} disabled={isProcessing}>
                            {isProcessing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Reject
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={previewModal.open} onOpenChange={(open) => !open && setPreviewModal({ open: false, image: "" })}>
                <DialogContent className="border-slate-200 rounded-none max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-normal text-slate-900">Payment screenshot</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        {previewModal.image && (
                            <img src={previewModal.image} alt="Payment screenshot" className="w-full max-h-[60vh] object-contain border border-slate-200" />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}