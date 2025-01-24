import { useState } from "react";
import { MenuData } from "@/lib/types.ts";
import Dropzone from "@/components/app/components/Dropzone.tsx";
import { Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import menuPromptFile from "@/assets/menu-promt.md?url";

interface DropzoneAreaProps {
  onDataLoad: (data: MenuData) => void;
}

export const DropzoneArea = ({ onDataLoad }: DropzoneAreaProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const hideOnLoad = (data: MenuData) => {
    onDataLoad(data);
    setIsExpanded(false);
  };

  return (
    <div
      className={`absolute transition-all duration-300 ease-in-out left-0 right-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] ${
        isExpanded ? "bottom-1 h-[200px]" : "bottom-0 h-[40px]"
      }`}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -top-4 right-4 h-8 px-2 bg-white shadow-md hover:bg-gray-50 rounded-t-lg  border border-b-0"
      >
        <ChevronDown
          size={16}
          className={`transform transition-transform duration-300 ${
            isExpanded ? "" : "-rotate-180"
          }`}
        />
      </Button>

      <div
        className={`transition-opacity duration-300 ${
          isExpanded
            ? "opacity-100 p-2 flex flex-col gap-2"
            : "opacity-0 invisible h-0"
        }`}
      >
        <a
          href={menuPromptFile}
          download
          className="text-blue-600 text-xs hover:text-blue-800 hover:underline inline-flex align-middle gap-2"
        >
          <Download size={16} className="inline-flex" />
          Скачайте промт для составления меню и вставьте его в вашу любимую
          языковую модель
        </a>
        <Dropzone onDataLoad={hideOnLoad} />
      </div>
    </div>
  );
};
