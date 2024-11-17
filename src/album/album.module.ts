import { forwardRef, Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TrackModule } from '../track/track.module';
import { FavoritesModule } from '../favorites/favorites.module';
import { PrismaModule } from '../database/prisma.module';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService],
  imports: [
    forwardRef(() => TrackModule),
    forwardRef(() => FavoritesModule),
    PrismaModule,
  ],
  exports: [AlbumService],
})
export class AlbumModule {}
