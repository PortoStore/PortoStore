"use client";

import React, { createContext, useContext, useState } from 'react';

type AdminNavigationContextType = {
  isDirty: boolean;
  setIsDirty: (value: boolean) => void;
};

const AdminNavigationContext = createContext<AdminNavigationContextType | undefined>(undefined);

export function AdminNavigationProvider({ children }: { children: React.ReactNode }) {
  const [isDirty, setIsDirty] = useState(false);

  return (
    <AdminNavigationContext.Provider value={{ isDirty, setIsDirty }}>
      {children}
    </AdminNavigationContext.Provider>
  );
}

export function useAdminNavigation() {
  const context = useContext(AdminNavigationContext);
  if (context === undefined) {
    throw new Error('useAdminNavigation must be used within an AdminNavigationProvider');
  }
  return context;
}
