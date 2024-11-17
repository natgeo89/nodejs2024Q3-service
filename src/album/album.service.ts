import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { TrackService } from '../track/track.service';
import { FavoritesService } from '../favorites/favorites.service';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    private readonly prisma: PrismaService,
  ) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const prismaCreatedArtist = await this.prisma.album.create({
      data: createAlbumDto,
    });

    return prismaCreatedArtist;
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

    const updatedArtistPrisma = await this.prisma.album.update({
      data: updateAlbumDto,
      where: {
        id: id,
      },
    });

    return updatedArtistPrisma;
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

    // const currentTracks = await this.trackService.findAll(); // replace with findMany() where deleted albumId

    // const updatedTracks = currentTracks.map((track) => {
    //   if (track.albumId === albumToDelete.id) {
    //     return {
    //       ...track,
    //       albumId: null,
    //     };
    //   }

    //   return track;
    // });

    // this.trackService.setTracks(updatedTracks);

    // const favAlbums = await this.favoritesService.findAllAlbums();

    // const favAlbum = favAlbums.find((album) => album.id === albumId);

    // if (favAlbum) {
    //   const updatedFavAlbums = favAlbums.filter(
    //     (album) => album.id !== albumId,
    //   );

    //   this.favoritesService.setFavAlbums(updatedFavAlbums);
    // }
  }
}
