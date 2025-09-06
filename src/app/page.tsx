// src/app/(dashboard)/page.tsx
'use client'; // Recharts requires client-side rendering

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const salesData = [
  { name: 'Jan', sales: 4000 }, { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 }, { name: 'Apr', sales: 4500 },
];

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Sales Chart Card */}
      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground">Sales Overview</h3>
        <div className="mt-4 h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
                contentStyle={{
                  backgroundColor: 'var(--color-background)',
                  borderRadius: '0.75rem',
                  borderColor: 'rgba(128, 128, 128, 0.2)',
                }}
              />
              <Bar dataKey="sales" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Example Metric Card */}
      <div className="rounded-xl border bg-background p-6 shadow-sm">
         <h3 className="text-lg font-semibold text-foreground">New Orders</h3>
         <p className="mt-4 text-4xl font-bold text-primary">152</p>
         <p className="mt-1 text-sm text-zinc-500">+12% from last month</p>
      </div>
    </div>
  );
}