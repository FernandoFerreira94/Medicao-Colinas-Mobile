import { Feather } from "@expo/vector-icons"; // <-- import do ícone
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppContext } from "../../src/context/useAppContext";
import { useThemeColors } from "../hook/useThemeColors";

export function MonthYearDropdown() {
  const color = useThemeColors();
  const { month, year, setMonth, setYear } = useAppContext();
  const [modalVisible, setModalVisible] = useState(false);

  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - i);

  const handleConfirm = () => setModalVisible(false);

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.trigger,
          { borderColor: color.roxo, backgroundColor: color.white },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.triggerText, { color: color.gray900 }]}>
          {month && year
            ? `${months[month - 1]} / ${year}`
            : "Selecione mês/ano"}
        </Text>
        <Feather name="calendar" size={20} color={color.gray900} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: color.white }]}>
            <Text style={styles.modalTitle}>Selecione mês e ano</Text>

            <View style={styles.pickersRow}>
              <Picker
                selectedValue={month}
                style={styles.picker}
                onValueChange={(itemValue) => setMonth(itemValue)}
                itemStyle={{ color: color.gray900 }}
                
              >
                {months.map((m, i) => {
                  const isFuture =
                    year > currentYear ||
                    (year === currentYear && i + 1 > new Date().getMonth() + 1);

                  // Se for um mês futuro, não renderiza
                  if (isFuture) return null;

                  return <Picker.Item key={i} label={m} value={i + 1} />;
                })}
              </Picker>

              <Picker
                selectedValue={year}
                style={styles.picker}
                onValueChange={(itemValue) => setYear(itemValue)}
                itemStyle={{ color: color.gray900 }}
              >
                {years.map((y) => (
                  <Picker.Item key={y} label={y.toString()} value={y} />
                ))}
              </Picker>
            </View>

            <Pressable
              style={[styles.confirmButton, { backgroundColor: color.roxo }]}
              onPress={handleConfirm}
            >
              <Text style={[styles.confirmText, { color: color.gray50 }]}>
                Confirmar
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    borderWidth: 1,
    height: 35,
    paddingHorizontal: 10,
    borderRadius: 8,
    flexDirection: "row", // para ícone e texto ficarem lado a lado
    justifyContent: "flex-end",
    gap: 10,
    alignItems: "center",
  },
  triggerText: { fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: 10,
    borderRadius: 12,
    width: "90%",
    alignItems: "center",
  },
  modalTitle: { fontSize: 16, fontWeight: "600" },
  pickersRow: { flexDirection: "row", gap: 10 },
  picker: { height: 240, width: 140 },
  confirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
