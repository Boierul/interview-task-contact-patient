import {
  DetailedPatientDto,
  ListPatientDto,
  QueryPatientsDto,
  UpdatePatientDto,
} from '@contact-patient/dtos';
import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { PatientService } from '../modules/dal/patient';

@Controller('api/v1/patients')
export class PatientsController {
  constructor(private readonly patientService: PatientService) {}


  // Get all patients
  /* ------------------------------------------------------------------------------------------ */

  @ApiQuery({ name: 'contacted', required: true, type: Boolean })
  @ApiOkResponse({
    description: 'Returns a list of patients',
    isArray: true,
    type: ListPatientDto,
  })
  @Get()
  async find(@Query() query: QueryPatientsDto): Promise<ListPatientDto[]> {
    return this.patientService.find(query.contacted);
  }

  // Get all patients count /or/ count of patients that have been contacted or not
  /* ------------------------------------------------------------------------------------------ */

  @ApiQuery({ name: 'contacted', required: false, type: Boolean })
  @ApiOkResponse({
    description: 'Returns the count of all patients or those that have been contacted/not contacted',
    type: Number,
  })
  @Get('stats/count')
  async count(@Query('contacted') contacted?: string): Promise<number> {
    const parsedContacted =
      contacted !== undefined
        ? contacted === 'true'
        : undefined;
    return this.patientService.count(parsedContacted);
  }

  // Get one patient
  /* ------------------------------------------------------------------------------------------ */

  @ApiOkResponse({
    description: 'Returns details of a patient',
    type: DetailedPatientDto,
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<DetailedPatientDto> {
    return this.patientService.findOne(id);
  }


  // Update patient's info
  /* ------------------------------------------------------------------------------------------ */

  @ApiOkResponse({
    description:
      'Patches a patient. Returns the updated patient. Only the fields that are provided will be updated.',
    type: DetailedPatientDto,
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdatePatientDto
  ): Promise<DetailedPatientDto> {
    return this.patientService.update(id, data);
  }
}
