import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { ReactQueryDevtools } from 'react-query/devtools'
import { theme } from '../styles/theme'

import { SidebarDrawerProvider } from '../contexts/SidebarDrawerContext'
import { makeServer } from '../../services/mirage'
import { QueryClientProvider } from 'react-query'
import { queryClient } from '../../services/queryClient'
import { AuthProvider } from '../contexts/AuthContext'

// if (process.env.NODE_ENV === 'development') {
//   makeServer();
// }

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChakraProvider theme={theme}>
          <SidebarDrawerProvider>
            <Component {...pageProps} />
          </SidebarDrawerProvider>
        </ChakraProvider>
        <ReactQueryDevtools/>
      </AuthProvider>
    </QueryClientProvider>
  )
}
