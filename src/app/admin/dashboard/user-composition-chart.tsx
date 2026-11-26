
'use client';
import * as React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
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
    <div className="mx-auto aspect-square h-[250px] relative">
      <ChartContainer config={chartConfig} className="h-full w-full">
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
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
      {total > 0 && (
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center text-center antialiased"
        >
          <div className="text-[28px] font-extrabold leading-[1.12] tracking-[-0.025em] tabular-nums text-[#0B224D] dark:text-white">
            {total.toLocaleString()}
            <div className="mt-0.5 text-[12px] font-bold tracking-[0.01em] text-[#475E82] dark:text-slate-400">
              Total
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
