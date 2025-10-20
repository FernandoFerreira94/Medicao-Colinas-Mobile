import { ArrowBack } from "@/src/_components/arrowBack";
import { SideBar } from "@/src/_components/sideBar";
import { Title } from "@/src/_components/title";

import { useAppContext } from "@/src/context/useAppContext";
import { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useThemeColors } from "../../../hook/useThemeColors";
export default function Perfil() {
  const color = useThemeColors();
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

      <View style={[styles.content, { backgroundColor: color.roxoLight }]}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ marginBottom: 30 }}
        >
          <InfoItem label="Nome completo" value={user?.nome_completo} />
          <InfoItem label="Função" value={user?.funcao} />
          <InfoItem label="Número matrícula" value={user?.matricula} />
          <InfoItem label="CPF" value={user?.cpf} />

          <View style={{ gap: 8 }}>
            <Text style={[styles.label, { color: color.gray900 }]}>
              Medição permitida
            </Text>

            <View
              style={[styles.switchGroup, { backgroundColor: color.white }]}
            >
              <SwitchItem label="Energia" value={medicaoEnergia} />
              <SwitchItem label="Água" value={medicaoAgua} />
              <SwitchItem label="Gás" value={medicaoGas} />
            </View>
          </View>
          <View style={{ gap: 8 }}>
            <Text style={[styles.label, { color: color.gray900 }]}>
              Usuario administrador
            </Text>

            <View
              style={[styles.switchGroup, { backgroundColor: color.white }]}
            >
              <SwitchItem label="Admin" value={isAdmin} />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
export function InfoItem({ label, value }: { label: string; value?: string }) {
  const color = useThemeColors();
  return (
    <View style={{ gap: 4 }}>
      <Text style={[styles.label, { color: color.gray900 }]}>{label}</Text>
      <View style={[styles.contentText, { backgroundColor: color.white }]}>
        <Text style={[styles.text, { color: color.gray900 }]}>{value}</Text>
      </View>
    </View>
  );
}
function SwitchItem({ label, value }: { label: string; value: boolean }) {
  const color = useThemeColors();
  return (
    <View style={styles.switchRow}>
      <Text style={[styles.text, { color: color.gray900 }]}>{label}</Text>
      <Switch
        value={value}
        disabled={true}
        trackColor={{ false: color.gray900, true: color.green }}
        thumbColor={value ? color.roxoLight : color.gray900}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20,
    padding: 20,
    paddingTop: 50,
    gap: 10,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
  },
  contentText: {
    width: "100%",

    justifyContent: "center",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  text: {
    fontSize: 15,
  },
  switchGroup: {
    borderRadius: 10,
    padding: 10,
    gap: 20,
    flexDirection: "row",
  },
  switchRow: {
    gap: 8,
  },
});
