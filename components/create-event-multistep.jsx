"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Lock, Globe, Plus, Trash2, Upload, CheckCircle2, Loader } from "lucide-react";
import { createEvent } from "@/actions/events";
import useFetch from "@/hooks/use-fetch";
import { uploadToCloudinary } from "@/lib/cloudinary";

const TITLE_SUGGESTIONS = {
  private: [
    { title: "1-on-1 Meeting", description: "Personal one-on-one discussion" },
    { title: "Coaching Session", description: "One-on-one coaching and mentoring" },
    { title: "Training Session", description: "Professional training and development" },
    { title: "Consultation", description: "Expert consultation and advice" },
    { title: "Performance Review", description: "Employee performance review meeting" },
  ],
  public: [
    { title: "Product Demo", description: "Live product demonstration" },
    { title: "Webinar", description: "Online educational webinar" },
    { title: "Workshop", description: "Interactive workshop session" },
    { title: "Q&A Session", description: "Question and answer session" },
    { title: "Team Meeting", description: "Team sync and collaboration" },
  ],
};

export default function CreateEventMultistep() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isPrivate, setIsPrivate] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 30,
    isPrivate: null,
    attendeeEmails: [],
    images: [],
    documents: [],
    notes: "",
  });
  const [emailInput, setEmailInput] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [docUrls, setDocUrls] = useState([]);
  const [errors, setErrors] = useState({});

  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading, error: submitError, fn: fnCreateEvent } = useFetch(createEvent);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  useEffect(() => {
    const create = searchParams.get("create");
    if (create === "true") {
      setIsOpen(true);
    }
  }, [searchParams]);

  const handleClose = () => {
    setIsOpen(false);
    setCurrentStep(1);
    setIsPrivate(null);
    setFormData({
      title: "",
      description: "",
      duration: 30,
      isPrivate: null,
      attendeeEmails: [],
      images: [],
      documents: [],
      notes: "",
    });
    setEmailInput("");
    setImageUrls([]);
    setDocUrls([]);
    setErrors({});
    if (searchParams.get("create") === "true") {
      router.replace(window?.location.pathname);
    }
  };

  const handlePrivacySelect = (privacy) => {
    setIsPrivate(privacy);
    setFormData((prev) => ({
      ...prev,
      isPrivate: privacy,
    }));
    setCurrentStep(2);
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (formData.duration <= 0) newErrors.duration = "Duration must be greater than 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddEmail = () => {
    if (!emailInput.trim()) return;
    if (!emailInput.includes("@")) {
      setErrors((prev) => ({ ...prev, email: "Invalid email address" }));
      return;
    }
    if (formData.attendeeEmails.includes(emailInput)) {
      setErrors((prev) => ({ ...prev, email: "Email already added" }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      attendeeEmails: [...prev.attendeeEmails, emailInput],
    }));
    setEmailInput("");
    setErrors((prev) => ({ ...prev, email: "" }));
  };

  const handleRemoveEmail = (email) => {
    setFormData((prev) => ({
      ...prev,
      attendeeEmails: prev.attendeeEmails.filter((e) => e !== email),
    }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    try {
      setUploadingFiles(true);
      const { url } = await uploadToCloudinary(file, "image");
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, url],
      }));
      setErrors((prev) => ({ ...prev, image: "" }));
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        image: error instanceof Error ? error.message : "Failed to upload image",
      }));
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleDocumentUpload = async (file) => {
    if (!file) return;
    try {
      setUploadingFiles(true);
      const { url } = await uploadToCloudinary(file, "auto");
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, url],
      }));
      setErrors((prev) => ({ ...prev, doc: "" }));
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        doc: error instanceof Error ? error.message : "Failed to upload document",
      }));
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!validateStep2()) return;

    const eventPayload = {
      title: formData.title,
      description: formData.description,
      duration: parseInt(formData.duration),
      isPrivate: formData.isPrivate,
      attendeeEmails: formData.attendeeEmails?.length > 0 ? formData.attendeeEmails : null,
      images: formData.images?.length > 0 ? formData.images : null,
      documents: formData.documents?.length > 0 ? formData.documents : null,
      notes: formData.notes?.trim() ? formData.notes : null,
    };

    await fnCreateEvent(eventPayload);
    if (!submitError) {
      handleClose();
      router.refresh();
    }
  };

  const handleNextStep = () => {
    if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(isPrivate ? 3 : 4);
      }
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      setIsPrivate(null);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 4) {
      setCurrentStep(isPrivate ? 3 : 2);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
            <p className="text-sm text-gray-500 mt-1">Step {currentStep} of {isPrivate ? 4 : 3}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-200 flex-shrink-0">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{
              width: `${(currentStep / (isPrivate ? 4 : 3)) * 100}%`,
            }}
          ></div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Privacy Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  What type of event would you like to create?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Private Option */}
                  <button
                    onClick={() => handlePrivacySelect(true)}
                    className="p-6 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all text-left group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-red-100 rounded-lg group-hover:scale-110 transition-transform">
                        <Lock className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600">
                          Private Meeting
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Exclusive for invited attendees only
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          ✓ Add specific email addresses
                        </p>
                        <p className="text-xs text-gray-500">
                          ✓ Control who can attend
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Public Option */}
                  <button
                    onClick={() => handlePrivacySelect(false)}
                    className="p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-100 rounded-lg group-hover:scale-110 transition-transform">
                        <Globe className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600">
                          Public Event
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Open to anyone with the link
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          ✓ Discoverable booking link
                        </p>
                        <p className="text-xs text-gray-500">
                          ✓ Accept any attendees
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Event Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
                
                {/* Title Suggestions */}
                {isPrivate && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900 mb-3">Suggested titles:</p>
                    <div className="space-y-2">
                      {TITLE_SUGGESTIONS.private.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              title: suggestion.title,
                              description: suggestion.description,
                            }))
                          }
                          className="w-full text-left p-3 bg-white rounded hover:bg-blue-100 transition-colors"
                        >
                          <p className="font-medium text-blue-900">{suggestion.title}</p>
                          <p className="text-xs text-blue-700">{suggestion.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!isPrivate && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-semibold text-green-900 mb-3">Popular titles:</p>
                    <div className="space-y-2">
                      {TITLE_SUGGESTIONS.public.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              title: suggestion.title,
                              description: suggestion.description,
                            }))
                          }
                          className="w-full text-left p-3 bg-white rounded hover:bg-green-100 transition-colors"
                        >
                          <p className="font-medium text-green-900">{suggestion.title}</p>
                          <p className="text-xs text-green-700">{suggestion.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Enter event title"
                    className="mt-1"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Describe your event"
                    className="mt-1"
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                  )}
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes) *
                  </label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        duration: parseInt(e.target.value),
                      }))
                    }
                    min={15}
                    step={15}
                    className="mt-1"
                  />
                  {errors.duration && (
                    <p className="text-red-500 text-xs mt-1">{errors.duration}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Attendee Emails (Private Only) */}
          {currentStep === 3 && isPrivate && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Add Attendees (Optional)
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Invite specific people to this private meeting. They&apos;ll receive calendar invites
                  when bookings are made.
                </p>

                {/* Email Input */}
                <div className="mb-4">
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      value={emailInput}
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        setErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddEmail();
                        }
                      }}
                      placeholder="Enter email address"
                    />
                    <Button
                      onClick={handleAddEmail}
                      className="bg-blue-600 hover:bg-blue-700 flex-shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Attendee List */}
                {formData.attendeeEmails.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Added Attendees:</p>
                    <div className="space-y-2">
                      {formData.attendeeEmails.map((email, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                        >
                          <span className="text-sm text-gray-700">{email}</span>
                          <button
                            onClick={() => handleRemoveEmail(email)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Media & Notes */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Add Media & Instructions
                </h3>
                <p className="text-xs text-gray-500 mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  💡 Upload from your device to Cloudinary (free). Images and PDFs supported.
                </p>

                {/* Images Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Images (Optional)
                  </label>
                  <div className="mb-3">
                    <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-6 h-6 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">Click to upload images</span>
                        <span className="text-xs text-blue-600">PNG, JPG, GIF (Max 5MB each)</span>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files) {
                            Array.from(files).forEach((file) => {
                              if (file.size > 5 * 1024 * 1024) {
                                setErrors((prev) => ({
                                  ...prev,
                                  image: "File size must be less than 5MB",
                                }));
                                return;
                              }
                              handleImageUpload(file);
                            });
                          }
                        }}
                        className="hidden"
                        disabled={uploadingFiles}
                      />
                    </label>
                  </div>
                  {errors.image && (
                    <p className="text-red-500 text-xs mb-2">{errors.image}</p>
                  )}
                  {uploadingFiles && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Loader className="w-4 h-4 animate-spin" />
                      Uploading to Cloudinary...
                    </div>
                  )}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={img}
                            alt="Event"
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Documents Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reference Documents (Optional)
                  </label>
                  <div className="mb-3">
                    <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-amber-300 rounded-lg bg-amber-50 hover:bg-amber-100 cursor-pointer transition-colors">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-6 h-6 text-amber-600" />
                        <span className="text-sm font-medium text-amber-700">Click to upload documents</span>
                        <span className="text-xs text-amber-600">PDF, DOC, DOCX (Max 10MB each)</span>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files) {
                            Array.from(files).forEach((file) => {
                              if (file.size > 10 * 1024 * 1024) {
                                setErrors((prev) => ({
                                  ...prev,
                                  doc: "File size must be less than 10MB",
                                }));
                                return;
                              }
                              handleDocumentUpload(file);
                            });
                          }
                        }}
                        className="hidden"
                        disabled={uploadingFiles}
                      />
                    </label>
                  </div>
                  {errors.doc && (
                    <p className="text-red-500 text-xs mb-2">{errors.doc}</p>
                  )}
                  {formData.documents.length > 0 && (
                    <div className="space-y-2">
                      {formData.documents.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Upload className="w-4 h-4 text-amber-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700 truncate">{doc.split("/").pop()}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveDocument(idx)}
                            className="text-red-600 hover:text-red-700 ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes & Instructions (Optional)
                  </label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    placeholder="Add any notes, instructions, or requirements for attendees"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}

          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{submitError.message}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex-shrink-0 flex gap-3">
          {currentStep > 1 && (
            <Button
              onClick={handlePrevStep}
              variant="outline"
              className="flex-1"
            >
              ← Previous
            </Button>
          )}
          {currentStep < (isPrivate ? 4 : 3) ? (
            <Button
              onClick={handleNextStep}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Next →
            </Button>
          ) : (
            <Button
              onClick={handleCreateEvent}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin">⏳</div>
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Create Event
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
