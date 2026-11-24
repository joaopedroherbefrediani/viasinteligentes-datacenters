import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from './api';
import type { SiteContent } from './types';

type State =
  | { status: 'loading'; data: null }
  | { status: 'ready'; data: SiteContent }
  | { status: 'error'; data: null };

const ContentContext = createContext<State>({ status: 'loading', data: null });

export function ContentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ status: 'loading', data: null });

  useEffect(() => {
    const controller = new AbortController();
    api
      .getContent(controller.signal)
      .then((data) => setState({ status: 'ready', data }))
      .catch((err) => {
        if (!controller.signal.aborted) {
          console.error('Falha ao carregar conteúdo da API', err);
          setState({ status: 'error', data: null });
        }
      });
    return () => controller.abort();
  }, []);

  return <ContentContext.Provider value={state}>{children}</ContentContext.Provider>;
}

export function useSiteContent() {
  return useContext(ContentContext);
}
