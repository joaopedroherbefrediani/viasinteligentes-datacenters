import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { lazy, Suspense, useRef } from 'react';

const HeroScene = lazy(() => import('../three/HeroScene'));
const EASE = [0.22, 1, 0.36, 1] as const;
const TITLE = ['Infraestrutura', 'para', 'novos', 'caminhos'];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: '0px 0px -10% 0px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <section id="inicio" ref={ref} className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink">
      <motion.div className="absolute inset-0" style={{ scale: sceneScale }}>
        <Suspense fallback={null}>
          <HeroScene active={inView} />
        </Suspense>
      </motion.div>

      {/* Vinhetas para legibilidade */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/40 to-transparent max-lg:from-ink/40" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-ink/90 via-ink/30 to-transparent lg:hidden" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container-site relative z-10 flex h-full flex-col justify-end pb-24 sm:pb-28 lg:justify-center lg:pb-0"
      >
        <h1
          className="max-w-3xl font-display text-[2.9rem] leading-[0.98] font-bold tracking-[-0.03em] text-white sm:text-7xl lg:text-[5.6rem]"
          aria-label={TITLE.join(' ')}
        >
          {TITLE.map((word, i) => (
            <span key={word} className="mr-[0.22em] inline-block overflow-hidden pb-[0.1em] align-bottom" aria-hidden>
              <motion.span
                className={`inline-block ${word === 'caminhos' ? 'text-gradient' : ''}`}
                initial={{ y: '115%', rotate: 4 }}
                animate={{ y: '0%', rotate: 0 }}
                transition={{ duration: 1, delay: 0.5 + i * 0.09, ease: EASE }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1, ease: EASE }}
        >
          Data centers projetados para <strong className="font-semibold text-white">conexão</strong> e{' '}
          <strong className="font-semibold text-white">continuidade</strong>: espaço, energia, conectividade e operação
          24/7 para os dados que movem o seu negócio.
        </motion.p>

        <motion.div
          className="mt-9 flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.15, ease: EASE }}
        >
          <a
            href="#servicos"
            className="group inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-3.5 text-sm font-bold text-ink shadow-[0_0_40px_-8px_rgba(146,213,11,0.7)] transition hover:bg-brand-green-soft"
          >
            Conheça o projeto
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#contato"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:border-white/50 hover:bg-white/5"
          >
            Fale com um especialista
          </a>
        </motion.div>
      </motion.div>

      <motion.a
        href="#sobre"
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-medium tracking-[0.2em] text-white/50 uppercase sm:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        aria-label="Rolar para a próxima seção"
      >
        Role
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
          <ArrowDown className="size-4" />
        </motion.span>
      </motion.a>
    </section>
  );
}
