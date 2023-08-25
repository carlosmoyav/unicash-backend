import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common'
import { AutenticacionService } from './autenticacion.service'
import { LoginAuthDto } from './dto/login-auth.dto'
import { RegisterAuthDto } from './dto/register-auth.dto'

@Controller('autenticacion')
export class AutenticacionController {
    constructor(private readonly autenticacionService: AutenticacionService) {}

    @Post('login')
    login(@Body() loginAuthDto: LoginAuthDto) {
        return this.autenticacionService.login(loginAuthDto)
    }

    @Post('registro')
    registro(@Body() registerAuthDto: RegisterAuthDto) {
        return this.autenticacionService.registro(registerAuthDto)
    }
}
