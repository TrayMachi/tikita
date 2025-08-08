import React, { useState } from "react";
import { ScrollView, Alert, Pressable } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/Themed";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
  SelectScrollView,
} from "@/components/ui/select";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import * as ImagePicker from "expo-image-picker";
import { Camera, Upload, ChevronDown, X } from "lucide-react-native";
import { DatePicker } from "@/components/ui/DatePicker";
import { TimePicker } from "@/components/ui/TimePicker";
import { Stack } from "expo-router";
import { Center } from "@/components/ui/center";

interface TicketFormData {
  namaEvent: string;
  kategori: string;
  kotaEvent: string;
  lokasi: string;
  tanggal: Date | null;
  waktu: Date | null;
  tipeTicket: string;
  tipeSeat: string;
  uploadTicket: string | null;
  gambarThumbnail: string | null;
}

interface FormErrors {
  namaEvent?: string;
  kategori?: string;
  kotaEvent?: string;
  lokasi?: string;
  tanggal?: string;
  waktu?: string;
  tipeTicket?: string;
  tipeSeat?: string;
  uploadTicket?: string;
  gambarThumbnail?: string;
}

const kategoriOptions = [
  { label: "Konser", value: "konser" },
  { label: "Festival", value: "festival" },
  { label: "Pertunjukan", value: "pertunjukan" },
  { label: "Stand Up Comedy", value: "stand-up-comedy" },
  { label: "Teater", value: "teater" },
  { label: "Olahraga", value: "olahraga" },
  { label: "Seminar", value: "seminar" },
  { label: "Workshop", value: "workshop" },
  { label: "Lainnya", value: "lainnya" },
];

const tipeTicketOptions = [
  { label: "Fisik", value: "fisik" },
  { label: "Digital", value: "digital" },
];

const tipeSeatOptions = [
  { label: "Reserved Seat (Kursi Bernopmor)", value: "reserved" },
  { label: "Free Seating (Bebas Duduk)", value: "free" },
  { label: "Standing (Berdiri)", value: "standing" },
];

export const SellerAddTicketModule = () => {
  const [formData, setFormData] = useState<TicketFormData>({
    namaEvent: "",
    kategori: "",
    kotaEvent: "",
    lokasi: "",
    tanggal: null,
    waktu: null,
    tipeTicket: "",
    tipeSeat: "",
    uploadTicket: null,
    gambarThumbnail: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoadingThumbnail, setIsLoadingThumbnail] = useState(false);
  const [isLoadingTicket, setIsLoadingTicket] = useState(false);

  const updateFormData = (updates: Partial<TicketFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    // Clear related errors when user starts typing
    const newErrors = { ...errors };
    Object.keys(updates).forEach((key) => {
      delete newErrors[key as keyof FormErrors];
    });
    setErrors(newErrors);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.namaEvent.trim()) {
      newErrors.namaEvent = "Nama event wajib diisi";
    }

    if (!formData.kategori) {
      newErrors.kategori = "Kategori wajib dipilih";
    }

    if (!formData.kotaEvent.trim()) {
      newErrors.kotaEvent = "Kota event wajib diisi";
    }

    if (!formData.lokasi.trim()) {
      newErrors.lokasi = "Lokasi wajib diisi";
    }

    if (!formData.tanggal) {
      newErrors.tanggal = "Tanggal event wajib dipilih";
    }

    if (!formData.waktu) {
      newErrors.waktu = "Waktu event wajib dipilih";
    }

    if (!formData.tipeTicket) {
      newErrors.tipeTicket = "Tipe tiket wajib dipilih";
    }

    if (!formData.tipeSeat) {
      newErrors.tipeSeat = "Tipe seat wajib dipilih";
    }

    if (!formData.uploadTicket) {
      newErrors.uploadTicket = "Upload tiket wajib dilakukan";
    }

    if (!formData.gambarThumbnail) {
      newErrors.gambarThumbnail = "Gambar thumbnail wajib diupload";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImage = async (type: "thumbnail" | "ticket") => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission required",
          "Mohon izinkan akses ke galeri foto"
        );
        return;
      }

      if (type === "thumbnail") {
        setIsLoadingThumbnail(true);
      } else {
        setIsLoadingTicket(true);
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === "thumbnail" ? [16, 9] : [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        if (type === "thumbnail") {
          updateFormData({ gambarThumbnail: result.assets[0].uri });
        } else {
          updateFormData({ uploadTicket: result.assets[0].uri });
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Gagal memilih gambar");
    } finally {
      setIsLoadingThumbnail(false);
      setIsLoadingTicket(false);
    }
  };

  const removeImage = (type: "thumbnail" | "ticket") => {
    if (type === "thumbnail") {
      updateFormData({ gambarThumbnail: null });
    } else {
      updateFormData({ uploadTicket: null });
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Form is valid, submit the data
      console.log("Form submitted:", formData);
      Alert.alert("Sukses", "Tiket berhasil ditambahkan!");
    } else {
      Alert.alert("Error", "Mohon lengkapi semua field yang wajib diisi");
    }
  };

  return (
    <ScrollView className="flex-1 bg-background-0 dark:bg-background-950">
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Jual Tiket",
          headerBackVisible: true,
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "600",
          },
          headerBackButtonDisplayMode: "minimal",
          headerTitleAlign: "center",
        }}
      />  
      <VStack className="p-6" space="lg">
        {/* Header */}
        <Box>
          <Text className="text-2xl font-poppins-bold text-typography-900 dark:text-typography-50">
            Tambah Tiket Baru
          </Text>
          <Text className="text-sm text-typography-500 dark:text-typography-400 mt-1">
            Lengkapi informasi event dan tiket Anda
          </Text>
        </Box>

        {/* Nama Event */}
        <FormControl isInvalid={!!errors.namaEvent}>
          <FormControlLabel>
            <FormControlLabelText>Nama Event</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              placeholder="Masukkan nama event"
              value={formData.namaEvent}
              onChangeText={(text) => updateFormData({ namaEvent: text })}
            />
          </Input>
          {errors.namaEvent && (
            <FormControlError>
              <FormControlErrorText>{errors.namaEvent}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        {/* Kategori */}
        <FormControl isInvalid={!!errors.kategori}>
          <FormControlLabel>
            <FormControlLabelText>Kategori</FormControlLabelText>
          </FormControlLabel>
          <Select
            selectedValue={formData.kategori}
            onValueChange={(value) => updateFormData({ kategori: value })}
          >
            <SelectTrigger>
              <SelectInput placeholder="Pilih kategori event" />
              <SelectIcon as={ChevronDown} />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                <SelectScrollView>
                  {kategoriOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </SelectScrollView>
              </SelectContent>
            </SelectPortal>
          </Select>
          {errors.kategori && (
            <FormControlError>
              <FormControlErrorText>{errors.kategori}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        {/* Kota Event */}
        <FormControl isInvalid={!!errors.kotaEvent}>
          <FormControlLabel>
            <FormControlLabelText>Kota Event</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              placeholder="Masukkan kota event"
              value={formData.kotaEvent}
              onChangeText={(text) => updateFormData({ kotaEvent: text })}
            />
          </Input>
          {errors.kotaEvent && (
            <FormControlError>
              <FormControlErrorText>{errors.kotaEvent}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        {/* Lokasi */}
        <FormControl isInvalid={!!errors.lokasi}>
          <FormControlLabel>
            <FormControlLabelText>Lokasi</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              placeholder="Masukkan alamat lengkap lokasi"
              value={formData.lokasi}
              onChangeText={(text) => updateFormData({ lokasi: text })}
              multiline
            />
          </Input>
          {errors.lokasi && (
            <FormControlError>
              <FormControlErrorText>{errors.lokasi}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        {/* Tanggal dan Waktu */}
        <HStack space="md">
          {/* Tanggal */}
          <Box className="flex-1">
            <FormControl isInvalid={!!errors.tanggal}>
              <FormControlLabel>
                <FormControlLabelText>Tanggal</FormControlLabelText>
              </FormControlLabel>
              <DatePicker
                value={formData.tanggal}
                onDateChange={(date) => updateFormData({ tanggal: date })}
                minimumDate={new Date()}
                placeholder="Pilih tanggal event"
                isInvalid={!!errors.tanggal}
              />
              {errors.tanggal && (
                <FormControlError>
                  <FormControlErrorText>{errors.tanggal}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          </Box>

          {/* Waktu */}
          <Box className="flex-1">
            <FormControl isInvalid={!!errors.waktu}>
              <FormControlLabel>
                <FormControlLabelText>Waktu</FormControlLabelText>
              </FormControlLabel>
              <TimePicker
                value={formData.waktu}
                onTimeChange={(time) => updateFormData({ waktu: time })}
                placeholder="Pilih waktu event"
                isInvalid={!!errors.waktu}
                is24Hour={true}
              />
              {errors.waktu && (
                <FormControlError>
                  <FormControlErrorText>{errors.waktu}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          </Box>
        </HStack>

        {/* Tipe Tiket */}
        <FormControl isInvalid={!!errors.tipeTicket}>
          <FormControlLabel>
            <FormControlLabelText>Tipe Tiket</FormControlLabelText>
          </FormControlLabel>
          <Select
            selectedValue={formData.tipeTicket}
            onValueChange={(value) => updateFormData({ tipeTicket: value })}
          >
            <SelectTrigger>
              <SelectInput placeholder="Pilih tipe tiket" />
              <SelectIcon as={ChevronDown} />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                <SelectScrollView>
                  {tipeTicketOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </SelectScrollView>
              </SelectContent>
            </SelectPortal>
          </Select>
          {errors.tipeTicket && (
            <FormControlError>
              <FormControlErrorText>{errors.tipeTicket}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        {/* Tipe Seat */}
        <FormControl isInvalid={!!errors.tipeSeat}>
          <FormControlLabel>
            <FormControlLabelText>Tipe Seat</FormControlLabelText>
          </FormControlLabel>
          <Select
            selectedValue={formData.tipeSeat}
            onValueChange={(value) => updateFormData({ tipeSeat: value })}
          >
            <SelectTrigger>
              <SelectInput placeholder="Pilih tipe seat" />
              <SelectIcon as={ChevronDown} />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                <SelectScrollView>
                  {tipeSeatOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </SelectScrollView>
              </SelectContent>
            </SelectPortal>
          </Select>
          {errors.tipeSeat && (
            <FormControlError>
              <FormControlErrorText>{errors.tipeSeat}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        {/* Upload Tiket */}
        <FormControl isInvalid={!!errors.uploadTicket}>
          <FormControlLabel>
            <FormControlLabelText>Upload Tiket</FormControlLabelText>
          </FormControlLabel>

          {formData.uploadTicket ? (
            <VStack space="sm">
              <Image
                source={{ uri: formData.uploadTicket }}
                className="w-full h-48 rounded-lg border border-outline-200"
                alt="Ticket Preview"
              />
              <HStack space="sm">
                <Button
                  onPress={() => pickImage("ticket")}
                  disabled={isLoadingTicket}
                  className="flex-1"
                  variant="outline"
                >
                  <ButtonIcon as={Upload} />
                  <ButtonText>
                    {isLoadingTicket ? "Mengunggah..." : "Ganti Tiket"}
                  </ButtonText>
                </Button>
                <Button
                  onPress={() => removeImage("ticket")}
                  action="negative"
                  variant="outline"
                >
                  <ButtonIcon as={X} />
                </Button>
              </HStack>
            </VStack>
          ) : (
            <Pressable
              onPress={() => pickImage("ticket")}
              disabled={isLoadingTicket}
              className="w-full py-8 border-dashed border-2 border-primary-300 rounded-xl bg-primary-50 dark:bg-primary-950"
            >
              <VStack className="items-center" space="sm">
                <Box className="bg-primary-100 dark:bg-primary-900 rounded-full p-3">
                  <Icon as={Upload} size="xl" className="text-primary-500" />
                </Box>
                <Text className="text-primary-500 font-poppins-medium">
                  {isLoadingTicket ? "Mengunggah..." : "Upload Foto Tiket"}
                </Text>
                <Text className="text-xs text-typography-500 text-center px-4">
                  Foto tiket yang jelas dan dapat dibaca
                </Text>
              </VStack>
            </Pressable>
          )}

          {errors.uploadTicket && (
            <FormControlError>
              <FormControlErrorText>{errors.uploadTicket}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        {/* Gambar Thumbnail */}
        <FormControl isInvalid={!!errors.gambarThumbnail}>
          <FormControlLabel>
            <FormControlLabelText>Gambar Thumbnail</FormControlLabelText>
          </FormControlLabel>

          {formData.gambarThumbnail ? (
            <VStack space="sm">
              <Image
                source={{ uri: formData.gambarThumbnail }}
                className="w-full h-48 rounded-lg border border-outline-200"
                alt="Thumbnail Preview"
              />
              <HStack space="sm">
                <Button
                  onPress={() => pickImage("thumbnail")}
                  disabled={isLoadingThumbnail}
                  className="flex-1"
                  variant="outline"
                >
                  <ButtonIcon as={Camera} />
                  <ButtonText>
                    {isLoadingThumbnail ? "Mengunggah..." : "Ganti Thumbnail"}
                  </ButtonText>
                </Button>
                <Button
                  onPress={() => removeImage("thumbnail")}
                  action="negative"
                  variant="outline"
                >
                  <ButtonIcon as={X} />
                </Button>
              </HStack>
            </VStack>
          ) : (
            <Pressable
              onPress={() => pickImage("thumbnail")}
              disabled={isLoadingThumbnail}
              className="w-full py-8 border-dashed border-2 border-primary-300 rounded-xl bg-primary-50 dark:bg-primary-950"
            >
              <VStack className="items-center" space="sm">
                <Box className="bg-primary-100 dark:bg-primary-900 rounded-full p-3">
                  <Icon as={Camera} size="xl" className="text-primary-500" />
                </Box>
                <Text className="text-primary-500 font-poppins-medium">
                  {isLoadingThumbnail
                    ? "Mengunggah..."
                    : "Upload Gambar Thumbnail"}
                </Text>
                <Text className="text-xs text-typography-500 text-center px-4">
                  Gambar menarik untuk mempromosikan event Anda (16:9)
                </Text>
              </VStack>
            </Pressable>
          )}

          {errors.gambarThumbnail && (
            <FormControlError>
              <FormControlErrorText>
                {errors.gambarThumbnail}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        {/* Submit Button */}
        <Box className="pt-4">
          <Button onPress={handleSubmit} size="lg">
            <ButtonText>Tambah Tiket</ButtonText>
          </Button>
        </Box>

        {/* Bottom spacing */}
        <Box className="h-6" />
      </VStack>
    </ScrollView>
  );
};
