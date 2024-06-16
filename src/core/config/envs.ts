

import 'dotenv/config';

import * as joi from 'joi';

enum NodeEnv {
    DEVELOPMENT = 'development',
    STAGING = 'staging',
    PRODUCTION = 'production'
}

interface EnvVars_I {

    PORT: number;
    NATS_SERVERS: string[];
    NODE_ENV: NodeEnv;
    DB_URL: string;

}

const envsSchema = joi.object({

    PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()),
    NODE_ENV: joi.string().valid(NodeEnv.DEVELOPMENT, NodeEnv.STAGING, NodeEnv.PRODUCTION).required(),
    DB_URL: joi.string().required()

}).unknown(true);

const {
    error,
    value
} = envsSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(',')
});

if (error) {

    throw new Error(`Config validation error: ${error.message}`);

}

const envVars: EnvVars_I = value;

export const envs = {

    port: envVars.PORT,
    natsServers: envVars.NATS_SERVERS,
    nodeEnv: envVars.NODE_ENV,
    db_url: envVars.DB_URL

}