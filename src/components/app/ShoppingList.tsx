import { useState } from "react";
import { Ingredient, MenuData } from "@/lib/types";
import { Search } from "lucide-react";

interface ShoppingListProps {
  menuData: MenuData;
}

interface IngredientItem extends Ingredient {
  id: string;
  isChecked: boolean;
}

const ShoppingList = ({ menuData }: ShoppingListProps) => {
  const allIngredients = menuData.days.flatMap((day) => [
    ...day.lunch.ingredients,
    ...day.dinner.ingredients,
  ]);

  // Группируем ингредиенты по названию и единице измерения
  const initialIngredients = Object.values(
    allIngredients.reduce((acc: Record<string, IngredientItem>, curr) => {
      const key = `${curr.nameRu}-${curr.nameCz}-${curr.unit}`;
      if (!acc[key]) {
        acc[key] = {
          id: key,
          nameRu: curr.nameRu,
          nameCz: curr.nameCz,
          amount: curr.amount,
          unit: curr.unit,
          isChecked: false,
        };
      } else {
        // Суммируем количество для одинаковых ингредиентов
        acc[key].amount += curr.amount;
      }
      return acc;
    }, {}),
  );

  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(
    new Set(),
  );
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredIngredients = initialIngredients.filter((ingredient) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      ingredient.nameRu.toLowerCase().includes(searchLower) ||
      ingredient.nameCz.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Список покупок</h2>

      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Поиск продуктов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div className="space-y-2">
        {filteredIngredients.map((ingredient) => (
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
              className={`ml-3 ${
                checkedIngredients.has(ingredient.id)
                  ? "line-through text-gray-400"
                  : ""
              }`}
            >
              <span className="font-medium">{ingredient.nameRu}</span>
              <span className="text-gray-500 ml-2">({ingredient.nameCz})</span>
              <span className="text-gray-600 ml-2">
                {ingredient.amount} {ingredient.unit}
              </span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ShoppingList;
