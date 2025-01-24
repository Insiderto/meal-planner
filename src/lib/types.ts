// Ингредиент
interface Ingredient {
  nameRu: string; // Название на русском
  nameCz: string; // Название на чешском
  amount: number; // Количество (число)
  unit: string; // Единица измерения (г, мл, шт, etc.)
}

// Блюдо
interface Dish {
  name: string; // Название блюда
  ingredients: Ingredient[]; // Массив ингредиентов
}

// День
interface Day {
  dayOfWeek: string; // День недели
  lunch: Dish; // Обед
  dinner: Dish; // Ужин
}

// Всё меню
interface MenuData {
  days: Day[];
}

export type { MenuData, Day, Dish, Ingredient };
