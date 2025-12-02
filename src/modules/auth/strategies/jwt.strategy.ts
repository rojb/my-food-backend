import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
        });
    }

async validate(payload: any) {
        console.log('🔍 JWT Payload:', payload);
        
        try {
            const customer = await this.authService.validateCustomer(payload.sub);
            console.log('✅ Customer encontrado:', customer);
            
            if (!customer) {
                console.log('❌ Customer no encontrado para ID:', payload.sub);
                throw new UnauthorizedException('Customer not found');
            }
            
            return customer;
        } catch (error) {
            console.error('❌ Error en validación:', error.message);
            throw new UnauthorizedException('Invalid token');
        }
    }
}