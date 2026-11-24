import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contact')
@UseGuards(ThrottlerGuard)
export class ContactController {
  constructor(private readonly contacts: ContactService) {}

  /** Recebe mensagens do formulário. Limite: 5 envios por minuto por IP. */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  async create(@Body() dto: CreateContactDto) {
    const saved = await this.contacts.create(dto);
    return {
      id: saved.id,
      message: 'Recebemos sua mensagem. Nossa equipe entrará em contato em breve.',
    };
  }
}
