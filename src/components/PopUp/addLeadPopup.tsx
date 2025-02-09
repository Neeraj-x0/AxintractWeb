import React, { useState } from "react";
import { X, Upload, Download } from "lucide-react";

interface FormData {
  type: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  notes: string;
  importCategory: string;
}

interface AddLeadsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData, file: File | null) => void;
  category: string[];
}

interface CustomFormData extends FormData {
  type: "manual" | "import";
  notes: string;
}
const AddLeadsPopup: React.FC<AddLeadsPopupProps> = ({
  isOpen,
  onClose,
  onSubmit,
  category,
}) => {
  const [mode, setMode] = useState<"manual" | "import">("manual");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [formData, setFormData] = useState<CustomFormData>({
    type: "manual", // Default type
    name: "",
    email: "",
    phone: "",
    category: "",
    notes: "",
    importCategory: "", // Used when in "import" mode
  });

  const [file, setFile] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const toggleMode = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      const newMode = mode === "manual" ? "import" : "manual";
      setMode(newMode);
      setFormData((prev) => {
        // Reset the formData to only the required fields based on mode
        if (newMode === "import") {
          return {
            ...prev,
            type: "import",
            name: "",
            email: "",
            phone: "",
            notes: "",
          };
        }
        return {
          ...prev,
          type: "manual",
        };
      });
      setIsTransitioning(false);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, file);
    setFormData({
      type: "manual",
      name: "",
      email: "",
      phone: "",
      category: "",
      notes: "",
      importCategory: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center animate-fadeIn">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 animate-slideUp">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Add New Leads
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={toggleMode}
              className={`flex items-center px-4 py-2 rounded-md transition-all duration-300 ${
                mode === "manual"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Manual Entry
            </button>
            <button
              onClick={toggleMode}
              className={`flex items-center px-4 py-2 rounded-md transition-all duration-300 ${
                mode === "import"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Upload size={20} className="mr-2" />
              Import from File
            </button>
          </div>

          <div
            className={`transition-opacity duration-300 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            {mode === "manual" ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category (Optional)
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    >
                      <option value="">Select category</option>
                      {category.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Add Lead
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Upload CSV or Excel file with leads data
                  </p>
                  <button
                    type="button"
                    className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors duration-200"
                    onClick={() => alert("Download format")}
                  >
                    <Download size={16} className="mr-1" />
                    Download Format
                  </button>
                </div>

                <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors duration-200">
                  <input
                    type="file"
                    accept=".csv,.xlsx"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-indigo-600 file:text-white
                      hover:file:bg-indigo-700
                      file:cursor-pointer file:transition-colors file:duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category for Imported Leads (Optional)
                  </label>
                  <select
                    name="importCategory"
                    value={formData.importCategory}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  >
                    <option value="">Select category</option>
                    {category.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => onSubmit(formData, file)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Import Leads
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLeadsPopup;

export type { AddLeadsPopupProps };
