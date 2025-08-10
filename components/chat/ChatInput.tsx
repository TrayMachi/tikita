import React, { useState } from "react";
import { View, Alert } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { Box } from "@/components/ui/box";
import { FormInput } from "@/components/ui/FormInput";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendOffer: (price: number) => void;
  currentPrice: number;
  disabled?: boolean;
}

export function ChatInput({
  onSendMessage,
  onSendOffer,
  currentPrice,
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [showOfferInput, setShowOfferInput] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");
  const [errors, setErrors] = useState<{ offerPrice?: string }>({});

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const validateOfferPrice = (price: string): boolean => {
    const numPrice = parseInt(price.replace(/\D/g, ""));
    let isValid = true;
    const newErrors: { offerPrice?: string } = {};

    if (!price || numPrice <= 0) {
      newErrors.offerPrice = "Harga penawaran harus diisi";
      isValid = false;
    } else if (numPrice >= currentPrice) {
      newErrors.offerPrice =
        "Harga penawaran harus lebih rendah dari harga asli";
      isValid = false;
    } else if (numPrice < currentPrice * 0.1) {
      newErrors.offerPrice =
        "Harga penawaran terlalu rendah (minimal 10% dari harga asli)";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSendOffer = () => {
    if (!validateOfferPrice(offerPrice)) return;

    const numPrice = parseInt(offerPrice.replace(/\D/g, ""));

    Alert.alert(
      "Konfirmasi Penawaran",
      `Anda akan mengirim penawaran sebesar ${new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numPrice)}?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Kirim",
          onPress: () => {
            onSendOffer(numPrice);
            setOfferPrice("");
            setShowOfferInput(false);
            setErrors({});
          },
        },
      ]
    );
  };

  const formatCurrency = (text: string) => {
    const numbers = text.replace(/\D/g, "");
    return new Intl.NumberFormat("id-ID").format(parseInt(numbers) || 0);
  };

  const handleOfferPriceChange = (text: string) => {
    setOfferPrice(formatCurrency(text));
    if (errors.offerPrice) {
      setErrors({});
    }
  };

  if (disabled) {
    return (
      <Box className="p-4 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <Button disabled variant="outline" className="w-full">
          <ButtonText className="text-gray-500">Chat tidak tersedia</ButtonText>
        </Button>
      </Box>
    );
  }

  return (
    <Box className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      {showOfferInput ? (
        <VStack space="sm">
          <FormInput
            label="Harga Penawaran"
            placeholder="Masukkan harga penawaran"
            value={offerPrice}
            onChangeText={handleOfferPriceChange}
            keyboardType="numeric"
            error={errors.offerPrice}
          />
          <HStack space="sm">
            <Button
              variant="outline"
              className="flex-1 border-gray-300"
              onPress={() => {
                setShowOfferInput(false);
                setOfferPrice("");
                setErrors({});
              }}
            >
              <ButtonText className="text-gray-600">Batal</ButtonText>
            </Button>
            <Button
              variant="solid"
              className="flex-1 bg-primary-500"
              onPress={handleSendOffer}
            >
              <ButtonText className="text-white">Kirim Penawaran</ButtonText>
            </Button>
          </HStack>
        </VStack>
      ) : (
        <VStack space="sm">
          <HStack space="sm" className="items-end">
            <Box className="flex-1">
              <Input variant="outline" className="border-gray-300">
                <InputField
                  placeholder="Ketik pesan..."
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  maxLength={500}
                  returnKeyType="send"
                  onSubmitEditing={handleSendMessage}
                  blurOnSubmit={false}
                />
              </Input>
            </Box>

            <Button
              size="md"
              variant="solid"
              className="bg-primary-500 aspect-square p-0 h-12 w-12"
              onPress={handleSendMessage}
              disabled={!message.trim()}
            >
              <FontAwesome name="send" size={16} color="white" />
            </Button>
          </HStack>

          <Button
            onPress={() => setShowOfferInput(true)}
          >
            <HStack space="sm" className="items-center">
              <FontAwesome name="dollar" size={16} color="#fff" />
              <ButtonText className="text-white">
                Buat Penawaran
              </ButtonText>
            </HStack>
          </Button>
        </VStack>
      )}
    </Box>
  );
}
