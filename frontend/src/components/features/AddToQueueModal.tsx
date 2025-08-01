"use client";

import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { useApi, useMutation } from "@/hooks/useApi";
import { patientApi, queueApi, doctorApi } from "@/lib/api";
import type { Patient, Doctor } from "@/lib/types";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import PatientForm from "../forms/PatientForm";

interface QueueFormData {
  patient_id: number | null;
  doctor_id: number | null;
}

const customSelectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: "var(--bg-input, #fff)",
    borderColor: state.isFocused
      ? "var(--border-focus, #3b82f6)"
      : "var(--border-default, #d1d5db)",
    boxShadow: state.isFocused
      ? "0 0 0 1px var(--border-focus, #3b82f6)"
      : "none",
    "&:hover": { borderColor: "var(--border-focus, #3b82f6)" },
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: "var(--bg-menu, #fff)",
    zIndex: 9999,
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "var(--bg-selected, #3b82f6)"
      : state.isFocused
      ? "var(--bg-focused, #f3f4f6)"
      : "transparent",
    color: state.isSelected ? "#fff" : "var(--text-default, #111827)",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "var(--text-default, #111827)",
  }),
  input: (provided: any) => ({
    ...provided,
    color: "var(--text-default, #111827)",
  }),
};

export default function AddToQueueModal({ isOpen, onClose, onSuccess }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewPatient, setIsNewPatient] = useState(false);
  const { data: patients } = useApi(patientApi.getAll);
  const { data: doctors } = useApi(doctorApi.getAll);

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<QueueFormData>({
    defaultValues: { patient_id: null, doctor_id: null },
  });

  const { mutate: addToQueue, loading } = useMutation(
    (params: { patientId: number; doctorId?: number }) =>
      queueApi.add(params.patientId, params.doctorId)
  );

  const onSubmit = async (data: QueueFormData) => {
    if (!data.patient_id) return;
    try {
      await addToQueue({
        patientId: data.patient_id,
        doctorId: data.doctor_id || undefined,
      });
      onSuccess();
    } catch (err) {
      console.error("Failed to add to queue:", err);
    }
  };

  const handleNewPatientSuccess = (newPatient: Patient) => {
    addToQueue({ patientId: newPatient.id });
    onSuccess();
  };

  const patientOptions = useMemo(
    () =>
      patients?.map((p) => ({
        value: p.id,
        label: `${p.name} - ${p.phone}`,
      })) || [],
    [patients]
  );

  const doctorOptions = useMemo(
    () =>
      doctors
        ?.filter((d) => d.is_available)
        .map((d) => ({ value: d.id, label: d.name })) || [],
    [doctors]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Patient to Queue">
      <style>{`:root { --bg-input: #fff; --border-default: #d1d5db; --border-focus: #3b82f6; --text-default: #111827; --bg-menu: #fff; --bg-focused: #f3f4f6; --bg-selected: #3b82f6; } .dark { --bg-input: #1f2937; --border-default: #4b5563; --border-focus: #60a5fa; --text-default: #f9fafb; --bg-menu: #1f2937; --bg-focused: #374151; }`}</style>
      {isNewPatient ? (
        <PatientForm
          onSuccess={handleNewPatientSuccess}
          onCancel={() => setIsNewPatient(false)}
        />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <fieldset disabled={loading}>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                Search Existing Patient *
              </label>
              <Controller
                name="patient_id"
                control={control}
                rules={{ required: "Please select a patient" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={patientOptions}
                    value={patientOptions.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(option) => field.onChange(option?.value || null)}
                    placeholder="Type to search for a patient..."
                    styles={customSelectStyles}
                    isClearable
                  />
                )}
              />
              {errors.patient_id && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.patient_id.message}
                </p>
              )}
            </div>

            <div className="text-center my-2">
              <span className="text-sm text-gray-500">OR</span>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full mb-6"
              onClick={() => setIsNewPatient(true)}
            >
              Register a New Patient
            </Button>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                Assign Doctor (Optional)
              </label>
              <Controller
                name="doctor_id"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={doctorOptions}
                    value={doctorOptions.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(option) => field.onChange(option?.value || null)}
                    placeholder="Assign later..."
                    styles={customSelectStyles}
                    isClearable
                  />
                )}
              />
            </div>
          </fieldset>
          <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-800">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Add to Queue
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
