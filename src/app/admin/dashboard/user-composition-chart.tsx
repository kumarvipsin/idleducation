
'use client';
import * as React from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { getNewStudentsCount, getDeniedUsersCount, getActiveUsersCount, getInactiveUsersCount } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';

const chartConfig = {
  approvedStudents: {
    label: 'Approved Students',
    color: 'hsl(var(--chart-1))',
  },
  activeUsers: {
    label: 'Active Users',
    color: 'hsl(var(--chart-2))',
  },
  inactiveUsers: {
    label: 'Inactive Users',
    color: 'hsl(var(--chart-3))',
  },
  deniedUsers: {
    label: 'Denied Users',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

export function UserCompositionChart() {
  const [data, setData] = React.useState<any[] | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      const [
        approvedStudentsRes,
        activeUsersRes,
        inactiveUsersRes,
        deniedUsersRes,
      ] = await Promise.all([
        getNewStudentsCount(),
        getActiveUsersCount(),
        getInactiveUsersCount(),
        getDeniedUsersCount(),
      ]);

      const approvedStudentsCount = approvedStudentsRes.success ? approvedStudentsRes.count : 0;
      const activeUsersCount = activeUsersRes.success ? activeUsersRes.count : 0;
      const inactiveUsersCount = inactiveUsersRes.success ? inactiveUsersRes.count : 0;
      const deniedUsersCount = deniedUsersRes.success ? deniedUsersRes.count : 0;
      
      setData([
        { name: 'approvedStudents', value: approvedStudentsCount, fill: 'var(--color-approvedStudents)' },
        { name: 'activeUsers', value: activeUsersCount, fill: 'var(--color-activeUsers)' },
        { name: 'inactiveUsers', value: inactiveUsersCount, fill: 'var(--color-inactiveUsers)' },
        { name: 'deniedUsers', value: deniedUsersCount, fill: 'var(--color-deniedUsers)' },
      ]);
    }

    fetchData();
  }, []);

  const total = React.useMemo(() => {
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
    <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px] relative">
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
       {total > 0 && (
            <div
                className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center text-center"
            >
                <div className="text-2xl font-bold">
                    {total.toLocaleString()}
                    <div className="text-sm font-normal text-muted-foreground">Total</div>
                </div>
            </div>
        )}
    </ChartContainer>
  );
}
