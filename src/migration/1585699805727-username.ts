import { MigrationInterface, QueryRunner } from 'typeorm';

export class username1585699805727 implements MigrationInterface {
  name = 'username1585699805727';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "username" character varying NOT NULL`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "username"`,
      undefined,
    );
  }
}
