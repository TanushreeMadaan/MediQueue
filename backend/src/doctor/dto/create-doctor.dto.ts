export class CreateDoctorDto {
  name: string;
  specialization: string;
  gender: string;
  location: string;
  phone?: string; // Optional field
  email?: string; // Optional field
} 