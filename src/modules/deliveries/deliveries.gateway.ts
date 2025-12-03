import {
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

interface DriverSocket {
    driverId: number;
    socketId: string;
}

@Injectable()
@WebSocketGateway({
    cors: { origin: '*' },
    namespace: '/deliveries',
})
export class DeliveriesGateway
    implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private connectedDrivers: Map<number, DriverSocket> = new Map();

    handleConnection(client: Socket) {
        console.log('🔌 Cliente conectado:', client.id);
    }

    handleDisconnect(client: Socket) {
        console.log('🔌 Cliente desconectado:', client.id);
        // Remover conductor del mapa
        for (const [driverId, socket] of this.connectedDrivers.entries()) {
            if (socket.socketId === client.id) {
                this.connectedDrivers.delete(driverId);
                break;
            }
        }
    }

    @SubscribeMessage('driver_register')
    handleDriverRegister(client: Socket, payload: { driverId: number }) {
        this.connectedDrivers.set(payload.driverId, {
            driverId: payload.driverId,
            socketId: client.id,
        });
        console.log(
            `✅ Conductor ${payload.driverId} registrado en WebSocket`,
        );
    }

    notifyDriver(driverId: number, notification: any) {
        const driver = this.connectedDrivers.get(driverId);
        if (driver) {
            this.server
                .to(driver.socketId)
                .emit('delivery_notification', notification);
            console.log(
                `📢 Notificación enviada al conductor ${driverId}`,
            );
        } else {
            console.log(
                `⚠️ Conductor ${driverId} no conectado. Notificación guardada en Redis`,
            );
        }
    }

    broadcastDeliveryUpdate(delivery: any) {
        this.server.emit('delivery_updated', delivery);
    }
}