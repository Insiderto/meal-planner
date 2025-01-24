import Dexie, { type Table } from "dexie";
import { MenuData } from "@/lib/types";

interface MenuEntry {
  id?: number;
  createdAt: string; // DD.MM.YYYY
  data: MenuData;
}

export class MenuDatabase extends Dexie {
  menus!: Table<MenuEntry>;

  constructor() {
    super("MenuDatabase");
    this.version(1).stores({
      menus: "++id, createdAt",
    });
  }
}

export const db = new MenuDatabase();
