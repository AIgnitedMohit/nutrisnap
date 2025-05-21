
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { OverallNutritionResponse, ChartDataItem } from '../types';

interface NutritionChartProps {
  data: OverallNutritionResponse | null;
}

const COLORS = {
  protein: '#34d399', // Emerald 500
  carbs: '#60a5fa',   // Blue 400
  fat: '#facc15',     // Yellow 400
};

const NutritionChart: React.FC<NutritionChartProps> = ({ data }) => {
  if (!data || (!data.totalProtein?.amount && !data.totalCarbohydrates?.amount && !data.totalFat?.amount)) {
    return (
      <div className="p-6 bg-slate-700 rounded-lg text-center">
        <p className="text-slate-300">Macronutrient chart will appear here once data is available.</p>
      </div>
    );
  }
  
  const chartData: ChartDataItem[] = [];
  if (data.totalProtein && data.totalProtein.amount > 0) {
    chartData.push({ name: `Protein (${data.totalProtein.amount.toFixed(1)}${data.totalProtein.unit})`, value: data.totalProtein.amount, fill: COLORS.protein });
  }
  if (data.totalCarbohydrates && data.totalCarbohydrates.amount > 0) {
    chartData.push({ name: `Carbs (${data.totalCarbohydrates.amount.toFixed(1)}${data.totalCarbohydrates.unit})`, value: data.totalCarbohydrates.amount, fill: COLORS.carbs });
  }
  if (data.totalFat && data.totalFat.amount > 0) {
    chartData.push({ name: `Fat (${data.totalFat.amount.toFixed(1)}${data.totalFat.unit})`, value: data.totalFat.amount, fill: COLORS.fat });
  }

  if (chartData.length === 0) {
     return (
      <div className="p-6 bg-slate-700 rounded-lg text-center">
        <p className="text-slate-300">No macronutrient data available to display chart.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-700/80 backdrop-blur-sm rounded-lg shadow-xl">
      <h3 className="text-xl font-semibold mb-4 text-sky-300 text-center">Macronutrient Distribution (grams)</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(42, 50, 78, 0.9)', border: '1px solid #4a5568', borderRadius: '0.5rem', color: '#e2e8f0' }}
              itemStyle={{ color: '#cbd5e1'}}
            />
            <Legend wrapperStyle={{ color: '#e2e8f0' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NutritionChart;
