import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Splash from "./Pages/Splash.tsx";
import Earn from "./Pages/Earns/Earn.tsx";
import Leaderboard from "./Pages/Leaderboards/Leaderboard.tsx";
import Index from "./Pages/Game/Index.tsx";
import Profile from "./Pages/Profile/Profile.tsx";
import Intro from "./Pages/Intro/Intro.tsx";
import { WagmiProvider, createConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { type Chain } from "viem";

export const LensTestnet: Chain = {
  id: 37111,
  name: "Lens Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "GRASS",
    symbol: "GRASS",
  },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.lens.dev"] },
  },
  blockExplorers: {
    default: {
      name: "Lens Explorer",
      url: "https://block-explorer.testnet.lens.dev/",
    },
  },
  testnet: true,
};

export const config = createConfig(
  getDefaultConfig({
    chains: [LensTestnet],
    walletConnectProjectId: import.meta.env.VITE_PROJECT_ID,
    appName: "Lens Tap",
    // Optional App Info
    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <ConnectKitProvider
        customTheme={{
          "--ck-font-family": '"mainfont", "Comic Sans", cursive',
          "--ck-border-radius": 42,
        }}
      >
        <div>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Splash />} />
              <Route path="/intro" element={<Intro />} />
              <Route path="/index" element={<Index />} />
              <Route path="/earn" element={<Earn />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </BrowserRouter>
        </div>
      </ConnectKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
