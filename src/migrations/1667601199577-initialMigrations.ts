import { MigrationInterface, QueryRunner } from "typeorm";

export class initialMigrations1667601199577 implements MigrationInterface {
    name = 'initialMigrations1667601199577'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "street" character varying(100) NOT NULL, "number" character varying(5) NOT NULL, "cep" character varying(8) NOT NULL, "extra" character varying(100) NOT NULL, CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "email" character varying(50) NOT NULL, "birthDate" date NOT NULL, "password" character varying(120) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isAdm" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "eventId" uuid, CONSTRAINT "PK_1dcc1bcf1914f93a195ad806889" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "date" TIMESTAMP NOT NULL, "description" character varying(600) NOT NULL, "addressId" uuid, "ongId" uuid, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ongCategory" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_1ba79fe25ef603dc8a3b5b7df5f" UNIQUE ("name"), CONSTRAINT "PK_7dc53b93ba6d7709f08853b5cb1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ongs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "email" character varying(30) NOT NULL, "tel" character varying(15) NOT NULL, "description" character varying(600) NOT NULL, "cpnj" character varying(14) NOT NULL, "balance" numeric(10,2) NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "categoryId" uuid, "userId" uuid, CONSTRAINT "UQ_0969876d463a63c64efb5fcd683" UNIQUE ("email"), CONSTRAINT "UQ_0aedd0bd7cf01c526310702dde3" UNIQUE ("cpnj"), CONSTRAINT "REL_b227960f3249b2ab55df7fb19a" UNIQUE ("userId"), CONSTRAINT "PK_bcd0edd4e9d5fb34b6e0b8c06d2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "donations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" numeric(10,2) NOT NULL, "date" TIMESTAMP NOT NULL, "userId" uuid, "ongId" uuid, CONSTRAINT "PK_c01355d6f6f50fc6d1b4a946abf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "paymentInfo" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "number" character varying(20) NOT NULL, "securityCode" character varying(3) NOT NULL, "dueDate" TIMESTAMP NOT NULL, "userId" uuid, CONSTRAINT "REL_d9fda67810ccfed027c4817a65" UNIQUE ("userId"), CONSTRAINT "PK_aa67d95006c6ffaa5cb3b3fcfbf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users_events" ADD CONSTRAINT "FK_c371d3d447bb0dfd99409808f98" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_events" ADD CONSTRAINT "FK_4bd0c9767e9a5815aac88bcee1d" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_7319036dfa19ed2a62d4042a528" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_f087c3e87cb64ff8c27fb061729" FOREIGN KEY ("ongId") REFERENCES "ongs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ongs" ADD CONSTRAINT "FK_69c73966cc97e8a778befbefe2b" FOREIGN KEY ("categoryId") REFERENCES "ongCategory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ongs" ADD CONSTRAINT "FK_b227960f3249b2ab55df7fb19a1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "donations" ADD CONSTRAINT "FK_cfd5edc39019b9001bd86e90f77" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "donations" ADD CONSTRAINT "FK_8a3e1047bc53f7a94e06e971c8a" FOREIGN KEY ("ongId") REFERENCES "ongs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "paymentInfo" ADD CONSTRAINT "FK_d9fda67810ccfed027c4817a658" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "paymentInfo" DROP CONSTRAINT "FK_d9fda67810ccfed027c4817a658"`);
        await queryRunner.query(`ALTER TABLE "donations" DROP CONSTRAINT "FK_8a3e1047bc53f7a94e06e971c8a"`);
        await queryRunner.query(`ALTER TABLE "donations" DROP CONSTRAINT "FK_cfd5edc39019b9001bd86e90f77"`);
        await queryRunner.query(`ALTER TABLE "ongs" DROP CONSTRAINT "FK_b227960f3249b2ab55df7fb19a1"`);
        await queryRunner.query(`ALTER TABLE "ongs" DROP CONSTRAINT "FK_69c73966cc97e8a778befbefe2b"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_f087c3e87cb64ff8c27fb061729"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_7319036dfa19ed2a62d4042a528"`);
        await queryRunner.query(`ALTER TABLE "users_events" DROP CONSTRAINT "FK_4bd0c9767e9a5815aac88bcee1d"`);
        await queryRunner.query(`ALTER TABLE "users_events" DROP CONSTRAINT "FK_c371d3d447bb0dfd99409808f98"`);
        await queryRunner.query(`DROP TABLE "paymentInfo"`);
        await queryRunner.query(`DROP TABLE "donations"`);
        await queryRunner.query(`DROP TABLE "ongs"`);
        await queryRunner.query(`DROP TABLE "ongCategory"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TABLE "users_events"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "addresses"`);
    }

}
