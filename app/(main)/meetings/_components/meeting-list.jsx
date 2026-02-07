"use client";

import { format, formatDistanceToNow, isPast } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, Video, Copy, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import CancelMeetingButton from "./cancel-meeting";
import { useState } from "react";

export default function MeetingList({ meetings, type }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyLink = (meetLink, meetingId) => {
    navigator.clipboard.writeText(meetLink);
    setCopiedId(meetingId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (meetings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg border border-gray-200 p-8">
        <div className="text-center space-y-4">
          {type === "upcoming" ? (
            <>
              <div className="flex justify-center">
                <div className="bg-blue-100 p-4 rounded-full">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No Upcoming Meetings</h3>
              <p className="text-gray-600">Your upcoming meetings will appear here</p>
            </>
          ) : (
            <>
              <div className="flex justify-center">
                <div className="bg-gray-100 p-4 rounded-full">
                  <Clock className="w-8 h-8 text-gray-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No Past Meetings</h3>
              <p className="text-gray-600">Your completed meetings will appear here</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {meetings.map((meeting) => {
        const meetingDate = new Date(meeting.startTime);
        const isMeetingPast = isPast(meetingDate);
        const timeFromNow = formatDistanceToNow(meetingDate, { addSuffix: !isMeetingPast });

        return (
          <Card 
            key={meeting.id} 
            className="flex flex-col justify-between hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden"
          >
            {/* Status Indicator */}
            <div className={`h-1 ${isMeetingPast ? 'bg-gray-300' : 'bg-blue-500'}`}></div>

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <CardTitle className="text-lg font-bold text-gray-900 flex-1">
                  {meeting.event.title}
                </CardTitle>
                <div className={`flex-shrink-0 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${isMeetingPast ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'}`}>
                  {isMeetingPast ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      Completed
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3" />
                      Upcoming
                    </>
                  )}
                </div>
              </div>
              <CardDescription className="text-sm text-gray-600">with {meeting.name}</CardDescription>
              {meeting.additionalInfo && (
                <CardDescription className="text-sm text-gray-500 italic mt-2 line-clamp-2">
                  &quot;{meeting.additionalInfo}&quot;
                </CardDescription>
              )}
            </CardHeader>

            <CardContent className="pb-4 space-y-3">
              {/* Date */}
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm">{format(meetingDate, "MMMM d, yyyy")}</span>
              </div>

              {/* Time */}
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span className="text-sm">
                  {format(meetingDate, "h:mm a")} - {format(new Date(meeting.endTime), "h:mm a")}
                </span>
              </div>

              {/* Time Status */}
              <div className="text-xs text-gray-500 font-medium pl-6">
                {isMeetingPast ? "Completed " : "Starting in "}
                {timeFromNow.replace(" ago", "")}
              </div>

              {/* Meeting Link */}
              {meeting.meetLink && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <a
                      href={meeting.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm flex-1 truncate"
                    >
                      <Video className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">Join Meeting</span>
                    </a>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyLink(meeting.meetLink, meeting.id)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 p-1 h-auto"
                    >
                      {copiedId === meeting.id ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>

            {type === "upcoming" && (
              <CardFooter className="pt-4 border-t border-gray-200">
                <CancelMeetingButton meetingId={meeting.id} />
              </CardFooter>
            )}
          </Card>
        );
      })}
    </div>
  );
}
