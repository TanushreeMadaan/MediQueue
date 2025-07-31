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
import { PatientService } from './patient.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePatientDto, UpdatePatientDto } from './dto';

@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientController{
    constructor(private readonly patientService: PatientService){}

    @Post()
    create(@Body(ValidationPipe) createPatientDto: CreatePatientDto){
        return this.patientService.create(createPatientDto);
    }

    @Get()
    findAll(){
        return this.patientService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.patientService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body(ValidationPipe) updatePatientDto: UpdatePatientDto,
    ) {
        return this.patientService.update(id, updatePatientDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.patientService.remove(id);
    }
}

