import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from './routes/AppRouter';
import { endFirstPrerenderedLoad, seedStaticQueryData } from './lib/prerender';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
seedStaticQueryData(queryClient);

export const App: React.FC = () => {
  useEffect(() => {
    // The first commit has painted once the second frame starts. From here on, newly
    // mounted components (client side navigation) animate as normal.
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(endFirstPrerenderedLoad);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </QueryClientProvider>
  );
};
