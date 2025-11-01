import { DashboardNav } from "@/components/layout/dashboard-nav";
import { UserMenu } from "@/components/layout/user-menu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 flex items-center justify-center">
                <span className="text-white dark:text-zinc-900 font-bold text-sm">
                  VT
                </span>
              </div>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                Vibe Tracker
              </h1>
            </div>
            <DashboardNav />
          </div>
          <UserMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">{children}</main>
    </div>
  );
}
