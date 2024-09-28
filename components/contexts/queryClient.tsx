
'use client';
import { QueryClientProvider ,  } from "@tanstack/react-query";
import React, { ReactNode } from "react";
import { getQueryClient } from "./getQueryClient";
export function Provider({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();
  
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }