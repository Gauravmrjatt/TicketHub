"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    Loader2, Ticket, Users, Check, X, Clock, CheckCircle, XCircle, Settings, Upload,
    LogOut, Eye, BarChart3, ArrowLeft, RefreshCw, Search, ListFilter, ExternalLink, Copy, Home
} from "lucide-react";

export default function EventAdminPage({ params }) {
    const { eventId } = use(params);

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [event, setEvent] = useState(null);
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");
    const [isAuthLoading, setIsAuthLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);

    const [tickets, setTickets] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

    const [statusFilter, setStatusFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const [eventSettings, setEventSettings] = useState({ upiAddress: "", qrCodeImage: "" });
    const [settingsPreview, setSettingsPreview] = useState("");
    const [isSavingSettings, setIsSavingSettings] = useState(false);

    const [rejectModal, setRejectModal] = useState({ open: false, ticketId: null, reason: "" });
    const [previewModal, setPreviewModal] = useState({ open: false, image: "" });
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchEvent();
    }, [eventId]);

    const fetchEvent = async () => {
        try {
            const res = await fetch(`/api/events/${eventId}`);
            const data = await res.json();
            if (data.success) {
                setEvent(data.data);
                setEventSettings({ upiAddress: data.data.upiAddress || "", qrCodeImage: data.data.qrCodeImage || "" });
                setSettingsPreview(data.data.qrCodeImage || "");
            }
        } catch (err) {
            console.error("Failed to fetch event:", err);
        }
    };

    const handleLogin = async () => {
        setAuthError("");
        setIsAuthLoading(true);
        try {
            const res = await fetch(`/api/events/${eventId}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.error);
            setIsAuthenticated(true);
            fetchDashboardData();
        } catch (err) {
            setAuthError(err.message);
        } finally {
            setIsAuthLoading(false);
        }
    };

    const fetchDashboardData = useCallback(async () => {
        setIsLoadingData(true);
        try {
            const res = await fetch(`/api/events/${eventId}/tickets`);
            const data = await res.json();
            if (data.success) {
                setTickets(data.data.tickets);
                setStats(data.data.stats);
            }
        } catch (err) {
            console.error("Failed to fetch tickets:", err);
        } finally {
            setIsLoadingData(false);
        }
    }, [eventId]);

    const handleApprove = async (ticketId) => {
        setIsProcessing(true);
        try {
            const res = await fetch(`/api/events/${eventId}/tickets/${ticketId}/approve`, { method: "PATCH" });
            const data = await res.json();
            if (data.success) fetchDashboardData();
        } catch (err) {
            console.error("Failed to approve:", err);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        setIsProcessing(true);
        try {
            const res = await fetch(`/api/events/${eventId}/tickets/${rejectModal.ticketId}/reject`, {
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
                setEventSettings((prev) => ({ ...prev, qrCodeImage: reader.result }));
                setSettingsPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveSettings = async () => {
        setIsSavingSettings(true);
        try {
            const res = await fetch(`/api/events/${eventId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(eventSettings),
            });
            const data = await res.json();
            if (data.success) alert("Settings saved!");
        } catch (err) {
            console.error("Failed to save:", err);
        } finally {
            setIsSavingSettings(false);
        }
    };

    const filteredTickets = tickets.filter((ticket) => {
        if (statusFilter !== "all" && ticket.status !== statusFilter) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return ticket.ticketId.toLowerCase().includes(q) || ticket.name.toLowerCase().includes(q) || ticket.email.toLowerCase().includes(q);
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

    const copyLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/events/${eventId}`);
        alert("Event link copied!");
    };

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]"></div>
                <Loader2 className="h-10 w-10 animate-spin text-slate-900" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white p-4">
                <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]"></div>
                <Card className="w-full max-w-md border-slate-200 rounded-none shadow-none relative">
                    <CardHeader className="text-center border-b border-slate-200 py-8">
                        <div className="w-14 h-14 border border-slate-900 mx-auto mb-4 flex items-center justify-center">
                            <Ticket className="w-7 h-7 text-slate-900" />
                        </div>
                        <CardTitle className="text-xl font-light text-slate-900">{event.name}</CardTitle>
                        <CardDescription className="text-slate-600 font-light mt-2">Enter admin password</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-normal text-slate-900">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                                className="h-12 rounded-none border-slate-300 focus:border-slate-900"
                            />
                        </div>
                        {authError && (
                            <div className="border border-red-500 bg-red-50 text-red-600 p-4 text-sm font-light">
                                {authError}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="border-t border-slate-200 pt-6 flex flex-col gap-3">
                        <Button onClick={handleLogin} disabled={isAuthLoading || !password} className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-none h-12">
                            {isAuthLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Login
                        </Button>
                        <Link href={`/events/${eventId}`} className="w-full">
                            <Button variant="outline" className="w-full border-slate-300 text-slate-900 hover:bg-slate-50 rounded-none h-12">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Event
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
                        <div>
                            <h1 className="text-lg font-light truncate max-w-[200px] sm:max-w-none">{event.name}</h1>
                            <p className="text-xs text-slate-400 font-mono">{event.eventId}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={copyLink} className="text-white hover:bg-white/10">
                            <Copy className="h-4 w-4" />
                        </Button>
                        <Link href={`/events/${eventId}`}>
                            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => setIsAuthenticated(false)} className="text-white hover:bg-white/10">
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 relative">
                <Tabs defaultValue="dashboard" className="space-y-8">
                    <TabsList className="border border-slate-200 rounded-none h-12 bg-white">
                        <TabsTrigger value="dashboard" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white rounded-none font-light">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Dashboard
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white rounded-none font-light">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="dashboard" className="space-y-8">
                        {/* Stats */}
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

                        {/* Tickets */}
                        <Card className="border-slate-200 rounded-none shadow-none">
                            <CardHeader className="border-b border-slate-200">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                                    <div>
                                        <CardTitle className="text-xl font-normal text-slate-900">Tickets ({filteredTickets.length})</CardTitle>
                                        <CardDescription className="text-slate-600 font-light mt-1">Manage event tickets</CardDescription>
                                    </div>
                                    <Button variant="outline" className="border-slate-300 rounded-none" onClick={fetchDashboardData} disabled={isLoadingData}>
                                        <RefreshCw className={`h-4 w-4 ${isLoadingData ? "animate-spin" : ""}`} />
                                    </Button>
                                </div>

                                {/* Filters */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-12 rounded-none border-slate-300 focus:border-slate-900" />
                                    </div>
                                    <div className="flex gap-2">
                                        {["all", "pending", "approved", "rejected"].map((status) => (
                                            <Button key={status} variant={statusFilter === status ? "default" : "outline"} onClick={() => setStatusFilter(status)} className={`capitalize rounded-none ${statusFilter === status ? "bg-slate-900 hover:bg-slate-800" : "border-slate-300"}`}>
                                                {status}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {isLoadingData ? (
                                    <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-slate-900" /></div>
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
                                                {ticket.status === "rejected" && ticket.rejectionReason && (
                                                    <p className="text-red-600 text-xs mt-2 bg-red-50 p-2 border border-red-200">Reason: {ticket.rejectionReason}</p>
                                                )}
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
                                <CardTitle className="text-xl font-normal text-slate-900">Payment Settings</CardTitle>
                                <CardDescription className="text-slate-600 font-light mt-1">Update UPI details for this event</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-8 space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="upiAddress" className="text-sm font-normal text-slate-900">UPI Address</Label>
                                    <Input id="upiAddress" placeholder="yourname@upi" value={eventSettings.upiAddress} onChange={(e) => setEventSettings((prev) => ({ ...prev, upiAddress: e.target.value }))} className="h-12 rounded-none border-slate-300 focus:border-slate-900" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-normal text-slate-900">QR Code</Label>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="border-2 border-dashed border-slate-300 p-8 text-center hover:border-slate-900 transition-colors">
                                            <label className="cursor-pointer block">
                                                <Upload className="h-10 w-10 mx-auto text-slate-400 mb-2" />
                                                <p className="text-slate-600 text-sm font-light">Upload QR</p>
                                                <input type="file" accept="image/*" onChange={handleQRUpload} className="hidden" />
                                            </label>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-200 p-4 flex items-center justify-center min-h-[180px]">
                                            {settingsPreview ? <img src={settingsPreview} alt="QR" className="max-h-40" /> : <p className="text-slate-500 text-sm font-light">No QR uploaded</p>}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t border-slate-200 pt-6">
                                <Button onClick={handleSaveSettings} disabled={isSavingSettings} className="bg-slate-900 hover:bg-slate-800 text-white rounded-none h-12 px-8">
                                    {isSavingSettings && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                    Save Settings
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>

            {/* Reject Modal */}
            <Dialog open={rejectModal.open} onOpenChange={(open) => !open && setRejectModal({ open: false, ticketId: null, reason: "" })}>
                <DialogContent className="border-slate-200 rounded-none max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-normal text-slate-900">Reject Ticket</DialogTitle>
                        <DialogDescription className="text-slate-600 font-light">Provide a reason (optional)</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Input placeholder="Reason..." value={rejectModal.reason} onChange={(e) => setRejectModal((prev) => ({ ...prev, reason: e.target.value }))} className="h-12 rounded-none border-slate-300 focus:border-slate-900" />
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setRejectModal({ open: false, ticketId: null, reason: "" })} className="border-slate-300 text-slate-900 hover:bg-slate-50 rounded-none h-12 px-6">Cancel</Button>
                        <Button className="bg-red-600 hover:bg-red-700 text-white rounded-none h-12 px-6" onClick={handleReject} disabled={isProcessing}>
                            {isProcessing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Reject
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Preview Modal */}
            <Dialog open={previewModal.open} onOpenChange={(open) => !open && setPreviewModal({ open: false, image: "" })}>
                <DialogContent className="border-slate-200 rounded-none max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-normal text-slate-900">Payment Screenshot</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        {previewModal.image && previewModal.image !== "FREE_TICKET" && (
                            <img src={previewModal.image} alt="Payment" className="w-full max-h-[60vh] object-contain border border-slate-200" />
                        )}
                        {previewModal.image === "FREE_TICKET" && (
                            <div className="text-center py-8 text-slate-600 font-light">Free ticket - no payment required</div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
