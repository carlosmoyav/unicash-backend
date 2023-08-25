import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Delete,
    Req,
    UseGuards,
    Query,
} from '@nestjs/common'
import { BilleteraService } from './billeteras.service'
import { AgregarMovimientoDto } from './dto/agregar-movimiento.dto'
import { JwtAuthGuard } from 'src/autenticacion/jwt-auth.guards'

@UseGuards(JwtAuthGuard)
@Controller('billeteras')
export class BilleteraController {
    constructor(private readonly billeteraService: BilleteraService) {}

    @Get()
    findOne(@Req() req: any) {
        return this.billeteraService.findOne(req.user._id)
    }

    @Post('movimiento')
    agregarMovimiento(
        @Req() req: any,
        @Body() agregarMovimientoDto: AgregarMovimientoDto
    ) {
        return this.billeteraService.agregarMovimiento(
            req.user._id,
            agregarMovimientoDto
        )
    }

    @Get('movimientos')
    obtenerMovimientos(@Req() req: any) {
        return this.billeteraService.obtenerMovimientos(req.user._id)
    }

    @Get('estadisticas')
    obtenerMovimientosEstadisticas(@Req() req: any, @Query() queryParams: any) {
        return this.billeteraService.obtenerMovimientosEstadisticas(
            req.user._id,
            queryParams
        )
    }
}
