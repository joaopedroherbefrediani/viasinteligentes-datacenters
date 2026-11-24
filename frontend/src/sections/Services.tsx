import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react';
import { Cloud, Compass, Network, ShieldCheck, Server, Zap, type LucideIcon } from 'lucide-react';
import type { PointerEvent } from 'react';
import { Eyebrow, Reveal, SplitHeading } from '../components/Reveal';
import { ContentError, SkeletonGrid } from '../components/Skeleton';
import type { Service } from '../lib/types';
import { useSiteContent } from '../lib/useSiteContent';

const ICONS: Record<Service['icon'], LucideIcon> = {
  server: Server,
  network: Network,
  zap: Zap,
  shield: ShieldCheck,
  cloud: Cloud,
  compass: Compass,
};

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = ICONS[service.icon];
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const rx = useSpring(0, { stiffness: 200, damping: 20 });
  const ry = useSpring(0, { stiffness: 200, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, rgba(146,213,11,0.14), transparent 60%)`;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * 100;
    const py = ((e.clientY - r.top) / r.height) * 100;
    mx.set(px);
    my.set(py);
    ry.set((px - 50) / 10);
    rx.set(-(py - 50) / 10);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <Reveal delay={(index % 3) * 0.08} className="[perspective:1200px]">
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry }}
        className="group relative h-full overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-8 transition-colors duration-500 hover:border-brand-green/40"
      >
        <motion.div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: spotlight }} />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-brand-blue/60 text-brand-green ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
              <Icon className="size-6" strokeWidth={1.8} />
            </span>
            <span className="font-display text-sm text-white/30">{String(index + 1).padStart(2, '0')}</span>
          </div>
          <h3 className="mt-8 font-display text-2xl font-bold text-white">{service.title}</h3>
          <p className="mt-3 leading-relaxed text-white/60">{service.description}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {service.highlights.map((h) => (
              <li key={h} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/70">
                {h}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </Reveal>
  );
}

export function Services() {
  const { status, data } = useSiteContent();

  return (
    <section id="servicos" className="relative overflow-hidden bg-abyss py-24 sm:py-32">
      <div className="grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-electric/20 blur-[140px]" />

      <div className="container-site relative">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <Eyebrow>Serviços</Eyebrow>
            <SplitHeading
              text="Tudo o que a sua infraestrutura precisa, em um só caminho."
              highlight={['caminho.']}
              className="mt-5 font-display text-4xl leading-[1.05] font-bold tracking-[-0.03em] text-white sm:text-5xl"
            />
          </div>
          <Reveal delay={0.2}>
            <p className="max-w-sm text-white/60">
              Soluções modulares que se encaixam como o nosso símbolo: cada peça conecta-se à próxima para formar uma
              operação contínua.
            </p>
          </Reveal>
        </div>

        <div className="mt-16">
          {status === 'ready' && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {data.services.map((s, i) => (
                <ServiceCard key={s.id} service={s} index={i} />
              ))}
            </div>
          )}
          {status === 'loading' && <SkeletonGrid count={6} className="md:grid-cols-2 lg:grid-cols-3" />}
          {status === 'error' && <ContentError />}
        </div>
      </div>
    </section>
  );
}
