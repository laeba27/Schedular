import { Suspense } from "react";
import { getUserEvents } from "@/actions/events";
import EventCard from "@/components/event-card";
import CreateEventModal from "@/components/create-event";
import { checkUser } from "@/lib/checkUser";
import { Calendar, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EventsPage() {
  return (
    <>
      <CreateEventModal />
      <Suspense fallback={<div>Loading events...</div>}>
        <Events />
      </Suspense>
    </>
  );
}

async function Events() {
  await checkUser();
  const { events, username } = await getUserEvents();

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
        <div className="text-center space-y-6 max-w-md">
          <div className="flex justify-center">
            <div className="bg-blue-100 p-8 rounded-full">
              <Calendar className="w-16 h-16 text-blue-600" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              No events yet
            </h2>
            <p className="text-gray-600 text-lg">
              Create your first event to start accepting bookings from your customers
            </p>
          </div>
          <div className="pt-4">
            <p className="text-gray-500 text-sm mb-6">
              Share your event link and let people book time with you
            </p>
            <Link href="?create=true">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-lg flex items-center justify-center gap-2 w-full"
              >
                <Plus className="w-5 h-5" />
                Create Your First Event
              </Button>
            </Link>
          </div>
          <div className="pt-4 space-y-4 text-left bg-gray-50 p-6 rounded-lg">
            <p className="font-semibold text-gray-800">Getting started:</p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                <span>Choose from ready-made templates or create a custom event type</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                <span>Set your availability and time slots</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                <span>Share your booking link with customers</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      {events?.map((event) => (
        <EventCard key={event.id} event={event} username={username} />
      ))}
    </div>
  );
}
