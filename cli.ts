// cli.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { Command } from 'commander';
import { AdminAuthService } from './src/modules/auth/services/admin-auth/admin-auth.service';

const program = new Command();

async function bootstrapCli() {
  const appContext = await NestFactory.createApplicationContext(AppModule);

  program
    .command('create-user <email> <password>')
    .description('Создание аккаунта администратора')
    .action(async (email: string, password: string) => {
      const adminAuthService = appContext.get(AdminAuthService);
      try {
        const user = await adminAuthService.signup({
          email: email,
          password: password,
        });
        console.log('User created successfully:', user);
      } catch (error) {
        console.error('Error creating user:', error);
      }
    });

  program.parse(process.argv);
}

bootstrapCli().catch((e) => console.error(e));
