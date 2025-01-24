import { DishComponent as Dish } from "@/components/app/Dish.tsx";
import { Day } from "@/lib/types.ts";

interface MenuProps {
  days: Day[];
}

export function Menu({ days }: MenuProps) {
  return (
    <div className="space-y-6">
      {days.map((day, index) => (
        <div key={index} className="border-b pb-4">
          <h2 className="font-semibold text-lg mb-3">{day.dayOfWeek}</h2>
          <div className="space-y-3">
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Обед:</h3>
              <Dish {...day.lunch} />
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Ужин:</h3>
              <Dish {...day.dinner} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
