"use client";

import { useState, useMemo, useCallback } from "react";
import { useApi, useMutation } from "@/hooks/useApi";
import { appointmentApi, doctorApi } from "@/lib/api";
import type { Appointment, Doctor, UpdateAppointmentDto } from "@/lib/types";
import { format, parseISO, isSameDay, getHours } from "date-fns";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AppointmentListItem from "./AppointmentListItem";
import AppointmentForm from "../forms/AppointmentForm";
import AppointmentRescheduleModal from "./AppointmentRescheduleModal";
import { Plus } from "lucide-react";

export default function AppointmentCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDoctorId, setSelectedDoctorId] = useState("all");
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  const [reschedulingAppointment, setReschedulingAppointment] =
    useState<Appointment | null>(null);

  const {
    data: appointments,
    loading: appointmentsLoading,
    refetch: refetchAppointments,
  } = useApi(useCallback(() => appointmentApi.getAll(), []));
  const { data: doctors, loading: doctorsLoading } = useApi(doctorApi.getAll);

  const { mutate: updateAppointment } = useMutation(
    (params: { id: number; data: UpdateAppointmentDto }) =>
      appointmentApi.update(params.id, params.data)
  );

  const handleUpdateStatus = async (
    id: number,
    status: "completed" | "cancelled" | "no_show"
  ) => {
    await updateAppointment({ id, data: { status } });
    refetchAppointments();
  };

  const handleRescheduleSuccess = () => {
    setReschedulingAppointment(null);
    refetchAppointments();
  };

  const filteredAppointments = useMemo(() => {
    return (appointments || [])
      .filter(
        (app) =>
          isSameDay(parseISO(app.appointment_date), selectedDate) &&
          (selectedDoctorId === "all" ||
            app.doctor_id === Number(selectedDoctorId))
      )
      .sort(
        (a, b) =>
          new Date(a.appointment_date).getTime() -
          new Date(b.appointment_date).getTime()
      );
  }, [appointments, selectedDate, selectedDoctorId]);

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      slots.push({ time: `${hour}:00`, hour });
      slots.push({ time: `${hour}:30`, hour });
    }
    const bookedHours = new Set(
      filteredAppointments.map((app) =>
        getHours(parseISO(app.appointment_date))
      )
    );
    return slots.map((slot) => ({
      ...slot,
      booked: bookedHours.has(slot.hour),
    }));
  }, [filteredAppointments]);

  const isLoading = appointmentsLoading || doctorsLoading;
  if (isLoading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            type="date"
            value={format(selectedDate, "yyyy-MM-dd")}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          />
          <Select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
          >
            <option value="all">All Doctors</option>
            {doctors?.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </Select>
        </div>
        <Button onClick={() => setBookingModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Book Appointment
        </Button>
      </div>

      {/* Time Slots Grid */}
      <div className="bg-white rounded-lg shadow-sm border dark:bg-gray-900 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Schedule for {format(selectedDate, "MMMM dd, yyyy")}
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-2">
          {timeSlots.map((slot) => (
            <div
              key={slot.time}
              className={`p-3 rounded-lg border text-center text-sm ${
                slot.booked
                  ? "bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 cursor-not-allowed"
                  : "bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-800 text-green-800 dark:text-green-400"
              }`}
            >
              {slot.time}
            </div>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-sm border dark:bg-gray-900 dark:border-gray-800">
        <div className="px-6 py-4 border-b dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {filteredAppointments.length} Appointments Scheduled
          </h3>
        </div>
        {filteredAppointments.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredAppointments.map((app) => (
              <AppointmentListItem
                key={app.id}
                appointment={app}
                onUpdateStatus={handleUpdateStatus}
                onReschedule={setReschedulingAppointment} // 4. Pass the handler to open the modal
              />
            ))}
          </div>
        ) : (
          <p className="p-8 text-center text-gray-500 dark:text-gray-400">
            No appointments for this day/doctor.
          </p>
        )}
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        title="Book New Appointment"
      >
        <AppointmentForm
          onSuccess={() => {
            setBookingModalOpen(false);
            refetchAppointments();
          }}
          onCancel={() => setBookingModalOpen(false)}
        />
      </Modal>
      {/* Rechedule modal */}
      <AppointmentRescheduleModal
        appointment={reschedulingAppointment}
        isOpen={!!reschedulingAppointment}
        onClose={() => setReschedulingAppointment(null)}
        onSuccess={handleRescheduleSuccess}
      />
    </div>
  );
}
