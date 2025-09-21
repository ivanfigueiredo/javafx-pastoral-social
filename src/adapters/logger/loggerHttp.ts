import pinoHTTP from 'pino-http';
import { stdSerializers } from "pino";
import { loggerAdapter } from './logger';

export const loggerHTTP = pinoHTTP({
    serializers: {
        req: stdSerializers.req,
        res: stdSerializers.res
    },
    logger: loggerAdapter
});