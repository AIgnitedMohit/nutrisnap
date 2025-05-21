
import React from 'react';
import { OverallNutritionResponse, NutrientInfo } from '../types';

interface NutritionDisplayProps {
  data: OverallNutritionResponse | null;
}

const NutrientItem: React.FC<{ label: string; value?: NutrientInfo | number; unitOverride?: string }> = ({ label, value, unitOverride }) => {
  if (value === undefined || value === null) return null;
  
  const amount = typeof value === 'number' ? value : value.amount;
  const unit = typeof value === 'number' ? unitOverride || '' : value.unit;

  return (
    <div className="flex justify-between py-2 border-b border-slate-600 last:border-b-0">
      <span className="text-slate-300">{label}:</span>
      <span className="font-semibold text-sky-300">
        {amount.toFixed(1)} {unit}
      </span>
    </div>
  );
};


const NutritionDisplay: React.FC<NutritionDisplayProps> = ({ data }) => {
  if (!data) {
    return null;
  }

  if (data.items.length === 0 && !data.summary?.toLowerCase().includes("no food")) {
     return (
        <div className="p-6 bg-slate-700 rounded-lg text-center">
            <p className="text-lg text-slate-300">{data.summary || "No food items were identified in the image, or no nutritional data could be retrieved."}</p>
        </div>
     );
  }


  return (
    <div className="space-y-6 p-6 bg-slate-700/80 backdrop-blur-sm rounded-lg shadow-xl">
      <div>
        <h3 className="text-2xl font-bold mb-4 text-sky-300 border-b-2 border-sky-500 pb-2">Overall Nutrition</h3>
        <div className="space-y-1">
          <NutrientItem label="Total Calories" value={data.totalCalories} unitOverride="kcal" />
          <NutrientItem label="Total Protein" value={data.totalProtein} />
          <NutrientItem label="Total Carbohydrates" value={data.totalCarbohydrates} />
          <NutrientItem label="Total Fat" value={data.totalFat} />
        </div>
      </div>

      {data.items.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mt-6 mb-3 text-sky-300 border-b border-sky-600 pb-1">Itemized Breakdown</h3>
          <div className="space-y-4">
            {data.items.map((item, index) => (
              <div key={index} className="p-4 bg-slate-600/50 rounded-md shadow">
                <h4 className="text-lg font-semibold text-green-400 mb-2">{item.name}</h4>
                <NutrientItem label="Calories" value={item.calories} unitOverride="kcal" />
                <NutrientItem label="Protein" value={item.protein} />
                <NutrientItem label="Carbohydrates" value={item.carbohydrates} />
                <NutrientItem label="Fat" value={item.fat} />
                {item.vitaminC && <NutrientItem label="Vitamin C" value={item.vitaminC} />}
                {item.iron && <NutrientItem label="Iron" value={item.iron} />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionDisplay;
