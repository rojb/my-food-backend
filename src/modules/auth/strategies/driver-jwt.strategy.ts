import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DriversService } from 'src/modules/drivers/drivers.service';

@Injectable()
export class DriverJwtStrategy extends PassportStrategy(Strategy, 'driver-jwt') {
    constructor(private driversService: DriversService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.DRIVER_JWT_SECRET || 'driver-secret-key',
        });
    }

    async validate(payload: any) {
        const driver = await this.driversService.findById(payload.sub);
        if (!driver) {
            throw new Error('Invalid token');
        }
        return driver;
    }
}