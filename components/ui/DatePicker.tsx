import React, { useState } from "react";
import { Platform, Modal } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/Themed";

interface DatePickerProps {
  value: Date | null;
  onDateChange: (date: Date | null) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  placeholder?: string;
  isInvalid?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onDateChange,
  minimumDate,
  maximumDate,
  placeholder = "Pilih tanggal",
  isInvalid = false,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(value || new Date());

  const formatDate = (date: Date | null): string => {
    if (!date) return placeholder;
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const handleDateSelect = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
      if (event.type === "set" && selectedDate) {
        onDateChange(selectedDate);
      }
    } else {
      // iOS - update temp date for modal
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleConfirm = () => {
    onDateChange(tempDate);
    setShowPicker(false);
  };

  const handleCancel = () => {
    setTempDate(value || new Date());
    setShowPicker(false);
  };

  const openPicker = () => {
    setTempDate(value || new Date());
    setShowPicker(true);
  };

  return (
    <>
      {/* Date Display */}
      <Button
        onPress={openPicker}
        variant="outline"
        size="lg"
        className={`border rounded-lg ${
          isInvalid
                ? "border-error-500 bg-error-50 dark:bg-error-950"
                : "border-[#D5D3D3] bg-background-50 dark:bg-background-900 focus:border-[#D5D3D3]/60"
            }`}
      >
        <Text
          className={`flex-1 text-left ${
            value
              ? "text-typography-900 dark:text-typography-50"
              : "text-typography-500"
          }`}
        >
          {formatDate(value)}
        </Text>
      </Button>

      {/* Android Picker */}
      {Platform.OS === "android" && showPicker && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          onChange={handleDateSelect}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}

      {/* iOS Modal Picker */}
      {Platform.OS === "ios" && (
        <Modal visible={showPicker} transparent={true} animationType="slide">
          <Box className="flex-1 justify-end bg-black/50">
            <Box className="bg-background-0 dark:bg-background-950 rounded-t-2xl">
              {/* Header */}
              <HStack className="justify-between items-center p-4 border-b border-background-200 dark:border-background-800">
                <Button onPress={handleCancel} variant="link">
                  <ButtonText className="text-typography-500">Batal</ButtonText>
                </Button>
                <Text className="font-poppins-semibold text-typography-900 dark:text-typography-50">
                  Pilih Tanggal
                </Text>
                <Button onPress={handleConfirm} variant="link">
                  <ButtonText className="text-primary-500">Selesai</ButtonText>
                </Button>
              </HStack>

              {/* Picker */}
              <Box className="p-4">
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateSelect}
                  minimumDate={minimumDate}
                  maximumDate={maximumDate}
                  style={{ backgroundColor: "transparent" }}
                />
              </Box>
            </Box>
          </Box>
        </Modal>
      )}

      {/* Web Picker */}
      {Platform.OS === "web" && showPicker && (
        <Modal visible={showPicker} transparent={true} animationType="fade">
          <Box className="flex-1 justify-center items-center bg-black/50">
            <Box className="bg-background-0 dark:bg-background-950 rounded-2xl p-6 mx-6 min-w-80">
              <VStack space="lg">
                <Text className="text-lg font-poppins-semibold text-typography-900 dark:text-typography-50 text-center">
                  Pilih Tanggal
                </Text>

                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display="default"
                  onChange={handleDateSelect}
                  minimumDate={minimumDate}
                  maximumDate={maximumDate}
                />

                <HStack space="md">
                  <Button
                    onPress={handleCancel}
                    variant="outline"
                    className="flex-1"
                  >
                    <ButtonText>Batal</ButtonText>
                  </Button>
                  <Button onPress={handleConfirm} className="flex-1">
                    <ButtonText>Pilih</ButtonText>
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </Box>
        </Modal>
      )}
    </>
  );
};

