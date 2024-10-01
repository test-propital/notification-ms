import { Inject, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/prisma_module/prisma.service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NAST_SERVICE } from 'src/config';
import { paginationDto } from 'src/common';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(NAST_SERVICE) private readonly nastClient: ClientProxy,
    private readonly prisma: PrismaService,
  ) {}

  // Create a new notification
  async create(createNotificationDto: CreateNotificationDto) {
    try {
      const notification = await this.prisma.notification.create({
        data: createNotificationDto,
      });
      this.nastClient.emit('notification.created', notification);
      return notification;
    } catch (error) {
      throw new RpcException('Error creating notification');
    }
  }

  // Get all notifications
  async findAll() {
    try {
      return await this.prisma.notification.findMany();
    } catch (error) {
      throw new RpcException('Error retrieving notifications');
    }
  }

  // Get notifications by user ID
  async findByUserId(id: string, paginationDto: paginationDto) {
    const { page, limit, onlyRead, onlyUnread, startDate, endDate, showAll } =
      paginationDto;
    let totalCount = 0;
    let totalPages = 0;
    let notifications = [];

    try {
      const filters: any = {
        userId: id,
      };

      if (!showAll) {
        if (onlyRead && onlyUnread) {
          throw new Error('Cannot filter by both onlyRead and onlyUnread');
        }

        if (onlyRead) {
          filters.isRead = true;
        } else if (onlyUnread) {
          filters.isRead = false;
        }

        if (startDate) {
          const startDateObj = new Date(startDate);
          if (!isNaN(startDateObj.getTime())) {
            filters.createdAt = {
              gte: startDateObj,
            };
          } else {
            console.error('Invalid startDate:', startDate);
          }
        }

        if (endDate) {
          const endDateObj = new Date(endDate);
          if (!isNaN(endDateObj.getTime())) {
            endDateObj.setHours(23, 59, 59, 999);
            filters.createdAt = {
              ...filters.createdAt,
              lte: endDateObj,
            };
          } else {
            console.error('Invalid endDate:', endDate);
          }
        }
      }

      totalCount = await this.prisma.notification.count({
        where: filters,
      });
      console.log(filters);
      totalPages = Math.ceil(totalCount / limit);

      notifications = await this.prisma.notification.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: filters,
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        data: notifications,
        meta: {
          page: page,
          totalCount: totalCount,
          totalPages: totalPages,
          limit: limit,
        },
      };
    } catch (error) {
      console.log(error);
      throw new RpcException('Error retrieving notifications by user');
    }
  }

  async countUnreadNotifications(userId: string): Promise<number> {
    try {
      const unreadCount = await this.prisma.notification.count({
        where: {
          userId: userId,
          isRead: false,
        },
      });

      return unreadCount;
    } catch (error) {
      throw new RpcException('Error counting unread notifications');
    }
  }

  // Get notifications by assetId
  async findByAssetId(assetId: string) {
    try {
      return await this.prisma.notification.findMany({
        where: {
          assetId: assetId,
        },
      });
    } catch (error) {
      throw new RpcException('Error retrieving notifications by assetId');
    }
  }

  // Get notifications by assetEventId
  async findByAssetEventId(assetEventId: string) {
    try {
      return await this.prisma.notification.findMany({
        where: {
          assetEventId: assetEventId,
        },
      });
    } catch (error) {
      throw new RpcException('Error retrieving notifications by assetEventId');
    }
  }

  // Get a notification by its ID
  async findOne(id: string) {
    try {
      const notification = await this.prisma.notification.findUnique({
        where: {
          id: id,
        },
      });
      if (!notification) {
        throw new RpcException('Notification not found');
      }
      return notification;
    } catch (error) {
      throw new RpcException('Error retrieving notification');
    }
  }

  // Mark a notification as read
  async markAsRead(id: string) {
    try {
      return await this.prisma.notification.update({
        where: { id: id },
        data: { isRead: true },
      });
    } catch (error) {
      throw new RpcException('Error marking notification as read');
    }
  }
  async markMultipleAsRead(ids: string[]) {
    try {
      // Validar que las notificaciones existen
      const notifications = await this.prisma.notification.findMany({
        where: { id: { in: ids } },
      });

      if (notifications.length === 0) {
        throw new RpcException('No notifications found for the given IDs');
      }

      // Marcar las notificaciones como leídas
      return await this.prisma.notification.updateMany({
        where: { id: { in: ids } },
        data: { isRead: true },
      });
    } catch (error) {
      throw new RpcException('Error marking notifications as read');
    }
  }
  async markAllAsRead(userId: string) {
    try {
      const updatedNotifications = await this.prisma.notification.updateMany({
        where: {
          userId: userId,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });

      return {
        message: `All notifications for user ${userId} have been marked as read.`,
        updatedCount: updatedNotifications.count, // Return the number of notifications updated
      };
    } catch (error) {
      throw new RpcException('Error marking all notifications as read.');
    }
  }

  // Update a notification
  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    try {
      return await this.prisma.notification.update({
        where: { id: id },
        data: updateNotificationDto,
      });
    } catch (error) {
      throw new RpcException('Error updating notification');
    }
  }

  // Delete a notification
  async remove(id: string) {
    try {
      return await this.prisma.notification.delete({
        where: { id: id },
      });
    } catch (error) {
      throw new RpcException('Error deleting notification');
    }
  }
}
