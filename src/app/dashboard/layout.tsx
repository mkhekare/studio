'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { DataProvider } from '@/context/data-context';
import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  HeartPulse,
  BarChart2,
  Cpu,
  FileText,
  Home,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DataProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </DataProvider>
  );
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/diagnosis', label: 'Data Diagnosis', icon: HeartPulse },
    { href: '/dashboard/visualizations', label: 'Visualizations', icon: BarChart2 },
    { href: '/dashboard/ml-models', label: 'ML Models', icon: Cpu },
    { href: '/dashboard/report', label: 'Report', icon: FileText },
  ];

  return (
    <SidebarProvider>
      <div className="bg-background">
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="flex-col !items-stretch !gap-4">
              <Link href="/" legacyBehavior passHref>
                  <SidebarMenuButton tooltip="Upload New Data">
                      <Home/>
                      <span>Home / Upload</span>
                  </SidebarMenuButton>
              </Link>
            <div className="flex items-center gap-3 rounded-md border p-2">
              <Avatar>
                <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="profile avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold truncate">Demo User</span>
                <span className="text-xs text-muted-foreground truncate">
                  user@example.com
                </span>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 sticky top-0 z-30">
              <SidebarTrigger className="md:hidden"/>
              <h1 className="text-xl font-semibold font-headline">
                  {menuItems.find(item => pathname.startsWith(item.href))?.label || 'Dashboard'}
              </h1>
          </header>
          <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
