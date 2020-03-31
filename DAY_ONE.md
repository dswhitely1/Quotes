# NEST JS with TypeORM and POSTGRES
## Day One Instructions

### What is Nest.JS

According to the official [website](https://nestjs.com/):
> A progressive Node.js framework for building efficient, reliable and scalable server-side applications.

### To Start a new project

We will need to install the **C**ommand **L**ine **I**nterface:

```shell script
npm i -g @nestjs/cli
```

After The CLI is installed, we issue this command:
```shell script
nest new project_name
```

The CLI will then ask for which Package Manager to use, this is totally up to your preference.
After the installation, cd into your project and run the command:
*Use the Package Manager of your choosing*
```shell script
npm run start
```
This will give us a working **A**pplication **P**rogramming **Interface** that has a ```GET``` Hello World Route.

### Next we need to set our environment variables
Since we don't **ever** want to upload our environment variables to a Version Control System, aka GitHub.  We will need to add a couple of files to our ```.gitignore```

```shell script
.env
ormconfig.json
``` 
The Environment Variables you will need to set is this:
```shell script
PORT=4000
JWT_SECRET=reactwizard
DB_HOST=localhost
DB_PORT=5432
DB_NAME=quotes
DB_USER=labspt8
DB_PASS=labspt8
NODE_ENV=development
```


### Lets install TypeORM Dependencies

*Use the Package Manager of your choosing*
```shell script
npm i -S @nestjs/typeorm typeorm pg dotenv
```

The first step to setting up TypeORM is to define the config for it to communicate to the database.  Instead of directly accessing the environment variables, we are going to define a ConfigService class to handle retrieving our environment variables.
```typescript
import {TypeOrmModuleOptions} from '@nestjs/typeorm';
import {config} from 'dotenv';

config()

class ConfigService {
  constructor(private env: {[key: string]: string}) {}

  private getValue(key: string, throwOnMissing = true) {
    const value = this.env[key]
    if (!value && throwOnMissing) {
      throw new Error(`Config not set, missing env.${key}`)
    } 
    return value
  }
  
  public ensureValues(keys: string[]) {
    keys.forEach(key => this.getValue(key, true))
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
        type: 'postgres',
        host: this.getValue('DB_HOST'),
        port: parseInt(this.getValue('DB_PORT')),
        username: this.getValue('DB_USER'),
        password: this.getValue('DB_PASS'),
        database: this.getValue('DB_NAME'),
  
        entities: ['**/*.entity{.ts,.js}'],
        migrationsTableName: 'migration',
  
        migrations: ['src/migration/*.ts'],
  
        cli: {
          migrationsDir: 'src/migration',
        },
        ssl: this.isProduction(),
      };
}
``` 

With our ConfigService class defined, we can now add a variable called configService and export it from the same file.

```typescript
export const configService = new ConfigService(process.env).ensureValues([
  'JWT_SECRET',
  'PORT',
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASS',
])
```

The first thing this will do is to ensure that the provided list of environment variables are present and will stop the application from running if any of the variables are not set.

In the ```getTypeOrmConfig``` method, we are defining our config for TypeORM.  As you notice, we have a type which is the Database Dialect we are instructing it to use.  In our case, it's Postgres.  If you want to learn more about which databases are supported by TypeORM, you can read the [documentation](https://github.com/typeorm/typeorm/blob/master/docs/connection-options.md) provided by TypeORM.
The `entities` entry is how we define what our tables are going to look like.   Let's work on defining our entities next.

Nest does not know about TypeORM, so we will need to import it into our App.  To import TypeORM, we will need to modify our `app.module.ts` file.

Looking at this file, we have the following code:

```typescript
import { Module } from '@nestjs/common'; 
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService]  
})

export class AppModule {}
```
To gain access to TypeORM, we will need to add it to our Imports section.  We will need to add the following imports:
```typescript
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
```

And now we will change the `imports` to the following:
```typescript
import { configService } from './config.service'; import { TypeOrmModule } from '@nestjs/typeorm'; 
imports: [TypeOrmModule.forRoot(configService.getTypeOrmConfig())]
```

### Defining our Entities
When defining our data structure, we will always want to define a primary key.  Since our primary key is on every entity, we will define a base entity so that it can be extended on all of our entities.

`base.entity.ts`
```typescript
import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string
  
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date
  
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP '})
  updatedAt: Date
}
```

Let's talk about the `@PrimaryGeneratedColumn`, `@CreatedDateColumn`, `@UpdateDateColumn` decorators.

Decorators are just a wrapper around a function.  If you have heard of this before, it is that you have.  Decorators are a fancy way to say Higher Order Function. Here is a good [article](https://www.telerik.com/blogs/decorators-in-javascript) if you want to read up on decorators.

TypeORM comes with many [decorators](https://github.com/typeorm/typeorm/blob/master/docs/decorator-reference.md).  They are used to define how the database schema is.

