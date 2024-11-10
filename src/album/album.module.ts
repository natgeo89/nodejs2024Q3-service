import { forwardRef, Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TrackModule } from '../track/track.module';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService],
  imports: [TrackModule, forwardRef(() => FavoritesModule)],
  exports: [AlbumService],
})
export class AlbumModule {}
