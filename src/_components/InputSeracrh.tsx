import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";
import { useAppContext } from "../context/useAppContext";
import { useThemeColors } from "../hook/useThemeColors";

export function InputSeracrh() {
  const color = useThemeColors();
  const { searchTerm, setSearchTerm } = useAppContext();
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={color.gray900} />
      <TextInput
        placeholder="Pesquisar nome ou numero do relogio"
        style={[styles.input, { color: color.gray900 }]}
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholderTextColor={color.grayPlaceholder900}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 35,
  },
  input: {
    flex: 1,
    height: 40,
    marginLeft: 10,
  },
});
