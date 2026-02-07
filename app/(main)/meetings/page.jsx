import { Suspense } from "react";
import { getUserMeetings } from "@/actions/meetings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MeetingList from "./_components/meeting-list";
import { checkUser } from "@/lib/checkUser";
import { Calendar, Clock } from "lucide-react";

export default async function MeetingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        {/* <h1 className="text-4xl font-bold text-gray-900 mb-2">Meetings</h1> */}
        <p className="text-gray-600 text-lg">View and manage all your scheduled meetings</p>
      </div>

      {/* Statistics Cards */}
      <Suspense fallback={<div>Loading statistics...</div>}>
        <StatsCards />
      </Suspense>

      {/* Meetings Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-flex mb-6 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="upcoming" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Calendar className="w-4 h-4" />
            <span>Upcoming</span>
          </TabsTrigger>
          <TabsTrigger 
            value="past" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Clock className="w-4 h-4" />
            <span>Past</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-0">
          <Suspense fallback={<LoadingState />}>
            <UpcomingMeetings />
          </Suspense>
        </TabsContent>

        <TabsContent value="past" className="mt-0">
          <Suspense fallback={<LoadingState />}>
            <PastMeetings />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

async function StatsCards() {
  await checkUser();
  const upcomingMeetings = await getUserMeetings("upcoming");
  const pastMeetings = await getUserMeetings("past");
  const totalMeetings = upcomingMeetings.length + pastMeetings.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard 
        label="Upcoming Meetings" 
        value={upcomingMeetings.length}
        icon={<Calendar className="w-6 h-6" />}
        color="bg-blue-50 text-blue-600"
      />
      <StatCard 
        label="Past Meetings" 
        value={pastMeetings.length}
        icon={<Clock className="w-6 h-6" />}
        color="bg-green-50 text-green-600"
      />
      <StatCard 
        label="Total Meetings" 
        value={totalMeetings}
        icon={<Calendar className="w-6 h-6" />}
        color="bg-purple-50 text-purple-600"
      />
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-200 rounded-lg h-48 animate-pulse"></div>
      ))}
    </div>
  );
}

async function UpcomingMeetings() {
  await checkUser();
  const meetings = await getUserMeetings("upcoming");
  return <MeetingList meetings={meetings} type="upcoming" />;
}

async function PastMeetings() {
  await checkUser();
  const meetings = await getUserMeetings("past");
  return <MeetingList meetings={meetings} type="past" />;
}
