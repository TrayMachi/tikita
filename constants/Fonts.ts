/**
 * Font family constants for the Tikita app
 * Inter is set as the default font, with Poppins as an alternative
 */

export const FontFamilies = {
  // Inter fonts (default)
  inter: {
    regular: "Inter-Regular",
    medium: "Inter-Medium",
    semibold: "Inter-SemiBold",
    bold: "Inter-Bold",
  },
  // Poppins fonts (alternative)
  poppins: {
    regular: "Poppins-Regular",
    medium: "Poppins-Medium",
    semibold: "Poppins-SemiBold",
    bold: "Poppins-Bold",
  },
  // System fonts
  mono: "SpaceMono",
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
