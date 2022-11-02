import { MigrationInterface, QueryRunner } from "typeorm";

export class colabora1667362694966 implements MigrationInterface {
    name = 'colabora1667362694966'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "eventId" uuid, CONSTRAINT "PK_1dcc1bcf1914f93a195ad806889" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users_events" ADD CONSTRAINT "FK_c371d3d447bb0dfd99409808f98" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_events" ADD CONSTRAINT "FK_4bd0c9767e9a5815aac88bcee1d" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_events" DROP CONSTRAINT "FK_4bd0c9767e9a5815aac88bcee1d"`);
        await queryRunner.query(`ALTER TABLE "users_events" DROP CONSTRAINT "FK_c371d3d447bb0dfd99409808f98"`);
        await queryRunner.query(`DROP TABLE "users_events"`);
    }

}
