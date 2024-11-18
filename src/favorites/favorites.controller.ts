import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async findAll() {
    return await this.favoritesService.findAll();
  }

  @Post('track/:id')
  async addFavTrack(@Param('id', new ParseUUIDPipe()) trackId: string) {
    return await this.favoritesService.addTrack(trackId);
  }

  @HttpCode(204)
  @Delete('track/:id')
  async removeFavTrack(@Param('id', new ParseUUIDPipe()) trackId: string) {
    return await this.favoritesService.removeTrack(trackId);
  }

  @Post('album/:id')
  async addFavAlbum(@Param('id', new ParseUUIDPipe()) albumId: string) {
    return await this.favoritesService.addAlbum(albumId);
  }

  @HttpCode(204)
  @Delete('album/:id')
  async removeFavAlbum(@Param('id', new ParseUUIDPipe()) albumId: string) {
    return await this.favoritesService.removeAlbum(albumId);
  }

  @Post('artist/:id')
  async addFavArtist(@Param('id', new ParseUUIDPipe()) artistId: string) {
    return await this.favoritesService.addArtist(artistId);
  }

  @HttpCode(204)
  @Delete('artist/:id')
  async removeFavArtist(@Param('id', new ParseUUIDPipe()) artistId: string) {
    return await this.favoritesService.removeArtist(artistId);
  }
}
