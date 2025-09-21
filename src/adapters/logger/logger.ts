import pino from 'pino';

export const loggerAdapter = pino({
    level: 'info',
    transport: { target: "pino-pretty", options: { colorize: true } },
    redact: ["req.headers.authorization", "req.body.senha"],
});