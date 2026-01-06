"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Ticket, User, Mail, Hash, Image, AlertCircle, Home, Calendar, MapPin } from "lucide-react";

export default function TrackPage({ params }) {
  const { ticketId } = use(params);
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Ticket not found");
      setTicket(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const baseClass = "border font-light text-xs px-4 py-1";
    switch (status) {
      case "approved":
        return <Badge variant="outline" className={`${baseClass} border-green-600 text-green-600`}>Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className={`${baseClass} border-red-600 text-red-600`}>Rejected</Badge>;
      default:
        return <Badge variant="outline" className={`${baseClass} border-slate-600 text-slate-600`}>Pending</Badge>;
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case "approved":
        return "Your ticket has been approved! You're all set.";
      case "rejected":
        return "Unfortunately, your ticket has been rejected.";
      default:
        return "Your ticket is under review. Please check back later.";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]"></div>
        <Loader2 className="h-10 w-10 animate-spin text-slate-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white py-8 px-4">
        <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]"></div>
        <div className="container max-w-2xl mx-auto text-center relative">
          <div className="w-20 h-20 mx-auto mb-6 border border-slate-300 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-slate-600" />
          </div>
          <h1 className="text-2xl font-light text-slate-900 mb-2">Ticket Not Found</h1>
          <p className="text-slate-600 font-light mb-2">
            We couldn't find a ticket with ID <span className="font-mono text-slate-900">{ticketId}</span>
          </p>
          <p className="text-slate-400 text-sm mb-6 font-light">{error}</p>
          <Link href="/">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-none h-12 px-8">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-4 sm:py-8 px-4">
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]"></div>

      <div className="container max-w-2xl mx-auto relative">
        {/* Header */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-light text-slate-900">Track your ticket</h1>
        </div>

        <Card className="border-slate-200 rounded-none shadow-none overflow-hidden">
          {/* Status Header */}
          <div className={`p-6 text-center border-b border-slate-200 ${ticket.status === "approved" ? "bg-green-50" :
              ticket.status === "rejected" ? "bg-red-50" : "bg-slate-50"
            }`}>
            <div className={`w-16 h-16 mx-auto mb-4 border flex items-center justify-center ${ticket.status === "approved" ? "border-green-600" :
                ticket.status === "rejected" ? "border-red-600" : "border-slate-600"
              }`}>
              <Ticket className={`w-8 h-8 ${ticket.status === "approved" ? "text-green-600" :
                  ticket.status === "rejected" ? "text-red-600" : "text-slate-600"
                }`} />
            </div>
            {getStatusBadge(ticket.status)}
            <p className="mt-3 text-slate-600 text-sm font-light">{getStatusMessage(ticket.status)}</p>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Ticket ID */}
            <div className="bg-slate-50 border border-slate-200 p-4 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2 font-light">Ticket ID</p>
              <p className="text-2xl font-mono font-light text-slate-900">{ticket.ticketId}</p>
            </div>

            {/* Event Info */}
            {ticket.event && (
              <div className="bg-slate-50 border border-slate-200 p-4">
                <h3 className="font-normal text-slate-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Event Details
                </h3>
                <div className="space-y-2">
                  <Link href={`/events/${ticket.event.eventId}`} className="block">
                    <p className="text-slate-900 font-normal hover:underline">{ticket.event.name}</p>
                  </Link>
                  <p className="text-slate-600 text-sm font-light flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(ticket.event.date).toLocaleDateString("en-US", {
                      weekday: "short", month: "short", day: "numeric", year: "numeric"
                    })}
                  </p>
                  {ticket.event.venue && (
                    <p className="text-slate-600 text-sm font-light flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {ticket.event.venue}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Rejection Reason */}
            {ticket.status === "rejected" && ticket.rejectionReason && (
              <div className="bg-red-50 border border-red-500 p-4">
                <p className="text-red-600 text-sm font-normal mb-1">Rejection Reason:</p>
                <p className="text-slate-900 text-sm font-light">{ticket.rejectionReason}</p>
              </div>
            )}

            {/* Booking Details */}
            <div className="space-y-4">
              <h3 className="font-normal text-slate-900 border-b border-slate-200 pb-2">Booking Details</h3>

              <div className="grid gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-slate-300 flex items-center justify-center">
                    <User className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-light">Name</p>
                    <p className="text-slate-900 font-normal">{ticket.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-slate-300 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-slate-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-500 text-xs font-light">Email</p>
                    <p className="text-slate-900 font-normal truncate">{ticket.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-slate-300 flex items-center justify-center">
                    <Hash className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-light">UTR Number</p>
                    <p className="text-slate-900 font-mono">{ticket.utr}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Screenshot */}
            {ticket.paymentImage && ticket.paymentImage !== "FREE_TICKET" && (
              <div className="space-y-2">
                <h3 className="font-normal text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Payment Screenshot
                </h3>
                <div className="bg-slate-50 border border-slate-200 p-4">
                  <img
                    src={ticket.paymentImage}
                    alt="Payment screenshot"
                    className="max-h-48 mx-auto"
                  />
                </div>
              </div>
            )}

            {/* Booking Time */}
            <div className="text-center text-slate-400 text-sm pt-4 border-t border-slate-200 font-light">
              Booked on {new Date(ticket.createdAt).toLocaleDateString("en-US", {
                weekday: "short", month: "short", day: "numeric", year: "numeric",
                hour: "2-digit", minute: "2-digit"
              })}
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-3">
              {ticket.event && (
                <Link href={`/events/${ticket.event.eventId}`} className="block">
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-none h-12">
                    View Event
                  </Button>
                </Link>
              )}
              <Link href="/" className="block">
                <Button variant="outline" className="w-full border-slate-300 text-slate-900 hover:bg-slate-50 rounded-none h-12">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}