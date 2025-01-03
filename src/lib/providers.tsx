import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
    defaultOptions:{
        queries:{
            staleTime: 60 * 1000, // 1 minute
            retry: 1
        }
    }
})

export function Providers({children}: {children: ReactNode}){
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}