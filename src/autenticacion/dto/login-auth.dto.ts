import { PartialType } from '@nestjs/mapped-types'
import { RegisterAuthDto } from './register-auth.dto'
import { IsString, IsNotEmpty, IsEmail } from 'class-validator'

export class LoginAuthDto extends PartialType(RegisterAuthDto) {
    @IsEmail()
    @IsNotEmpty()
    correo: string

    @IsString()
    @IsNotEmpty()
    contrasena: string
}
