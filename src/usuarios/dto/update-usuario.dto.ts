import { IsString, IsEmail, IsDateString } from 'class-validator'
export class UpdateUsuarioDto {
    @IsString()
    nombres: string

    @IsString()
    apellidos: string

    @IsDateString()
    fechaNacimiento: Date

    @IsEmail()
    correo: string
}
