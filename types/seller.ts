export interface Seller {
  id: string;
  created_at: string;
  userId: string; // References profiles.id
  NIK: string; // Unique identifier
  nama: string;
  linkKtp: string; // Supabase storage URL for KTP image
  linkSelfieKtp: string; // Supabase storage URL for selfie with KTP
  isVerified?: boolean;
  isActive?: boolean;
}

export interface SellerDB {
  id: string;
  created_at: string;
  userId: string;
  NIK: string;
  nama: string;
  linkKtp: string;
  linkSelfieKtp: string;
  isVerified: boolean;
  isActive: boolean;
}

export interface SellerFormData {
  NIK: string;
  nama: string;
  linkKtp: string;
  linkSelfieKtp: string;
}

export interface OnboardingStepProps {
  onNext: () => void;
  onPrevious?: () => void;
  formData: SellerFormData;
  updateFormData: (data: Partial<SellerFormData>) => void;
}

export interface SellerOnboardingState {
  currentStep: number;
  formData: SellerFormData;
  isSubmitting: boolean;
  errors: Record<string, string>;
}
