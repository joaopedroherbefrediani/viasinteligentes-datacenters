import { randomUUID } from 'node:crypto';
import { appendFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { Injectable, Logger } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';

export interface ContactRecord extends CreateContactDto {
  id: string;
  createdAt: string;
}

/**
 * Persiste os contatos em um arquivo JSON Lines (backend/data/contacts.jsonl).
 * Troque por um banco de dados, CRM ou envio de e-mail quando for para produção.
 */
@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  private readonly dataDir = join(process.cwd(), 'data');
  private readonly file = join(this.dataDir, 'contacts.jsonl');

  async create(dto: CreateContactDto): Promise<ContactRecord> {
    const record: ContactRecord = { ...dto, id: randomUUID(), createdAt: new Date().toISOString() };
    await mkdir(this.dataDir, { recursive: true });
    await appendFile(this.file, JSON.stringify(record) + '\n', 'utf8');
    this.logger.log(`Novo contato (${record.interest}) id=${record.id}`);
    return record;
  }
}
