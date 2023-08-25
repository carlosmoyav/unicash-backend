import { HttpException, Injectable } from '@nestjs/common'
import { AgregarMovimientoDto } from './dto/agregar-movimiento.dto'
import { Movimiento, MovimientoDocument } from './model/movimiento.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Billetera, BilleteraDocument } from './model/billetera.schema'
import { Decimal } from 'decimal.js'
import { DateTime } from 'luxon'

@Injectable()
export class BilleteraService {
    constructor(
        @InjectModel(Movimiento.name)
        private movimientoModel: Model<MovimientoDocument>,
        @InjectModel(Billetera.name)
        private billeteraModel: Model<BilleteraDocument>
    ) {}

    async findOne(id: string) {
        try {
            const billetera = await this.billeteraModel
                .findOne({
                    usuario: new Types.ObjectId(id),
                })
                .lean()
            if (!billetera) {
                throw new HttpException('Billetera no encontrada', 404)
            }
            const movimientos = await this.movimientoModel
                .find({
                    billetera: billetera._id,
                })
                .sort({ fecha: -1, createdAt: -1 })
                .limit(10)
                .lean()
            Decimal.set({ precision: 2 })
            const balanceTotal = (
                new Decimal(billetera.ingresos).toNumber() -
                new Decimal(billetera.gastos).toNumber()
            ).toFixed(2)
            return { billetera, balanceTotal: +balanceTotal, movimientos }
        } catch (error) {
            console.log(error)
            throw new HttpException('Ha ocurrido un error', 500)
        }
    }
    async agregarMovimiento(
        id: string,
        agregarMovimientoDto: AgregarMovimientoDto
    ) {
        try {
            const billetera = await this.billeteraModel.findOne({
                usuario: new Types.ObjectId(id),
            })
            if (!billetera) {
                throw new HttpException('Billetera no encontrada', 404)
            }
            Decimal.set({ precision: 2 })
            agregarMovimientoDto = {
                ...agregarMovimientoDto,
                monto: new Decimal(agregarMovimientoDto.monto).toNumber(),
            }
            await this.movimientoModel
                .create({
                    ...agregarMovimientoDto,
                    billetera: billetera._id,
                })
                .then((movimiento) => {
                    Decimal.set({ precision: 2 })
                    if (movimiento.tipo.toLowerCase() === 'ingreso') {
                        billetera.ingresos =
                            new Decimal(billetera.ingresos).toNumber() +
                            new Decimal(movimiento.monto).toNumber()
                    } else if (movimiento.tipo.toLowerCase() === 'gasto') {
                        billetera.gastos =
                            new Decimal(billetera.gastos).toNumber() +
                            new Decimal(movimiento.monto).toNumber()
                    }
                    billetera.save()
                })
            return { statusCode: 201, message: 'Movimiento agregado' }
        } catch (error) {
            console.log(error)
            throw new HttpException('Ha ocurrido un error', 500)
        }
    }
    async obtenerMovimientos(id: string) {
        try {
            const billetera = await this.billeteraModel.findOne({
                usuario: new Types.ObjectId(id),
            })
            if (!billetera) {
                throw new HttpException('Billetera no encontrada', 404)
            }
            const movimientos = await this.movimientoModel
                .find({
                    billetera: billetera._id,
                })
                .sort({ fecha: -1, createdAt: -1 })
                .lean()
            return { movimientos }
        } catch (error) {
            throw new HttpException('Ha ocurrido un error', 500)
        }
    }
    async obtenerMovimientosEstadisticas(id: string, queryParams: any) {
        try {
            console.log(queryParams)
            const { tipo, rango } = queryParams
            if (!tipo || !rango) {
                throw new HttpException(
                    'Tipo y rango son parametros obligatorios',
                    400
                )
            }
            const billetera = await this.billeteraModel
                .findOne({
                    usuario: new Types.ObjectId(id),
                })
                .lean()
            if (!billetera) {
                throw new HttpException('Billetera no encontrada', 404)
            }
            const dateEcuador = DateTime.fromISO(
                DateTime.now().toISO()
            ).setZone('America/Guayaquil')
            const dateIso = new Date(dateEcuador.toISODate())
            const dateActual = new Date(dateEcuador.toISODate())
            let dateConsulta: Date
            switch (rango.toLowerCase()) {
                case 'dia':
                    console.log('dia')
                    dateConsulta = dateIso
                    break
                case 'semana':
                    console.log('semana')
                    dateConsulta = new Date(
                        dateIso.setDate(dateIso.getDate() - dateIso.getDay())
                    )
                    break
                case 'mes':
                    console.log('mes')
                    dateConsulta = new Date(
                        DateTime.fromISO(
                            new Date(
                                dateIso.getFullYear(),
                                dateIso.getMonth(),
                                1
                            ).toISOString()
                        ).toISODate()
                    )
                    break
                case 'anual':
                    console.log('anual')
                    dateConsulta = new Date(
                        DateTime.fromISO(
                            new Date(dateIso.getFullYear(), 0, 1).toISOString()
                        ).toISODate()
                    )
                    break
                default:
                    throw new HttpException(
                        'Rango no valido, valores validos: dia, semana, mes, anual',
                        400
                    )
            }
            console.log('fechaActual: ', dateActual)
            console.log('fechaConsulta: ', dateConsulta)
            const movimientos = await this.movimientoModel
                .find({
                    billetera: billetera._id,
                    tipo: tipo,
                    fecha:
                        rango.toLowerCase() == 'dia'
                            ? dateConsulta
                            : { $gte: dateConsulta, $lte: dateActual },
                })
                .sort({ fecha: 1, createdAt: 1 })
                .lean()

            return { movimientos }
        } catch (error) {
            throw new HttpException('Ha ocurrido un error', 500)
        }
    }
}
