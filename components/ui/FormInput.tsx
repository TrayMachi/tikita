import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";
import { Input, InputField } from "./input";

interface FormInputProps extends Omit<TextInputProps, "style"> {
  label: string;
  error?: string;
  className?: string;
  inputClassName?: string;
}

export const FormInput: React.FC<FormInputProps> = function FormInput({
  label,
  error,
  className,
  inputClassName,
  ...props
}) {
  return (
    <View className={className}>
      <Text className="text-sm font-semibold text-typography-700 dark:text-typography-300 mb-2 ml-1">
        {label}
      </Text>
      <Input
        variant="outline"
        size="lg"
        className={`border-2 rounded-xl ${
          error
            ? "border-error-500 bg-error-50 dark:bg-error-950"
            : "border-primary-200 bg-background-50 dark:bg-background-900 focus:border-primary-500"
        }`}
      >
        <InputField
          {...props}
          className={`text-base text-typography-900 dark:text-typography-100 px-4 ${
            inputClassName || ""
          }`}
        />
      </Input>
      {error ? (
        <Text className="text-error-600 dark:text-error-400 text-sm mt-1 ml-1">
          {error}
        </Text>
      ) : null}
    </View>
  );
};
