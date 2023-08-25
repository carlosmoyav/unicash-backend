import { Injectable, HttpException } from '@nestjs/common'
import { UpdateUsuarioDto } from './dto/update-usuario.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Usuario, UsuarioDocument } from './model/usuario.schema'

@Injectable()
export class UsuariosService {
    constructor(
        @InjectModel(Usuario.name)
        private usuarioModel: Model<UsuarioDocument>
    ) {}

    async findOne(id: string) {
        try {
            const usuario = await this.usuarioModel
                .findOne({ _id: new Types.ObjectId(id) })
                .lean()
            if (!usuario) {
                throw new HttpException('Usuario no encontrado', 404)
            }
            if (usuario.activo === false) {
                throw new HttpException('Usuario inactivo', 403)
            }
            delete usuario.contrasena
            return { usuario }
        } catch (error) {
            throw new HttpException('Ha ocurrido un error', 500)
        }
    }

    async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
        try {
            const usuario = await this.usuarioModel
                .findOneAndUpdate(
                    { _id: new Types.ObjectId(id), eliminado: false },
                    { $set: updateUsuarioDto },
                    { new: true }
                )
                .lean()
            if (!usuario) {
                throw new HttpException('Usuario no encontrado', 404)
            }
            if (usuario.activo === false) {
                throw new HttpException('Usuario inactivo', 403)
            }
            delete usuario.contrasena
            return { usuario }
        } catch (error) {
            throw new HttpException('Ha ocurrido un error', 500)
        }
    }

    async updateFotoPerfil(id: string, body: any) {
        try {
            const { imagenPerfil } = body
            const usuario = await this.usuarioModel
                .findOneAndUpdate(
                    { _id: new Types.ObjectId(id), eliminado: false },
                    { $set: { imagenPerfil } },
                    { new: true }
                )
                .lean()
            if (!usuario) {
                throw new HttpException('Usuario no encontrado', 404)
            }
            if (usuario.activo === false) {
                throw new HttpException('Usuario inactivo', 403)
            }
            delete usuario.contrasena
            return { usuario }
        } catch (error) {
            throw new HttpException('Ha ocurrido un error', 500)
        }
    }
}
