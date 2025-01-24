import { DragEventHandler, useCallback, useRef, useState } from "react";
import { MenuData } from "@/lib/types.ts";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DropzoneProps {
  onDataLoad: (data: MenuData) => void;
}

const Dropzone = ({ onDataLoad }: DropzoneProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const processFile = (file: File) => {
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
        setError(""); // Очищаем ошибку при успешной загрузке
      } catch (err) {
        setError(`Ошибка парсинга JSON файла ${JSON.stringify(err)}`);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop: DragEventHandler = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      setError("");

      const file = e.dataTransfer?.files[0];
      if (!file) return;

      processFile(file);
    },
    [onDataLoad],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    processFile(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors relative
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
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept=".json,application/json"
        className="hidden"
      />

      <div className="flex flex-col items-center gap-4">
        <div>
          {dragActive
            ? "Отпустите файл здесь"
            : "Перетащите JSON файл полученный от языковой модели сюда"}
        </div>

        <div className="text-gray-500">или</div>

        <Button
          variant="outline"
          onClick={handleButtonClick}
          className="flex items-center gap-2"
        >
          <Upload size={16} />
          Выберите файл
        </Button>
      </div>

      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default Dropzone;
