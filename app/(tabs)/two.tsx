import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";

export default function TabTwoScreen() {
  const router = useRouter();
  const { signOut } = useAuth();

  return (
    <Box className="flex-1 justify-center items-center">
      <Button
        onPress={async () => {
          await signOut();
          router.replace("/auth/login");
        }}
      >
        <ButtonText>Sign Out</ButtonText>
      </Button>
    </Box>
  );
}
