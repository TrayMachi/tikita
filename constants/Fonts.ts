/**
 * Font family constants for the Tikita app
 * Inter is set as the default font, with Poppins as an alternative
 */

export const FontFamilies = {
  // Inter fonts (default) - Using Google Fonts naming
  inter: {
    regular: "Inter_400Regular",
    medium: "Inter_500Medium",
    semibold: "Inter_600SemiBold",
    bold: "Inter_700Bold",
  },
  // Poppins fonts (alternative) - Using Google Fonts naming
  poppins: {
    regular: "Poppins_400Regular",
    medium: "Poppins_500Medium",
    semibold: "Poppins_600SemiBold",
    bold: "Poppins_700Bold",
  },
  // System fonts
  mono: "SpaceMono_400Regular",
} as const;

export const DefaultFontFamily = FontFamilies.inter.regular;

// Tailwind CSS classes for font families
export const FontClasses = {
  // Inter font classes
  inter: "font-inter",
  interMedium: "font-inter-medium",
  interSemibold: "font-inter-semibold",
  interBold: "font-inter-bold",

  // Poppins font classes
  poppins: "font-poppins",
  poppinsMedium: "font-poppins-medium",
  poppinsSemibold: "font-poppins-semibold",
  poppinsBold: "font-poppins-bold",

  // Default semantic classes
  heading: "font-heading", // Inter SemiBold
  body: "font-body", // Inter Regular
  mono: "font-mono", // SpaceMono
} as const;
