import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const prismaCreatedAlbum = await this.prisma.album.create({
      data: createAlbumDto,
    });

    return prismaCreatedAlbum;
  }

  async findAll() {
    const albumsPrisma = await this.prisma.album.findMany();
    return albumsPrisma;
  }

  async findOne(id: string) {
    const albumPrisma = await this.prisma.album.findUnique({
      where: { id: id },
    });

    if (!albumPrisma) {
      throw new NotFoundException();
    }

    return albumPrisma;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const albumPrisma = await this.prisma.album.findUnique({
      where: { id: id },
    });

    if (!albumPrisma) {
      throw new NotFoundException();
    }

    const updatedAlbumPrisma = await this.prisma.album.update({
      data: updateAlbumDto,
      where: {
        id: id,
      },
    });

    return updatedAlbumPrisma;
  }

  async remove(albumId: string) {
    const albumToDelete = await this.findOne(albumId);

    if (!albumToDelete) {
      throw new NotFoundException();
    }

    await this.prisma.album.delete({
      where: {
        id: albumToDelete.id,
      },
    });
  }
}
