import { randomUUID } from 'node:crypto';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from '../interfaces';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class TrackService {
  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

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

    const updatedTracks = currentTracks.map((track) => {
      if (track.id === id) {
        return trackToReturn;
      }

      return track;
    });

    this.setTracks(updatedTracks);

    return trackToReturn;
  }

  async remove(trackId: string) {
    const currentTracks = await this.findAll();

    const trackToDelete = currentTracks.find((track) => track.id === trackId);

    if (!trackToDelete) {
      throw new NotFoundException();
    }

    const updatedTracks = currentTracks.filter((track) => track.id !== trackId);

    this.setTracks(updatedTracks);

    const favTracks = await this.favoritesService.findAllTracks();

    const favTrack = favTracks.find((track) => track.id === trackId);

    if (favTrack) {
      const updatedFavTracks = favTracks.filter(
        (track) => track.id !== trackId,
      );

      this.favoritesService.setFavTracks(updatedFavTracks);
    }
  }

  async setTracks(tracks: Track[]) {
    this.tracks = tracks;
  }
}
