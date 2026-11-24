export function SkeletonGrid({ count = 3, tone = 'dark', className = '' }: { count?: number; tone?: 'dark' | 'light'; className?: string }) {
  const bg = tone === 'dark' ? 'bg-white/5' : 'bg-brand-blue/5';
  return (
    <div className={`grid gap-4 ${className}`} aria-busy="true" aria-label="Carregando conteúdo">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`h-44 animate-pulse rounded-3xl ${bg}`} />
      ))}
    </div>
  );
}

export function ContentError({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  return (
    <p className={`rounded-2xl border p-6 text-sm ${tone === 'dark' ? 'border-white/10 text-white/60' : 'border-line text-brand-blue/70'}`}>
      Não foi possível carregar este conteúdo agora. Verifique se a API está em execução e recarregue a página.
    </p>
  );
}
