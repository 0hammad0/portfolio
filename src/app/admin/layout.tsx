import { Metadata } from "next";
import { SessionProvider } from "@/providers/SessionProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard",
    template: "%s | Admin",
  },
  description: "Portfolio admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          className: "!bg-background-secondary !text-foreground !border !border-border",
          duration: 4000,
        }}
      />
    </SessionProvider>
  );
}
