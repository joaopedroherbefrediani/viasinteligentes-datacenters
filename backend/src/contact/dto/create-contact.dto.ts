import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { SITE_CONTENT } from '../../content/content.data';

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class CreateContactDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty({ message: 'Informe seu nome.' })
  @MaxLength(120)
  name: string;

  @Transform(trim)
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  @MaxLength(160)
  email: string;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(120)
  company?: string;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;

  @IsIn(SITE_CONTENT.interests, { message: 'Selecione um assunto válido.' })
  interest: string;

  @Transform(trim)
  @IsString()
  @MinLength(10, { message: 'Conte um pouco mais (mínimo de 10 caracteres).' })
  @MaxLength(2000)
  message: string;
}
