"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { useRouter } from "next/navigation";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Get auth token from cookies
        const cookies = document.cookie.split(';');
        const authToken = cookies
          .find(cookie => cookie.trim().startsWith('auth_token='))
          ?.split('=')[1];

        if (!authToken) {
          // No auth token found, redirect to login
          router.push('/sign-up');
          return;
        }

        // Here you would typically validate the token with your backend
        // This is just a basic example
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication error:', error);
        router.push('/sign-up');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Router will handle redirect
  }


  return (
    <div className="flex h-screen overflow-hidden">
      <div className={`${sidebarOpen ? "block" : "hidden"} md:block`}>
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        {/* right side section */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}

