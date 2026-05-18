import { IsOptional, IsString } from 'class-validator';

export class QueryBooksDto {
  @IsOptional()
  @IsString()
  authorName?: string;

  @IsOptional()
  @IsString()
  genreName?: string;
}
