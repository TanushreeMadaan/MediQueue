'use client';

import { useState, useMemo, useCallback } from 'react';
import { useApi, useMutation } from '@/hooks/useApi';
import { patientApi } from '@/lib/api';
import type { Patient } from '@/lib/types';
import { format } from 'date-fns';

import Layout from '@/components/layout/Layout';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import PatientForm from '../forms/PatientForm';
import { Plus, Search, User, Phone, Mail, Edit, Trash2 } from 'lucide-react';

export default function PatientList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  const { data: patients, loading, error, refetch } = useApi(
    useCallback(() => patientApi.getAll(), [])
  );

  const { mutate: deletePatient } = useMutation((id: number) => patientApi.delete(id));

  const handleDelete = async (patient: Patient) => {
    if (window.confirm(`Are you sure you want to delete ${patient.name}?`)) {
      await deletePatient(patient.id);
      refetch();
    }
  };

  const onFormSuccess = () => {
    setEditingPatient(null);
    setAddModalOpen(false);
    refetch();
  };

  const filteredPatients = useMemo(() => {
    return (patients || []).filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm)
    );
  }, [patients, searchTerm]);

  if (loading) return <LoadingSpinner fullscreen />;
  if (error) return <div className="text-red-500">Error loading patients: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Patient
        </Button>
      </div>

      {/* Patients Table / List */}
      <div className="bg-white rounded-lg shadow-sm border dark:bg-gray-900 dark:border-gray-800">
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {filteredPatients.map(patient => (
            <div key={patient.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{patient.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{patient.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                {patient.email && <p className="hidden md:block">{patient.email}</p>}
                <p className="hidden lg:block">Joined: {format(new Date(patient.created_at), 'dd MMM yyyy')}</p>
                <div className="flex gap-2">
                   <Button size="sm" variant="outline" onClick={() => setEditingPatient(patient)}><Edit className="h-4 w-4" /></Button>
                   <Button size="sm" variant="danger" onClick={() => handleDelete(patient)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredPatients.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <h3 className="text-xl font-semibold">No Patients Found</h3>
            <p>Add a new patient or adjust your search term.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingPatient}
        onClose={() => { setAddModalOpen(false); setEditingPatient(null); }}
        title={editingPatient ? 'Edit Patient Information' : 'Register New Patient'}
      >
        <PatientForm
          patient={editingPatient || undefined}
          onSuccess={onFormSuccess}
          onCancel={() => { setAddModalOpen(false); setEditingPatient(null); }}
        />
      </Modal>
    </div>
  );
}
