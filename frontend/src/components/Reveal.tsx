import { motion, type HTMLMotionProps } from 'motion/react';
import type { ReactNode } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  ...rest
}: { children: ReactNode; delay?: number; y?: number } & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Título com revelação palavra a palavra. */
export function SplitHeading({
  text,
  className = '',
  as: Tag = 'h2',
  highlight = [],
}: {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
  highlight?: string[];
}) {
  const words = text.split(' ');
  const MotionTag = motion[Tag];
  // O gatilho fica no título inteiro: as palavras começam recortadas pelo overflow-hidden
  // e nunca seriam detectadas como visíveis individualmente.
  return (
    <MotionTag
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
          <motion.span
            className={`inline-block ${highlight.includes(word) ? 'text-gradient' : ''}`}
            variants={{
              hidden: { y: '110%' },
              show: { y: '0%', transition: { duration: 0.8, ease: EASE } },
            }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

export function Eyebrow({ children, tone = 'green' }: { children: ReactNode; tone?: 'green' | 'blue' }) {
  return (
    <Reveal y={12}>
      <span className={`eyebrow ${tone === 'green' ? 'text-brand-green' : 'text-brand-blue'}`}>
        <span className={`h-px w-8 ${tone === 'green' ? 'bg-brand-green' : 'bg-brand-blue'}`} />
        {children}
      </span>
    </Reveal>
  );
}
