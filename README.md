# VIAS DATA CENTERS

Site institucional da VIAS DATA CENTERS, com animações em 3D e uma API para o formulário de contato.

**Tecnologias:** React, Three.js, Motion e Tailwind no frontend; NestJS no backend.

## Pré-requisitos

- [Node.js](https://nodejs.org) 20 ou mais recente

## Como rodar

Na pasta principal do projeto:

```bash
npm install     # instala as dependências (só na primeira vez)
npm run dev     # inicia o site e a API
```

Depois abra **http://localhost:5173** no navegador.

### Versão de produção

```bash
npm run prod
```

O site fica em **http://localhost:3000**.

## Estrutura

```
frontend/   → o site (React)
backend/    → a API (NestJS)
```

## Editar o conteúdo

Os textos do site (serviços, números, contato etc.) ficam em um só arquivo:

```
backend/src/content/content.data.ts
```

As mensagens enviadas pelo formulário são salvas em `backend/data/contacts.jsonl`.

## Problemas comuns

- **`address already in use :::3000`**: o projeto já está rodando em outro terminal. Feche-o com `Ctrl+C` e tente de novo.
- **Erro com `&&` no PowerShell**: use os comandos acima (`npm run dev` ou `npm run prod`), que já funcionam no Windows.
- Rode os comandos sempre na **pasta principal**, não dentro de `frontend/` ou `backend/`.
