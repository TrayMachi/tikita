import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import {
  Circle,
  MoreHorizontal,
  CreditCard,
  Wallet,
  ArrowRightLeft,
  WalletCards,
} from "lucide-react-native";
import { Icon } from "./icon";
import { HStack } from "./hstack";

interface CustomRadioOption {
  value: string;
  label: string;
}

interface CustomRadioGroupProps {
  options: CustomRadioOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  style?: any;
}

interface CustomRadioProps {
  isSelected: boolean;
  onPress: () => void;
  label: string;
}

const CustomRadio: React.FC<CustomRadioProps> = ({
  isSelected,
  onPress,
  label,
}) => {
  const icons = {
    "Transfer Bank": ArrowRightLeft,
    "Kartu Kredit/Debit": CreditCard,
    "E-Wallet": Wallet,
    "Metode Pembayaran Lainnya": WalletCards,
  };

  return (
    <Pressable
      onPress={onPress}
      style={[styles.radioContainer]}
      accessibilityRole="radio"
      accessibilityState={{ checked: isSelected }}
      accessibilityLabel={label}
    >
      <View style={styles.radioCircleContainer}>
        <View
          style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}
        >
          {isSelected && <View style={styles.radioInnerCircle} />}
        </View>
      </View>
      <HStack space="md" className="items-center">
        <Icon
          as={icons[label as keyof typeof icons]}
          size="md"
          className="text-primary-500"
        />

        <Text
          style={[styles.radioLabel, isSelected && styles.radioLabelSelected]}
        >
          {label}
        </Text>
      </HStack>
    </Pressable>
  );
};

export const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({
  options,
  selectedValue,
  onValueChange,
  style,
}) => {
  return (
    <View style={[styles.radioGroup, style]}>
      {options.map((option) => (
        <CustomRadio
          key={option.value}
          isSelected={selectedValue === option.value}
          onPress={() => onValueChange(option.value)}
          label={option.label}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  radioGroup: {
    marginTop: 4,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#F3F3F3",
  },
  radioCircleContainer: {
    marginRight: 12,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#9CA3AF",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  radioCircleSelected: {
    borderColor: "#5994FB",
  },
  radioInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#5994FB",
  },
  radioLabel: {
    flex: 1,
    fontSize: 16,
    color: "#7C7C7C",
    fontFamily: "Poppins-Medium",
  },
  radioLabelSelected: {
    fontFamily: "Poppins-Medium",
  },
});

export default CustomRadioGroup;
