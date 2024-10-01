import { IsString, IsBoolean, IsUUID, IsMongoId } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  message: string;
  @IsUUID()
  @IsString()
  userId: string;
  @IsUUID()
  @IsString()
  assetId: string;
  @IsUUID()
  @IsString()
  assetEventId: string;
}
