import React from "react";
import { ConfigSchemaResponse } from "../types/activity.types";
import { Settings } from "lucide-react";

interface ActivityConfigFieldsProps {
    configSchema: ConfigSchemaResponse | null;
    configValues: Record<string, any>;
    onChange: (name: string, value: any) => void;
    errors?: Record<string, string>;
}

const ActivityConfigFields: React.FC<ActivityConfigFieldsProps> = ({
    configSchema,
    configValues,
    onChange,
    errors = {},
}) => {
    if (!configSchema || !configSchema.fields || configSchema.fields.length === 0) {
        return null;
    }

    const handleInputChange = (fieldName: string, value: string) => {
        // Convert string to appropriate type based on field type
        const field = configSchema.fields.find(f => f.name === fieldName);
        if (field?.type === "number") {
            const numValue = parseFloat(value);
            onChange(fieldName, isNaN(numValue) ? "" : numValue);
        } else {
            onChange(fieldName, value);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">
                <Settings size={16} className="inline mr-2" />
                Cấu hình hoạt động
            </h2>

            <div className="space-y-4">
                {configSchema.fields.map((field) => (
                    <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>

                        <input
                            type={field.type === "number" ? "number" : "text"}
                            name={field.name}
                            value={configValues[field.name] ?? ""}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            placeholder={
                                field.defaultValue !== undefined
                                    ? `Mặc định: ${field.defaultValue}`
                                    : undefined
                            }
                            step={field.type === "number" ? "any" : undefined}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[field.name] ? "border-red-500" : "border-gray-200"
                                }`}
                        />

                        {field.description && (
                            <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                        )}

                        {errors[field.name] && (
                            <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityConfigFields;
