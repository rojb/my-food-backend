import {
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TrackingService } from './tracking.service';
import { redisClient } from 'src/common/providers/redis.provider';

@WebSocketGateway({
    cors: { origin: '*' },
    namespace: '/tracking'
})
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private readonly trackingService: TrackingService) { }

    handleConnection(client: Socket) {
        console.log('Client connected', client.id);
        // TODO: auth using token in query
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected', client.id);
    }

    @SubscribeMessage('driver_location_update')
    async handleLocation(client: Socket, payload: any) {
        /**
         payload = {
           driverId: number,
           lat: number,
           lng: number,
           heading?: number
         }
        */

        const { driverId, lat, lng } = payload;
        if (!driverId || !lat || !lng) return;

        // 1) Store in Redis GEO for super fast queries
        // Redis expects: GEOADD key longitude latitude member
        await redisClient.geoadd('drivers_geo', lng, lat, `driver:${driverId}`);

        // 2) Optional: set a TTL to indicate freshness
        await redisClient.set(`driver:${driverId}:last_seen`, JSON.stringify({ lat, lng, updatedAt: new Date().toISOString() }), 'EX', 30);

        // 3) Save to DB for history / mapping
        await this.trackingService.storeLocationInDb(driverId, lat, lng);

        // 4) Broadcast to interested clients (e.g. admin dashboards)
        this.server.emit('driver_location_broadcast', { driverId, lat, lng, updatedAt: new Date() });
    }
}
