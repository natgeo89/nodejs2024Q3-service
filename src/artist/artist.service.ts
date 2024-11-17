import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { FavoritesService } from '../favorites/favorites.service';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ArtistService {
  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    private readonly prisma: PrismaService,
  ) {}

  async create(createArtistDto: CreateArtistDto) {
    const prismaCreatedArtist = await this.prisma.artist.create({
      data: createArtistDto,
    });

    return prismaCreatedArtist;
  }

  async findAll() {
    const artistsPrisma = await this.prisma.artist.findMany();
    return artistsPrisma;
  }

  async findOne(id: string) {
    const artistPrisma = await this.prisma.artist.findUnique({
      where: { id: id },
    });

    if (!artistPrisma) {
      throw new NotFoundException();
    }

    return artistPrisma;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artistPrisma = await this.prisma.artist.findUnique({
      where: { id: id },
    });

    if (!artistPrisma) {
      throw new NotFoundException();
    }

    const updatedArtistPrisma = await this.prisma.artist.update({
      data: updateArtistDto,
      where: {
        id: id,
      },
    });

    return updatedArtistPrisma;
  }

  async remove(artistId: string) {
    const artistToDelete = await this.findOne(artistId);

    if (!artistToDelete) {
      throw new NotFoundException();
    }

    await this.prisma.artist.delete({
      where: {
        id: artistToDelete.id,
      },
    });

    const favArtists = await this.favoritesService.findAllArtists();

    const favArtist = favArtists.find((artist) => artist.id === artistId);

    if (favArtist) {
      const updatedFavArtists = favArtists.filter(
        (artist) => artist.id !== artistId,
      );

      this.favoritesService.setFavArtists(updatedFavArtists);
    }
  }
}
