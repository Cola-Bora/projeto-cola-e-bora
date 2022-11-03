import { MigrationInterface, QueryRunner } from "typeorm";

export class createTables1667424761834 implements MigrationInterface {
    name = 'createTables1667424761834'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ongs" DROP COLUMN "age"`);
        await queryRunner.query(`ALTER TABLE "ongs" ALTER COLUMN "balance" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ongs" ALTER COLUMN "balance" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "ongs" ADD "age" integer NOT NULL`);
    }

}
