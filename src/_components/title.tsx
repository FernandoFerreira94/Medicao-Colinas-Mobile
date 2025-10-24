import { StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "../hook/useThemeColors";

export function Title({ text }: { text: string }) {
  const color = useThemeColors();
  return (
    <View style={styles.header}>
      <Text style={[styles.headerText, { color: color.gray50 }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    marginBottom: 20,
  },
});
