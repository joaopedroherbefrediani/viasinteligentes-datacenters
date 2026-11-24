import { motion, useScroll, useTransform } from 'motion/react';
import { Leaf } from 'lucide-react';
import { useRef } from 'react';
import { Eyebrow, Reveal, SplitHeading } from '../components/Reveal';
import { ContentError, SkeletonGrid } from '../components/Skeleton';
import { useSiteContent } from '../lib/useSiteContent';

export function Sustainability() {
  const { status, data } = useSiteContent();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const glowY = useTransform(scrollYProgress, [0, 1], ['-20%', '30%']);

  return (
    <section id="sustentabilidade" ref={ref} className="relative overflow-hidden bg-deep py-24 sm:py-32">
      <motion.div
        style={{ y: glowY }}
        className="pointer-events-none absolute -right-40 top-0 size-[620px] rounded-full bg-brand-green/25 blur-[160px]"
      />
      <div className="container-site relative grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <Eyebrow>Versão verde</Eyebrow>
          <SplitHeading
            text="Mais dados, menos impacto."
            highlight={['menos', 'impacto.']}
            className="mt-5 font-display text-4xl leading-[1.05] font-bold tracking-[-0.03em] text-white sm:text-6xl"
          />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">
              O verde da marca é também um compromisso: projetar, operar e evoluir a infraestrutura com eficiência e
              responsabilidade ambiental.
            </p>
          </Reveal>
        </div>

        <div className="space-y-4">
          {status === 'ready' &&
            data.sustainability.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ x: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  className="glass flex gap-5 rounded-3xl p-6 sm:p-7"
                >
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-green text-ink">
                    <Leaf className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold text-white">{item.title}</h3>
                    <p className="mt-1.5 leading-relaxed text-white/65">{item.description}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          {status === 'loading' && <SkeletonGrid count={3} />}
          {status === 'error' && <ContentError />}
        </div>
      </div>
    </section>
  );
}
