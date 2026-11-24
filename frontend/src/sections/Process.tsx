import { motion, useScroll, useSpring } from 'motion/react';
import { useRef } from 'react';
import { Eyebrow, Reveal, SplitHeading } from '../components/Reveal';
import { ContentError, SkeletonGrid } from '../components/Skeleton';
import { useSiteContent } from '../lib/useSiteContent';

export function Process() {
  const { status, data } = useSiteContent();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  return (
    <section id="processo" className="relative overflow-hidden bg-mist py-24 text-brand-blue sm:py-32">
      <div className="container-site">
        <div className="max-w-3xl">
          <Eyebrow tone="blue">Como trabalhamos</Eyebrow>
          <SplitHeading
            text="Do primeiro desenho à operação contínua."
            className="mt-5 font-display text-4xl leading-[1.05] font-bold tracking-[-0.03em] sm:text-5xl"
          />
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-xl text-lg text-brand-blue/70">
              Uma jornada clara, com responsáveis definidos e indicadores visíveis em cada etapa.
            </p>
          </Reveal>
        </div>

        <div ref={ref} className="relative mt-16">
          {status === 'ready' && (
            <>
              {/* Linha conectora — horizontal no desktop, vertical no mobile */}
              <div className="absolute top-6 right-[12.5%] left-[12.5%] hidden h-0.5 bg-brand-blue/10 lg:block">
                <motion.div className="h-full origin-left bg-gradient-to-r from-brand-blue to-brand-green" style={{ scaleX: progress }} />
              </div>
              <div className="absolute top-6 bottom-6 left-6 w-0.5 bg-brand-blue/10 lg:hidden">
                <motion.div className="h-full w-full origin-top bg-gradient-to-b from-brand-blue to-brand-green" style={{ scaleY: progress }} />
              </div>

              <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-6">
                {data.process.map((step, i) => (
                  <motion.li
                    key={step.step}
                    className="relative list-none pl-20 lg:pl-0 lg:text-center"
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.9, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  >
                      <span className="absolute top-0 left-0 inline-flex size-12 items-center justify-center rounded-full border-4 border-mist bg-brand-blue font-display text-sm font-bold text-white shadow-lg lg:relative lg:mx-auto lg:flex">
                        {step.step}
                      </span>
                      <h3 className="font-display text-2xl font-bold lg:mt-8">{step.title}</h3>
                      <p className="mt-2 leading-relaxed text-brand-blue/65 lg:mx-auto lg:max-w-[240px]">{step.description}</p>
                  </motion.li>
                ))}
              </ol>
            </>
          )}
          {status === 'loading' && <SkeletonGrid count={4} tone="light" className="lg:grid-cols-4" />}
          {status === 'error' && <ContentError tone="light" />}
        </div>
      </div>
    </section>
  );
}
