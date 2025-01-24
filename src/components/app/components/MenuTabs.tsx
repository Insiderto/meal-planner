import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { MenuData } from "@/lib/types.ts";

export interface MenuTab {
  id?: number;
  createdAt: string;
  data: MenuData;
}

interface MenuTabsProps {
  menuTabs: MenuTab[];
  activeTabId?: number;
  onCreateMenu: () => void;
  onDeleteMenu: (id: number) => void;
  onSwitchTab: (tab: MenuTab) => void;
  onRenameTab: (id: number, newName: string) => void;
}

export const MenuTabs = ({
  menuTabs,
  activeTabId,
  onCreateMenu,
  onDeleteMenu,
  onSwitchTab,
  onRenameTab,
}: MenuTabsProps) => {
  const [editingTabId, setEditingTabId] = useState<number | undefined>();
  const [editingName, setEditingName] = useState("");

  const startEditing = (tab: MenuTab) => {
    if (tab.id) {
      setEditingTabId(tab.id);
      setEditingName(tab.createdAt);
    }
  };

  const cancelEditing = () => {
    setEditingTabId(undefined);
    setEditingName("");
  };

  const saveNewName = (id: number) => {
    if (editingName.trim()) {
      onRenameTab(id, editingName.trim());
      cancelEditing();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, id: number) => {
    if (e.key === "Enter") {
      saveNewName(id);
    } else if (e.key === "Escape") {
      cancelEditing();
    }
  };

  return (
    <div className="h-screen p-4 flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        {menuTabs.map((tab) => (
          <div key={tab.id} className="flex items-center gap-1">
            {editingTabId === tab.id ? (
              <div className="flex-1 flex items-center gap-1">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => tab.id && handleKeyPress(e, tab.id)}
                  className="flex-1 px-3 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-green-600 hover:text-green-800 hover:bg-green-100"
                  onClick={() => tab.id && saveNewName(tab.id)}
                >
                  <Check size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  onClick={cancelEditing}
                >
                  <X size={16} />
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant={tab.id === activeTabId ? "default" : "ghost"}
                  className="flex-1 justify-start"
                  onClick={() => onSwitchTab(tab)}
                >
                  {tab.createdAt}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  onClick={() => startEditing(tab)}
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                  onClick={() => tab.id && onDeleteMenu(tab.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        onClick={onCreateMenu}
        className="w-full flex items-center gap-2"
      >
        <Plus size={16} />
        Новое меню
      </Button>
    </div>
  );
};
