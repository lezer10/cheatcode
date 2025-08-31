'use client';

import { Navbar } from '@/components/home/sections/navbar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SidebarLeft } from '@/components/sidebar/sidebar-left';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { DeleteOperationProvider } from '@/contexts/DeleteOperationContext';
import { BillingProvider } from '@/contexts/BillingContext';
import { MaintenanceAlert } from '@/components/maintenance-alert';
import { useAccounts } from '@/hooks/use-accounts';
import { Loader2 } from 'lucide-react';
import { MaintenancePage } from '@/components/maintenance/maintenance-page';
import { StatusOverlay } from '@/components/ui/status-overlay';
import { useApiHealth } from '@/hooks/react-query/usage/use-health';

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({
  children,
}: HomeLayoutProps) {
  const { user, isLoaded } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  // Enhanced features from layout-content.tsx
  const [showPricingAlert, setShowPricingAlert] = useState(false);
  const [showMaintenanceAlert, setShowMaintenanceAlert] = useState(false);
  const { data: accounts } = useAccounts();
  const personalAccount = accounts?.find((account) => account.personal_account);



  // Enhanced: Smart API Health Monitoring with React Query
  const { data: healthData, isLoading: isCheckingHealth, isError: isApiUnhealthy } = useApiHealth();
  const isApiHealthy = healthData?.status === 'ok' && !isApiUnhealthy;

  // Check if we're on a thread page (hide home navbar on thread pages)
  const isThreadPage = pathname?.includes('/projects/') && pathname?.includes('/thread/');

  // Ensure we only render after hydration to prevent SSR/client mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Enhanced: Initialize alert states
  useEffect(() => {
    setShowPricingAlert(false);
    setShowMaintenanceAlert(false);
  }, []);

  // Listen for sidebar toggle events from navbar
  useEffect(() => {
    const handleToggleSidebar = () => {
      setSidebarOpen(prev => !prev);
    };

    window.addEventListener('toggleHomeSidebar', handleToggleSidebar);
    return () => window.removeEventListener('toggleHomeSidebar', handleToggleSidebar);
  }, []);



  // Enhanced: Show loading state while checking auth or health
  if (!isClient || !isLoaded || isCheckingHealth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Enhanced: Show maintenance page if API is not healthy
  if (!isApiHealthy) {
    return <MaintenancePage />;
  }

  // Enhanced: Graceful degradation - Don't render anything if not authenticated
  if (!user) {
    return (
      <BillingProvider>
        <div
          className="w-full relative min-h-screen"
          style={!isThreadPage ? {
            backgroundImage: 'linear-gradient( 156.2deg,  rgba(0,0,0,1) 14.8%, rgba(32,104,177,1) 68.1%, rgba(222,229,237,1) 129% )'
          } : {
            backgroundColor: '#0a0a0a'
          }}
        >
          {!isThreadPage && <Navbar sidebarOpen={false} />}
          <div className={isThreadPage ? "pt-0" : "pt-6"}>
            {children}
          </div>
          {!isThreadPage && (
            <footer className="w-full py-6 text-center text-xs text-white/70">
              Built by <a href="https://jigyansurout.com/" target="_blank" rel="noreferrer" className="no-underline hover:text-white">Jigyansu Rout</a>
            </footer>
          )}
        </div>
      </BillingProvider>
    );
  }

  // Authenticated user - show enhanced layout with all features
  return (
    <DeleteOperationProvider>
      <BillingProvider>
        <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SidebarLeft />
        <SidebarInset>
          <div
            className="w-full relative min-h-screen"
            style={!isThreadPage ? {
              backgroundImage: 'linear-gradient( 156.2deg,  rgba(0,0,0,1) 14.8%, rgba(32,104,177,1) 68.1%, rgba(222,229,237,1) 129% )'
            } : {
              backgroundColor: '#0a0a0a'
            }}
          >
            {!isThreadPage && <Navbar sidebarOpen={sidebarOpen} />}
            <div className={isThreadPage ? "pt-0" : "pt-6"}>
              {children}
            </div>
            {!isThreadPage && (
              <footer className="w-full py-6 text-center text-xs text-white/70">
                Built by <a href="https://jigyansurout.com/" target="_blank" rel="noreferrer" className="no-underline hover:text-white">Jigyansu Rout</a>
              </footer>
            )}
          </div>
        </SidebarInset>

        {/* Enhanced: Pricing Alert Framework (ready to enable) */}
        {/* <PricingAlert
          open={showPricingAlert}
          onOpenChange={setShowPricingAlert}
          closeable={false}
          accountId={personalAccount?.account_id}
        /> */}

        {/* Enhanced: Maintenance Alert */}
        <MaintenanceAlert
          open={showMaintenanceAlert}
          onOpenChange={setShowMaintenanceAlert}
          closeable={true}
        />

        {/* Enhanced: Status overlay for deletion operations and async tasks */}
        <StatusOverlay />
      </SidebarProvider>
      </BillingProvider>
    </DeleteOperationProvider>
  );
}
