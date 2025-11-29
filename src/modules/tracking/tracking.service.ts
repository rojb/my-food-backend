import { Injectable } from '@nestjs/common';
import { DriversService } from '../drivers/drivers.service';

@Injectable()
export class TrackingService {
    constructor(private driversService: DriversService) { }

    async storeLocationInDb(driverId: number, lat: number, lng: number) {
        try {
            await this.driversService.createOrUpdateLocation(driverId, lat, lng);
        } catch (err) {
            console.error('DB store location failed', err);
        }
    }
}
