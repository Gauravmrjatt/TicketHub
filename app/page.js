"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Ticket,
    Plus,
    Search,
    Calendar,
    MapPin,
    Users,
    ArrowRight,
    Loader2,
    LogIn,
    LogOut,
    User
} from "lucide-react";

export default function HomePage() {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [ticketId, setTicketId] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if user is logged in
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await fetch("/api/events");
            const data = await res.json();
            if (data.success) {
                setEvents(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch events:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    const filteredEvents = events.filter((event) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            event.name.toLowerCase().includes(query) ||
            event.venue?.toLowerCase().includes(query) ||
            event.eventId.toLowerCase().includes(query)
        );
    });

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]"></div>

            {/* Header */}
            <header className="border-b border-slate-200 relative z-10">
                <div className="container mx-auto px-4 py-4 sm:py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 border border-slate-900 flex items-center justify-center">
                                <Ticket className="w-5 h-5 text-slate-900" />
                            </div>
                            <span className="text-xl font-light text-slate-900">TicketHub</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4">
                            {user ? (
                                <>
                                    <span className="hidden sm:flex items-center gap-2 text-slate-600 text-sm font-light">
                                        <User className="w-4 h-4" />
                                        {user.name}
                                    </span>
                                    <Link href="/create-event">
                                        <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white border-0 rounded-none h-10 px-4">
                                            <Plus className="w-4 h-4 sm:mr-2" />
                                            <span className="hidden sm:inline">Create Event</span>
                                        </Button>
                                    </Link>
                                    <Button size="sm" variant="ghost" onClick={handleLogout} className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-none h-10">
                                        <LogOut className="w-4 h-4" />
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <Button size="sm" variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-none h-10">
                                            <LogIn className="w-4 h-4 sm:mr-2" />
                                            <span className="hidden sm:inline">Login</span>
                                        </Button>
                                    </Link>
                                    <Link href="/signup">
                                        <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white border-0 rounded-none h-10 px-4">
                                            Sign Up
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-16 sm:py-20 md:py-24 relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                    <p className="text-slate-500 text-sm uppercase tracking-widest mb-6 font-light">
                        Secure & Professional Ticket Booking
                    </p>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-slate-900 leading-tight mb-6">
                        Book Tickets for
                        <span className="block font-normal">Amazing Events</span>
                    </h1>
                    <p className="text-slate-600 text-lg mb-10 max-w-xl mx-auto font-light">
                        Create your own event or browse upcoming events. Secure booking with easy ticket tracking.
                    </p>

                    {/* Search & Track */}
                    <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-12 border-slate-300 focus:border-slate-900 rounded-none"
                            />
                        </div>
                        <div className="relative flex-1 sm:max-w-[200px]">
                            <Input
                                type="text"
                                placeholder="Track ticket ID"
                                value={ticketId}
                                onChange={(e) => setTicketId(e.target.value)}
                                className="h-12 border-slate-300 focus:border-slate-900 rounded-none"
                            />
                        </div>
                        {ticketId && (
                            <Link href={`/track/${ticketId}`}>
                                <Button className="h-12 px-8 bg-slate-900 hover:bg-slate-800 text-white rounded-none">
                                    Track
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* Events Section */}
            <section className="container mx-auto px-4 pb-20 relative z-10">
                <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-6">
                    <div>
                        <h2 className="text-2xl font-light text-slate-900">
                            Upcoming Events
                        </h2>
                        {filteredEvents.length > 0 && (
                            <p className="text-slate-500 text-sm font-light mt-1">{filteredEvents.length} events available</p>
                        )}
                    </div>
                    {user && (
                        <Link href="/create-event">
                            <Button variant="outline" className="border-slate-300 text-slate-900 hover:bg-slate-50 rounded-none h-10">
                                <Plus className="w-4 h-4 mr-2" />
                                New Event
                            </Button>
                        </Link>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-900" />
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 mx-auto mb-6 border border-slate-300 flex items-center justify-center">
                            <Calendar className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-light text-slate-900 mb-2">No Events Found</h3>
                        <p className="text-slate-600 mb-8 font-light">
                            {searchQuery ? "Try a different search term" : "Be the first to create an event!"}
                        </p>
                        {user ? (
                            <Link href="/create-event">
                                <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-none h-12 px-8">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Event
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/signup">
                                <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-none h-12 px-8">
                                    Sign Up to Create
                                </Button>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => (
                            <Link key={event.eventId} href={`/events/${event.eventId}`}>
                                <Card className="group border-slate-200 hover:border-slate-900 transition-all duration-300 overflow-hidden cursor-pointer h-full rounded-none shadow-none">
                                    {/* Event Image */}
                                    <div className="aspect-video bg-slate-100 relative overflow-hidden">
                                        {event.image ? (
                                            <img
                                                src={event.image}
                                                alt={event.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Ticket className="w-12 h-12 text-slate-300" />
                                            </div>
                                        )}
                                        {event.price > 0 && (
                                            <Badge variant="outline" className="absolute top-3 right-3 bg-white border-slate-900 text-slate-900 rounded-none">
                                                ₹{event.price}
                                            </Badge>
                                        )}
                                        {event.price === 0 && (
                                            <Badge variant="outline" className="absolute top-3 right-3 bg-white border-green-600 text-green-600 rounded-none">
                                                Free
                                            </Badge>
                                        )}
                                    </div>

                                    <CardContent className="p-5">
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="font-normal text-slate-900 text-lg line-clamp-1 group-hover:text-slate-600 transition-colors">
                                                    {event.name}
                                                </h3>
                                                <p className="text-xs text-slate-400 font-mono mt-1">{event.eventId}</p>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3 text-slate-600 text-sm font-light">
                                                    <Calendar className="w-4 h-4 flex-shrink-0" />
                                                    <span className="truncate">{formatDate(event.date)}</span>
                                                </div>
                                                {event.venue && (
                                                    <div className="flex items-center gap-3 text-slate-600 text-sm font-light">
                                                        <MapPin className="w-4 h-4 flex-shrink-0" />
                                                        <span className="truncate">{event.venue}</span>
                                                    </div>
                                                )}
                                                {event.capacity > 0 && (
                                                    <div className="flex items-center gap-3 text-slate-600 text-sm font-light">
                                                        <Users className="w-4 h-4 flex-shrink-0" />
                                                        <span>{event.ticketsSold || 0}/{event.capacity} spots</span>
                                                    </div>
                                                )}
                                            </div>

                                            <Button variant="outline" className="w-full mt-2 border-slate-300 text-slate-900 hover:bg-slate-900 hover:text-white rounded-none h-10 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                                View Event
                                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 py-8 relative z-10">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <div className="w-8 h-8 border border-slate-900 flex items-center justify-center">
                            <Ticket className="w-4 h-4 text-slate-900" />
                        </div>
                        <span className="font-light text-slate-900">TicketHub</span>
                    </div>
                    <p className="text-slate-500 text-sm font-light">
                        © {new Date().getFullYear()} TicketHub. Secure ticket booking platform.
                    </p>
                </div>
            </footer>
        </div>
    );
}