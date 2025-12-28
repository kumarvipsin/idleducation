"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { subject: "Maths", hours: 18.5, fill: "var(--color-maths)" },
  { subject: "Science", hours: 22.0, fill: "var(--color-science)" },
  { subject: "English", hours: 15.0, fill: "var(--color-english)" },
  { subject: "History", hours: 12.5, fill: "var(--color-history)" },
  { subject: "SSC Prep", hours: 25.0, fill: "var(--color-ssc)" },
  { subject: "NIOS", hours: 8.0, fill: "var(--color-nios)" },
]

const chartConfig = {
  hours: {
    label: "Hours Studied",
  },
  maths: {
    label: "Maths",
    color: "hsl(var(--chart-1))",
  },
  science: {
    label: "Science",
    color: "hsl(var(--chart-2))",
  },
  english: {
    label: "English",
    color: "hsl(var(--chart-3))",
  },
  history: {
    label: "History",
    color: "hsl(var(--chart-4))",
  },
  ssc: {
    label: "SSC Prep",
    color: "hsl(var(--chart-5))",
  },
  nios: {
    label: "NIOS",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function ProgressChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Progress Overview</CardTitle>
        <CardDescription>Hours studied per subject this month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="subject"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
             <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              label={{
                value: 'Hours',
                angle: -90,
                position: 'insideLeft',
                offset: -5,
                style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' },
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="hours" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
