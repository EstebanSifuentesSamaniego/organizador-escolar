import { CheckCircle, NotebookPen } from "lucide-react";

interface TareaItemProps {
  titulo: string;
  fecha: string;
  materia: string;
}

export default function TareaItem({ titulo, fecha, materia }: TareaItemProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-3 flex items-start gap-3 border border-gray-100">
      <div className="mt-1">
        <NotebookPen className="w-6 h-6 text-blue-500" />
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{titulo}</h3>
        <p className="text-sm text-gray-500">{materia}</p>
        <p className="text-xs text-gray-400 mt-1">Entrega: {fecha}</p>
      </div>

      <button>
        <CheckCircle className="w-6 h-6 text-gray-300 hover:text-green-500 transition" />
      </button>
    </div>
  );
}
