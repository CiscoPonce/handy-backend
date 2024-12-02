import { MigrationInterface, QueryRunner } from "typeorm";

export class CleanupAndRecreate1701527000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop existing tables and types
        await queryRunner.query(`
            DROP TABLE IF EXISTS "job" CASCADE;
            DROP TABLE IF EXISTS "users" CASCADE;
            DROP TABLE IF EXISTS "migrations" CASCADE;
            DROP TYPE IF EXISTS "job_priority_enum" CASCADE;
            DROP TYPE IF EXISTS "job_status_enum" CASCADE;
        `);

        // Create migrations table first
        await queryRunner.query(`
            CREATE TABLE "migrations" (
                "id" SERIAL PRIMARY KEY,
                "timestamp" bigint NOT NULL,
                "name" character varying NOT NULL
            )
        `);

        // Create users table
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "firstName" character varying NOT NULL,
                "lastName" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
            )
        `);

        // Create job_priority_enum
        await queryRunner.query(`
            CREATE TYPE "job_priority_enum" AS ENUM ('low', 'medium', 'high')
        `);

        // Create job_status_enum
        await queryRunner.query(`
            CREATE TYPE "job_status_enum" AS ENUM ('pending', 'accepted', 'refused')
        `);

        // Create job table with proper types
        await queryRunner.query(`
            CREATE TABLE "job" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "priority" "job_priority_enum" NOT NULL DEFAULT 'medium',
                "status" "job_status_enum" NOT NULL DEFAULT 'pending',
                "isCompleted" boolean NOT NULL DEFAULT false,
                "comment" text,
                "date" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_98ab1c14ff8d1cf80d18703b92f" PRIMARY KEY ("id"),
                CONSTRAINT "FK_308fb0752c2ea332cb79f52ceaa" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "job" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "migrations" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "job_priority_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "job_status_enum" CASCADE`);
    }
}
