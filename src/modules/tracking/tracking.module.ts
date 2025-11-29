import { Module } from '@nestjs/common';
import { TrackingGateway } from './tracking.gateway';
import { TrackingService } from './tracking.service';
import { DriversModule } from '../drivers/drivers.module';

@Module({
    imports: [DriversModule],
    providers: [TrackingGateway, TrackingService],
    exports: [TrackingService]
})
export class TrackingModule { }
