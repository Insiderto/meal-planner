import { DragEventHandler, useCallback, useState } from "react";
import { MenuData } from "@/lib/types.ts";

interface DropzoneProps {
  onDataLoad: (data: MenuData) => void;
}

const Dropzone = ({ onDataLoad }: DropzoneProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  const handleDrag: DragEventHandler = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateJson = (json: any): json is MenuData => {
    return json?.days && Array.isArray(json.days) && json.days.length > 0;
  };

  const handleDrop: DragEventHandler = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      setError("");

      const file = e.dataTransfer?.files[0];
      if (!file) return;

      if (file.type !== "application/json" && !file.name.endsWith(".json")) {
        setError("Пожалуйста, загрузите JSON файл");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          if (!validateJson(json)) {
            setError("Неверный формат JSON");
            return;
          }
          onDataLoad(json);
        } catch (err) {
          setError(`Ошибка парсинга JSON файла ${JSON.stringify(err)}`);
        }
      };
      reader.readAsText(file);
    },
    [onDataLoad],
  );

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="text-lg mb-2">
        {dragActive
          ? "Отпустите файл здесь"
          : "Перетащите JSON файл полученный от языковой модели  сюда"}
      </div>

      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default Dropzone;
