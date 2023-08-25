import {
    IsString,
    IsNotEmpty,
    MinLength,
    IsEmail,
    IsDateString,
} from 'class-validator'

export class RegisterAuthDto {
    @IsString()
    @IsNotEmpty()
    nombres: string

    @IsString()
    @IsNotEmpty()
    apellidos: string

    @IsNotEmpty()
    @IsDateString()
    fechaNacimiento: Date

    @IsEmail()
    @IsNotEmpty()
    correo: string

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    contrasena: string
}
