import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./app/router/AppRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient} >
      <AppRouter />
    </QueryClientProvider>
  </React.StrictMode>
);