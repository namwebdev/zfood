import { Transform } from "class-transformer";
import { IsString, IsInt, Min, Max, IsOptional } from "class-validator";

export class QueryParamsDTO {
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number;
}
