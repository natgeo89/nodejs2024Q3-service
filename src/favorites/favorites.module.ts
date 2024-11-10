import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { TrackModule } from '../track/track.module';
import { AlbumModule } from '../album/album.module';
import { ArtistModule } from '../artist/artist.module';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService],
  imports: [TrackModule, AlbumModule, ArtistModule],
  exports: [FavoritesService],
})
export class FavoritesModule {}
