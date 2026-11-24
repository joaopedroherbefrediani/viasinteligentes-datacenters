import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Logo } from './Logo';

const LINKS = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#infraestrutura', label: 'Infraestrutura' },
  { href: '#processo', label: 'Como trabalhamos' },
  { href: '#sustentabilidade', label: 'Sustentabilidade' },
];

export function Navbar() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 40));

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`transition-all duration-500 ${
            scrolled ? 'border-b border-white/10 bg-ink/90 backdrop-blur-xl' : 'border-b border-transparent bg-transparent'
          }`}
        >
          <nav className="container-site flex h-18 items-center justify-between py-4">
            <a href="#inicio" className="text-[28px] sm:text-[32px]" aria-label="VIAS DATA CENTERS — início">
              <Logo variant="white" />
            </a>

            <ul className="hidden items-center gap-1 lg:flex">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="group relative rounded-full px-4 py-2 text-sm font-medium text-white/75 transition-colors hover:text-white"
                  >
                    {l.label}
                    <span className="absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-brand-green transition-transform duration-300 group-hover:scale-x-100" />
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <a
                href="#contato"
                className="hidden items-center gap-1.5 rounded-full bg-brand-green px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-brand-green-soft sm:inline-flex"
              >
                Fale conosco <ArrowUpRight className="size-4" />
              </a>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 text-white lg:hidden"
                aria-label={open ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={open}
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </nav>
        </div>
        <motion.div className="h-0.5 origin-left bg-brand-green" style={{ scaleX: progress }} />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-ink/95 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.ul
              className="container-site flex h-full flex-col justify-center gap-2"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
            >
              {[...LINKS, { href: '#contato', label: 'Contato' }].map((l) => (
                <motion.li
                  key={l.href}
                  variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 font-display text-4xl font-semibold text-white"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
