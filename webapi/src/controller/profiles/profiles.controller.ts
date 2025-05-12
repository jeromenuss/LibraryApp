import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { HttpErrorExceptionFilter } from '../../core/filter/errors/errors.filter';
import { Profile } from '../../core/models/profile.model';
import { Public } from '../auth/public.decorator';

@Controller('profiles')
@UseFilters(new HttpErrorExceptionFilter())
@Public()
export class ProfilesController {
  constructor(private usersService: ProfilesService) {}

  @Get()
  async findAllAsync(): Promise<Profile[]> {
    return await this.usersService.getAllDocsAsync();
  }

  @Get('user/:uid')
  async findByUid(@Param('uid') uid: string): Promise<Profile> {
    return await this.usersService.findByUid(uid);
  }

  @Get('username/:uid')
  async getUsername(@Param('uid') uid: string): Promise<{ username: string }> {
    let username: string = '';
    await this.usersService.findByUid(uid).then((profile) => {
      username = `${profile.lastName} ${profile.name}`;
    });
    return { username: username };
  }

  @Get(':id')
  async findByIdAsync(@Param('id') id: string): Promise<Profile> {
    return await this.usersService.getDocByIdAsync(id);
  }

  @Post()
  async create(@Body() profile: Profile) {
    return await this.usersService.createDocAsync(profile);
  }

  /*@Delete(":id")
    async delete(@Param('id') id:number){
        await this.usersService.deleteAsync(id);
    }*/

  @Delete(':id')
  async disableUser(@Param('id') id: string) {
    await this.usersService.disableProfile(id);
  }

  @Put()
  async update(@Param('id') id: string, @Body() profile: Profile) {
    if (id != profile.id) {
      throw new BadRequestException('Différence des identifiants');
    }
    await this.usersService.updateDocAsync(id, profile);
  }
}
