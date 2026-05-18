import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { registerSchema } from './schemas/register.schema';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { loginSchema } from './schemas/login.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body(new JoiValidationPipe(registerSchema)) dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body(new JoiValidationPipe(loginSchema)) dto: LoginDto) {
    return this.authService.login(dto);
  }
}
