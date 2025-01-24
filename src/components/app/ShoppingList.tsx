import { useState } from "react";
import { Ingredient, MenuData } from "@/lib/types.ts";

interface ShoppingListProps {
  menuData: MenuData;
}

interface IngredientItem extends Ingredient {
  id: string;
  isChecked: boolean;
}

const ShoppingList = ({ menuData }: ShoppingListProps) => {
  // Получаем и группируем ингредиенты при каждом рендере
  const allIngredients = menuData.days.flatMap((day) => [
    ...day.lunch.ingredients,
    ...day.dinner.ingredients,
  ]);

  const initialIngredients = Object.values(
    allIngredients.reduce((acc: Record<string, IngredientItem>, curr) => {
      const key = `${curr.nameRu}-${curr.nameCz}`;
      if (!acc[key]) {
        acc[key] = {
          ...curr,
          id: key,
          isChecked: false,
        };
      }
      return acc;
    }, {}),
  );

  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(
    new Set(),
  );

  const toggleIngredient = (id: string) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Список покупок</h2>
      <div className="space-y-2">
        {initialIngredients.map((ingredient) => (
          <label
            key={ingredient.id}
            className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
          >
            <input
              type="checkbox"
              checked={checkedIngredients.has(ingredient.id)}
              onChange={() => toggleIngredient(ingredient.id)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span
              className={`ml-3 ${checkedIngredients.has(ingredient.id) ? "line-through text-gray-400" : ""}`}
            >
              <span className="font-medium">{ingredient.nameRu}</span>
              <span className="text-gray-500 ml-2">({ingredient.nameCz})</span>
              <span className="text-gray-600 ml-2">{ingredient.amount}</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ShoppingList;
