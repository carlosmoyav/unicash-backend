import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as bodyParser from 'body-parser'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.setGlobalPrefix('api')
    app.use(bodyParser.json({ limit: '50mb' }))
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
    app.enableCors()
    app.useGlobalPipes(new ValidationPipe())
    await app.listen(process.env.PORT || 3000, '0.0.0.0')
    console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
