"use client";

import { AlertCircle, CheckCircle2, Calendar } from "lucide-react";
import Link from "next/link";

export default function GoogleCalendarStatus({ isConnected }) {
  if (isConnected) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-green-900">Google Calendar Connected</h3>
          <p className="text-sm text-green-700 mt-1">
            Your bookings will be automatically added to your Google Calendar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start justify-between gap-4">
      <div className="flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-amber-900 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Connect Google Calendar
          </h3>
          <p className="text-sm text-amber-800 mt-1">
            To sync your availability and automatically add bookings to your calendar,
            please connect your Google Calendar account first.
          </p>
        </div>
      </div>
      <Link
        href="/"
        className="flex-shrink-0 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
      >
        Connect Now
      </Link>
    </div>
  );
}
