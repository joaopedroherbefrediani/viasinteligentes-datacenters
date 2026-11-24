import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { lazy, Suspense, useRef, useState } from 'react';
import { Counter } from '../components/Counter';
import { useSiteContent } from '../lib/useSiteContent';

const RackCorridor = lazy(() => import('../three/RackCorridor'));
const EASE = [0.22, 1, 0.36, 1] as const;

export function Infrastructure() {
  const { status, data } = useSiteContent();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: '200px 0px 200px 0px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const captions = data?.infrastructure ?? [];
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (!captions.length) return;
    setActive(Math.min(captions.length - 1, Math.max(0, Math.floor(p * captions.length))));
  });
  const caption = captions[active];

  return (
    <section id="infraestrutura" ref={ref} className="relative h-[320vh] bg-ink">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-0">
          <Suspense fallback={null}>
            <RackCorridor progress={scrollYProgress} active={inView} />
          </Suspense>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/70" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/10 to-transparent" />

        <div className="container-site relative flex h-full flex-col justify-between pt-28 pb-10 sm:pb-14">
          <div className="max-w-2xl">
            <span className="eyebrow text-brand-green">
              <span className="h-px w-8 bg-brand-green" />
              Infraestrutura
            </span>
            <h2 className="mt-5 font-display text-4xl leading-[1.05] font-bold tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
              Caminhe pelo <span className="text-gradient">coração</span> da operação.
            </h2>
          </div>

          <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
            <div className="relative h-44 sm:h-40" aria-live="polite">
              <AnimatePresence mode="wait">
                {caption && (
                  <motion.div
                    key={caption.title}
                    className="absolute inset-x-0 bottom-0"
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <span className="font-display text-sm font-semibold text-brand-green">
                      {String(active + 1).padStart(2, '0')} / {String(captions.length).padStart(2, '0')}
                    </span>
                    <h3 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">{caption.title}</h3>
                    <p className="mt-3 max-w-md text-white/75">{caption.description}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {status === 'ready' && (
              <div className="glass grid grid-cols-2 gap-x-8 gap-y-6 rounded-3xl p-6 sm:grid-cols-4 lg:grid-cols-2 lg:p-7">
                {data.stats.map((s) => (
                  <div key={s.label} className="min-w-[120px]">
                    <Counter stat={s} className="font-display text-3xl font-bold text-white sm:text-4xl" />
                    <p className="mt-1 max-w-[160px] text-xs leading-snug text-white/60">{s.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 h-px w-full bg-white/10">
            <motion.div className="h-full bg-brand-green" style={{ width: bar }} />
          </div>
        </div>
      </div>
    </section>
  );
}
