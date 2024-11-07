import { randomUUID } from 'node:crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from '../interfaces';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];

  async create(createTrackDto: CreateTrackDto) {
    const newTrack: Track = {
      ...createTrackDto,
      id: randomUUID(),
    };

    this.tracks.push(newTrack);

    return newTrack;
  }

  async findAll() {
    return this.tracks;
  }

  async findOne(id: string) {
    const currentTracks = await this.findAll();

    const track = currentTracks.find((track) => track.id === id);

    if (!track) {
      throw new NotFoundException();
    }

    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const currentTracks = await this.findAll();

    const track = currentTracks.find((track) => track.id === id);

    if (!track) {
      throw new NotFoundException();
    }

    const trackToReturn: Track = { ...track, ...updateTrackDto };

    this.tracks = currentTracks.map((track) => {
      if (track.id === id) {
        return trackToReturn;
      }

      return track;
    });

    return trackToReturn;
  }

  async remove(id: string) {
    const currentTracks = await this.findAll();

    const trackToDelete = currentTracks.find((track) => track.id === id);

    if (!trackToDelete) {
      throw new NotFoundException();
    }

    this.tracks = currentTracks.filter((track) => track.id !== id);
  }
}
