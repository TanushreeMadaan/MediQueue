'use client';

import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import DashboardStats from '@/components/features/DashboardStat';
import { ListOrdered, Calendar, Stethoscope, Clock, CheckCircle, BarChart } from 'lucide-react';

export default function DashboardPage() {
  return (
    <Layout>
      <div className="space-y-8">
        <DashboardStats />

        {/* move between comps here */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Quick Navigation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/queue">
              <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-gray-50 transition-colors cursor-pointer h-full dark:border-gray-800 dark:hover:bg-gray-800/50 dark:hover:border-blue-500">
                <div className="flex items-start space-x-3">
                  <ListOrdered className="h-8 w-8 text-blue-600 dark:text-blue-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Queue Management</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage walk-in patients</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/appointments">
              <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors cursor-pointer h-full dark:border-gray-800 dark:hover:bg-gray-800/50 dark:hover:border-green-500">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-8 w-8 text-green-600 dark:text-green-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Appointments</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Schedule and manage bookings</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/doctors">
              <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors cursor-pointer h-full dark:border-gray-800 dark:hover:bg-gray-800/50 dark:hover:border-purple-500">
                <div className="flex items-start space-x-3">
                  <Stethoscope className="h-8 w-8 text-purple-600 dark:text-purple-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Doctor Management</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage doctor profiles</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-900 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Today's Performance</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg dark:bg-gray-800/50">
                <BarChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Queue Efficiency: 85%</p>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg dark:bg-gray-800/50">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Appointment Completion: 92%</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-900 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Upcoming Tasks</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg dark:bg-gray-800/50">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Staff meeting in 30 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
