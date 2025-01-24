import { Menu } from "@/components/app/Menu.tsx";
import { MenuData } from "@/lib/types.ts";

interface MainContentProps {
  menuData: MenuData;
}

export const MainContent = ({ menuData }: MainContentProps) => {
  return (
    <div className="h-[calc(100vh-200px)] overflow-auto">
      <div className="p-4">
        <Menu days={menuData.days} />
      </div>
    </div>
  );
};
