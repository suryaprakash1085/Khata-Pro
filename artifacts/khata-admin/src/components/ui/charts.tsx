import * as React from "react"
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts'

export function LineChart({ data, categories, index, colors }: any) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis 
          dataKey={index} 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} 
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} 
        />
        <Tooltip 
          contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '6px' }}
          itemStyle={{ color: 'var(--foreground)' }}
        />
        {categories.map((category: string, i: number) => (
          <Line 
            key={category}
            type="monotone" 
            dataKey={category} 
            stroke={colors?.[i] || `hsl(var(--chart-${(i % 5) + 1}))`} 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

export function BarChart({ data, categories, index, colors }: any) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis 
          dataKey={index} 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} 
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} 
        />
        <Tooltip 
          contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '6px' }}
          itemStyle={{ color: 'var(--foreground)' }}
          cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
        />
        {categories.map((category: string, i: number) => (
          <Bar 
            key={category}
            dataKey={category} 
            fill={colors?.[i] || `hsl(var(--chart-${(i % 5) + 1}))`} 
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

export function PieChart({ data, category, index, colors }: any) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={120}
          paddingAngle={2}
          dataKey={category}
          nameKey={index}
        >
          {data.map((_: any, i: number) => (
            <Cell key={`cell-${i}`} fill={colors?.[i] || `hsl(var(--chart-${(i % 5) + 1}))`} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '6px' }}
          itemStyle={{ color: 'var(--foreground)' }}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}
