import { IsString, IsOptional, IsInt } from 'class-validator';
export class CreateAlbumDto {
  @IsString()
  name: string;
  @IsInt()
  year: number;
  @IsOptional()
  @IsString()
  artistId: string | null;
}
