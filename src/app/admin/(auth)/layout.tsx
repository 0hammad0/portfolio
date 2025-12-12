import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Admin",
  description: "Admin login",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
