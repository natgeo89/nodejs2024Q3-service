import { randomUUID } from 'node:crypto';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from '../interfaces';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class ArtistService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

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

    const updatedArtists = currentArtists.map((artist) => {
      if (artist.id === id) {
        return artistToReturn;
      }

      return artist;
    });

    this.setArtists(updatedArtists);

    return artistToReturn;
  }

  async remove(artistId: string) {
    const currentArtists = await this.findAll();

    const artistToDelete = currentArtists.find(
      (artist) => artist.id === artistId,
    );

    if (!artistToDelete) {
      throw new NotFoundException();
    }

    const updatedArtists = currentArtists.filter(
      (artist) => artist.id !== artistId,
    );

    this.setArtists(updatedArtists);

    const currentTracks = await this.trackService.findAll(); // replace with findMany() where deleted artistId

    const updatedTracks = currentTracks.map((track) => {
      if (track.artistId === artistToDelete.id) {
        return {
          ...track,
          artistId: null,
        };
      }

      return track;
    });

    this.trackService.setTracks(updatedTracks);

    const currentAlbums = await this.albumService.findAll(); // replace with findMany() where deleted artistId

    const updatedAlbums = currentAlbums.map((track) => {
      if (track.artistId === artistToDelete.id) {
        return {
          ...track,
          artistId: null,
        };
      }

      return track;
    });

    this.albumService.setAlbums(updatedAlbums);

    const favArtists = await this.favoritesService.findAllArtists();

    const favArtist = favArtists.find((artist) => artist.id === artistId);

    if (favArtist) {
      const updatedFavArtists = favArtists.filter(
        (artist) => artist.id !== artistId,
      );

      this.favoritesService.setFavArtists(updatedFavArtists);
    }
  }

  async setArtists(artists: Artist[]) {
    this.artists = artists;
  }
}
