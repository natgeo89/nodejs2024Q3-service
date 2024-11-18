import { Album } from './album.interface';
import { Artist } from './artist.interface';
import { Track } from './track.interface';

export interface Favorites {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
