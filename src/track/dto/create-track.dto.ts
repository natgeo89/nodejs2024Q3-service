import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  artistId: string | null;
  @IsOptional()
  @IsString()
  albumId: string | null;
  @IsInt()
  duration: number;
}
