import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useAppContext } from "../context/useAppContext";

export function TypeMEdicao() {
  const { typeMedicao, setTypeMedicao } = useAppContext();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Energia", value: "Energia" },
    { label: "Água", value: "Agua" },
    { label: "Gás", value: "Gas" },
  ]);

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={typeMedicao}
        items={items}
        setOpen={setOpen}
        setValue={(callback) => {
          const value =
            typeof callback === "function" ? callback(typeMedicao) : callback;
          setTypeMedicao(value);
        }}
        setItems={setItems}
        placeholder="Selecione o tipo medição"
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
    width: "45%",
    zIndex: 1,
  },
  dropdown: {
    borderColor: "#ccc",
    borderRadius: 6,
    backgroundColor: "#fff",
    minHeight: 40, // menor altura visível
    paddingVertical: 2,
  },
  dropdownContainer: {
    borderColor: "#ccc",
    borderRadius: 6,
  },
  listItemContainer: {
    minHeight: 28, // reduz altura dos itens da lista
  },
  text: {
    fontSize: 13, // texto menor
  },
});
