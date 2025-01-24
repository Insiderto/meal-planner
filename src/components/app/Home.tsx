import ShoppingList from "@/components/app/ShoppingList.tsx";
import { useEffect, useState } from "react";
import { MenuTab, MenuTabs } from "@/components/app/components/MenuTabs.tsx";
import { MenuData } from "@/lib/types.ts";
import { db } from "@/lib/db.ts";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable.tsx";
import { MainContent } from "@/components/app/components/MainContent.tsx";
import { DropzoneArea } from "@/components/app/components/DropzoneArea.tsx";

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
      await createNewMenu(newData);
    }
  };

  const switchTab = (tab: MenuTab) => {
    setActiveTabId(tab.id);
    setMenuData(tab.data);
  };

  const renameTab = async (id: number, newName: string) => {
    await db.menus.update(id, { createdAt: newName });
    setMenuTabs((prev) =>
      prev.map((tab) => (tab.id === id ? { ...tab, createdAt: newName } : tab)),
    );
  };

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15}>
          <MenuTabs
            menuTabs={menuTabs}
            activeTabId={activeTabId}
            onCreateMenu={() => createNewMenu()}
            onDeleteMenu={deleteMenu}
            onSwitchTab={switchTab}
            onRenameTab={renameTab}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-screen relative">
            <MainContent menuData={menuData} />
            <DropzoneArea onDataLoad={updateActiveMenu} />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={30} minSize={30}>
          <div className="h-screen overflow-auto">
            <ShoppingList menuData={menuData} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
