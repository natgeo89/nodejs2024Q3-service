import { forwardRef, Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
  imports: [forwardRef(() => FavoritesModule)],
})
export class TrackModule {}
