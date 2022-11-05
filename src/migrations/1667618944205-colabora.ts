import { MigrationInterface, QueryRunner } from "typeorm";

export class colabora1667618944205 implements MigrationInterface {
    name = 'colabora1667618944205'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ongCategory" DROP COLUMN "name"`);
        await queryRunner.query(`DROP TYPE "public"."ongCategory_name_enum"`);
        await queryRunner.query(`ALTER TABLE "ongCategory" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ongCategory" ADD CONSTRAINT "UQ_1ba79fe25ef603dc8a3b5b7df5f" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ongCategory" DROP CONSTRAINT "UQ_1ba79fe25ef603dc8a3b5b7df5f"`);
        await queryRunner.query(`ALTER TABLE "ongCategory" DROP COLUMN "name"`);
        await queryRunner.query(`CREATE TYPE "public"."ongCategory_name_enum" AS ENUM('ecologia', 'filantropia', 'animais')`);
        await queryRunner.query(`ALTER TABLE "ongCategory" ADD "name" "public"."ongCategory_name_enum" NOT NULL DEFAULT 'animais'`);
    }

}
