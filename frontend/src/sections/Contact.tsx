import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Loader2, Mail, MapPin, Phone } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Eyebrow, Reveal, SplitHeading } from '../components/Reveal';
import { api, ApiError } from '../lib/api';
import type { ContactPayload } from '../lib/types';
import { useSiteContent } from '../lib/useSiteContent';

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'success'; message: string } | { kind: 'error'; message: string };

const EMPTY: ContactPayload = { name: '', email: '', company: '', phone: '', interest: '', message: '' };

const inputClass =
  'peer w-full rounded-2xl border border-line bg-white px-4 pt-6 pb-2.5 text-[15px] text-brand-blue outline-none transition placeholder-transparent focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10';
const labelClass =
  'pointer-events-none absolute top-2 left-4 text-xs font-semibold text-brand-blue/55 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-medium peer-focus:top-2 peer-focus:text-xs peer-focus:font-semibold';

function Field({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required,
  autoComplete,
}: {
  id: keyof ContactPayload;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className="relative">
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        placeholder={label}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
      <label htmlFor={id} className={labelClass}>
        {label}
        {required && ' *'}
      </label>
    </div>
  );
}

export function Contact() {
  const { data } = useSiteContent();
  const [form, setForm] = useState<ContactPayload>(EMPTY);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const set = (key: keyof ContactPayload) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  const interests = data?.interests ?? [];

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus({ kind: 'sending' });
    try {
      const payload: ContactPayload = {
        ...form,
        company: form.company || undefined,
        phone: form.phone || undefined,
      };
      const res = await api.sendContact(payload);
      setStatus({ kind: 'success', message: res.message });
      setForm(EMPTY);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Não foi possível enviar agora. Tente novamente em instantes.';
      setStatus({ kind: 'error', message });
    }
  }

  return (
    <section id="contato" className="relative overflow-hidden bg-white py-24 text-brand-blue sm:py-32">
      <div className="grid-bg-light pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_bottom_left,black,transparent_65%)]" />
      <div className="container-site relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <Eyebrow tone="blue">Contato</Eyebrow>
          <SplitHeading
            text="Vamos desenhar o próximo caminho juntos?"
            className="mt-5 font-display text-4xl leading-[1.05] font-bold tracking-[-0.03em] sm:text-5xl"
          />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-brand-blue/70">
              Conte sobre o seu projeto. Um especialista da VIAS DATA CENTERS retorna com uma proposta sob medida.
            </p>
          </Reveal>

          {data && (
            <Reveal delay={0.25}>
              <ul className="mt-10 space-y-4">
                {[
                  { icon: Mail, label: data.contact.email, href: `mailto:${data.contact.email}` },
                  { icon: Phone, label: data.contact.phone, href: `tel:${data.contact.phone.replace(/[^\d+]/g, '')}` },
                  { icon: MapPin, label: data.contact.address },
                ].map(({ icon: Icon, label, href }) => (
                  <li key={label} className="flex items-center gap-4">
                    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-mist text-brand-blue">
                      <Icon className="size-5" />
                    </span>
                    {href ? (
                      <a href={href} className="font-medium hover:text-brand-blue/70">
                        {label}
                      </a>
                    ) : (
                      <span className="font-medium">{label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>

        <Reveal delay={0.1}>
          <div className="relative rounded-[32px] border border-line bg-mist/60 p-6 shadow-[0_40px_100px_-50px_rgba(7,43,117,0.45)] sm:p-10">
            <AnimatePresence mode="wait">
              {status.kind === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[420px] flex-col items-center justify-center text-center"
                  role="status"
                >
                  <motion.span
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
                    className="inline-flex size-16 items-center justify-center rounded-full bg-brand-green text-ink"
                  >
                    <CheckCircle2 className="size-8" />
                  </motion.span>
                  <h3 className="mt-6 font-display text-2xl font-bold">Mensagem enviada!</h3>
                  <p className="mt-2 max-w-sm text-brand-blue/70">{status.message}</p>
                  <button
                    type="button"
                    onClick={() => setStatus({ kind: 'idle' })}
                    className="mt-8 text-sm font-semibold underline underline-offset-4"
                  >
                    Enviar outra mensagem
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-4 sm:grid-cols-2">
                  <Field id="name" label="Nome" value={form.name} onChange={set('name')} required autoComplete="name" />
                  <Field id="email" label="E-mail corporativo" type="email" value={form.email} onChange={set('email')} required autoComplete="email" />
                  <Field id="company" label="Empresa" value={form.company ?? ''} onChange={set('company')} autoComplete="organization" />
                  <Field id="phone" label="Telefone" type="tel" value={form.phone ?? ''} onChange={set('phone')} autoComplete="tel" />

                  <div className="relative sm:col-span-2">
                    <select
                      id="interest"
                      name="interest"
                      required
                      value={form.interest}
                      onChange={(e) => set('interest')(e.target.value)}
                      className={`${inputClass} appearance-none ${form.interest ? '' : 'text-brand-blue/40'}`}
                    >
                      <option value="" disabled>
                        Selecione
                      </option>
                      {interests.map((i) => (
                        <option key={i} value={i} className="text-brand-blue">
                          {i}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="interest" className="pointer-events-none absolute top-2 left-4 text-xs font-semibold text-brand-blue/55">
                      Assunto *
                    </label>
                  </div>

                  <div className="relative sm:col-span-2">
                    <textarea
                      id="message"
                      name="message"
                      required
                      minLength={10}
                      rows={5}
                      placeholder="Mensagem"
                      value={form.message}
                      onChange={(e) => set('message')(e.target.value)}
                      className={`${inputClass} resize-none`}
                    />
                    <label htmlFor="message" className={labelClass}>
                      Como podemos ajudar? *
                    </label>
                  </div>

                  <AnimatePresence>
                    {status.kind === 'error' && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 sm:col-span-2"
                        role="alert"
                      >
                        {status.message}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-col-reverse items-start justify-between gap-4 sm:col-span-2 sm:flex-row sm:items-center">
                    <p className="text-xs text-brand-blue/50">Usamos seus dados apenas para responder a este contato.</p>
                    <motion.button
                      type="submit"
                      disabled={status.kind === 'sending'}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="group inline-flex items-center gap-2 rounded-full bg-brand-blue px-7 py-3.5 text-sm font-bold text-white transition hover:bg-deep disabled:opacity-70"
                    >
                      {status.kind === 'sending' ? (
                        <>
                          Enviando <Loader2 className="size-4 animate-spin" />
                        </>
                      ) : (
                        <>
                          Enviar mensagem <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
