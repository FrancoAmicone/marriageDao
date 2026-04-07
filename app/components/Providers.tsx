'use client'

import { useState } from "react";
import { MiniKitProvider } from "@worldcoin/minikit-js/minikit-provider";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "@/lib/wagmi/config";
import { Header } from "./Header";
import { usePathname } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  const isGalleryPage = pathname === '/marriage/gallery';

  return (
    <MiniKitProvider>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          {!isGalleryPage && <Header />}
          <div className={isGalleryPage ? "pt-0" : "pt-[160px]"}>
            {children}
          </div>
        </QueryClientProvider>
      </WagmiProvider>
    </MiniKitProvider>
  );
}
