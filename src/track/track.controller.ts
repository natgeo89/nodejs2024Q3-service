import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
  ValidationPipe,
  HttpCode,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  async create(@Body(new ValidationPipe()) createTrackDto: CreateTrackDto) {
    return await this.trackService.create(createTrackDto);
  }

  @Get()
  async findAll() {
    return await this.trackService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.trackService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe()) updateTrackDto: UpdateTrackDto,
  ) {
    return await this.trackService.update(id, updateTrackDto);
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.trackService.remove(id);
  }
}
