'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/forms/LoginForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Stethoscope, ListOrdered, Calendar, BarChart4 } from 'lucide-react';

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // if user is authenticated redirect straight to dashboard
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  // show loading screen till auth
  if (loading || isAuthenticated) {
    return <LoadingSpinner fullscreen />;
  }

  return (
    // left side holds logo
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="flex min-h-screen">
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center p-12">
          <div className="text-center text-white">
            <Stethoscope className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">MediQueue</h1>
            <p className="text-xl text-blue-100 mb-8">
              A Modern Front Desk Management System
            </p>
            <div className="space-y-4 text-left inline-block">
              <div className="flex items-center space-x-3">
                <ListOrdered className="h-6 w-6 text-blue-200" />
                <span>Efficient Queue Management</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-6 w-6 text-blue-200" />
                <span>Smart Appointment Scheduling</span>
              </div>
              <div className="flex items-center space-x-3">
                <BarChart4 className="h-6 w-6 text-blue-200" />
                <span>Real-time Analytics</span>
              </div>
            </div>
          </div>
        </div>

       {/* right side holds the form  */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="lg:hidden text-center mb-8">
              <Stethoscope className="h-12 w-12 mx-auto mb-2 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ClinicDesk</h1>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-8 dark:bg-gray-900 dark:border dark:border-gray-800">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome Back</h2>
                <p className="text-gray-600 dark:text-gray-400">Sign in to your account to continue.</p>
              </div>
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
