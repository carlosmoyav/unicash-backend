import { PassportStrategy } from '@nestjs/passport'
import { HttpException, Injectable } from '@nestjs/common'
import { Model, Types } from 'mongoose'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Usuario, UsuarioDocument } from 'src/usuarios/model/usuario.schema'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectModel(Usuario.name)
        private usuarioModel: Model<UsuarioDocument>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: 'unicash',
        })
    }
    async validate(payload: any) {
        const usuario = await this.usuarioModel
            .findOne({
                _id: new Types.ObjectId(payload._id),
                eliminado: false,
                activo: true,
            })
            .lean()
        if (!usuario) {
            throw new HttpException(
                'Usuario no encontrado o ha sido desactivado',
                404
            )
        }
        return { _id: payload._id }
    }
}
