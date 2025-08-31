
'use client';
import * as React from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { getMonthlyUserStats } from "@/app/actions";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [data, setData] = React.useState<any[] | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      const result = await getMonthlyUserStats();
      if (result.success && result.data) {
        setData(result.data);
      } else {
        // Handle error case, maybe set data to empty array
        setData([]);
      }
    }
    fetchData();
  }, []);
  
  if (data === null) {
    return <Skeleton className="w-full h-[300px]" />;
  }

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
