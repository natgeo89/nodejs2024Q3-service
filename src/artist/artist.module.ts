import { forwardRef, Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { TrackModule } from '../track/track.module';
import { AlbumModule } from '../album/album.module';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService],
  imports: [TrackModule, AlbumModule, forwardRef(() => FavoritesModule)],
  exports: [ArtistService],
})
export class ArtistModule {}
