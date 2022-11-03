import { MigrationInterface, QueryRunner } from "typeorm";

export class editingTables1667488545521 implements MigrationInterface {
    name = 'editingTables1667488545521'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "age" TO "birthDate"`);
        await queryRunner.query(`ALTER TABLE "ongs" DROP COLUMN "age"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "birthDate"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "birthDate" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "isAdm" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "ongs" ALTER COLUMN "balance" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ongs" ALTER COLUMN "balance" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "isAdm" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "birthDate"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "birthDate" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ongs" ADD "age" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "birthDate" TO "age"`);
    }

}
