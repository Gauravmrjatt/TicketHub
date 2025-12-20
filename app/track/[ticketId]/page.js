"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Ticket, User, Mail, Hash, Image, AlertCircle, Home } from "lucide-react";

export default function TrackPage({ params }) {
  const { ticketId } = use(params);
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(`/api/tickets/${ticketId}`);
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || "Ticket not found");
        }
        setTicket(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTicket();
  }, [ticketId]);

  const getStatusBadge = (status) => {
    const baseClass = "border font-light px-4 py-1";
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
        return "Your ticket has been approved.";
      case "rejected":
        return "Your ticket has been rejected.";
      default:
        return "Your ticket is under review.";
    }
  };

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
          <h1 className="text-4xl font-light text-slate-900 mb-2">Track ticket</h1>
          <p className="text-slate-600 font-light">View booking status</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <Card className="border-slate-200 rounded-none shadow-none">
            <CardContent className="py-16">
              <div className="flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-slate-900" />
                <p className="text-slate-600 font-light">Loading ticket details...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Card className="border-red-500 rounded-none shadow-none">
            <CardContent className="py-16">
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-16 h-16 border border-red-500 flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-xl font-normal text-slate-900">Ticket not found</h2>
                <p className="text-slate-600 font-light max-w-sm">
                  Could not find ticket with ID <span className="font-mono font-normal">{ticketId}</span>
                </p>
                <Link href="/">
                  <Button className="mt-4 bg-slate-900 hover:bg-slate-800 text-white rounded-none h-12 px-8">
                    <Home className="mr-2 h-4 w-4" />
                    Back to home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ticket Details */}
        {ticket && !isLoading && (
          <Card className="border-slate-200 rounded-none shadow-none">
            {/* Status Header */}
            <div className={`p-8 text-center border-b ${
              ticket.status === "approved" 
                ? "bg-green-50 border-green-200" 
                : ticket.status === "rejected" 
                  ? "bg-red-50 border-red-200" 
                  : "bg-slate-50 border-slate-200"
            }`}>
              <div className={`w-16 h-16 border mx-auto mb-6 flex items-center justify-center ${
                ticket.status === "approved" 
                  ? "border-green-600" 
                  : ticket.status === "rejected" 
                    ? "border-red-600" 
                    : "border-slate-600"
              }`}>
                <Ticket className={`h-8 w-8 ${
                  ticket.status === "approved" 
                    ? "text-green-600" 
                    : ticket.status === "rejected" 
                      ? "text-red-600" 
                      : "text-slate-600"
                }`} />
              </div>
              {getStatusBadge(ticket.status)}
              <p className="mt-4 text-slate-600 font-light">
                {getStatusMessage(ticket.status)}
              </p>
            </div>

            <CardContent className="p-8 space-y-8">
              {/* Ticket ID */}
              <div className="bg-slate-50 p-6 text-center border border-slate-200">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-2 font-light">Ticket ID</p>
                <p className="text-2xl font-mono font-light text-slate-900">{ticket.ticketId}</p>
              </div>

              {/* Rejection Reason */}
              {ticket.status === "rejected" && ticket.rejectionReason && (
                <div className="border border-red-500 bg-red-50 p-4">
                  <p className="text-sm font-normal text-slate-900 mb-2">Rejection reason</p>
                  <p className="text-sm text-slate-600 font-light">{ticket.rejectionReason}</p>
                </div>
              )}

              {/* User Details */}
              <div className="space-y-6">
                <h3 className="font-normal text-slate-900 pb-3 border-b border-slate-200">Booking details</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4 pb-4 border-b border-slate-200">
                    <div className="w-10 h-10 border border-slate-300 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-slate-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1 font-light">Name</p>
                      <p className="text-slate-900 font-normal">{ticket.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pb-4 border-b border-slate-200">
                    <div className="w-10 h-10 border border-slate-300 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-4 w-4 text-slate-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1 font-light">Email</p>
                      <p className="text-slate-900 font-normal break-all">{ticket.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pb-4 border-b border-slate-200">
                    <div className="w-10 h-10 border border-slate-300 flex items-center justify-center flex-shrink-0">
                      <Hash className="h-4 w-4 text-slate-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1 font-light">UTR Number</p>
                      <p className="font-mono text-slate-900 font-normal">{ticket.utr}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Screenshot */}
              {ticket.paymentImage && (
                <div className="space-y-4">
                  <h3 className="font-normal text-slate-900 pb-3 border-b border-slate-200 flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Payment screenshot
                  </h3>
                  <div className="bg-slate-50 p-4 border border-slate-200">
                    <img
                      src={ticket.paymentImage}
                      alt="Payment screenshot"
                      className="max-h-64 mx-auto"
                    />
                  </div>
                </div>
              )}

              {/* Booking Time */}
              <div className="text-center text-xs text-slate-500 uppercase tracking-wide pt-6 border-t border-slate-200 font-light">
                Booked on {new Date(ticket.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              {/* Back Button */}
              <div className="pt-4">
                <Link href="/" className="block">
                  <Button variant="outline" className="w-full border-slate-300 text-slate-900 hover:bg-slate-50 rounded-none h-12">
                    <Home className="mr-2 h-4 w-4" />
                    Back to home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}