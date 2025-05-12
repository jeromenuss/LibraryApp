import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '../../core/DTO/register.dto';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';
import { UpdateUserDto } from '../../core/DTO/update-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.createUser(registerDto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Patch('update/:id')
  async updateUser(@Param('id') id: string, @Body() updateUser: UpdateUserDto) {
    return await this.authService.updateUser(id, updateUser);
  }

  /*@UseGuards(FirebaseAuthGuard)
  @Get('profile')
  async getProfile(uid: string) {
    const userDoc = await this.authService.getUser(uid);
  }*/
}
