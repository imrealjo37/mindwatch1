import { Sidebar } from "./Sidebar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:pl-64 min-h-screen">
        <div className="p-4 lg:p-6 pt-16 lg:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}
