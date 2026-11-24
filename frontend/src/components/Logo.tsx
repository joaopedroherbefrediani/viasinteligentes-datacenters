import { FLUXO_MODULE_PATH, FLUXO_ROTATION_CENTER, FLUXO_VIEWBOX } from '../lib/fluxo';

type Variant = 'color' | 'white';

const PALETTE: Record<Variant, { blue: string; green: string; text: string; sub: string }> = {
  color: { blue: '#072B75', green: '#92D50B', text: '#072B75', sub: '#072B75' },
  // "Branca sobre azul" — uso sobre campos escuros (guia de identidade, p. 14)
  white: { blue: '#FFFFFF', green: '#FFFFFF', text: '#FFFFFF', sub: 'rgba(255,255,255,0.75)' },
};

export function FluxoSymbol({
  className,
  blue = '#072B75',
  green = '#92D50B',
  title,
}: {
  className?: string;
  blue?: string;
  green?: string;
  title?: string;
}) {
  const { x, y } = FLUXO_ROTATION_CENTER;
  return (
    <svg viewBox={FLUXO_VIEWBOX} className={className} role={title ? 'img' : undefined} aria-hidden={!title}>
      {title && <title>{title}</title>}
      <path d={FLUXO_MODULE_PATH} fill={blue} />
      <path d={FLUXO_MODULE_PATH} fill={green} transform={`rotate(180 ${x} ${y})`} />
    </svg>
  );
}

export function Logo({ variant = 'color', className = '' }: { variant?: Variant; className?: string }) {
  const c = PALETTE[variant];
  return (
    <span className={`inline-flex flex-col ${className}`} aria-label="VIAS DATA CENTERS">
      <span className="flex items-center gap-[0.35em]">
        <FluxoSymbol className="h-[1.15em] w-auto" blue={c.blue} green={c.green} />
        <span
          className="font-display text-[1.25em] leading-none font-bold tracking-[-0.02em]"
          style={{ color: c.text }}
        >
          VIAS
        </span>
        <span
          className="font-display text-[0.42em] leading-[0.95] font-bold tracking-wide"
          style={{ color: c.text }}
        >
          DATA
          <br />
          CENTERS
        </span>
      </span>
    </span>
  );
}

/** Representação tipográfica simples da marca-mãe para a assinatura conjunta. */
export function ViasInteligentesMark({ variant = 'color', className = '' }: { variant?: Variant; className?: string }) {
  const color = variant === 'white' ? '#FFFFFF' : '#072B75';
  return (
    <span className={`inline-flex flex-col leading-none ${className}`} style={{ color }} aria-label="Vias Inteligentes">
      <span className="font-display text-[1.25em] font-bold tracking-[-0.03em] lowercase">vias</span>
      <span className="text-[0.42em] font-semibold tracking-wide">inteligentes</span>
    </span>
  );
}
