import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class TrackService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTrackDto: CreateTrackDto) {
    const prismaCreatedTrack = await this.prisma.track.create({
      data: createTrackDto,
    });

    return prismaCreatedTrack;
  }

  async findAll() {
    const tracksPrisma = await this.prisma.track.findMany();
    return tracksPrisma;
  }

  async findOne(id: string) {
    const trackPrisma = await this.prisma.track.findUnique({
      where: { id: id },
    });

    if (!trackPrisma) {
      throw new NotFoundException();
    }

    return trackPrisma;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const trackPrisma = await this.prisma.track.findUnique({
      where: { id: id },
    });

    if (!trackPrisma) {
      throw new NotFoundException();
    }

    const updatedTrackPrisma = await this.prisma.track.update({
      data: updateTrackDto,
      where: {
        id: id,
      },
    });

    return updatedTrackPrisma;
  }

  async remove(trackId: string) {
    const trackToDelete = await this.findOne(trackId);

    if (!trackToDelete) {
      throw new NotFoundException();
    }

    await this.prisma.track.delete({
      where: {
        id: trackToDelete.id,
      },
    });
  }
}
