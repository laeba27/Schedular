"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2, Calendar as CalendarIcon, Briefcase, Sun } from "lucide-react";

import { updateAvailability } from "@/actions/availability";
import { availabilitySchema } from "@/app/lib/validators";
import { timeSlots } from "../data";
import useFetch from "@/hooks/use-fetch";

const DAYS = [
  { label: "Mon", value: "monday", icon: CalendarIcon },
  { label: "Tue", value: "tuesday", icon: CalendarIcon },
  { label: "Wed", value: "wednesday", icon: CalendarIcon },
  { label: "Thu", value: "thursday", icon: CalendarIcon },
  { label: "Fri", value: "friday", icon: CalendarIcon },
  { label: "Sat", value: "saturday", icon: Briefcase },
  { label: "Sun", value: "sunday", icon: Sun },
];

const PRESETS = {
  standard: {
    label: "Standard (9 AM - 5 PM)",
    desc: "Mon-Fri 9:00-17:00, Weekends off",
    data: {
      monday: { isAvailable: true, startTime: "09:00", endTime: "17:00" },
      tuesday: { isAvailable: true, startTime: "09:00", endTime: "17:00" },
      wednesday: { isAvailable: true, startTime: "09:00", endTime: "17:00" },
      thursday: { isAvailable: true, startTime: "09:00", endTime: "17:00" },
      friday: { isAvailable: true, startTime: "09:00", endTime: "17:00" },
      saturday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
      sunday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
    },
  },
  flexible: {
    label: "Flexible (All Week)",
    desc: "All days 10:00-18:00",
    data: {
      monday: { isAvailable: true, startTime: "10:00", endTime: "18:00" },
      tuesday: { isAvailable: true, startTime: "10:00", endTime: "18:00" },
      wednesday: { isAvailable: true, startTime: "10:00", endTime: "18:00" },
      thursday: { isAvailable: true, startTime: "10:00", endTime: "18:00" },
      friday: { isAvailable: true, startTime: "10:00", endTime: "18:00" },
      saturday: { isAvailable: true, startTime: "10:00", endTime: "18:00" },
      sunday: { isAvailable: true, startTime: "10:00", endTime: "18:00" },
    },
  },
  parttime: {
    label: "Part-time (Evenings)",
    desc: "Weekdays 5 PM - 8 PM",
    data: {
      monday: { isAvailable: true, startTime: "17:00", endTime: "20:00" },
      tuesday: { isAvailable: true, startTime: "17:00", endTime: "20:00" },
      wednesday: { isAvailable: true, startTime: "17:00", endTime: "20:00" },
      thursday: { isAvailable: true, startTime: "17:00", endTime: "20:00" },
      friday: { isAvailable: false, startTime: "17:00", endTime: "20:00" },
      saturday: { isAvailable: false, startTime: "17:00", endTime: "20:00" },
      sunday: { isAvailable: false, startTime: "17:00", endTime: "20:00" },
    },
  },
};

export default function AvailabilityForm({ initialData }) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(availabilitySchema),
    defaultValues: { ...initialData },
  });

  const {
    loading,
    error,
    fn: fnupdateAvailability,
  } = useFetch(updateAvailability);

  const onSubmit = async (data) => {
    await fnupdateAvailability(data);
  };

  const applyPreset = (presetKey) => {
    const preset = PRESETS[presetKey];
    Object.entries(preset.data).forEach(([day, settings]) => {
      setValue(`${day}.isAvailable`, settings.isAvailable);
      setValue(`${day}.startTime`, settings.startTime);
      setValue(`${day}.endTime`, settings.endTime);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {/* Presets Section */}
      <div>
        <h3 className="text-xs font-semibold text-gray-600 mb-2">Quick Presets</h3>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              type="button"
              onClick={() => applyPreset(key)}
              className="p-2 border border-gray-200 rounded text-left hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <p className="font-medium text-gray-900 text-xs">
                {preset.label.split(" ")[0]}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Section */}
      <div>
        <h3 className="text-xs font-semibold text-gray-700 mb-2">Schedule</h3>
        <div className="space-y-2">
          {DAYS.map((day) => {
            const isAvailable = watch(`${day.value}.isAvailable`);
            const DayIcon = day.icon;

            return (
              <div
                key={day.value}
                className={`p-2 border rounded transition-all flex items-center gap-2 ${
                  isAvailable
                    ? "border-blue-200 bg-blue-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                {/* Day Checkbox */}
                <Controller
                  name={`${day.value}.isAvailable`}
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        setValue(`${day.value}.isAvailable`, checked);
                        if (!checked) {
                          setValue(`${day.value}.startTime`, "09:00");
                          setValue(`${day.value}.endTime`, "17:00");
                        }
                      }}
                    />
                  )}
                />

                {/* Day Label */}
                <div className="flex items-center gap-1 w-12">
                  <DayIcon className="w-3 h-3 text-gray-500" />
                  <span className="text-xs font-medium text-gray-700 w-8">{day.label}</span>
                </div>

                {/* Time Selection */}
                {isAvailable && (
                  <div className="flex items-center gap-1 flex-1">
                    <Controller
                      name={`${day.value}.startTime`}
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="h-7 text-xs w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <span className="text-xs text-gray-500">-</span>
                    <Controller
                      name={`${day.value}.endTime`}
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="h-7 text-xs w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Time Gap Section */}
      <div>
        <h3 className="text-xs font-semibold text-gray-700 mb-2">Buffer (min)</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            {...register("timeGap", {
              valueAsNumber: true,
            })}
            className="w-16 h-7 text-xs"
            min="0"
            max="480"
          />
          {errors.timeGap && (
            <span className="text-red-500 text-xs">
              {errors.timeGap.message}
            </span>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded flex gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-700">{error?.message}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-8 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 text-sm"
        >
          {loading ? (
            <>
              <div className="animate-spin">⏳</div>
              Saving...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3 h-3" />
              Save
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
