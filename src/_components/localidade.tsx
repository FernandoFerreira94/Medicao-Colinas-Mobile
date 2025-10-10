import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { color } from "../constants/color";
import { useAppContext } from "../context/useAppContext";

export function Localidade() {
  const { localidade, setLocalidade } = useAppContext();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Todos", value: "all" },
    { label: "Sub-Adm", value: "Sub-Adm" },
    { label: "CM-1", value: "CM-1" },
    { label: "CM-2", value: "CM-2" },
    { label: "Shaft - NT", value: "Shaft-NT" },
    { label: "Shaft - NS", value: "Shaft-NS" },
    { label: "Área técnica 26", value: "Area tecnica 26" },
    { label: "Área técnica 27", value: "Area tecnica 27" },
    { label: "Sub-Band", value: "Sub-Band" },
    { label: "Sub-Doca-Hotel", value: "Sub-Doca-Hotel" },
    { label: "Sub-Eco-Primo", value: "Sub-Eco-Primo" },
    { label: "Sub-Principal", value: "Sub-Principal" },
    { label: "Hotel", value: "Hotel" },
    { label: "Casa-Bomba", value: "Casa-Bomba" },
    { label: "Torre-Comercial", value: "Torre-Comercial" },
    { label: "Loja", value: "Loja" },
    { label: "CAG", value: "CAG" },
    { label: "Outros", value: "Outros" },
  ]);

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={localidade}
        items={items}
        setOpen={setOpen}
        listMode="MODAL"
        setValue={(callback) => {
          const value =
            typeof callback === "function" ? callback(localidade) : callback;

          setLocalidade(value);
        }}
        setItems={setItems}
        placeholder="Selecione a localidade"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        textStyle={styles.text}
        listItemContainerStyle={styles.listItemContainer}
        listItemLabelStyle={styles.text}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "50%",
    zIndex: 1,
  },
  dropdown: {
    borderColor: color.gray900,
    borderRadius: 6,
    backgroundColor: "#fff",
    minHeight: 40,
    paddingVertical: 2,
  },
  dropdownContainer: {
    borderColor: "#ccc",
    borderRadius: 6,
    maxHeight: 200,
  },
  listItemContainer: {
    minHeight: 28,
  },
  text: {
    fontSize: 13,
  },
});
