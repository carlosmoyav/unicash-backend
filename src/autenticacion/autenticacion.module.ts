import { Module } from '@nestjs/common'
import { AutenticacionService } from './autenticacion.service'
import { AutenticacionController } from './autenticacion.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Usuario, UsuarioSchema } from 'src/usuarios/model/usuario.schema'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt.strategy'
import {
    Billetera,
    BilleteraSchema,
} from 'src/billeteras/model/billetera.schema'

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Usuario.name,
                schema: UsuarioSchema,
            },
            {
                name: Billetera.name,
                schema: BilleteraSchema,
            },
        ]),
        JwtModule.register({
            secret: 'unicash',
        }),
    ],
    controllers: [AutenticacionController],
    providers: [AutenticacionService, JwtStrategy],
})
export class AutenticacionModule {}
