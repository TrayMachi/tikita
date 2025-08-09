import { VStack } from "@/components/ui/vstack";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { CustomRadioGroup } from "@/components/ui/CustomRadio";
import { TicketDB } from "@/types/ticket";
import React, { useState } from "react";
import { Text } from "react-native";

export interface FormData {
  nama: string;
  email: string;
  nomorHP: string;
  nomorKartuIdentitas: string;
  metodePembayaran: string;
}

export interface FormErrors {
  nama?: string;
  email?: string;
  nomorHP?: string;
  nomorKartuIdentitas?: string;
  metodePembayaran?: string;
}

export const Form = React.forwardRef<
  { validateForm: () => boolean },
  {
    ticket: TicketDB;
    formData: FormData;
    setFormData: (data: FormData) => void;
  }
>(({ ticket, formData, setFormData }, ref) => {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nama.trim()) {
      newErrors.nama = "Nama wajib diisi";
    } else if (formData.nama.trim().length < 2) {
      newErrors.nama = "Nama minimal 2 karakter";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.nomorHP.trim()) {
      newErrors.nomorHP = "Nomor HP wajib diisi";
    } else if (
      !/^(\+62|62|0)[0-9]{8,13}$/.test(formData.nomorHP.replace(/\s|-/g, ""))
    ) {
      newErrors.nomorHP = "Format nomor HP tidak valid (contoh: 08xxxxxxxxx)";
    }

    if (!formData.nomorKartuIdentitas.trim()) {
      newErrors.nomorKartuIdentitas = "Nomor kartu identitas wajib diisi";
    } else if (formData.nomorKartuIdentitas.trim().length < 6) {
      newErrors.nomorKartuIdentitas =
        "Nomor kartu identitas minimal 6 karakter";
    }

    if (!formData.metodePembayaran) {
      newErrors.metodePembayaran = "Metode pembayaran wajib dipilih";
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    return isValid;
  };

  React.useImperativeHandle(ref, () => ({
    validateForm,
  }));

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    if (errors[field]) {
      setErrors((prev: FormErrors) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const paymentMethods = [
    { value: "transfer-bank", label: "Transfer Bank" },
    { value: "kartu-kredit", label: "Kartu Kredit/Debit" },
    { value: "e-wallet", label: "E-Wallet" },
    { value: "lainnya", label: "Metode Pembayaran Lainnya" },
  ];

  return (
    <VStack space="md">
      <VStack className="px-6 py-4 bg-white mt-3">
        <Text className="font-poppins-medium text-2xl text-[#464646] mb-4">
          Detail Peserta
        </Text>

        <VStack space="lg">
          <FormControl isInvalid={!!errors.nama}>
            <FormControlLabel>
              <FormControlLabelText className="font-poppins-medium text-[#464646]">
                Nama <Text className="text-[#FD6885]">*</Text>{"\n"}
                <Text className="text-xs text-[#7C7C7C] font-inter-regular">
                  Gunakan nama lengkap sesuai dengan KTP/Paspor.
                </Text>
              </FormControlLabelText>
            </FormControlLabel>
            <Input
              variant="outline"
              size="md"
              className={`border rounded-lg ${
                errors.nama
                  ? "border-error-500 bg-error-50 dark:bg-error-950"
                  : "border-[#D5D3D3] bg-background-50 dark:bg-background-900 focus:border-[#D5D3D3]/60"
              }`}
            >
              <InputField
                placeholder="Masukkan nama lengkap"
                value={formData.nama}
                onChangeText={(value) => handleInputChange("nama", value)}
                className="font-poppins-regular"
              />
            </Input>
            {errors.nama && (
              <FormControlError>
                <FormControlErrorText className="font-poppins-regular">
                  {errors.nama}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.email}>
            <FormControlLabel>
              <FormControlLabelText className="font-poppins-medium text-[#464646]">
                Email <Text className="text-[#FD6885]">*</Text>{"\n"}
                <Text className="text-xs text-[#7C7C7C] font-inter-regular">
                  Gunakan Email yang masih aktif.
                </Text>
              </FormControlLabelText>
            </FormControlLabel>
            <Input
              variant="outline"
              size="md"
              className={`border rounded-lg ${
                errors.email
                  ? "border-error-500 bg-error-50 dark:bg-error-950"
                  : "border-[#D5D3D3] bg-background-50 dark:bg-background-900 focus:border-[#D5D3D3]/60"
              }`}
            >
              <InputField
                placeholder="contoh@email.com"
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value)}
                keyboardType="email-address"
                autoCapitalize="none"
                className="font-poppins-regular"
              />
            </Input>
            {errors.email && (
              <FormControlError>
                <FormControlErrorText className="font-poppins-regular">
                  {errors.email}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.nomorHP}>
            <FormControlLabel>
              <FormControlLabelText className="font-poppins-medium text-[#464646]">
                Nomor HP <Text className="text-[#FD6885]">*</Text>{"\n"}
                <Text className="text-xs text-[#7C7C7C] font-inter-regular">
                  Gunakan nomor HP yang masih aktif.
                </Text>
              </FormControlLabelText>
            </FormControlLabel>
            <Input
              variant="outline"
              size="md"
              className={`border rounded-lg ${
                errors.nomorHP
                  ? "border-error-500 bg-error-50 dark:bg-error-950"
                  : "border-[#D5D3D3] bg-background-50 dark:bg-background-900 focus:border-[#D5D3D3]/60"
              }`}
            >
              <InputField
                placeholder="08xxxxxxxxxx"
                value={formData.nomorHP}
                onChangeText={(value) => handleInputChange("nomorHP", value)}
                keyboardType="phone-pad"
                className="font-poppins-regular"
              />
            </Input>
            {errors.nomorHP && (
              <FormControlError>
                <FormControlErrorText className="font-poppins-regular">
                  {errors.nomorHP}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.nomorKartuIdentitas}>
            <FormControlLabel>
              <FormControlLabelText className="font-poppins-medium text-[#464646]">
                Nomor Kartu Identitas (KTP/Paspor){" "}
                <Text className="text-[#FD6885]">*</Text>{"\n"}
                <Text className="text-xs text-[#7C7C7C] font-inter-regular">
                  Gunakan nomor yang tertera di kartu identitas kamu.
                </Text>
              </FormControlLabelText>
            </FormControlLabel>
            <Input
              variant="outline"
              size="md"
              className={`border rounded-lg ${
                errors.nomorKartuIdentitas
                  ? "border-error-500 bg-error-50 dark:bg-error-950"
                  : "border-[#D5D3D3] bg-background-50 dark:bg-background-900 focus:border-[#D5D3D3]/60"
              }`}
            >
              <InputField
                placeholder="Masukkan nomor KTP atau Paspor"
                value={formData.nomorKartuIdentitas}
                onChangeText={(value) =>
                  handleInputChange("nomorKartuIdentitas", value)
                }
                className="font-poppins-regular"
              />
            </Input>
            {errors.nomorKartuIdentitas && (
              <FormControlError>
                <FormControlErrorText className="font-poppins-regular">
                  {errors.nomorKartuIdentitas}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
        </VStack>
      </VStack>

      <VStack className="px-6 py-4 bg-white">
        <Text className="font-poppins-medium text-2xl text-[#464646] mb-4">
          Pilih Metode Pembayaran
        </Text>

        <FormControl isInvalid={!!errors.metodePembayaran}>
          <CustomRadioGroup
            options={paymentMethods}
            selectedValue={formData.metodePembayaran}
            onValueChange={(value) =>
              handleInputChange("metodePembayaran", value)
            }
          />
          {errors.metodePembayaran && (
            <FormControlError>
              <FormControlErrorText className="font-poppins-regular">
                {errors.metodePembayaran}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </VStack>
    </VStack>
  );
});

Form.displayName = "Form";
