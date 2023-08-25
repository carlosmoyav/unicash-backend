import {
    Req,
    Controller,
    Get,
    Post,
    Put,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common'
import { UsuariosService } from './usuarios.service'
import { UpdateUsuarioDto } from './dto/update-usuario.dto'
import { JwtAuthGuard } from 'src/autenticacion/jwt-auth.guards'

@UseGuards(JwtAuthGuard)
@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) {}

    @Get('me')
    obtenerMiPerfil(@Req() req: any) {
        return this.usuariosService.findOne(req.user._id)
    }

    @Patch()
    update(@Req() req: any, @Body() updateUsuarioDto: UpdateUsuarioDto) {
        return this.usuariosService.update(req.user._id, updateUsuarioDto)
    }

    @Put()
    updateFotoPerfil(@Req() req: any, @Body() body: any) {
        return this.usuariosService.updateFotoPerfil(req.user._id, body)
    }
}
