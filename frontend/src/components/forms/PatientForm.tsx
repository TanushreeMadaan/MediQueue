'use client';

import { useForm } from 'react-hook-form';
import { useMutation } from '@/hooks/useApi';
import { patientApi } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/TextArea';
import type { Patient, CreatePatientDto } from '@/lib/types';

interface PatientFormProps {
  patient?: Patient; 
  onSuccess: (patient: Patient) => void;
  onCancel: () => void;
}

export default function PatientForm({ patient, onSuccess, onCancel }: PatientFormProps) {
  const { mutate: savePatient, loading, error } = useMutation(
    (data: CreatePatientDto) => 
      patient ? patientApi.update(patient.id, data) : patientApi.create(data)
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePatientDto>({
    defaultValues: patient || {},
  });

  const onSubmit = async (data: CreatePatientDto) => {
    try {
      const result = await savePatient(data);
      if (result) {
        onSuccess(result);
      }
    } catch (err) {
      console.error('Failed to save patient:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg text-sm dark:bg-red-900/50 dark:text-red-300 dark:border-red-700">
          {error}
        </div>
      )}

      <fieldset disabled={loading} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Full Name *</label>
            <Input {...register('name', { required: 'Name is required' })} placeholder="Enter full name" />
            {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>}
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Phone Number *</label>
            <Input {...register('phone', { required: 'Phone number is required' })} placeholder="Enter phone number" />
            {errors.phone && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Email Address</label>
            <Input type="email" {...register('email')} placeholder="Enter email address" />
          </div>

          {/* Gender Field */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Gender</label>
            <Select {...register('gender')}>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>
          </div>

          {/* Date of Birth Field */}
          <div>
            <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Date of Birth</label>
            <Input type="date" {...register('date_of_birth')} />
          </div>
        </div>

        {/* Address Field */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Address</label>
          <Textarea {...register('address')} rows={3} placeholder="Enter address" />
        </div>
      </fieldset>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {patient ? 'Update Patient' : 'Add Patient'}
        </Button>
      </div>
    </form>
  );
}
