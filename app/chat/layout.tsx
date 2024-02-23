import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <SessionProvider session={session}>
      <div className="flex flex-col w-ful bg-slate-950 h-[100dvh] overflow-hidden">
        <Navbar />
        <div className="h-full flex w-full min-h-0">
          <div className="m-4 mt-0 flex w-full min-w-0">
            <Sidebar />
            {children}
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}
