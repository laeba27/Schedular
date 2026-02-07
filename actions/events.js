"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { eventSchema } from "@/app/lib/validators";

export async function createEvent(data) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const validatedData = eventSchema.parse(data);

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const event = await db.event.create({
    data: {
      title: validatedData.title,
      description: validatedData.description,
      duration: validatedData.duration,
      isPrivate: validatedData.isPrivate,
      userId: user.id,
      images: validatedData.images || null,
      documents: validatedData.documents || null,
      notes: validatedData.notes || null,
      attendeeEmails: validatedData.attendeeEmails || null,
    },
  });

  // TODO: Send calendar invites to attendeeEmails if private and emails are provided
  if (validatedData.isPrivate && validatedData.attendeeEmails && validatedData.attendeeEmails.length > 0) {
    // This will be implemented with email service
    console.log("TODO: Send calendar invites to:", validatedData.attendeeEmails);
  }

  return event;
}

export async function getUserEvents() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const events = await db.event.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { bookings: true },
      },
    },
  });

  return { events, username: user.username };
}

export async function deleteEvent(eventId) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const event = await db.event.findUnique({
    where: { id: eventId },
  });

  if (!event || event.userId !== user.id) {
    throw new Error("Event not found or unauthorized");
  }

  await db.event.delete({
    where: { id: eventId },
  });

  return { success: true };
}

export async function getEventDetails(username, eventId) {
  const event = await db.event.findFirst({
    where: {
      id: eventId,
      user: {
        username: username,
      },
    },
    include: {
      user: {
        select: {
          clerkUserId: true,
          name: true,
          email: true,
          imageUrl: true,
        },
      },
    },
  });

  return event;
}
