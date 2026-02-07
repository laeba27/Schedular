import { Calendar, Clock, FileText, Download } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function EventDetails({ event }) {
  const { user } = event;
  
  // Parse JSON fields
  const images = event.images ? (Array.isArray(event.images) ? event.images : JSON.parse(event.images)) : [];
  const documents = event.documents ? (Array.isArray(event.documents) ? event.documents : JSON.parse(event.documents)) : [];

  return (
    <div className="p-10 lg:w-1/3 bg-white overflow-y-auto">
      {/* Event Title and Host */}
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <div className="flex items-center mb-6 pb-6 border-b border-gray-200">
        <Avatar className="w-12 h-12 mr-4">
          <AvatarImage src={user.imageUrl} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      {/* Event Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-gray-700">
          <Clock className="mr-3 w-5 h-5 text-blue-600" />
          <span className="font-medium">{event.duration} minutes</span>
        </div>
        <div className="flex items-center text-gray-700">
          <Calendar className="mr-3 w-5 h-5 text-purple-600" />
          <span className="font-medium">Google Meet Included</span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2">About this event</h3>
        <p className="text-gray-700 leading-relaxed">{event.description}</p>
      </div>

      {/* Event Images */}
      {images.length > 0 && (
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Event Images</h3>
          <div className="grid grid-cols-2 gap-3">
            {images.map((img, idx) => (
              <a key={idx} href={img} target="_blank" rel="noopener noreferrer">
                <img
                  src={img}
                  alt="Event"
                  className="w-full h-24 object-cover rounded-lg hover:shadow-md transition-shadow"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Documents */}
      {documents.length > 0 && (
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Reference Materials</h3>
          <div className="space-y-2">
            {documents.map((doc, idx) => (
              <a
                key={idx}
                href={doc}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
              >
                <FileText className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <span className="text-sm text-gray-700 flex-1 truncate">{doc}</span>
                <Download className="w-4 h-4 text-amber-600 flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {event.notes && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Important Notes</h3>
          <p className="text-sm text-blue-800 whitespace-pre-wrap">{event.notes}</p>
        </div>
      )}
    </div>
  );
}
