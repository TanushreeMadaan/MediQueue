export class CreatePatientDto {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    date_of_birth?: Date;
    gender?: string;
}