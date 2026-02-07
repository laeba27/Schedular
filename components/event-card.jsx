"use client";

import { deleteEvent } from "@/actions/events";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useFetch from "@/hooks/use-fetch";
import { Link, Trash2, Clock, Users, Lock, Globe, Eye, Share2, MessageCircle, Mail, Twitter, Linkedin, Facebook } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function EventCard({ event, username, isPublic = false }) {
  const [isCopied, setIsCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareMenuRef = useRef(null);
  const router = useRouter();
  const eventLink = `${window?.location.origin}/${username}/${event.id}`;

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target)) {
        setShowShareMenu(false);
      }
    };

    if (showShareMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showShareMenu]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(eventLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "hover:bg-green-50",
      action: () => {
        const text = `Check out my calendar: ${event.title}\n${eventLink}`;
        window.open(
          `https://wa.me/?text=${encodeURIComponent(text)}`,
          "_blank"
        );
      },
    },
    {
      name: "Email",
      icon: Mail,
      color: "hover:bg-blue-50",
      action: () => {
        const subject = `Schedule time with me: ${event.title}`;
        const body = `Hi,\n\nI'd like to schedule a ${event.title} with you. Please use this link to book a time that works for you:\n\n${eventLink}\n\nLooking forward to speaking with you!`;
        window.open(
          `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        );
      },
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "hover:bg-sky-50",
      action: () => {
        const text = `Check out my calendar and schedule time with me for a ${event.title} 🗓️\n${eventLink}`;
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
          "_blank"
        );
      },
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "hover:bg-blue-50",
      action: () => {
        const text = `I'm now available for ${event.title}. Schedule time with me using this link: ${eventLink}`;
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventLink)}`,
          "_blank"
        );
      },
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "hover:bg-blue-50",
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventLink)}`,
          "_blank"
        );
      },
    },
  ];

  const handleShare = (action) => {
    action();
    setShowShareMenu(false);
  };

  const { loading, fn: fnDeleteEvent } = useFetch(deleteEvent);

  const handleDelete = async () => {
    if (window?.confirm("Are you sure you want to delete this event?")) {
      await fnDeleteEvent(event.id);
      router.refresh();
    }
  };

  const handleCardClick = (e) => {
    if (e.target.tagName !== "BUTTON" && e.target.tagName !== "SVG" && !e.target.closest("button")) {
      window?.open(eventLink, "_blank");
    }
  };

  const handlePreview = (e) => {
    e.stopPropagation();
    window?.open(eventLink, "_blank");
  };

  return (
    <Card
      className="flex flex-col justify-between cursor-pointer hover:shadow-lg transition-shadow border border-gray-200"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle className="text-xl font-bold text-gray-900 flex-1">
            {event.title}
          </CardTitle>
          <badge className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
            event.isPrivate 
              ? 'bg-red-100 text-red-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {event.isPrivate ? (
              <>
                <Lock className="w-3 h-3" />
                Private
              </>
            ) : (
              <>
                <Globe className="w-3 h-3" />
                Public
              </>
            )}
          </badge>
        </div>
        <CardDescription className="flex flex-wrap items-center gap-4 text-sm">
          <span className="flex items-center gap-1 text-gray-600">
            <Clock className="w-4 h-4" />
            {event.duration} mins
          </span>
          <span className="flex items-center gap-1 text-gray-600">
            <Users className="w-4 h-4" />
            {event._count.bookings} booking{event._count.bookings !== 1 ? 's' : ''}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-4">
        {/* Image Preview */}
        {event.images && Array.isArray(event.images) && event.images.length > 0 && (
          <div className="mb-4 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={event.images[0]}
              alt={event.title}
              className="w-full h-32 object-cover"
            />
          </div>
        )}

        <p className="text-sm text-gray-700 leading-relaxed">
          {event.description.substring(0, event.description.indexOf(".")) || event.description.substring(0, 100)}
          {event.description.charAt(event.description.indexOf(".")) === "." ? "." : ""}
        </p>

        {/* Documents Badge */}
        {event.documents && Array.isArray(event.documents) && event.documents.length > 0 && (
          <div className="mt-3 inline-block px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded">
            📎 {event.documents.length} reference{event.documents.length !== 1 ? 's' : ''}
          </div>
        )}

        {/* Notes Preview */}
        {event.notes && (
          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
            ℹ️ Includes attendee notes
          </div>
        )}

        {!isPublic && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 font-medium mb-2">Booking Link:</p>
            <div className="flex items-center gap-2 bg-white p-2 rounded border border-gray-200 text-xs break-all">
              <span className="text-gray-500 flex-shrink-0">🔗</span>
              <code className="text-gray-700 flex-1 truncate">{eventLink}</code>
            </div>
          </div>
        )}
      </CardContent>

      {!isPublic && (
        <CardFooter className="flex gap-2 pt-4 border-t border-gray-200 flex-wrap">
          <Button
            variant="outline"
            onClick={handleCopy}
            className="flex items-center gap-2 flex-1"
          >
            <Link className="h-4 w-4" />
            {isCopied ? "Copied!" : "Copy"}
          </Button>
          <Button
            variant="outline"
            onClick={handlePreview}
            className="flex items-center gap-2 flex-1"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>

          {/* Share Button with Dropdown */}
          <div className="relative flex-1" ref={shareMenuRef}>
            <Button
              variant="outline"
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center gap-2 w-full"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>

            {/* Share Dropdown Menu */}
            {showShareMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-max">
                {shareOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(option.action);
                      }}
                      className={`w-full px-4 py-3 flex items-center gap-3 text-sm text-gray-700 transition-colors border-b border-gray-100 last:border-b-0 ${option.color}`}
                    >
                      <Icon className="h-4 w-4" />
                      {option.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-2"
            size="sm"
          >
            <Trash2 className="h-4 w-4" />
            {loading ? "..." : "Delete"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
