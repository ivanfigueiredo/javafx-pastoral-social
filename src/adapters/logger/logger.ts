import pino from 'pino';

export const loggerAdapter = pino(
    {
        level: 'info',
        redact: ["req.headers.authorization", "req.body.senha"],
    }, pino.destination({ sync: true }));