
'use client';

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

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
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: -10,
          bottom: 0,
        }}
      >
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
        <ChartTooltip
          cursor={{ fill: 'hsl(var(--accent) / 0.3)' }}
          content={<ChartTooltipContent />}
        />
        <Legend 
            iconSize={12} 
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            verticalAlign="top" 
            align="right"
            />
        <Line type="monotone" dataKey="totalUsers" name="Total Users" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--chart-1))' }} activeDot={{ r: 6 }}/>
        <Line type="monotone" dataKey="totalStudents" name="Total Students" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--chart-2))' }} activeDot={{ r: 6 }}/>
        <Line type="monotone" dataKey="newStudents" name="New Students" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--chart-3))' }} activeDot={{ r: 6 }}/>
        <Line type="monotone" dataKey="trainedStudents" name="Trained Students" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--chart-4))' }} activeDot={{ r: 6 }}/>
      </LineChart>
    </ResponsiveContainer>
  );
}
