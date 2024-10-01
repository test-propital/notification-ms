import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { PrismaModule } from 'src/prisma_module/prisma.module';
import { NastModule } from 'src/transports/nast.module';

@Module({
  imports: [PrismaModule, NastModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
