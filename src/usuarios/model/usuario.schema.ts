import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
export type UsuarioDocument = HydratedDocument<Usuario>
@Schema({ timestamps: true })
export class Usuario {
    @Prop({ default: '' })
    imagenPerfil: string
    @Prop({ required: true })
    nombres: string
    @Prop({ required: true })
    apellidos: string
    @Prop({ required: true })
    fechaNacimiento: Date
    @Prop({ required: true })
    correo: string
    @Prop({ required: true })
    contrasena: string
    @Prop({ default: true })
    activo: boolean
    @Prop({ default: false })
    eliminado: boolean
}
export const UsuarioSchema = SchemaFactory.createForClass(Usuario)
