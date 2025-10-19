
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { ActivityIndicator } from "react-native-paper";
import { useThemeColors } from "../hook/useThemeColors";

interface ConfirmationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  leituraAtual: string;
  leituraAnterior: number;
  consumoCalculado: number;
  isPending: boolean;
}

export function ConfirmationModal({
  isVisible,
  onClose,
  onConfirm,
  leituraAtual,
  leituraAnterior,
  consumoCalculado,
  isPending,
}: ConfirmationModalProps) {
  const color = useThemeColors();
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      animationIn="zoomIn"
      animationOut="zoomOut"
    >
      <View style={[styles.modalContent, { backgroundColor: color.white }]}>
        <Text style={[styles.modalTitle, { color: color.gray900 }]}>
          Confirmação de Medição
        </Text>
        <Text style={[styles.modalQuestion, { color: color.roxo }]}>
          A medição está correta?
        </Text>

        <Text style={styles.modalDataLabel}>Leitura atual</Text>
        <Text style={styles.modalDataValue}>{leituraAtual}</Text>

        <Text style={styles.modalDataLabel}>Leitura anterior</Text>
        <Text style={styles.modalDataValue}>{String(leituraAnterior)}</Text>

        <Text style={styles.modalDataLabel}>Consumo</Text>
        <Text style={styles.modalDataValue}>{String(consumoCalculado)}</Text>

        <Text style={[styles.modalQuestion, { color: color.roxo }]}>
          Deseja continuar?
        </Text>

        <View style={styles.modalButtonContainer}>
          <TouchableOpacity
            style={[
              styles.modalButton,
              {
                borderColor: color.red,
                borderWidth: 2,
                backgroundColor: color.white,
              },
            ]}
            onPress={onClose}
            disabled={isPending}
          >
            <Text style={{ color: color.red }}>Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: color.roxo }]}
            onPress={onConfirm}
            disabled={isPending}
          >
            <Text style={[styles.modalButtonText, { color: color.gray50 }]}>
              {isPending ? (
                <ActivityIndicator size={"small"} color={color.gray50} />
              ) : (
                "Continuar"
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalQuestion: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 15,
  },
  modalDataLabel: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
  },
  modalDataValue: {
    fontSize: 16,
    fontWeight: "semibold",
    textAlign: "center",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    height: 40, // Adicionado para manter o tamanho quando o ActivityIndicator for exibido
    justifyContent: "center",
  },
  modalButtonText: {
    fontWeight: "semibold",
    fontSize: 16,
    // Removida altura e alinhamento, pois o container cuida disso
  },
});
