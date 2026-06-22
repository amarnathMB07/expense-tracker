"use client";

import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function ExpenseAnalytics({ transactions, categories }) {
  const data = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    
    // Group by category
    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    return Object.entries(grouped).map(([categoryId, value]) => {
      const cat = categories.find(c => c.id === categoryId);
      // Map category color from 'bg-orange-500/20 text-orange-500' to hex for the chart
      let hexColor = '#8884d8';
      if (cat) {
         if (categoryId === 'food') hexColor = '#f97316'; // orange-500
         else if (categoryId === 'shopping') hexColor = '#ec4899'; // pink-500
         else if (categoryId === 'utilities') hexColor = '#3b82f6'; // blue-500
         else if (categoryId === 'housing') hexColor = '#6366f1'; // indigo-500
         else hexColor = '#6b7280'; // gray-500
      }
      
      return {
        name: cat ? cat.label : categoryId,
        value,
        color: hexColor
      };
    }).sort((a, b) => b.value - a.value);
  }, [transactions, categories]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-neutral-500 text-sm">
        No expense data to display
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => `$${value.toFixed(2)}`}
            contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '12px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
