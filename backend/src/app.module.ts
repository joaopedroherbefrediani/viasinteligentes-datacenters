import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { DynamicModule, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';
import { ContactModule } from './contact/contact.module';
import { ContentModule } from './content/content.module';
import { HealthController } from './health/health.controller';

// Em produção o NestJS também entrega o build do frontend (frontend/dist).
const frontendDist = join(__dirname, '..', '..', 'frontend', 'dist');
const staticModules: DynamicModule[] = existsSync(frontendDist)
  ? [
      ServeStaticModule.forRoot({
        rootPath: frontendDist,
        exclude: ['/api/{*path}'],
      }),
    ]
  : [];

@Module({
  imports: [
    ...staticModules,
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60_000, limit: 60 }]),
    ContentModule,
    ContactModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
