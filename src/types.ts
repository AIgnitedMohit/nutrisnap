
export interface NutrientInfo {
  amount: number;
  unit: string;
}

export interface FoodItemNutrition {
  name: string;
  calories: number;
  protein: NutrientInfo;
  carbohydrates: NutrientInfo;
  fat: NutrientInfo;
  vitaminC?: NutrientInfo;
  iron?: NutrientInfo;
}

export interface OverallNutritionResponse {
  summary?: string;
  totalCalories: number;
  totalProtein: NutrientInfo;
  totalCarbohydrates: NutrientInfo;
  totalFat: NutrientInfo;
  items: FoodItemNutrition[];
}

export interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
}
