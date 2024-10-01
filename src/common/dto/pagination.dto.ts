import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional, IsPositive } from 'class-validator';

export class paginationDto {
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  onlyRead?: boolean = false;
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  onlyUnread?: boolean = false;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  showAll?: boolean = false;
}
