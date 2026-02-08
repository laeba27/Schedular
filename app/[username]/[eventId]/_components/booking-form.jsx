"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createBooking } from "@/actions/bookings";
import { bookingSchema } from "@/app/lib/validators";
import "react-day-picker/style.css";
import useFetch from "@/hooks/use-fetch";
import { AlertCircle, RefreshCw, Mail } from "lucide-react";

export default function BookingForm({ event, availability, organiserGoogleConnected }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(bookingSchema),
  });

  useEffect(() => {
    if (selectedDate) {
      setValue("date", format(selectedDate, "yyyy-MM-dd"));
    }
  }, [selectedDate, setValue]);

  useEffect(() => {
    if (selectedTime) {
      setValue("time", selectedTime);
    }
  }, [selectedTime, setValue]);

  const { loading, data, error, fn: fnCreateBooking } = useFetch(createBooking);

  const onSubmit = async (data) => {
    console.log("Form submitted with data:", data);

    if (!selectedDate || !selectedTime) {
      console.error("Date or time not selected");
      return;
    }

    const startTime = new Date(
      `${format(selectedDate, "yyyy-MM-dd")}T${selectedTime}`
    );
    const endTime = new Date(startTime.getTime() + event.duration * 60000);

    const bookingData = {
      eventId: event.id,
      name: data.name,
      email: data.email,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      additionalInfo: data.additionalInfo,
    };

    await fnCreateBooking(bookingData);
  };

  const availableDays = availability.map((day) => new Date(day.date));

  const timeSlots = selectedDate
    ? availability.find(
        (day) => day.date === format(selectedDate, "yyyy-MM-dd")
      )?.slots || []
    : [];

  if (!organiserGoogleConnected) {
    return (
      <div className="flex flex-col gap-6 p-8 border rounded-lg bg-red-50 border-red-200 md:w-96">
        <div className="flex gap-4 items-start">
          <AlertCircle className="text-red-600 w-6 h-6 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 mb-3">
              Organizer Not Set Up for Bookings
            </h3>
            <p className="text-red-800 mb-4 text-sm">
              This event organizer hasn&apos;t connected their Google Calendar yet. Without this connection, bookings cannot be processed and video call links cannot be generated.
            </p>
            
            {/* Steps to connect */}
            <div className="bg-white rounded-lg p-4 mb-4 border border-red-100">
              <p className="font-semibold text-gray-900 text-sm mb-3">The organizer needs to:</p>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="font-bold text-red-600 flex-shrink-0">1.</span>
                  <span>Log in to their account and go to <span className="font-semibold">Availability</span> page</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-red-600 flex-shrink-0">2.</span>
                  <span>Click the <span className="font-semibold">&quot;Connect Google Calendar&quot;</span> button</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-red-600 flex-shrink-0">3.</span>
                  <span>Complete the Google authorization step</span>
                </li>
              </ol>
            </div>

            <div className="space-y-2">
              <p className="text-red-700 text-sm font-medium">Next steps:</p>
              <Button 
                variant="outline"
                className="w-full flex items-center justify-center gap-2 bg-white border-red-300 text-red-700 hover:bg-red-100"
                onClick={() => {
                  const organiserEmail = event.user?.email;
                  if (organiserEmail) {
                    window.open(
                      `mailto:${organiserEmail}?subject=Please%20Connect%20Google%20Calendar%20for%20Bookings&body=Hi%20${event.user?.name || 'there'},%0A%0AI&apos;d%20like%20to%20book%20a%20${event.title}%20event,%20but%20I%20see%20that%20your%20Google%20Calendar%20hasn&apos;t%20been%20connected%20yet.%0A%0APlease%20connect%20it%20by:%0A1.%20Going%20to%20your%20Availability%20page%0A2.%20Clicking%20&apos;Connect%20Google%20Calendar&apos;%0A3.%20Completing%20the%20authorization%0A%0AThank%20you!`,
                      '_blank'
                    );
                  }
                }}
              >
                <Mail className="w-4 h-4" />
                Send Reminder to Organizer
              </Button>
              <Button 
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  window.location.reload();
                }}
              >
                <RefreshCw className="w-4 h-4" />
                Try Again (Just Connected?)
              </Button>
            </div>
            
            <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-lg text-xs text-blue-800">
              <strong>💡 Tip:</strong> If the organizer just connected their Google Calendar, click &quot;Try Again&quot; to refresh this page.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (data) {
    if (data.success === false) {
      const isInsufficientScopes = data.error?.includes("insufficient authentication scopes");
      const isAPIDisabled = data.error?.includes("Google Calendar API has not been used") || data.error?.includes("disabled");
      
      return (
        <div className="flex flex-col gap-6 p-8 border rounded-lg bg-red-50 border-red-200 md:w-96">
          <div className="flex gap-4 items-start">
            <AlertCircle className="text-red-600 w-6 h-6 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3 text-red-600">
                {isInsufficientScopes 
                  ? "Organizer Needs to Re-authorize" 
                  : isAPIDisabled
                  ? "Google Calendar API Not Enabled"
                  : "Booking Failed"}
              </h2>
              <p className="text-red-800 mb-4 text-sm">
                {isInsufficientScopes
                  ? "The organizer authorized Google Calendar but didn&apos;t grant permission to create calendar events. They need to re-connect with proper permissions."
                  : isAPIDisabled
                  ? "The organizer&apos;s Google Cloud project hasn&apos;t enabled the Google Calendar API yet. This needs to be activated before bookings can be processed."
                  : data.error}
              </p>

              {isAPIDisabled && (
                <div className="bg-white rounded-lg p-4 mb-4 border border-red-100">
                  <p className="font-semibold text-gray-900 text-sm mb-3">Organizer needs to:</p>
                  <ol className="space-y-2 text-sm text-gray-700">
                    <li className="flex gap-2">
                      <span className="font-bold text-red-600 flex-shrink-0">1.</span>
                      <span>Go to <a href="https://console.cloud.google.com/apis/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">Google Cloud Console</a></span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-red-600 flex-shrink-0">2.</span>
                      <span>Search for <span className="font-semibold">&quot;Google Calendar API&quot;</span></span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-red-600 flex-shrink-0">3.</span>
                      <span>Click <span className="font-semibold">ENABLE</span></span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-red-600 flex-shrink-0">4.</span>
                      <span>Wait 2-3 minutes for changes to propagate</span>
                    </li>
                  </ol>
                </div>
              )}

              {isInsufficientScopes && (
                <div className="bg-white rounded-lg p-4 mb-4 border border-red-100">
                  <p className="font-semibold text-gray-900 text-sm mb-3">Organizer needs to:</p>
                  <ol className="space-y-2 text-sm text-gray-700">
                    <li className="flex gap-2">
                      <span className="font-bold text-red-600 flex-shrink-0">1.</span>
                      <span>Go to <span className="font-semibold">Availability</span> page</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-red-600 flex-shrink-0">2.</span>
                      <span>Click <span className="font-semibold">Disconnect Google Calendar</span></span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-red-600 flex-shrink-0">3.</span>
                      <span>Click <span className="font-semibold">Connect Google Calendar</span> again</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-red-600 flex-shrink-0">4.</span>
                      <span>Grant <span className="font-semibold">all permissions</span> when prompted</span>
                    </li>
                  </ol>
                </div>
              )}

              <div className="space-y-2">
                <Button 
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 bg-white border-red-300 text-red-700 hover:bg-red-100"
                  onClick={() => {
                    const organiserEmail = event.user?.email;
                    if (organiserEmail) {
                      const subject = isAPIDisabled 
                        ? "Please Enable Google Calendar API"
                        : "Please Re-authorize Google Calendar";
                      const body = isAPIDisabled
                        ? `Hi%20${event.user?.name || 'there'},%0A%0AI%20tried%20to%20book%20your%20${event.title}%20event,%20but%20received%20an%20error.%0A%0APlease%20enable%20the%20Google%20Calendar%20API%20in%20your%20Google%20Cloud%20Console:%0A1.%20Go%20to%20https://console.cloud.google.com/apis/dashboard%0A2.%20Search%20for%20%22Google%20Calendar%20API%22%0A3.%20Click%20ENABLE%0A4.%20Wait%202-3%20minutes%0A%0AThank%20you!`
                        : `Hi%20${event.user?.name || 'there'},%0A%0AI%20tried%20to%20book%20your%20${event.title}%20event,%20but%20received%20an%20authorization%20error.%0A%0APlease%20fix%20this%20by:%0A1.%20Going%20to%20your%20Availability%20page%0A2.%20Disconnecting%20Google%20Calendar%0A3.%20Reconnecting%20and%20granting%20ALL%20permissions%0A%0AThank%20you!`;
                      
                      window.open(
                        `mailto:${organiserEmail}?subject=${subject}&body=${body}`,
                        '_blank'
                      );
                    }
                  }}
                >
                  <Mail className="w-4 h-4" />
                  Send Instructions to Organizer
                </Button>
                <Button 
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center p-10 border bg-green-50 border-green-200">
        <h2 className="text-2xl font-bold mb-4 text-green-600">Booking successful!</h2>
        {data.meetLink ? (
          <p className="mb-4">
            Join the meeting:{" "}
            <a
              href={data.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline font-semibold"
            >
              {data.meetLink}
            </a>
          </p>
        ) : (
          <p className="text-gray-600">
            Your booking is confirmed! The organizer will send you the meeting link via email.
          </p>
        )}
        <p className="text-sm text-gray-500 mt-4">
          A confirmation email has been sent to your email address.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-10 border bg-white">
      <div className="md:h-96 flex flex-col md:flex-row gap-5 ">
        <div className="w-full">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setSelectedTime(null); // Reset selected time when date changes
            }}
            disabled={[{ before: new Date() }]}
            modifiers={{ available: availableDays }}
            modifiersStyles={{
              available: {
                background: "lightblue",
                borderRadius: 100,
              },
            }}
          />
        </div>
        <div className="w-full h-full md:overflow-scroll no-scrollbar">
          {/* add hide scroll bar code */}
          {selectedDate && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Available Time Slots
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot}
                    variant={selectedTime === slot ? "default" : "outline"}
                    onClick={() => setSelectedTime(slot)}
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {selectedTime && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
              <p className="font-semibold">Error: {error.message}</p>
              <p className="text-sm mt-1">
                The event organizer may not have connected their Google Calendar. Please contact them.
              </p>
            </div>
          )}
          <div>
            <Input {...register("name")} placeholder="Your Name" />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Input
              {...register("email")}
              type="email"
              placeholder="Your Email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Textarea
              {...register("additionalInfo")}
              placeholder="Additional Information"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Scheduling..." : "Schedule Event"}
          </Button>
        </form>
      )}
    </div>
  );
}
