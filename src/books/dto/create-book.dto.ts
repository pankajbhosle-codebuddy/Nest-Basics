import {
  IsArray,
  IsNotEmpty,
  IsString,
  ArrayNotEmpty,
  IsMongoId,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  genreIds!: string[];
}
