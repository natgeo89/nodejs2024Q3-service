import { randomUUID } from 'node:crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from '../interfaces';
import { TrackService } from '../track/track.service';

@Injectable()
export class AlbumService {
  constructor(private readonly trackService: TrackService) {}

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

    this.albums = currentAlbums.map((album) => {
      if (album.id === id) {
        return albumToReturn;
      }

      return album;
    });

    return albumToReturn;
  }

  async remove(id: string) {
    const currentAlbums = await this.findAll();

    const albumToDelete = currentAlbums.find((album) => album.id === id);

    if (!albumToDelete) {
      throw new NotFoundException();
    }

    this.albums = currentAlbums.filter((album) => album.id !== id);

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

    this.trackService.set(updatedTracks);
  }
}
