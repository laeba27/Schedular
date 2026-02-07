"use server";

import { db } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

export async function createBooking(bookingData) {
  try {
    // Fetch the event and its creator
    const event = await db.event.findUnique({
      where: { id: bookingData.eventId },
      include: { user: true },
    });

    if (!event) {
      throw new Error("Event not found");
    }

    // Get the event creator's Google OAuth token from Clerk
    const { data } = await clerkClient().users.getUserOauthAccessToken(
      event.user.clerkUserId,
      "oauth_google"
    );

    const token = data[0]?.token;

    if (!token) {
      throw new Error("Event creator has not connected Google Calendar");
    }

    // Build attendees list
    const attendees = [
      { email: bookingData.email },
      { email: event.user.email },
    ];

    // Add event attendees if it's a private meeting
    if (event.isPrivate && event.attendeeEmails && Array.isArray(event.attendeeEmails)) {
      event.attendeeEmails.forEach((email) => {
        if (email && !attendees.find((a) => a.email === email)) {
          attendees.push({ email });
        }
      });
    }

    // Make direct API call to Google Calendar API instead of using googleapis library
    const calendarResponse = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: `${bookingData.name} - ${event.title}`,
          description: bookingData.additionalInfo || event.notes || event.description,
          start: { dateTime: bookingData.startTime },
          end: { dateTime: bookingData.endTime },
          attendees: attendees,
          conferenceData: {
            createRequest: { requestId: `${event.id}-${Date.now()}` },
          },
        }),
      }
    );

    if (!calendarResponse.ok) {
      const errorData = await calendarResponse.json();
      console.error("Google Calendar API error:", errorData);
      throw new Error(
        errorData.error?.message ||
          "Failed to create event in Google Calendar"
      );
    }

    const meetResponse = await calendarResponse.json();
    const meetLink = meetResponse.conferenceData?.entryPoints?.find(
      (ep) => ep.entryPointType === "video"
    )?.uri || meetResponse.hangoutLink;
    const googleEventId = meetResponse.id;

    // Create booking in database
    const booking = await db.booking.create({
      data: {
        eventId: event.id,
        userId: event.userId,
        name: bookingData.name,
        email: bookingData.email,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        additionalInfo: bookingData.additionalInfo,
        meetLink,
        googleEventId,
        invitedEmails: event.isPrivate && event.attendeeEmails ? event.attendeeEmails : null,
      },
    });

    return { success: true, booking, meetLink };
  } catch (error) {
    console.error("Error creating booking:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create booking",
    };
  }
}
