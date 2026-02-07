"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateUsername, isGoogleConnected } from "@/actions/users";
import { BarLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import { usernameSchema } from "@/app/lib/validators";
import { getLatestUpdates } from "@/actions/dashboard";
import { format, getDaysInMonth, startOfMonth, getDay } from "date-fns";
import { AlertCircle, Check, Calendar as CalendarIcon, Copy, Share2, Mail, MessageCircle, Instagram, Linkedin, Twitter } from "lucide-react";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [googleConnected, setGoogleConnected] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [copied, setCopied] = useState(false);
  const [shareDropdownOpen, setShareDropdownOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(usernameSchema),
  });

  useEffect(() => {
    setValue("username", user?.username);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  useEffect(() => {
    (async () => {
      const result = await isGoogleConnected();
      setGoogleConnected(result);
    })();
  }, []);

  const {
    loading: loadingUpdates,
    data: upcomingMeetings,
    fn: fnUpdates,
  } = useFetch(getLatestUpdates);

  useEffect(() => {
    (async () => await fnUpdates())();
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Set greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  const bookingLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/${user?.username}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(bookingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'text-green-600 hover:bg-green-50',
      onClick: () => window.open(`https://wa.me/?text=${encodeURIComponent(`Book a meeting with me: ${bookingLink}`)}`),
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'text-red-600 hover:bg-red-50',
      onClick: () => window.open(`mailto:?subject=Book a Meeting&body=${encodeURIComponent(`Check out my booking link: ${bookingLink}`)}`),
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'text-blue-600 hover:bg-blue-50',
      onClick: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(bookingLink)}`),
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'text-sky-600 hover:bg-sky-50',
      onClick: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Book a meeting with me: ${bookingLink}`)}`),
    },
  ];

  const { loading, error, fn: fnUpdateUsername } = useFetch(updateUsername);

  const onSubmit = async (data) => {
    await fnUpdateUsername(data.username);
  };

  // Generate calendar grid
  const today = new Date();
  const firstDay = startOfMonth(today);
  const daysInMonth_num = getDaysInMonth(today);
  const startingDayOfWeek = getDay(firstDay);
  const days = [];

  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth_num; i++) {
    days.push(i);
  }

  return (
    <div className="space-y-4 h-full overflow-hidden flex flex-col">
      {googleConnected === false && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-3 items-start flex-shrink-0">
          <AlertCircle className="text-yellow-600 w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-yellow-900 font-medium mb-1 text-sm">Connect Google Calendar</p>
            <p className="text-yellow-800 text-xs mb-2">
              Enable automatic Google Meet links for your bookings
            </p>
            <Button 
              onClick={() => window.location.href = "https://accounts.google.com/o/oauth2/auth"}
              className="bg-yellow-600 hover:bg-yellow-700 text-xs h-8"
            >
              Connect Calendar
            </Button>
          </div>
        </div>
      )}

      {/* Header Section with Greeting and Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{greeting}, {user?.firstName}! 👋</h2>
            {googleConnected === true && (
              <div className="flex items-center gap-1 bg-green-50 border border-green-200 px-2 py-1 rounded-full">
                <Check className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-700 font-medium">Connected</span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600">Welcome back to your scheduling dashboard</p>
        </div>

        {/* Time and Date */}
        <div className="text-right bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-gray-200 min-w-max flex-shrink-0">
          <p className="text-3xl md:text-4xl font-bold text-gray-900">{format(currentTime, "HH:mm")}</p>
          <p className="text-xs md:text-sm text-gray-600 mt-1">{format(currentTime, "MMM d, yyyy")}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 overflow-hidden">
        {/* Meetings Section - Takes 2 columns on large screens */}
        <div className="lg:col-span-2 overflow-hidden flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarIcon className="w-4 h-4" />
                Upcoming Meetings
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              {!loadingUpdates ? (
                <div>
                  {upcomingMeetings && upcomingMeetings?.length > 0 ? (
                    <div className="space-y-2">
                      {upcomingMeetings?.map((meeting) => (
                        <div 
                          key={meeting.id} 
                          className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{meeting.event.title}</p>
                              <p className="text-xs text-gray-600 mt-1">with {meeting.name}</p>
                              <p className="text-xs text-gray-500 mt-1 font-medium">
                                {format(new Date(meeting.startTime), "MMM d • h:mm a")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 flex flex-col items-center justify-center h-full">
                      <div className="text-4xl mb-2">📅</div>
                      <p className="text-gray-600 font-medium text-sm mb-1">No upcoming meetings</p>
                      <p className="text-xs text-gray-500">
                        Enjoy your free time! ✨
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4 text-sm">Loading updates...</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Calendar and Username */}
        <div className="space-y-4 overflow-hidden flex flex-col">
          {/* Mini Calendar */}
          <Card className="flex-shrink-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {format(today, "MMM yyyy")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="grid grid-cols-7 gap-1">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-gray-500 py-1">
                      {day}
                    </div>
                  ))}
                  {days.map((day, idx) => (
                    <div
                      key={idx}
                      className={`text-center py-1 rounded text-xs ${
                        day === null
                          ? ""
                          : day === today.getDate()
                          ? "bg-blue-600 text-white font-bold"
                          : "text-gray-700 hover:bg-gray-100 cursor-pointer"
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Unique Link */}
          <Card className="flex-shrink-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Your Link</CardTitle>
                <div className="flex items-center gap-1">
                  {/* Copy Icon Button */}
                  <button
                    onClick={handleCopy}
                    className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                    title="Copy link"
                  >
                    <Copy className={`w-4 h-4 ${copied ? 'text-green-600' : 'text-gray-600'}`} />
                  </button>

                  {/* Share Icon Button with Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShareDropdownOpen(!shareDropdownOpen)}
                      className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                      title="Share link"
                    >
                      <Share2 className="w-4 h-4 text-gray-600" />
                    </button>

                    {/* Share Dropdown Menu */}
                    {shareDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 min-w-max">
                        {shareOptions.map((option) => {
                          const Icon = option.icon;
                          return (
                            <button
                              key={option.name}
                              onClick={() => {
                                option.onClick();
                                setShareDropdownOpen(false);
                              }}
                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${option.color}`}
                            >
                              <Icon className="w-4 h-4" />
                              {option.name}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500 mb-2">Booking link</p>
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 border border-gray-200">
                    <span className="text-xs text-gray-600 truncate flex-shrink-0">{typeof window !== 'undefined' ? window.location.origin : ''}/</span>
                    <Input 
                      {...register("username")} 
                      placeholder="username"
                      className="border-0 bg-transparent text-xs p-0 focus:outline-none focus:ring-0 h-6"
                    />
                  </div>
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.username.message}
                    </p>
                  )}
                  {error && (
                    <p className="text-red-500 text-xs mt-1">{error?.message}</p>
                  )}
                </div>
                {loading && (
                  <BarLoader className="mb-2" width={"100%"} color="#36d7b7" />
                )}
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full text-xs h-8"
                  variant="outline"
                >
                  Update
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
