import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateLocationDto } from './dto/create-location.dto'
import { UpdateLocationDto } from './dto/update-location.dto'
import { LocationEntity } from './entities/location.entity'

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(LocationEntity)
    private readonly locationRepository: Repository<LocationEntity>,
  ) {}

  async create(createLocationDto: CreateLocationDto) {
    const newLocationObject = {
      image_url: createLocationDto.image_url,
      name: createLocationDto.name,
      meta: createLocationDto.meta,
      faction_id: createLocationDto.faction_id,
      latitude: createLocationDto.latitude,
      longitude: createLocationDto.longitude,
      altitude: createLocationDto.altitude,
      triggered_by: createLocationDto.triggered_by,
    };

    const existLocation = await this.findOne(newLocationObject);
    //console.l

    if (existLocation)
      throw new BadRequestException(
        'Данная локация с такими же входными данными уже существует!',
      );

    const newLocation = await this.locationRepository.save(newLocationObject);

    return newLocation;
  }

  async delete(id: number) {
    const location = await this.findById(id);
    if (!location)
      return new UnauthorizedException(
        'Проверьте данные локации , так как сервер не может ее найти',
      );
    return this.locationRepository.delete(location.id);
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {
    const location = await this.findById(id);
    if (!location)
      return new UnauthorizedException(
        'Проверьте данные локации , так как сервер не может ее найти',
      );
    return this.locationRepository.update(location.id, updateLocationDto);
  }

  async findById(id: number) {
    const location = await this.locationRepository.findOne({
      where: { id },
      relations: ['npcs'],
    });
    if (!location) throw new NotFoundException('Данной локации не найдено');
    return location;
  }

  private async findOne(existLocationObject: UpdateLocationDto) {
    const existLocation = await this.locationRepository.findOne({
      where: existLocationObject,
    });
    // if (!existLocation)
    //   throw new UnauthorizedException(
    //     'Локация с такими же входными данными существует',
    //   );
    return existLocation;
  }

  async updateForRelations(updateLocationDto) {
    const location = await this.findById(updateLocationDto.id);
    if (!location)
      return new UnauthorizedException(
        'Проверьте данные локации , так как сервер не может его найти',
      );
    return await this.locationRepository.save(updateLocationDto);
  }
}
