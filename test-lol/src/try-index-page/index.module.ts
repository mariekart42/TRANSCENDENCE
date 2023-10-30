import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {IndexController} from "./index.controller";
import {LoggerMiddleware} from "./logger.middleware";
import {AuthController} from "../auth/auth.controller";

@Module({
    controllers: [IndexController],
})
export class IndexModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware)
            .forRoutes(IndexController, AuthController) // the order is important!!!
        console.log('After configure');
    }
}