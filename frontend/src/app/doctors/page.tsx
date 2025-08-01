'use client';

import { useState, useMemo, useCallback } from 'react';
import { useApi, useMutation } from '@/hooks/useApi';
import { doctorApi } from '@/lib/api';
import type { Doctor, UpdateDoctorDto } from '@/lib/types';

import Layout from '@/components/layout/Layout';
import DoctorCard from '@/components/features/DoctorCard';
import DoctorForm from '@/components/forms/DoctorForm';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Plus, Search } from 'lucide-react';

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('all'); // 'all', 'available', 'unavailable'
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  const { data: doctors, loading, error, refetch } = useApi(
    useCallback(() => doctorApi.getAll(), [])
  );

  const { mutate: updateDoctor } = useMutation(
    (params: { id: number; data: UpdateDoctorDto }) => doctorApi.update(params.id, params.data)
  );
  const { mutate: deleteDoctor } = useMutation((id: number) => doctorApi.delete(id));

  const handleUpdateAvailability = async (doctor: Doctor, is_available: boolean) => {
    await updateDoctor({ id: doctor.id, data: { is_available } });
    refetch();
  };

  const handleDelete = async (doctor: Doctor) => {
    await deleteDoctor(doctor.id);
    refetch();
  };

  const onFormSuccess = () => {
    setEditingDoctor(null);
    setAddModalOpen(false);
    refetch();
  };

  const filteredDoctors = useMemo(() => {
    return (doctors || []).filter(doctor => {
      const lowerCaseSearch = searchTerm.toLowerCase();
      
      const matchesSearch =
        doctor.name.toLowerCase().includes(lowerCaseSearch) ||
        doctor.specialization.toLowerCase().includes(lowerCaseSearch) ||
        doctor.location.toLowerCase().includes(lowerCaseSearch);

      const matchesSpecialization = filterSpecialization === 'all' || doctor.specialization === filterSpecialization;

      const matchesAvailability =
        filterAvailability === 'all' ||
        (filterAvailability === 'available' && doctor.is_available) ||
        (filterAvailability === 'unavailable' && !doctor.is_available);
      
      return matchesSearch && matchesSpecialization && matchesAvailability;
    });
  }, [doctors, searchTerm, filterSpecialization, filterAvailability]); 

  const specializations = useMemo(() => 
    [...new Set((doctors || []).map(doctor => doctor.specialization))], 
    [doctors]
  );

  if (loading) return <Layout><LoadingSpinner fullscreen /></Layout>;
  if (error) return <Layout><div className="text-red-500">Error loading doctors: {error}</div></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header and Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            {/* 3. Update the search placeholder text */}
            <Input
              type="text"
              placeholder="Search by name, specialization, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-4">
            <Select value={filterAvailability} onChange={(e) => setFilterAvailability(e.target.value)}>
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </Select>

            {/* <Select value={filterSpecialization} onChange={(e) => setFilterSpecialization(e.target.value)}>
              <option value="all">All Specializations</option>
              {specializations.map(spec => <option key={spec} value={spec}>{spec}</option>)}
            </Select> */}
            <Button className="w-45 px-3 py-3 test-sm" onClick={() => setAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDoctors.map(doctor => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onEdit={() => setEditingDoctor(doctor)}
              onDelete={handleDelete}
              onUpdateAvailability={handleUpdateAvailability}
            />
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <h3 className="text-xl font-semibold">No Doctors Found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      <Modal isOpen={isAddModalOpen || !!editingDoctor} onClose={() => { setAddModalOpen(false); setEditingDoctor(null); }} title={editingDoctor ? 'Edit Doctor Profile' : 'Add New Doctor'}>
        <DoctorForm doctor={editingDoctor || undefined} onSuccess={onFormSuccess} onCancel={() => { setAddModalOpen(false); setEditingDoctor(null); }} />
      </Modal>
    </Layout>
  );
}
