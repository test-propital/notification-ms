import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { paginationDto } from 'src/common';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // Crear una nueva notificación
  @MessagePattern({ cmd: 'create_notification' })
  async create(@Payload() createNotificationDto: CreateNotificationDto) {
    return await this.notificationService.create(createNotificationDto);
  }

  // Obtener todas las notificaciones
  @MessagePattern({ cmd: 'get_all_notifications' })
  async findAll() {
    return this.notificationService.findAll();
  }

  // Obtener notificaciones por ID de usuario
  @MessagePattern({ cmd: 'get_notifications_by_user_id' })
  async findByUserId(
    @Payload() paiload: { id: string; paginationDto: paginationDto },
  ) {
    console.log(paiload);
    return this.notificationService.findByUserId(
      paiload.id,
      paiload.paginationDto,
    );
  }
  @MessagePattern({ cmd: 'get_count_unread_notifications_by_user_id' })
  async countUnreadNotifications(@Payload() userId: string) {
    return this.notificationService.countUnreadNotifications(userId);
  }

  // Obtener notificaciones por assetId
  @MessagePattern({ cmd: 'get_notifications_by_asset_id' })
  async findByAssetId(@Payload() assetId: string) {
    return this.notificationService.findByAssetId(assetId);
  }

  // Obtener notificaciones por assetEventId
  @MessagePattern({ cmd: 'get_notifications_by_asset_event_id' })
  async findByAssetEventId(@Payload() assetEventId: string) {
    return this.notificationService.findByAssetEventId(assetEventId);
  }

  // Obtener una notificación por su ID
  @MessagePattern({ cmd: 'get_notification_by_id' })
  async findOne(@Payload() id: string) {
    return this.notificationService.findOne(id);
  }

  // Marcar una notificación como leída
  @MessagePattern({ cmd: 'mark_notification_as_read' })
  async markAsRead(@Payload() id: string) {
    return this.notificationService.markAsRead(id);
  }

  // Marcar múltiples notificaciones como leídas
  @MessagePattern({ cmd: 'mark_multiple_notifications_as_read' })
  async markMultipleAsRead(@Payload() ids: string[]) {
    return this.notificationService.markMultipleAsRead(ids);
  }

  @MessagePattern({ cmd: 'mark_all_notification_as_read' })
  async markAsReadAll(@Payload() id: string) {
    console.log(id);
    return this.notificationService.markAllAsRead(id);
  }

  // Actualizar una notificación
  @MessagePattern({ cmd: 'update_notification' })
  async update(
    @Payload()
    {
      id,
      updateNotificationDto,
    }: {
      id: string;
      updateNotificationDto: UpdateNotificationDto;
    },
  ) {
    return this.notificationService.update(id, updateNotificationDto);
  }

  // Eliminar una notificación
  @MessagePattern({ cmd: 'delete_notification' })
  async remove(@Payload() id: string) {
    return this.notificationService.remove(id);
  }
}
