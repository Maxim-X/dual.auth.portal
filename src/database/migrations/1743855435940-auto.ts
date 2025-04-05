import { MigrationInterface, QueryRunner } from 'typeorm';

export class Auto1743855435940 implements MigrationInterface {
  name = 'Auto1743855435940';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`sessions\` (\`uid\` varchar(36) NOT NULL, \`profile_uid\` varchar(255) NOT NULL, \`role\` enum ('USER', 'ADMIN') NOT NULL, \`is_force_expired\` tinyint NOT NULL DEFAULT 0, \`expired_at\` datetime NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`uid\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`sessions\``);
  }
}
