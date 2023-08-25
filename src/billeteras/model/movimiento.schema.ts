import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types, SchemaTypes } from 'mongoose'
import { Billetera } from './billetera.schema'
export type MovimientoDocument = HydratedDocument<Movimiento>
@Schema({ timestamps: true })
export class Movimiento {
    @Prop({ type: SchemaTypes.ObjectId, required: true, ref: Billetera.name })
    billetera: Types.ObjectId
    @Prop({
        required: true,
        enum: [
            'Pagos',
            'Alimentación',
            'Transporte',
            'Regalo',
            'Educación',
            'Ropa',
            'Salud',
            'Vivienda',
        ],
    })
    categoria: string
    @Prop({ required: true })
    monto: number
    @Prop({ required: true, enum: ['Ingreso', 'Gasto'] })
    tipo: string
    @Prop({ required: true })
    fecha: Date
    @Prop({ default: '' })
    descripcion: string
    @Prop({ required: true, enum: ['Efectivo', 'Tarjeta', 'Transferencia'] })
    metodoPago: string
}

export const MovimientoSchema = SchemaFactory.createForClass(Movimiento)
