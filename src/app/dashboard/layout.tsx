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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="flex-col !items-stretch !gap-4">
            <SidebarMenuButton asChild tooltip="Upload New Data">
                <Link href="/">
                    <Home/>
                    <span>Home / Upload</span>
                </Link>
            </SidebarMenuButton>
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
        <div className="flex flex-col h-full">
          <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6 sticky top-0 z-30">
              <SidebarTrigger className="md:hidden"/>
              <div className='flex-1'>
                <h1 className="text-2xl font-bold font-headline">
                    {menuItems.find(item => item.href === pathname)?.label || 'Dashboard'}
                </h1>
              </div>
          </header>
          <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 bg-muted/20">
              {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
