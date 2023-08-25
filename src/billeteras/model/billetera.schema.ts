import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types, SchemaTypes } from 'mongoose'
import { Usuario } from 'src/usuarios/model/usuario.schema'
export type BilleteraDocument = HydratedDocument<Billetera>
@Schema({ timestamps: true })
export class Billetera {
    @Prop({ type: SchemaTypes.ObjectId, required: true, ref: Usuario.name })
    usuario: Types.ObjectId
    @Prop({ default: 0 })
    ingresos: number
    @Prop({ default: 0 })
    gastos: number
    @Prop({ default: true })
    activo: boolean
    @Prop({ default: false })
    eliminado: boolean
}

export const BilleteraSchema = SchemaFactory.createForClass(Billetera)
