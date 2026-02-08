import React from "react";
import AvailabilityForm from "./_components/availability-form";
import { getUserAvailability } from "@/actions/availability";
import { isGoogleConnected } from "@/actions/users";
import { defaultAvailability } from "./data";
import { checkUser } from "@/lib/checkUser";
import { Calendar } from "lucide-react";

export default async function AvailabilityPage() {
  await checkUser();
  const [availability] = await Promise.all([
    getUserAvailability(),
    isGoogleConnected(),
  ]);

  return (
    <div className="space-y-2 max-h-screen overflow-y-auto">
      {/* Header */}
      <div>
        {/* <h1 className="text-2xl font-bold text-gray-900">Availability</h1> */}
        <p className="text-sm text-gray-600">Set your weekly schedule</p>
      </div>

      {/* Google Calendar Status */}
      {/* <GoogleCalendarStatus isConnected={googleConnected} /> */}

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Schedule
        </h2>
        <AvailabilityForm initialData={availability || defaultAvailability} />
      </div>
    </div>
  );
}
