import React from "react";
import { Edit2, Save, X, Trash2 } from "lucide-react";

export type EditMode = { type: string | null; id: number | null; value: string };

interface ItemListProps {
  items: string[];
  type: "category" | "status";
  editMode: EditMode;
  onEdit: (type: string, id: number, currentValue: string) => void;
  onSave: (type: "category" | "status") => void;
  onCancel: () => void;
  onDelete: (type: "category" | "status", index: number) => void;
  onChange: (value: string) => void;
}

const ItemList: React.FC<ItemListProps> = React.memo(
  ({ items, type, editMode, onEdit, onSave, onCancel, onDelete, onChange }) => {
    return (
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg transition-all duration-300  hover:shadow-md animate-grow"
          >
            {editMode.type === type && editMode.id === index ? (
              <input
                type="text"
                value={editMode.value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 px-3 py-1 border rounded-md mr-2 dark:bg-gray-700"
                autoFocus
              />
            ) : (
              <span>{item}</span>
            )}
            <div className="flex gap-2">
              {editMode.type === type && editMode.id === index ? (
                <>
                  <button
                    onClick={() => onSave(type)}
                    className="p-1 text-green-600 hover:bg-green-100 rounded-full transition-colors duration-200"
                  >
                    <Save size={18} />
                  </button>
                  <button
                    onClick={onCancel}
                    className="p-1 text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200"
                  >
                    <X size={18} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onEdit(type, index, item)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-200"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(type, index)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
);

ItemList.displayName = 'ItemList';

export default ItemList;