import { Dish } from "@/lib/types.ts";

export function DishComponent({ name, ingredients }: Dish) {
  return (
    <div className="p-3 border rounded">
      <h3 className="font-medium mb-2">{name}</h3>
      <ul>
        {ingredients.map((ingredient, index) => (
          <li key={index} className="text-sm py-1 flex justify-between">
            <div>
              <span>{ingredient.nameRu}</span>
              <span className="text-gray-400 ml-2">({ingredient.nameCz})</span>
            </div>
            <span className="ml-2">{ingredient.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
