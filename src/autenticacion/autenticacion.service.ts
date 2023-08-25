import { genSalt, hash, compare } from 'bcrypt'
import { HttpException, Injectable } from '@nestjs/common'
import { LoginAuthDto } from './dto/login-auth.dto'
import { RegisterAuthDto } from './dto/register-auth.dto'
import { Usuario, UsuarioDocument } from 'src/usuarios/model/usuario.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { JwtService } from '@nestjs/jwt'
import { Billetera } from 'src/billeteras/model/billetera.schema'

@Injectable()
export class AutenticacionService {
    constructor(
        @InjectModel(Usuario.name)
        private usuarioModel: Model<UsuarioDocument>,
        @InjectModel(Billetera.name)
        private billeteraModel: Model<Billetera>,
        private jwtService: JwtService
    ) {}
    async login(loginAuthDto: LoginAuthDto) {
        try {
            const { correo, contrasena } = loginAuthDto
            const usuario = await this.usuarioModel.findOne({ correo }).lean()
            if (!usuario) {
                throw new HttpException('Usuario no encontrado', 404)
            }
            if (usuario.activo === false) {
                throw new HttpException('Usuario inactivo', 403)
            }
            const checkPassword = await compare(contrasena, usuario.contrasena)
            if (!checkPassword) {
                throw new HttpException('Contrasena incorrecta', 403)
            }
            const token = this.jwtService.sign({
                _id: usuario._id.toHexString(),
            })
            delete usuario.contrasena
            const payload = { usuario, token }
            return payload
        } catch (error) {
            throw new HttpException(error.response, error.status)
        }
    }

    async registro(registerAuthDto: RegisterAuthDto) {
        try {
            const { contrasena, correo } = registerAuthDto
            const salt = await genSalt()
            const hashContrasena = await hash(contrasena, salt)
            registerAuthDto = { ...registerAuthDto, contrasena: hashContrasena }
            const buscarUsuario = await this.usuarioModel
                .findOne({ correo, eliminado: false })
                .lean()
            if (!buscarUsuario) {
                const usuarioCreado = (
                    await this.usuarioModel.create(registerAuthDto)
                ).toJSON()
                await this.billeteraModel.create({ usuario: usuarioCreado._id })
                const token = this.jwtService.sign({ _id: usuarioCreado._id })
                delete usuarioCreado.contrasena
                const payload = { usuario: usuarioCreado, token }
                return payload
            }
            if (buscarUsuario.activo === false) {
                throw new HttpException(
                    'Ya existe un usuario con el correo pero está inactivo',
                    409
                )
            }
            if (buscarUsuario) {
                throw new HttpException('Usuario con el correo ya existe', 409)
            }
        } catch (error) {
            throw new HttpException(error.response, error.status)
        }
    }
}
