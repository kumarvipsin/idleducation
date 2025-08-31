
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const data = [
  {
    name: 'Jan',
    totalUsers: Math.floor(Math.random() * 1000) + 500,
    totalStudents: Math.floor(Math.random() * 800) + 400,
    newStudents: Math.floor(Math.random() * 300) + 100,
    trainedStudents: Math.floor(Math.random() * 400) + 200,
  },
  {
    name: 'Feb',
    totalUsers: Math.floor(Math.random() * 1000) + 500,
    totalStudents: Math.floor(Math.random() * 800) + 400,
    newStudents: Math.floor(Math.random() * 300) + 100,
    trainedStudents: Math.floor(Math.random() * 400) + 200,
  },
  {
    name: 'Mar',
    totalUsers: Math.floor(Math.random() * 1000) + 500,
    totalStudents: Math.floor(Math.random() * 800) + 400,
    newStudents: Math.floor(Math.random() * 300) + 100,
    trainedStudents: Math.floor(Math.random() * 400) + 200,
  },
  {
    name: 'Apr',
    totalUsers: Math.floor(Math.random() * 1000) + 500,
    totalStudents: Math.floor(Math.random() * 800) + 400,
    newStudents: Math.floor(Math.random() * 300) + 100,
    trainedStudents: Math.floor(Math.random() * 400) + 200,
  },
  {
    name: 'May',
    totalUsers: Math.floor(Math.random() * 1000) + 500,
    totalStudents: Math.floor(Math.random() * 800) + 400,
    newStudents: Math.floor(Math.random() * 300) + 100,
    trainedStudents: Math.floor(Math.random() * 400) + 200,
  },
  {
    name: 'Jun',
    totalUsers: Math.floor(Math.random() * 1000) + 500,
    totalStudents: Math.floor(Math.random() * 800) + 400,
    newStudents: Math.floor(Math.random() * 300) + 100,
    trainedStudents: Math.floor(Math.random() * 400) + 200,
  },
];

export function OverviewChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
          }}
        />
        <Legend iconSize={10} wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
        <Bar dataKey="totalUsers" fill="hsl(var(--chart-1))" name="Total Users" radius={[4, 4, 0, 0]} />
        <Bar dataKey="totalStudents" fill="hsl(var(--chart-2))" name="Total Students" radius={[4, 4, 0, 0]} />
        <Bar dataKey="newStudents" fill="hsl(var(--chart-3))" name="New Students" radius={[4, 4, 0, 0]} />
        <Bar dataKey="trainedStudents" fill="hsl(var(--chart-4))" name="Trained Students" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
