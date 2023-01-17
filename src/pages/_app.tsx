import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const reactQueryClient=new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (  
    <QueryClientProvider client={reactQueryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )


  
}
