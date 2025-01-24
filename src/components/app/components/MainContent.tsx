import { Menu } from "@/components/app/Menu.tsx";
import { MenuData } from "@/lib/types.ts";

interface MainContentProps {
  menuData: MenuData;
}

export const MainContent = ({ menuData }: MainContentProps) => {
  return (
    <div className="h-[calc(100vh-40px)] overflow-auto transition-all">
      <div className="p-4">
        <Menu days={menuData.days} />
      </div>
    </div>
  );
};
