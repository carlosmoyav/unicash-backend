import { Module } from '@nestjs/common'
import { BilleteraService } from './billeteras.service'
import { BilleteraController } from './billeteras.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Movimiento, MovimientoSchema } from './model/movimiento.schema'
import { Billetera, BilleteraSchema } from './model/billetera.schema'

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Movimiento.name,
                schema: MovimientoSchema,
            },
            {
                name: Billetera.name,
                schema: BilleteraSchema,
            },
        ]),
    ],
    controllers: [BilleteraController],
    providers: [BilleteraService],
})
export class BilleteraModule {}
