import { IsString, IsDateString, IsNotEmpty } from 'class-validator'

export class AgregarMovimientoDto {
    @IsNotEmpty()
    categoria: string
    @IsNotEmpty()
    monto: number
    @IsNotEmpty()
    tipo: string
    @IsNotEmpty()
    @IsDateString()
    fecha: Date
    @IsString()
    descripcion: string
    @IsNotEmpty()
    metodoPago: string
}
