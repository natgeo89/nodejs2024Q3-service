import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Album, Artist, Favorites, Track } from '../interfaces';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
  ) {}

  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  async findAll() {
    return await this.favorites;
  }

  async setFavArtists(newArtists: Artist[]) {
    this.favorites.artists = newArtists;
  }

  async setFavAlbums(newAlbums: Album[]) {
    this.favorites.albums = newAlbums;
  }

  async setFavTracks(newTracks: Track[]) {
    this.favorites.tracks = newTracks;
  }

  async addTrack(trackId: string) {
    const currentTracks = await this.trackService.findAll(); // replace with findMany() where deleted trackId

    const trackToFav = currentTracks.find((track) => track.id === trackId);

    if (!trackToFav) {
      throw new UnprocessableEntityException(
        `Track with id: ${trackId} doesn't exist`,
      );
    }

    this.favorites.tracks.push(trackToFav);
  }

  async removeTrack(trackId: string) {
    const currentFavs = await this.findAll();

    const trackToRemove = currentFavs.tracks.find(
      (track) => track.id === trackId,
    );

    if (!trackToRemove) {
      throw new NotFoundException();
    }

    const updatedFavTracks = currentFavs.tracks.filter(
      (track) => track.id !== trackId,
    );

    this.setFavTracks(updatedFavTracks);
  }

  async addAlbum(albumId: string) {
    const currentAlbums = await this.albumService.findAll(); // replace with findMany() where deleted albumId

    const albumToFav = currentAlbums.find((album) => album.id === albumId);

    if (!albumToFav) {
      throw new UnprocessableEntityException(
        `Album with id: ${albumId} doesn't exist`,
      );
    }

    this.favorites.albums.push(albumToFav);
  }

  async removeAlbum(albumId: string) {
    const currentFavs = await this.findAll();

    const albumToRemove = currentFavs.albums.find(
      (album) => album.id === albumId,
    );

    if (!albumToRemove) {
      throw new NotFoundException();
    }

    const updatedFavAlbums = currentFavs.albums.filter(
      (album) => album.id !== albumId,
    );

    this.setFavAlbums(updatedFavAlbums);
  }

  async addArtist(artistId: string) {
    const currentArtists = await this.artistService.findAll(); // replace with findMany() where deleted artistId

    const artistToFav = currentArtists.find((artist) => artist.id === artistId);

    if (!artistToFav) {
      throw new UnprocessableEntityException(
        `Album with id: ${artistId} doesn't exist`,
      );
    }

    this.favorites.artists.push(artistToFav);
  }

  async removeArtist(artistId: string) {
    const currentFavs = await this.findAll();

    const artistToRemove = currentFavs.artists.find(
      (artist) => artist.id === artistId,
    );

    if (!artistToRemove) {
      throw new NotFoundException();
    }

    const updatedFavArtists = currentFavs.artists.filter(
      (artist) => artist.id !== artistId,
    );

    this.setFavArtists(updatedFavArtists);
  }
}
