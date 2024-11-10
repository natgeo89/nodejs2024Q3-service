import { randomUUID } from 'node:crypto';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from '../interfaces';
import { TrackService } from '../track/track.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  private albums: Album[] = [];

  async create(createAlbumDto: CreateAlbumDto) {
    const newAlbum: Album = {
      ...createAlbumDto,
      id: randomUUID(),
    };

    this.albums.push(newAlbum);

    return newAlbum;
  }

  async findAll() {
    return this.albums;
  }

  async findOne(id: string) {
    const currentAlbums = await this.findAll();

    const album = currentAlbums.find((album) => album.id === id);

    if (!album) {
      throw new NotFoundException();
    }

    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const currentAlbums = await this.findAll();

    const album = currentAlbums.find((album) => album.id === id);

    if (!album) {
      throw new NotFoundException();
    }

    const albumToReturn: Album = { ...album, ...updateAlbumDto };

    const updatedAlbums = currentAlbums.map((album) => {
      if (album.id === id) {
        return albumToReturn;
      }

      return album;
    });

    this.setAlbums(updatedAlbums);

    return albumToReturn;
  }

  async remove(albumId: string) {
    const currentAlbums = await this.findAll();

    const albumToDelete = currentAlbums.find((album) => album.id === albumId);

    if (!albumToDelete) {
      throw new NotFoundException();
    }

    const updatedAlbums = currentAlbums.filter((album) => album.id !== albumId);

    this.setAlbums(updatedAlbums);

    const currentTracks = await this.trackService.findAll(); // replace with findMany() where deleted albumId

    const updatedTracks = currentTracks.map((track) => {
      if (track.albumId === albumToDelete.id) {
        return {
          ...track,
          albumId: null,
        };
      }

      return track;
    });

    this.trackService.setTracks(updatedTracks);

    const favAlbums = await this.favoritesService.findAllAlbums();

    const favAlbum = favAlbums.find((album) => album.id === albumId);

    if (favAlbum) {
      const updatedFavAlbums = favAlbums.filter(
        (album) => album.id !== albumId,
      );

      this.favoritesService.setFavAlbums(updatedFavAlbums);
    }
  }

  async setAlbums(albums: Album[]) {
    this.albums = albums;
  }
}
