import { randomUUID } from 'node:crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from '../interfaces';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

  async create(createArtistDto: CreateArtistDto) {
    const newArtist: Artist = {
      ...createArtistDto,
      id: randomUUID(),
    };

    this.artists.push(newArtist);

    return newArtist;
  }

  async findAll() {
    return this.artists;
  }

  async findOne(id: string) {
    const currentArtists = await this.findAll();

    const artist = currentArtists.find((artist) => artist.id === id);

    if (!artist) {
      throw new NotFoundException();
    }

    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const currentArtists = await this.findAll();

    const artist = currentArtists.find((artist) => artist.id === id);

    if (!artist) {
      throw new NotFoundException();
    }

    const artistToReturn: Artist = { ...artist, ...updateArtistDto };

    this.artists = currentArtists.map((artist) => {
      if (artist.id === id) {
        return artistToReturn;
      }

      return artist;
    });

    return artistToReturn;
  }

  async remove(id: string) {
    const currentArtists = await this.findAll();

    const artistToDelete = currentArtists.find((artist) => artist.id === id);

    if (!artistToDelete) {
      throw new NotFoundException();
    }

    this.artists = currentArtists.filter((artist) => artist.id !== id);
  }
}
