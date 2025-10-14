import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { truncateText } from "../action/truncateText";
import { color } from "../constants/color";
import { LojaProps } from "../types";

export default function Card({ loja }: { loja: LojaProps }) {
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

  return (
    <View
      style={[
        styles.card,
        loja.medidores[0]?.leituras[0]?.leitura_atual
          ? { borderColor: color.green }
          : { borderColor: color.red },
      ]}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{truncateText(loja.nome_loja, 17)}</Text>
        <View
          style={{
            flexDirection: "row",
            gap: 4,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.cardTitle}>
            {loja.prefixo_loja} - {truncateText(loja.numero_loja, 8)}{" "}
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
        <Text style={styles.cardSpan}>Nº relogio</Text>
        <Text style={styles.cardSpan}>
          {loja?.medidores[0]?.numero_relogio || "xxx-xxx-xxx"}
        </Text>
      </View>
      <View style={styles.cardHeader}>
        <Text style={styles.cardSpan}>Localidade</Text>
        <Text style={styles.cardSpan}>
          {loja?.medidores[0]?.localidade || "Outros"}
        </Text>
      </View>
      <View style={styles.cardHeader}>
        <Text style={styles.cardSpan}>Leitura mês anterior</Text>
        <Text style={styles.cardSpan}>
          {loja?.medidores[0]?.ultima_leitura}
        </Text>
      </View>

      <View style={styles.cardButtonsWrapper}>
        <TouchableOpacity
          style={[
            styles.btnCardDefault,
            isVerificad && {
              backgroundColor: color.grayPlaceholder900,
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
            ]}
          >
            Medição
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: color.white,
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
    color: color.gray900,
  },
  cardSpan: {
    fontSize: 13,
    color: color.gray900,
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
    backgroundColor: color.roxo,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btnTextPrimary: {
    color: color.roxo,
    fontWeight: "600",
    fontSize: 13,
  },
  btnTextSecondary: {
    color: color.gray50,
    fontWeight: "600",
    fontSize: 13,
  },
});
