import { Module } from '@nestjs/common';
import { NotificationModule } from './notification/notification.module';
import { NastModule } from './transports/nast.module';

@Module({
  imports: [NotificationModule, NastModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
