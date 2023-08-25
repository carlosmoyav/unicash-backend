import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsuariosModule } from './usuarios/usuarios.module'
import { AutenticacionModule } from './autenticacion/autenticacion.module'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { BilleteraModule } from './billeteras/billeteras.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }), // Import ConfigModule
        MongooseModule.forRoot(
            encodeURI(
                process.env.MONGO_URI ||
                    'mongodb://root:root@localhost:27017/unicash?authSource=admin'
            )
        ),
        UsuariosModule,
        AutenticacionModule,
        BilleteraModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
