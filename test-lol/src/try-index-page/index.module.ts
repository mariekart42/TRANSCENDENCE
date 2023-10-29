import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {IndexController} from "./index.controller";
import * as express from 'express';

@Module({
    controllers: [IndexController],
})
export class IndexModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(express.static('root'))
            .forRoutes('root');
    }
}