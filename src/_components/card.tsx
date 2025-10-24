import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { truncateText } from "../action/truncateText";
import { useAppContext } from "../context/useAppContext";
import { useThemeColors } from "../hook/useThemeColors";
import { LojaProps } from "../types";

const date = new Date();
const currentDay = date.getDate();
const currentMonth = date.getMonth() + 1;
const currentYear = date.getFullYear();

export default function Card({ loja }: { loja: LojaProps }) {
  const color = useThemeColors();
  const { user, month, year } = useAppContext();
  const isToDetailLoja = (idLoja: string, idMedidor: string) => {
    if (idLoja && idMedidor) {
      router.push({
        pathname: "/page/detailLoja/[id]",
        params: { id: idLoja, idMedidor: idMedidor },
      });
    }
  };

  const verifi = () => {
    if (loja?.medidores[0]?.leituras[0]?.leitura_atual) {
      return true;
    }
    return false;
  };

  const isVerificad = verifi();

  const shouldDisableButton2 = () => {
    if (user?.is_adm) {
      return false;
    }
    const isShouldDisable = currentDay > 10;
    return isShouldDisable;
  };
  const shouldDisable = shouldDisableButton2();

  const verifiedMonth = () => {
    if (currentMonth === month && currentYear === year && currentDay < 10) {
      return true;
    }
    return false;
  };

  const isVerificadMonth = verifiedMonth();

  const textoMedicao = isVerificad
    ? "Medição coletada"
    : shouldDisable
      ? `Medição liberada no primeiro dia do mês!`
      : isVerificadMonth
        ? "Mês não liberado"
        : `Medição`;

  return (
    <View
      style={[
        styles.card,
        isVerificad ? { borderColor: color.green } : { borderColor: color.red },
        { backgroundColor: color.white },
      ]}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: color.gray900 }]}>
          {truncateText(loja.nome_loja, 17)}
        </Text>
        <View
          style={{
            flexDirection: "row",
            gap: 4,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={[styles.cardTitle, { color: color.gray900 }]}>
            {loja.prefixo_loja} - {truncateText(loja.numero_loja, 8)}
          </Text>
          <View
            style={[
              {
                width: 14,
                height: 14,
                backgroundColor: color.gray50,
                borderRadius: 50,
              },
              loja.ativa
                ? { backgroundColor: color.green }
                : { backgroundColor: color.red },
            ]}
          ></View>
        </View>
      </View>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardSpan, { color: color.gray900 }]}>
          Nº relogio
        </Text>
        <Text style={[styles.cardSpan, { color: color.gray900 }]}>
          {loja?.medidores[0]?.numero_relogio || "xxx-xxx-xxx"}
        </Text>
      </View>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardSpan, { color: color.gray900 }]}>
          Localidade
        </Text>
        <Text style={[styles.cardSpan, { color: color.gray900 }]}>
          {loja?.medidores[0]?.localidade || "Outros"}
        </Text>
      </View>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardSpan, { color: color.gray900 }]}>
          Leitura mês anterior
        </Text>
        <Text style={[styles.cardSpan, { color: color.gray900 }]}>
          {loja?.medidores[0]?.ultima_leitura}
        </Text>
      </View>

      <View style={styles.cardButtonsWrapper}>
        <TouchableOpacity
          style={[
            styles.btnCardDefault,
            {
              backgroundColor:
                isVerificad || shouldDisable || isVerificadMonth
                  ? color.roxoPlaceholder
                  : color.roxo,
            },
          ]}
          onPress={() => {
            if (loja?.id && loja?.medidores[0].id) {
              isToDetailLoja(loja?.id, loja?.medidores[0]?.id);
            }
          }}
        >
          <Text
            style={[
              styles.btnTextSecondary,
              isVerificad && { color: color.gray50 },
              {
                color: color.gray50,
              },
            ]}
          >
            {textoMedicao}{" "}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginVertical: 8,
    borderLeftWidth: 10,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  cardSpan: {
    fontSize: 13,
  },
  cardButtonsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    gap: 15,
  },

  btnCardDefault: {
    width: "100%",
    height: 35,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  btnTextSecondary: {
    fontWeight: "600",
    fontSize: 13,
    textAlign: "center",
  },
});
