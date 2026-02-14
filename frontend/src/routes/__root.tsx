import { HeadContent, Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"

import "../index.css";

export interface RouterAppContext { }

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSettled: (data, error, variables, context, mutation) => {
      // This triggers after any mutation, whether it succeeded or failed
      queryClient.invalidateQueries();
    },
  }),
});

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: "frontend",
      },
      {
        name: "description",
        content: "frontend is a web application",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
});


function RootComponent() {
  return (
    <QueryClientProvider client={queryClient} >
      <HeadContent />
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
        storageKey="vite-ui-theme"
      >
        <div className="grid grid-rows-[auto_1fr] h-svh">
          <Header />
          <Outlet />
        </div>
        <Toaster richColors />
      </ThemeProvider>
      <TanStackRouterDevtools position="bottom-left" />
    </QueryClientProvider>
  );
}
