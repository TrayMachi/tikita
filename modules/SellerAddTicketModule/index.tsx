import React, { useState } from "react";
import { ScrollView, Alert, Pressable, Text, SafeAreaView } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";
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
import { useAuth } from "@/contexts/AuthContext";
import * as ImagePicker from "expo-image-picker";
import {
  Camera,
  Upload,
  ChevronDown,
  X,
  Check,
  Megaphone,
  ArrowLeft,
  ArrowRight,
} from "lucide-react-native";
import { DatePicker } from "@/components/ui/DatePicker";
import { TimePicker } from "@/components/ui/TimePicker";
import { Checkbox } from "@/components/ui/Checkbox";
import { router, Stack } from "expo-router";
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider";
import { TicketFormData, FormErrors } from "@/types/ticket";
import {
  kategoriOptions,
  tipeTicketOptions,
  tipeSeatOptions,
} from "./constant";
import {
  createTicket,
  uploadTicketImage,
  uploadTicketThumbnail,
  updateTicketImages,
} from "@/services/ticketService";
import { checkSellerStatus } from "@/services/sellerService";
import { LinearGradient } from "@/components/ui/LinearGradient";

export const SellerAddTicketModule = () => {
  const { user } = useAuth();
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
    price: 50000,
    enableCountdownPriceDrop: false,
    countdownPriceDrops: [0, 0, 0], // [H-1, H-2, H-3]
    premium: false,
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

    if (formData.price < 1000) {
      newErrors.price = "Harga tiket minimal Rp 1.000";
    }

    if (formData.price > 10000000) {
      newErrors.price = "Harga tiket maksimal Rp 10.000.000";
    }

    if (formData.enableCountdownPriceDrop) {
      if (formData.countdownPriceDrops.some((drop) => drop < 0 || drop > 100)) {
        newErrors.countdownPriceDrops =
          "Persentase turun harga harus antara 0-100%";
      }
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
        aspect: type === "thumbnail" ? [4, 3] : [9, 16],
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Error", "Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    if (!formData.uploadTicket || !formData.gambarThumbnail) {
      Alert.alert("Error", "Mohon upload gambar tiket dan thumbnail");
      return;
    }

    try {
      if (!user) {
        Alert.alert("Error", "Anda harus login terlebih dahulu");
        return;
      }

      const seller = await checkSellerStatus(user.id);
      if (!seller) {
        Alert.alert(
          "Error",
          "Seller tidak ditemukan. Silakan daftar sebagai seller terlebih dahulu."
        );
        return;
      }

      if (!seller.isVerified) {
        Alert.alert(
          "Error",
          "Akun seller Anda belum terverifikasi. Hubungi admin untuk verifikasi."
        );
        return;
      }

      const ticket = await createTicket(formData, seller.id);

      const ticketImageUrl = await uploadTicketImage(
        formData.uploadTicket,
        ticket.id
      );
      const thumbnailUrl = await uploadTicketThumbnail(
        formData.gambarThumbnail,
        ticket.id
      );

      await updateTicketImages(ticket.id, ticketImageUrl, thumbnailUrl);

      console.log("Ticket created successfully:", {
        ticket,
        ticketImageUrl,
        thumbnailUrl,
      });
      Alert.alert("Sukses", "Tiket berhasil ditambahkan!");
      router.push("/seller/addticket");
    } catch (error: any) {
      console.error("Error creating ticket:", error);

      const errorMessage =
        error?.message || "Gagal menambahkan tiket. Silakan coba lagi.";

      if (errorMessage.includes("Permission denied")) {
        Alert.alert(
          "Error",
          "Anda tidak memiliki izin untuk membuat tiket. Pastikan akun seller Anda sudah terverifikasi."
        );
      } else if (errorMessage.includes("authenticated")) {
        Alert.alert(
          "Error",
          "Sesi Anda telah berakhir. Silakan login kembali."
        );
      } else {
        Alert.alert("Error", errorMessage);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-0 dark:bg-background-950">
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
        <VStack className="bg-primary-500 rounded-t-xl p-5 mx-8 shadow-md mt-7">
          <Text className="text-white font-poppins-semibold text-xl">
            Buat Listing
          </Text>
        </VStack>
        <VStack
          className="p-5 mx-8 shadow-md bg-white rounded-b-xl mb-10"
          space="lg"
        >
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
            <Input
              variant="outline"
              size="lg"
              className={`border rounded-lg ${
                errors.namaEvent
                  ? "border-error-500 bg-error-50 dark:bg-error-950"
                  : "border-[#D5D3D3] bg-background-50 dark:bg-background-900 focus:border-[#D5D3D3]/60"
              }`}
            >
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
              <SelectTrigger
                className={`border rounded-lg ${
                  errors.kategori
                    ? "border-error-500 bg-error-50 dark:bg-error-950"
                    : "border-[#D5D3D3] bg-background-50 dark:bg-background-900 focus:border-[#D5D3D3]/60"
                }`}
              >
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
            <Input
              variant="outline"
              size="lg"
              className={`border rounded-lg ${
                errors.kotaEvent
                  ? "border-error-500 bg-error-50 dark:bg-error-950"
                  : "border-[#D5D3D3] bg-background-50 dark:bg-background-900 focus:border-[#D5D3D3]/60"
              }`}
            >
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
            <Input
              variant="outline"
              size="lg"
              className={`border rounded-lg ${
                errors.lokasi
                  ? "border-error-500 bg-error-50 dark:bg-error-950"
                  : "border-[#D5D3D3] bg-background-50 dark:bg-background-900 focus:border-[#D5D3D3]/60"
              }`}
            >
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
                    <FormControlErrorText>
                      {errors.tanggal}
                    </FormControlErrorText>
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
              <SelectTrigger
                className={`border rounded-lg ${
                  errors.tipeTicket
                    ? "border-error-500 bg-error-50 dark:bg-error-950"
                    : "border-[#D5D3D3] bg-background-50 dark:bg-background-900 focus:border-[#D5D3D3]/60"
                }`}
              >
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
              <SelectTrigger
                className={`border rounded-lg ${
                  errors.tipeSeat
                    ? "border-error-500 bg-error-50 dark:bg-error-950"
                    : "border-[#D5D3D3] bg-background-50 dark:bg-background-900 focus:border-[#D5D3D3]/60"
                }`}
              >
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
                    Foto tiket yang jelas dan dapat dibaca (9:16)
                  </Text>
                </VStack>
              </Pressable>
            )}

            {errors.uploadTicket && (
              <FormControlError>
                <FormControlErrorText>
                  {errors.uploadTicket}
                </FormControlErrorText>
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
                    Gambar menarik untuk mempromosikan event Anda (4:3)
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

          {/* Price Slider */}
          <FormControl isInvalid={!!errors.price}>
            <VStack space="md" className="border border-primary-500 rounded-xl">
              <HStack className="bg-primary-50 justify-between p-2 rounded-t-xl">
                <Text className="text-base font-poppins-semibold text-primary-500">
                  Smart Pricing
                </Text>
                <LinearGradient
                  className="rounded-full rounded-bl-none items-center py-1 -translate-y-4"
                  colors={["#FD6885", "#FE9274", "#FFBB16"]}
                  start={[0, 1]}
                  end={[1, 0]}
                >
                  <Text className="text-white font-poppins-medium text-xs px-2">
                    AI Recommendation
                  </Text>
                </LinearGradient>
              </HStack>
              <VStack className="px-4 py-2" space="md">
                <VStack className="items-center" space="sm">
                  <Text className="text-sm text-center text-typography-500 dark:text-typography-400">
                    Harga ideal saat ini berdasarkan 10+ penjualan terakhir dan
                    popularitas event
                  </Text>
                  <Text className="text-2xl font-bold text-[#464646]">
                    Rp {formData.price.toLocaleString("id-ID")}
                  </Text>
                </VStack>

                <VStack space="sm" className="px-2">
                  <HStack className="justify-between">
                    <Text className="text-xs text-typography-500 dark:text-typography-400">
                      Min
                    </Text>
                    <Text className="text-xs text-typography-500 dark:text-typography-400">
                      Max
                    </Text>
                  </HStack>

                  <Box className="justify-center h-4">
                    <Slider
                      value={formData.price}
                      onChange={(value: number) => {
                        updateFormData({ price: value });
                      }}
                      minValue={900000}
                      maxValue={2700000}
                      step={1000}
                      className="w-full"
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </Box>
                  <HStack className="justify-between">
                    <Text className="text-xs text-typography-500 dark:text-typography-400">
                      900.000
                    </Text>
                    <Text className="text-xs text-typography-500 dark:text-typography-400">
                      2.700.000
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
            </VStack>

            {errors.price && (
              <FormControlError>
                <FormControlErrorText>{errors.price}</FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          {/* Countdown Automatic Price Drop */}
          <FormControl isInvalid={!!errors.countdownPriceDrops}>
            <VStack space="md">
              <HStack space="sm" className="items-center">
                <FormControlLabel className="flex-1">
                  <FormControlLabelText>
                    Countdown Automatic Price Drop
                  </FormControlLabelText>
                </FormControlLabel>
                <HStack space="sm">
                  <Checkbox
                    isChecked={formData.enableCountdownPriceDrop}
                    onToggle={() =>
                      updateFormData({
                        enableCountdownPriceDrop:
                          !formData.enableCountdownPriceDrop,
                      })
                    }
                  />
                  <Text className="text-sm text-primary-500 font-semibold">
                    Aktifkan
                  </Text>
                </HStack>
              </HStack>

              <Text className="text-sm text-typography-500 dark:text-typography-400">
                Tiket masih ga laku, padahal acara udah H-3 😱?{"\n"}
                <Text className="text-primary-500 font-semibold italic">
                  Jika diaktifkan,{" "}
                </Text>
                Tikita bisa turunin harga kamu secara otomatis kalau mendekati
                hari H tiket masih belum laku
              </Text>

              <VStack
                space="md"
                className="bg-white p-4 rounded-xl border border-primary-500"
              >
                {/* H-3 */}
                <HStack space="md" className="items-center">
                  <Text className="text-sm font-medium text-typography-700 border border-primary-500 rounded-lg py-2 px-3 bg-primary-50">
                    H-3
                  </Text>
                  <Text className="flex-1 text-sm text-black">akan turun</Text>
                  <Input
                    variant="outline"
                    size="sm"
                    className="w-20 border-outline-300 dark:border-outline-600"
                    isDisabled={!formData.enableCountdownPriceDrop}
                  >
                    <InputField
                      placeholder="10"
                      value={formData.countdownPriceDrops[2]?.toString() || ""}
                      onChangeText={(text) => {
                        const newDrops = [...formData.countdownPriceDrops];
                        newDrops[2] = parseInt(text) || 0;
                        updateFormData({ countdownPriceDrops: newDrops });
                      }}
                      keyboardType="numeric"
                    />
                  </Input>
                  <Text className="text-sm text-black">% dari harga awal</Text>
                </HStack>

                {/* H-2 */}
                <HStack space="md" className="items-center">
                  <Text className="text-sm font-medium text-typography-700 border border-primary-500 rounded-lg py-2 px-3 bg-primary-50">
                    H-2
                  </Text>
                  <Text className="flex-1 text-sm text-black">akan turun</Text>
                  <Input
                    variant="outline"
                    size="sm"
                    className="w-20 border-outline-300 dark:border-outline-600"
                    isDisabled={!formData.enableCountdownPriceDrop}
                  >
                    <InputField
                      placeholder="15"
                      value={formData.countdownPriceDrops[1]?.toString() || ""}
                      onChangeText={(text) => {
                        const newDrops = [...formData.countdownPriceDrops];
                        newDrops[1] = parseInt(text) || 0;
                        updateFormData({ countdownPriceDrops: newDrops });
                      }}
                      keyboardType="numeric"
                    />
                  </Input>
                  <Text className="text-sm text-black">% dari harga awal</Text>
                </HStack>

                {/* H-1 */}
                <HStack space="md" className="items-center">
                  <Text className="text-sm font-medium text-typography-700 border border-primary-500 rounded-lg py-2 px-3 bg-primary-50">
                    H-1
                  </Text>
                  <Text className="flex-1 text-sm text-black">akan turun</Text>
                  <Input
                    variant="outline"
                    size="sm"
                    className="w-20 border-outline-300 dark:border-outline-600"
                    isDisabled={!formData.enableCountdownPriceDrop}
                  >
                    <InputField
                      placeholder="20"
                      value={formData.countdownPriceDrops[0]?.toString() || ""}
                      onChangeText={(text) => {
                        const newDrops = [...formData.countdownPriceDrops];
                        newDrops[0] = parseInt(text) || 0;
                        updateFormData({ countdownPriceDrops: newDrops });
                      }}
                      keyboardType="numeric"
                    />
                  </Input>
                  <Text className="text-sm text-black">% dari harga awal</Text>
                </HStack>
              </VStack>
            </VStack>

            {errors.countdownPriceDrops && (
              <FormControlError>
                <FormControlErrorText>
                  {errors.countdownPriceDrops}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.premium}>
            <VStack space="md">
              <HStack space="sm" className="items-center">
                <FormControlLabel className="flex-1">
                  <FormControlLabelText>Premium Promotion</FormControlLabelText>
                </FormControlLabel>
                <HStack space="sm">
                  <Checkbox
                    isChecked={formData.premium}
                    onToggle={() =>
                      updateFormData({ premium: !formData.premium })
                    }
                  />
                  <Text className="text-sm text-primary-500 font-semibold">
                    Aktifkan
                  </Text>
                </HStack>
              </HStack>
              <Text className="text-sm text-typography-500 dark:text-typography-400">
                Tingkatkan peluang tiketmu cepat laku dengan promosi premium
              </Text>
              <VStack className="bg-white rounded-xl border border-primary-500">
                <VStack className="p-4" space="sm">
                  <Text className="text-sm text-black">
                    - Tiketmu muncul paling atas di hasil pencarian
                  </Text>
                  <Text className="text-sm text-black">
                    - Masuk fitur Last Minute Deal pada halaman utama aplikasi
                  </Text>
                  <Text className="text-sm text-black">
                    - Lebih banyak dilihat, tiket lebih cepat terjual
                  </Text>
                </VStack>
                <HStack className="p-2 justify-between items-center bg-primary-50 rounded-b-xl">
                  <VStack space="xs">
                    <Text className="text-primary-500 font-inter-medium text-base">
                      Biaya Premium
                    </Text>
                    <Text className="text-orange-500 font-inter-medium text-sm">
                      *8% dari harga tiket
                    </Text>
                  </VStack>
                  <Text className="text-lg text-primary-500 font-semibold">
                    Rp {(formData.price * 0.08).toLocaleString("id-ID")}
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </FormControl>
        </VStack>
      </ScrollView>
      <VStack space="md" className="px-6 py-4 border-t shadow-lg bg-white border-outline-200 dark:border-outline-700">
        <HStack className="justify-between border border-primary-500 rounded-lg px-4 py-2 bg-white">
          <HStack space="sm">
            <Icon as={Megaphone} size="md" className="text-primary-500" />
            <Text className="text-[#464646] text-base">
              Anda Mengaktifkan Premium Promotion
            </Text>
          </HStack>
          <Icon as={ArrowRight} size="md" className="text-primary-500" />
        </HStack>
        <HStack className="justify-between">
          <VStack space="sm">
            <Text className="text-[#7C7C7C] dark:text-typography-50 font-inter-medium text-sm">
              *8% dari harga tiket
            </Text>
            <Text className="text-primary-500 dark:text-typography-50 font-poppins-semibold text-lg">
              Rp {(formData.price * 0.08).toLocaleString("id-ID")}
            </Text>
          </VStack>

          <Button onPress={handleSubmit} size="lg">
            <ButtonText className="font-semibold">Bayar & Jual</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </SafeAreaView>
  );
};
