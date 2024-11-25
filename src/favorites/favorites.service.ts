import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const favArtists = await this.prisma.favoriteArtist.findMany({
      select: { artist: true },
    });

    const favAlbums = await this.prisma.favoriteAlbum.findMany({
      select: { album: true },
    });

    const favTracks = await this.prisma.favoriteTrack.findMany({
      select: { track: true },
    });

    return {
      artists: favArtists.map(({ artist }) => artist),
      albums: favAlbums.map(({ album }) => album),
      tracks: favTracks.map(({ track }) => track),
    };
  }

  async addTrack(trackId: string) {
    const trackToFav = await this.prisma.track.findUnique({
      where: { id: trackId },
    });

    if (!trackToFav) {
      throw new UnprocessableEntityException(
        `Track with id: ${trackId} doesn't exist`,
      );
    }

    await this.prisma.favoriteTrack.create({
      data: { trackId: trackId },
    });
  }

  async removeTrack(trackId: string) {
    const currentFavs = await this.findAll();
    const trackToRemove = currentFavs.tracks.find(
      (track) => track.id === trackId,
    );

    if (!trackToRemove) {
      throw new NotFoundException();
    }

    await this.prisma.favoriteTrack.delete({
      where: { trackId },
    });
  }

  async addAlbum(albumId: string) {
    const albumPrisma = await this.prisma.album.findUnique({
      where: { id: albumId },
    });

    if (!albumPrisma) {
      throw new UnprocessableEntityException(
        `Album with id: ${albumId} doesn't exist`,
      );
    }

    await this.prisma.favoriteAlbum.create({
      data: { albumId: albumId },
    });
  }

  async removeAlbum(albumId: string) {
    const currentFavs = await this.findAll();
    const albumToRemove = currentFavs.albums.find(
      (album) => album.id === albumId,
    );

    if (!albumToRemove) {
      throw new NotFoundException();
    }

    await this.prisma.favoriteAlbum.delete({
      where: { albumId },
    });
  }

  async addArtist(artistId: string) {
    const artistPrisma = await this.prisma.artist.findUnique({
      where: { id: artistId },
    });

    if (!artistPrisma) {
      throw new UnprocessableEntityException(
        `Album with id: ${artistId} doesn't exist`,
      );
    }

    await this.prisma.favoriteArtist.create({
      data: { artistId: artistId },
    });
  }

  async removeArtist(artistId: string) {
    const currentFavs = await this.findAll();
    const artistToRemove = currentFavs.artists.find(
      (artist) => artist.id === artistId,
    );

    if (!artistToRemove) {
      throw new NotFoundException();
    }

    await this.prisma.favoriteArtist.delete({
      where: { artistId },
    });
  }
}
