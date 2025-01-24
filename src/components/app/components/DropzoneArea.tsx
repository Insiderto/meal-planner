import { MenuData } from "@/lib/types.ts";
import Dropzone from "@/components/app/components/Dropzone.tsx";

interface DropzoneAreaProps {
  onDataLoad: (data: MenuData) => void;
}

export const DropzoneArea = ({ onDataLoad }: DropzoneAreaProps) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="p-4 flex flex-col gap-2">
        <Dropzone onDataLoad={onDataLoad} />
        <div className="text-sm text-gray-600">
          <a
            href="/assets/menu-prompt.md"
            download
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Скачайте промт для составления меню и вставьте его в вашу любимую
            языковую модель
          </a>
        </div>
      </div>
    </div>
  );
};
