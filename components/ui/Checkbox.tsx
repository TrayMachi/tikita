import React from "react";
import { Pressable } from "react-native";
import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Check } from "lucide-react-native";

interface CheckboxProps {
  isChecked: boolean;
  onToggle: () => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  isChecked,
  onToggle,
  size = "md",
  disabled = false,
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  return (
    <Pressable
      onPress={onToggle}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        ${
          isChecked
            ? "bg-primary-500 border-primary-500"
            : "bg-background-50 dark:bg-background-900 border-outline-300 dark:border-outline-600"
        }
        ${disabled ? "opacity-50" : ""}
        border-2 rounded-md items-center justify-center
        ${className}
      `}
    >
      {isChecked && <Icon as={Check} size="xs" className="text-white" />}
    </Pressable>
  );
};
