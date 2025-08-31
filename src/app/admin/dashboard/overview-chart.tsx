
'use client';
import * as React from "react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

const fullYearData = [
  {
    name: 'Jan',
    totalUsers: 520,
    totalStudents: 450,
    newStudents: 120,
    trainedStudents: 210,
  },
  {
    name: 'Feb',
    totalUsers: 630,
    totalStudents: 540,
    newStudents: 150,
    trainedStudents: 250,
  },
  {
    name: 'Mar',
    totalUsers: 740,
    totalStudents: 630,
    newStudents: 180,
    trainedStudents: 300,
  },
  {
    name: 'Apr',
    totalUsers: 820,
    totalStudents: 700,
    newStudents: 200,
    trainedStudents: 340,
  },
  {
    name: 'May',
    totalUsers: 950,
    totalStudents: 810,
    newStudents: 240,
    trainedStudents: 400,
  },
  {
    name: 'Jun',
    totalUsers: 1100,
    totalStudents: 940,
    newStudents: 280,
    trainedStudents: 470,
  },
  {
    name: 'Jul',
    totalUsers: 1250,
    totalStudents: 1070,
    newStudents: 310,
    trainedStudents: 520,
  },
  {
    name: 'Aug',
    totalUsers: 1380,
    totalStudents: 1180,
    newStudents: 340,
    trainedStudents: 580,
  },
  {
    name: 'Sep',
    totalUsers: 1500,
    totalStudents: 1280,
    newStudents: 370,
    trainedStudents: 630,
  },
  {
    name: 'Oct',
    totalUsers: 1620,
    totalStudents: 1390,
    newStudents: 400,
    trainedStudents: 680,
  },
  {
    name: 'Nov',
    totalUsers: 1750,
    totalStudents: 1500,
    newStudents: 430,
    trainedStudents: 740,
  },
  {
    name: 'Dec',
    totalUsers: 1900,
    totalStudents: 1650,
    newStudents: 460,
    trainedStudents: 800,
  },
];

const chartConfig = {
  totalUsers: {
    label: "Total Users",
    color: "hsl(var(--chart-1))",
  },
  totalStudents: {
    label: "Total Students",
    color: "hsl(var(--chart-2))",
  },
  newStudents: {
    label: "New Students",
    color: "hsl(var(--chart-3))",
  },
  trainedStudents: {
    label: "Trained Students",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function OverviewChart() {
  const [data, setData] = React.useState<typeof fullYearData>([]);

  React.useEffect(() => {
    const currentMonth = new Date().getMonth();
    setData(fullYearData.slice(0, currentMonth + 1));
  }, []);

  return (
    <ChartContainer config={chartConfig} className="w-full h-[300px]">
      <LineChart
        data={data}
        margin={{
          top: 10,
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
        <Line type="monotone" dataKey="totalUsers" stroke="var(--color-totalUsers)" strokeWidth={2} dot={false} activeDot={{ r: 5 }}/>
        <Line type="monotone" dataKey="totalStudents" stroke="var(--color-totalStudents)" strokeWidth={2} dot={false} activeDot={{ r: 5 }}/>
        <Line type="monotone" dataKey="newStudents" stroke="var(--color-newStudents)" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={{ r: 5 }}/>
        <Line type="monotone" dataKey="trainedStudents" stroke="var(--color-trainedStudents)" strokeWidth={2} strokeDasharray="3 4 5 2" dot={false} activeDot={{ r: 5 }}/>
      </LineChart>
    </ChartContainer>
  );
}
