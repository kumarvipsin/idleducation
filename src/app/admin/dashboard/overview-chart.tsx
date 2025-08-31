
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
  {
    name: 'Jul',
    totalUsers: Math.floor(Math.random() * 1000) + 500,
    totalStudents: Math.floor(Math.random() * 800) + 400,
    newStudents: Math.floor(Math.random() * 300) + 100,
    trainedStudents: Math.floor(Math.random() * 400) + 200,
  },
  {
    name: 'Aug',
    totalUsers: Math.floor(Math.random() * 1000) + 500,
    totalStudents: Math.floor(Math.random() * 800) + 400,
    newStudents: Math.floor(Math.random() * 300) + 100,
    trainedStudents: Math.floor(Math.random() * 400) + 200,
  },
  {
    name: 'Sep',
    totalUsers: Math.floor(Math.random() * 1000) + 500,
    totalStudents: Math.floor(Math.random() * 800) + 400,
    newStudents: Math.floor(Math.random() * 300) + 100,
    trainedStudents: Math.floor(Math.random() * 400) + 200,
  },
  {
    name: 'Oct',
    totalUsers: Math.floor(Math.random() * 1000) + 500,
    totalStudents: Math.floor(Math.random() * 800) + 400,
    newStudents: Math.floor(Math.random() * 300) + 100,
    trainedStudents: Math.floor(Math.random() * 400) + 200,
  },
  {
    name: 'Nov',
    totalUsers: Math.floor(Math.random() * 1000) + 500,
    totalStudents: Math.floor(Math.random() * 800) + 400,
    newStudents: Math.floor(Math.random() * 300) + 100,
    trainedStudents: Math.floor(Math.random() * 400) + 200,
  },
  {
    name: 'Dec',
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
        <defs>
          <linearGradient id="colorTotalUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="colorTotalStudents" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1}/>
          </linearGradient>
           <linearGradient id="colorNewStudents" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.1}/>
          </linearGradient>
           <linearGradient id="colorTrainedStudents" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
        <XAxis
          dataKey="name"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          cursor={{ fill: 'hsl(var(--accent) / 0.3)' }}
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
            borderRadius: 'var(--radius)',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          }}
          labelStyle={{
            color: 'hsl(var(--foreground))',
            fontWeight: 'bold',
          }}
        />
        <Legend 
            iconSize={12} 
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            verticalAlign="top" 
            align="right"
            />
        <Bar dataKey="totalUsers" fill="url(#colorTotalUsers)" name="Total Users" radius={[4, 4, 0, 0]} />
        <Bar dataKey="totalStudents" fill="url(#colorTotalStudents)" name="Total Students" radius={[4, 4, 0, 0]} />
        <Bar dataKey="newStudents" fill="url(#colorNewStudents)" name="New Students" radius={[4, 4, 0, 0]} />
        <Bar dataKey="trainedStudents" fill="url(#colorTrainedStudents)" name="Trained Students" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
