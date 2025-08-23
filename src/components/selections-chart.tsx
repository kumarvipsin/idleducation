"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  LabelList,
} from "recharts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const data = [
  { year: 2016, selections: 20, topStudent: { name: "Anmol Sher Singh Bedi", percentage: 97.1, img: "https://placehold.co/100x100.png" } },
  { year: 2017, selections: 29, topStudent: { name: "Sachin Gupta", percentage: 97.5, img: "https://placehold.co/100x100.png" } },
  { year: 2018, selections: 38, topStudent: { name: "Kanishak Kataria", percentage: 97.8, img: "https://placehold.co/100x100.png" } },
  { year: 2019, selections: 47, topStudent: { name: "Jatin Kishore", percentage: 98.2, img: "https://placehold.co/100x100.png" } },
  { year: 2020, selections: 56, topStudent: { name: "Shubham Kumar", percentage: 98.5, img: "https://placehold.co/100x100.png" } },
  { year: 2021, selections: 65, topStudent: { name: "Ankita Agarwal", percentage: 98.8, img: "https://placehold.co/100x100.png" } },
  { year: 2022, selections: 74, topStudent: { name: "Ishita Kishore", percentage: 99.1, img: "https://placehold.co/100x100.png" } },
  { year: 2023, selections: 83, topStudent: { name: "Aditya Srivastava", percentage: 99.4, img: "https://placehold.co/100x100.png" } },
  { year: 2024, selections: 92, topStudent: { name: "Shakti Dubey", percentage: 99.7, img: "https://placehold.co/100x100.png" } },
  { year: 2025, selections: 100, topStudent: { name: "Future Leader", percentage: 99.9, img: "https://placehold.co/100x100.png" } },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = data.find(d => d.year === label);
    return (
      <div className="bg-background border p-4 rounded-lg shadow-lg">
        <p className="font-bold">{`Year: ${label}`}</p>
        <p className="text-primary">{`Selections: ${payload[0].value}`}</p>
        {dataPoint && (
             <div className="mt-2 text-center">
                <p className="font-semibold">{dataPoint.topStudent.name}</p>
                <p className="text-sm text-muted-foreground">CBSE: {dataPoint.topStudent.percentage}%</p>
             </div>
        )}
      </div>
    )
  }
  return null
}

const renderCustomizedLabel = (props: any) => {
    const { x, y, width, index } = props;
    const student = data[index].topStudent;
  
    return (
      <g transform={`translate(${x + width / 2},${y})`}>
        <foreignObject x={-40} y={-110} width={80} height={110}>
          <div className="flex flex-col items-center text-center gap-2">
            <Avatar className="w-16 h-16 border-4 border-primary/50 shadow-md">
              <AvatarImage src={student.img} alt={student.name} data-ai-hint="student headshot"/>
              <AvatarFallback>{student.name.substring(0,2)}</AvatarFallback>
            </Avatar>
            <div className="bg-destructive text-destructive-foreground px-2 py-0.5 rounded-md text-xs font-bold shadow-sm whitespace-nowrap">
              {student.percentage}%
            </div>
          </div>
        </foreignObject>
      </g>
    );
  };
  

export function SelectionsChart() {
  return (
    <div style={{ width: "100%", height: 500 }} className="relative">
      <div className="absolute left-0 -top-4 -translate-y-full transform -rotate-90 origin-bottom-left text-lg font-semibold text-foreground/80">
        No. of Selections
      </div>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 120,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="year" tickLine={false} axisLine={false} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}+`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent) / 0.3)' }} />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
            </linearGradient>
          </defs>
          <Bar dataKey="selections" fill="url(#barGradient)" barSize={50} radius={[4, 4, 0, 0]}>
            <LabelList dataKey="topStudent" content={renderCustomizedLabel} />
          </Bar>
          <Line
            type="monotone"
            dataKey="selections"
            stroke="hsl(var(--destructive))"
            strokeWidth={3}
            dot={{ r: 6, fill: 'hsl(var(--destructive))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
            activeDot={{ r: 8 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
