import { ArrowBack } from "@/src/_components/arrowBack";
import { SideBar } from "@/src/_components/sideBar";
import { Title } from "@/src/_components/title";
import { color } from "@/src/constants/color";
import { useAppContext } from "@/src/context/useAppContext";
import { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

export default function Perfil() {
  const { user } = useAppContext();

  // Caso venha do contexto, você pode trocar esses estados
  const [medicaoEnergia, setMedicaoEnergia] = useState(
    user?.permissao_energia ?? false
  );
  const [medicaoAgua, setMedicaoAgua] = useState(user?.permissao_agua ?? false);
  const [medicaoGas, setMedicaoGas] = useState(user?.permissao_gas ?? false);
  const [isAdmin, setIsAdmin] = useState(user?.is_adm ?? false);

  return (
    <View style={{ flex: 1, backgroundColor: color.roxo }}>
      <SideBar />
      <ArrowBack />

      <Title text={"Perfil"} />

      <View style={styles.content}>
        {/* Nome completo */}
        <InfoItem label="Nome completo" value={user?.nome_completo} />
        <InfoItem label="Função" value={user?.funcao} />
        <InfoItem label="Número matrícula" value={user?.matricula} />
        <InfoItem label="CPF" value={user?.cpf} />

        {/* Medição permitida */}
        <View style={{ gap: 8 }}>
          <Text style={styles.label}>Medição permitida</Text>

          <View style={styles.switchGroup}>
            <SwitchItem label="Energia" value={medicaoEnergia} />
            <SwitchItem label="Água" value={medicaoAgua} />
            <SwitchItem label="Gás" value={medicaoGas} />
          </View>
        </View>
        <View style={{ gap: 8 }}>
          <Text style={styles.label}>Usuario administrador</Text>

          <View style={styles.switchGroup}>
            <SwitchItem label="Admin" value={isAdmin} />
          </View>
        </View>
      </View>
    </View>
  );
}

export function InfoItem({ label, value }: { label: string; value?: string }) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.contentText}>
        <Text style={styles.text}>{value}</Text>
      </View>
    </View>
  );
}

function SwitchItem({ label, value }: { label: string; value: boolean }) {
  return (
    <View style={styles.switchRow}>
      <Text style={styles.text}>{label}</Text>
      <Switch
        value={value}
        disabled={true}
        trackColor={{ false: color.gray900, true: color.green }}
        thumbColor={value ? color.white : color.gray900}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: color.roxoLight,
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
    paddingHorizontal: 10,
    gap: 12,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    color: color.gray900,
  },
  contentText: {
    width: "100%",
    backgroundColor: color.white,
    justifyContent: "center",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  text: {
    color: color.gray900,
    fontSize: 16,
  },
  switchGroup: {
    backgroundColor: color.white,
    borderRadius: 10,
    padding: 10,
    gap: 20,
    flexDirection: "row",
  },
  switchRow: {
    gap: 8,
  },
});
