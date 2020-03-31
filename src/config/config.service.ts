import { TypeOrmModuleOptions } from '@nestjs/typeorm';
require('dotenv').config();

class ConfigService {
  constructor(private env: { [key: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true) {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`Config not set, missing env.${key}`);
    }
    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach(key => this.getValue(key, true));
    return this;
  }

  public getSecret() {
    return this.getValue('JWT_SECRET');
  }

  public isProduction() {
    const mode = this.getValue('NODE_ENV');
    return mode === 'production';
  }

  public getPort() {
    return this.getValue('PORT');
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'sqlite',
      database: 'quotes.db3',
      synchronize: true,
      logging: false,

      entities: ['src/entity/**/*.ts'],

      migrations: ['src/migration/**/*.ts'],

      subscribers: ['src/subscriber/**/*.ts'],

      cli: {
        entitiesDir: 'src/entity',
        migrationsDir: 'src/migration',
        subscribersDir: 'src/subscriber',
      },
    };
  }
}

export const configService = new ConfigService(process.env).ensureValues([
  'JWT_SECRET',
  'PORT',
]);
