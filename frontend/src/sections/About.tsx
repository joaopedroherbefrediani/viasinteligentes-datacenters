import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { FLUXO_MODULE_PATH, FLUXO_ROTATION_CENTER, FLUXO_VIEWBOX } from '../lib/fluxo';
import { Logo, ViasInteligentesMark } from '../components/Logo';
import { Eyebrow, Reveal, SplitHeading } from '../components/Reveal';
import { ContentError, SkeletonGrid } from '../components/Skeleton';
import { useSiteContent } from '../lib/useSiteContent';

/** Símbolo cujos módulos se encaixam conforme a rolagem — "Conexão". */
function ConnectingSymbol() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const gap = useTransform(scrollYProgress, [0, 1], [22, 0]);
  const blueX = useTransform(gap, (g) => -g);
  const blueY = useTransform(gap, (g) => g * 0.5);
  const greenX = useTransform(gap, (g) => g);
  const greenY = useTransform(gap, (g) => -g * 0.5);
  const { x, y } = FLUXO_ROTATION_CENTER;

  return (
    <div ref={ref} className="flex items-center justify-center">
      <svg viewBox={FLUXO_VIEWBOX} className="w-full max-w-[180px] overflow-visible" aria-hidden>
        <motion.path d={FLUXO_MODULE_PATH} fill="#072B75" style={{ x: blueX, y: blueY }} />
        <motion.g style={{ x: greenX, y: greenY }}>
          <path d={FLUXO_MODULE_PATH} fill="#92D50B" transform={`rotate(180 ${x} ${y})`} />
        </motion.g>
      </svg>
    </div>
  );
}

/** Linha fina com um ponto que a percorre sem parar — "Continuidade", de forma minimalista. */
function ContinuousLine() {
  return (
    <div className="relative flex h-24 items-center" aria-hidden>
      <div className="h-px w-full bg-brand-blue/15" />
      <motion.span
        className="absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-brand-green shadow-[0_0_12px_rgba(146,213,11,0.8)]"
        animate={{ left: ['0%', '100%'] }}
        transition={{ duration: 3.2, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
      />
      <span className="absolute left-0 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-brand-blue" />
      <span className="absolute right-0 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-brand-blue" />
    </div>
  );
}

export function About() {
  const { status, data } = useSiteContent();

  return (
    <section id="sobre" className="relative overflow-hidden bg-white text-brand-blue">
      <div className="grid-bg-light pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />

      <div className="container-site relative py-24 sm:py-32">
        <div className="grid items-end gap-12 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <Eyebrow tone="blue">Quem somos</Eyebrow>
            <SplitHeading
              text="Uma origem comum. Uma especialidade com nome próprio."
              className="mt-5 font-display text-4xl leading-[1.05] font-bold tracking-[-0.03em] sm:text-5xl lg:text-6xl"
            />
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-blue/70">
                A VIAS DATA CENTERS nasce do Grupo Vias Inteligentes para cuidar de uma especialidade: a infraestrutura
                que mantém dados, aplicações e negócios em movimento. A experiência do grupo é a nossa origem — data
                centers são o nosso foco.
              </p>
            </Reveal>
          </div>

          {/* Assinatura conjunta */}
          <Reveal delay={0.15}>
            <div className="relative rounded-[28px] border border-line bg-white p-8 shadow-[0_30px_80px_-40px_rgba(7,43,117,0.35)]">
              <p className="mb-6 text-xs font-semibold tracking-[0.2em] text-brand-blue/50 uppercase">Assinatura conjunta</p>
              <div className="flex flex-wrap items-center gap-6 text-[30px] sm:text-[34px]">
                <ViasInteligentesMark />
                <span className="h-14 w-px bg-line" />
                <Logo />
              </div>
              <p className="mt-6 text-sm leading-relaxed text-brand-blue/60">
                A origem abre a leitura. A especialidade completa a mensagem.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Pilares do símbolo */}
        <div className="mt-20 grid gap-5 md:grid-cols-2">
          {status === 'ready' &&
            data.pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1}>
                <div className="group relative h-full overflow-hidden rounded-[28px] bg-mist p-8 sm:p-10">
                  <div className="grid items-center gap-8 sm:grid-cols-[1fr_180px]">
                    <div>
                      <span className="font-display text-sm font-semibold text-brand-green">0{i + 1}</span>
                      <h3 className="mt-2 font-display text-3xl font-bold">{p.title}</h3>
                      <p className="mt-3 leading-relaxed text-brand-blue/70">{p.description}</p>
                    </div>
                    {i === 0 ? (
                      <ConnectingSymbol />
                    ) : (
                      <ContinuousLine />
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          {status === 'loading' && <SkeletonGrid count={2} tone="light" className="md:col-span-2 md:grid-cols-2" />}
          {status === 'error' && <ContentError tone="light" />}
        </div>

        {/* Relação com o grupo */}
        {status === 'ready' && (
          <div className="mt-20 grid gap-px overflow-hidden rounded-[28px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {data.group.map((g, i) => (
              <Reveal key={g.title} delay={i * 0.08} className="bg-white p-8">
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-brand-blue text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h4 className="mt-5 font-display text-xl font-bold">{g.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-brand-blue/65">{g.description}</p>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
