import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDriverDto } from './dto/create-driver.dto';
import { Driver } from './entities/driver.entity';
import { DriverLocation } from './entities/driver-location.entity';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private driverRepository: Repository<Driver>,
    @InjectRepository(DriverLocation)
    private driverLocationRepository: Repository<DriverLocation>,
  ) { }

  async create(createDriverDto: CreateDriverDto): Promise<Driver> {
    const driver = this.driverRepository.create(createDriverDto);
    return this.driverRepository.save(driver);
  }

  async createOrUpdateLocation(driverId: number, lat: number, lng: number) {
    const existing = await this.driverLocationRepository.findOneBy({ driverId });

    const geom = `SRID=4326;POINT(${lng} ${lat})`;

    if (existing) {
      await this.driverLocationRepository.update(
        { driverId },
        {
          location: () => `ST_GeomFromText('POINT(${lng} ${lat})', 4326)`,
          updatedAt: new Date(),
        } as any
      );
    } else {
      const newLoc = this.driverLocationRepository.create({
        driverId,
        location: () => `ST_GeomFromText('POINT(${lng} ${lat})', 4326)`,
      } as any);

      await this.driverLocationRepository.save(newLoc);
    }
  }

  async findNearestAvailable(lng: number, lat: number, maxMeters = 5000) {
    const sql = `
    SELECT *
    FROM (
      SELECT d.id, d.name, d.last_name, d.is_available,
        ST_Distance(
          dl.location::geography,
          ST_SetSRID(ST_MakePoint($1,$2),4326)::geography
        ) AS distance_m
      FROM drivers d
      INNER JOIN driver_locations dl ON dl.driver_id = d.id
      WHERE d.is_available = true
    ) AS t
    ORDER BY 
      (distance_m > $3) ASC,  -- primero los dentro del radio
      distance_m ASC          -- luego el más cercano
    LIMIT 1;
  `;

    const result = await this.driverRepository.query(sql, [lng, lat, maxMeters]);
    return result[0];
  }



  async findAll(): Promise<Driver[]> {
    return this.driverRepository.find({ relations: ['deliveries', 'deliveries.order'] });
  }

  async findById(id: number): Promise<Driver> {
    const driver = await this.driverRepository.findOne({
      where: { id },
      relations: ['deliveries', 'deliveries.order'],
    });
    if (!driver) {
      throw new NotFoundException(`Conductor ${id} no encontrado`);
    }
    return driver;
  }

  async remove(id: number): Promise<{ message: string }> {
    const driver = await this.findById(id);
    await this.driverRepository.remove(driver);
    return { message: 'Conductor eliminado correctamente' };
  }
}