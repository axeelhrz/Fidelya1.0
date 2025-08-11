'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import api from '@/lib/axios';
import { ApiResponse } from '@/types';

interface DashboardStats {
  leagues_count: number;
  clubs_count: number;
  members_count: number;
  sports_count: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch basic counts from each endpoint
        const [leaguesRes, clubsRes, membersRes, sportsRes] = await Promise.all([
          api.get('/api/leagues?per_page=1'),
          api.get('/api/clubs?per_page=1'),
          api.get('/api/members?per_page=1'),
          api.get('/api/sports?per_page=1'),
        ]);

        setStats({
          leagues_count: leaguesRes.data.data.total || 0,
          clubs_count: clubsRes.data.data.total || 0,
          members_count: membersRes.data.data.total || 0,
          sports_count: sportsRes.data.data.total || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setStats({
          leagues_count: 0,
          clubs_count: 0,
          members_count: 0,
          sports_count: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    {
      name: 'Create League',
      description: 'Add a new league to the system',
      href: '/leagues?action=create',
      icon: '🏆',
      color: 'bg-blue-500',
    },
    {
      name: 'Add Club',
      description: 'Register a new club',
      href: '/clubs?action=create',
      icon: '🏟️',
      color: 'bg-green-500',
    },
    {
      name: 'Register Member',
      description: 'Add a new member to a club',
      href: '/members?action=create',
      icon: '👤',
      color: 'bg-purple-500',
    },
    {
      name: 'Create Sport',
      description: 'Add a new sport with parameters',
      href: '/sports?action=create',
      icon: '⚽',
      color: 'bg-orange-500',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome to Raquet Power - Sports Organization Management System
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white overflow-hidden shadow rounded-lg animate-pulse">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-gray-300 rounded"></div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
                      <div className="h-6 bg-gray-300 rounded w-8"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            [
              { name: 'Total Leagues', value: stats?.leagues_count || 0, icon: '🏆', href: '/leagues' },
              { name: 'Total Clubs', value: stats?.clubs_count || 0, icon: '🏟️', href: '/clubs' },
              { name: 'Total Members', value: stats?.members_count || 0, icon: '👤', href: '/members' },
              { name: 'Total Sports', value: stats?.sports_count || 0, icon: '⚽', href: '/sports' },
            ].map((item) => (
              <Link key={item.name} href={item.href}>
                <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className="text-2xl">{item.icon}</span>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {item.name}
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {item.value}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link key={action.name} href={action.href}>
                <div className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow hover:shadow-md transition-shadow">
                  <div>
                    <span className={`${action.color} rounded-lg inline-flex p-3 text-white ring-4 ring-white`}>
                      <span className="text-xl">{action.icon}</span>
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {action.name}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      {action.description}
                    </p>
                  </div>
                  <span
                    className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                    aria-hidden="true"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Getting Started</h2>
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Welcome to Raquet Power
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Start by creating your organizational structure. Follow these steps to set up your sports management system:
                </p>
              </div>
              <div className="mt-5">
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>Create <strong>Leagues</strong> to organize your competitions</li>
                  <li>Add <strong>Clubs</strong> and assign them to leagues</li>
                  <li>Register <strong>Members</strong> and associate them with clubs</li>
                  <li>Define <strong>Sports</strong> and configure their parameters</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}