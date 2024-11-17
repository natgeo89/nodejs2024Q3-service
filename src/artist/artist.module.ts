import { forwardRef, Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { FavoritesModule } from '../favorites/favorites.module';
import { PrismaModule } from '../database/prisma.module';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService],
  imports: [forwardRef(() => FavoritesModule), PrismaModule],
  exports: [ArtistService],
})
export class ArtistModule {}
