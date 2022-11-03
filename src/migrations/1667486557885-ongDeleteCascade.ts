import { MigrationInterface, QueryRunner } from "typeorm";

export class ongDeleteCascade1667486557885 implements MigrationInterface {
    name = 'ongDeleteCascade1667486557885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "age" TO "birthDate"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "birthDate"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "birthDate" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "isAdm" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "isAdm" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "birthDate"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "birthDate" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "birthDate" TO "age"`);
    }

}
