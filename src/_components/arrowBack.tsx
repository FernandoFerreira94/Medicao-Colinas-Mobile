import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable } from "react-native";
import { useThemeColors } from "../hook/useThemeColors";

export function ArrowBack() {
  const color = useThemeColors();
  return (
    <Pressable
      onPress={() => router.back()}
      style={{
        borderRadius: 10,
        padding: 4,
        width: 36,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
        marginBottom: 10,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
      }}
    >
      <Ionicons name="arrow-back-outline" size={26} color={color.gray50} />
    </Pressable>
  );
}
