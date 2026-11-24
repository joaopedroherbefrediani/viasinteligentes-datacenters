import { motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { Logo, ViasInteligentesMark } from '../components/Logo';

const LINKS = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#infraestrutura', label: 'Infraestrutura' },
  { href: '#processo', label: 'Como trabalhamos' },
  { href: '#sustentabilidade', label: 'Sustentabilidade' },
  { href: '#contato', label: 'Contato' },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-blue text-white">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-green/60 to-transparent" />

      <div className="container-site py-20">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl font-display text-4xl leading-[1.05] font-bold tracking-[-0.03em] sm:text-6xl"
        >
          Uma origem comum.
          <br />
          <span className="text-brand-green">Uma especialidade com nome próprio.</span>
        </motion.p>

        <div className="mt-16 grid gap-12 border-t border-white/15 pt-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-wrap items-center gap-6 text-[30px] sm:text-[36px]">
            <ViasInteligentesMark variant="white" />
            <span className="h-14 w-px bg-white/25" />
            <Logo variant="white" />
          </div>

          <nav aria-label="Rodapé">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-white/75">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="transition hover:text-brand-green">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-6 text-xs text-white/55 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} VIAS DATA CENTERS. Todos os direitos reservados.</p>
          <a
            href="#inicio"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 font-semibold text-white transition hover:border-brand-green hover:text-brand-green"
          >
            Voltar ao topo <ArrowUp className="size-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
