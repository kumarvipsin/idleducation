
'use client';
import * as React from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { getTotalStudentsCount, getTotalTeachersCount } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';

const chartConfig = {
  students: {
    label: 'Students',
    color: 'hsl(var(--chart-1))',
  },
  teachers: {
    label: 'Teachers',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function UserCompositionChart() {
  const [data, setData] = React.useState<any[] | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      const [studentsRes, teachersRes] = await Promise.all([
        getTotalStudentsCount(),
        getTotalTeachersCount(),
      ]);

      const studentsCount = studentsRes.success ? studentsRes.count : 0;
      const teachersCount = teachersRes.success ? teachersRes.count : 0;

      setData([
        { name: 'students', value: studentsCount, fill: 'var(--color-students)' },
        { name: 'teachers', value: teachersCount, fill: 'var(--color-teachers)' },
      ]);
    }

    fetchData();
  }, []);

  const totalUsers = React.useMemo(() => {
    return data?.reduce((acc, curr) => acc + curr.value, 0) || 0;
  }, [data]);

  if (data === null) {
    return (
        <div className="w-full h-[250px] flex items-center justify-center">
            <Skeleton className="h-[200px] w-[200px] rounded-full" />
        </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
                >
            </Pie>
        </PieChart>
      </ResponsiveContainer>
       {totalUsers > 0 && (
            <div
                className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center text-center"
                style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}
            >
                <div className="text-2xl font-bold">
                    {totalUsers.toLocaleString()}
                    <div className="text-sm font-normal text-muted-foreground">Total Users</div>
                </div>
            </div>
        )}
    </ChartContainer>
  );
}
