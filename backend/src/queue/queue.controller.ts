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
import { QueueService } from './queue.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QueueStatus } from '../entities/queue.entity';

@Controller('queue')
@UseGuards(JwtAuthGuard)
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post('add')
  addToQueue(
    @Body(ValidationPipe) addToQueueDto: { patientId: number; doctorId?: number }) {
    return this.queueService.addToQueue(addToQueueDto.patientId, addToQueueDto.doctorId);
  }

  @Get()
  findAll(@Query('status') status?: QueueStatus) {
    if (status) {
      return this.queueService.getQueueByStatus(status);
    }
    return this.queueService.findAll();
  }

  @Get('current')
  getCurrentQueue() {
    return this.queueService.getCurrentQueue();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.queueService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateStatusDto: { status: QueueStatus; doctorId?: number }
  ) {
    return this.queueService.updateStatus(id, updateStatusDto.status, updateStatusDto.doctorId);
  }

  @Delete(':id')
  removeFromQueue(@Param('id', ParseIntPipe) id: number) {
    return this.queueService.removeFromQueue(id);
  }
} 