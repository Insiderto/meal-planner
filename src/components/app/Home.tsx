import { useState, useEffect } from "react";
import { Menu } from "@/components/app/Menu.tsx";
import Dropzone from "@/components/app/components/Dropzone.tsx";
import { MenuData } from "@/lib/types.ts";
import ShoppingList from "@/components/app/ShoppingList.tsx";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface MenuTab {
  id?: number;
  createdAt: string;
  data: MenuData;
}

export function Home() {
  const [menuTabs, setMenuTabs] = useState<MenuTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<number | undefined>();
  const [menuData, setMenuData] = useState<MenuData>({ days: [] });

  useEffect(() => {
    const loadMenus = async () => {
      const menus = await db.menus.toArray();
      setMenuTabs(menus);
      if (menus.length > 0) {
        setActiveTabId(menus[0].id);
        setMenuData(menus[0].data);
      }
    };
    void loadMenus();
  }, []);

  const getUniqueTabName = (baseDate: string) => {
    const existingTabs = menuTabs.filter((tab) =>
      tab.createdAt.startsWith(baseDate),
    );
    if (existingTabs.length === 0) return baseDate;

    let counter = 1;
    while (
      existingTabs.some((tab) => tab.createdAt === `${baseDate} (${counter})`)
    ) {
      counter++;
    }
    return `${baseDate} (${counter})`;
  };

  const createNewMenu = async (initialData?: MenuData) => {
    const today = new Date();
    const baseDate = today.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const createdAt = getUniqueTabName(baseDate);

    const newMenu = {
      createdAt,
      data: initialData || { days: [] },
    };

    const id = await db.menus.add(newMenu);
    const menuWithId = { ...newMenu, id };

    setMenuTabs((prev) => [...prev, menuWithId]);
    setActiveTabId(id);
    setMenuData(newMenu.data);
  };

  const deleteMenu = async (id: number) => {
    await db.menus.delete(id);
    setMenuTabs((prev) => prev.filter((tab) => tab.id !== id));

    if (activeTabId === id) {
      const remainingTabs = menuTabs.filter((tab) => tab.id !== id);
      if (remainingTabs.length > 0) {
        setActiveTabId(remainingTabs[0].id);
        setMenuData(remainingTabs[0].data);
      } else {
        setActiveTabId(undefined);
        setMenuData({ days: [] });
      }
    }
  };

  const updateActiveMenu = async (newData: MenuData) => {
    if (activeTabId) {
      await db.menus.update(activeTabId, { data: newData });
      setMenuTabs((prev) =>
        prev.map((tab) =>
          tab.id === activeTabId ? { ...tab, data: newData } : tab,
        ),
      );
      setMenuData(newData);
    } else {
      // Если нет активной вкладки, создаем новую
      await createNewMenu(newData);
    }
  };

  const switchTab = (tab: MenuTab) => {
    setActiveTabId(tab.id);
    setMenuData(tab.data);
  };

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15}>
          <div className="h-screen p-4 flex flex-col gap-2">
            <Button
              onClick={() => createNewMenu()}
              className="w-full flex items-center gap-2"
            >
              <Plus size={16} />
              Новое меню
            </Button>
            <div className="flex flex-col gap-1">
              {menuTabs.map((tab) => (
                <div key={tab.id} className="flex items-center gap-1">
                  <Button
                    variant={tab.id === activeTabId ? "default" : "ghost"}
                    className="flex-1 justify-start"
                    onClick={() => switchTab(tab)}
                  >
                    {tab.createdAt}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                    onClick={() => tab.id && deleteMenu(tab.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-screen relative">
            <div className="h-[calc(100vh-200px)] overflow-auto">
              <div className="p-4">
                <Menu days={menuData.days} />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
              <div className="p-4 flex flex-col gap-2">
                <Dropzone onDataLoad={updateActiveMenu} />
                <div className="text-sm text-gray-600">
                  <a
                    href="/assets/menu-prompt.md"
                    download
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Скачайте промт для составления меню и вставьте его в вашу
                    любимую языковую модель
                  </a>
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={30} minSize={30}>
          <div className="h-screen overflow-auto">
            <div className="p-4">
              <ShoppingList menuData={menuData} />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
