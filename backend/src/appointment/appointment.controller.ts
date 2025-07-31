import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  ValidationPipe,
  ParseIntPipe,
  Query
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AppointmentStatus } from '../entities/appointment.entity';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  create(@Body(ValidationPipe) createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  @Get()
  findAll(
    @Query('patientId') patientId?: string,
    @Query('doctorId') doctorId?: string,
    @Query('status') status?: AppointmentStatus,
  ) {
    if (patientId) {
      return this.appointmentService.findByPatient(parseInt(patientId));
    }
    if (doctorId) {
      return this.appointmentService.findByDoctor(parseInt(doctorId));
    }
    if (status) {
      return this.appointmentService.findByStatus(status);
    }
    return this.appointmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.update(id, updateAppointmentDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateStatusDto: { status: AppointmentStatus },
  ) {
    return this.appointmentService.updateStatus(id, updateStatusDto.status);
  }

  @Patch(':id/cancel')
  cancelAppointment(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentService.updateStatus(id, AppointmentStatus.CANCELLED);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentService.remove(id);
  }
}