import Card from "@/src/_components/card";
import { MonthYearDropdown } from "@/src/_components/data";
import { InputSeracrh } from "@/src/_components/InputSeracrh";
import { Localidade } from "@/src/_components/localidade";
import { SideBar } from "@/src/_components/sideBar";
import { TypeMEdicao } from "@/src/_components/typeMedicao";
import { useAppContext } from "@/src/context/useAppContext";
import { useFetchAllLojas } from "@/src/hook/useFetchAllLojas";
import { useThemeColors } from "@/src/hook/useThemeColors";
import { LojaProps } from "@/src/types";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
const ITEMS_PER_PAGE = 20;

export default function Dashboard() {
  const color = useThemeColors();
  const {
    searchTerm,
    month,
    year,
    localidade,

    typeMedicao,
  } = useAppContext();

  const { data, isLoading } = useFetchAllLojas(
    typeMedicao,
    month,
    year,
    localidade,
    searchTerm
  );

  const [filteredLojas, setFilteredLojas] = useState<LojaProps[]>([]);
  const [sortedLojas, setSortedLojas] = useState<LojaProps[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [vacantCount, setVacantCount] = useState(0);
  const [activeLeituras, setActiveLeituras] = useState(0);
  const [vacanLeitura, setVacanLeitura] = useState(0);
  // useEffect 1: Filtra as lojas por data e tipo de medição
  useEffect(() => {
    if (data) {
      const selectedDate = new Date(year, month - 1, 1);

      const filtered = data.filter((loja) => {
        const relevantMedidor = loja.medidores.find(
          (medidor) => medidor.tipo_medicao === typeMedicao
        );

        if (!relevantMedidor || !relevantMedidor.data_instalacao) {
          return false;
        }

        const medidorCreationDate = new Date(relevantMedidor.data_instalacao);
        return (
          medidorCreationDate.getFullYear() < selectedDate.getFullYear() ||
          (medidorCreationDate.getFullYear() === selectedDate.getFullYear() &&
            medidorCreationDate.getMonth() <= selectedDate.getMonth())
        );
      });

      setFilteredLojas(filtered);
    }
  }, [data, typeMedicao, month, year]);

  // useEffect 2: Ordena, conta e atualiza os estados com base nas lojas filtradas
  useEffect(() => {
    if (filteredLojas.length > 0) {
      const tempLojas = [...filteredLojas];

      const activeStores = tempLojas.filter((loja) => loja.ativa === true);
      const vacantStores = tempLojas.filter((loja) => loja.ativa === false);

      const activeLojasComLeitura = activeStores.filter(
        (loja) => loja.medidores[0]?.leituras.length > 0
      );
      const vacantLojasComLeitura = vacantStores.filter(
        (loja) => loja.medidores[0]?.leituras.length > 0
      );

      setActiveLeituras(activeLojasComLeitura.length);
      setVacanLeitura(vacantLojasComLeitura.length);

      setActiveCount(activeStores.length);
      setVacantCount(vacantStores.length);

      const orderedLojas = tempLojas.sort((a, b) => {
        const aHasReading = a.medidores[0]?.leituras.length > 0;
        const bHasReading = b.medidores[0]?.leituras.length > 0;

        if (aHasReading !== bHasReading) {
          return aHasReading ? 1 : -1;
        }

        if (a.prefixo_loja > b.prefixo_loja) return 1;
        if (a.prefixo_loja < b.prefixo_loja) return -1;

        return Number(a.numero_loja) - Number(b.numero_loja);
      });

      setSortedLojas(orderedLojas);
    } else {
      // Limpa os estados se não houver dados filtrados
      setSortedLojas([]);
      setActiveLeituras(0);
      setVacanLeitura(0);
      setActiveCount(0);
      setVacantCount(0);
    }
  }, [filteredLojas]);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [sortedLojas]);

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + ITEMS_PER_PAGE);
  };

  return (
    <View style={{ flex: 1, height: "100%", backgroundColor: color.roxo }}>
      <SideBar />
      <View style={styles.containerSearch}>
        <View style={{ width: "100%", alignItems: "flex-end" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{ fontSize: 20, color: color.gray50, fontWeight: "bold" }}
            >
              Painel medições
            </Text>
            <MonthYearDropdown />
          </View>
        </View>
        <View style={styles.contentSearch}>
          <Localidade />
          <TypeMEdicao />
        </View>
        <View style={styles.contentSearch}>
          <InputSeracrh />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={[styles.content, { backgroundColor: color.roxoLight }]}>
          <ScrollView style={{ width: "100%" }}>
            {isLoading && (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: 100,
                  width: "100%",
                  gap: 12,
                }}
              >
                <ActivityIndicator size="large" color={color.roxo} />
                <Text style={{ fontSize: 16, fontWeight: "semibold" }}>
                  Carregando lojas...
                </Text>
              </View>
            )}
            {data &&
              (sortedLojas && sortedLojas.length > 0 ? (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      justifyContent: "center",
                      paddingBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: color.green,
                        fontWeight: "semibold",
                        fontSize: 14,
                      }}
                    >
                      Ativos ( {activeLeituras} / {activeCount} )
                    </Text>
                    <Text
                      style={{
                        color: color.red,
                        fontWeight: "semibold",
                        fontSize: 14,
                      }}
                    >
                      Vagos ( {vacanLeitura} / {vacantCount} )
                    </Text>
                  </View>
                  {sortedLojas.slice(0, visibleCount).map((loja) => {
                    if (!loja.id) {
                      console.error(
                        "ID ausente ou inválido para uma loja:",
                        loja
                      );
                      return null;
                    }

                    return <Card key={loja.id} loja={loja} />;
                  })}
                  {visibleCount < sortedLojas.length && (
                    <TouchableOpacity
                      style={{
                        alignItems: "center",
                        paddingTop: 10,
                        paddingBottom: 20,
                      }}
                      onPress={handleLoadMore}
                    >
                      <Text style={{ color: color.roxo, fontSize: 16 }}>
                        Ver mais...
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "semibold",
                      marginTop: 20,
                    }}
                  >
                    Nenhuma loja encontrada
                  </Text>
                </View>
              ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 15,
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  containerSearch: {
    width: "100%",
    paddingHorizontal: 14,
    paddingBottom: 16,
    gap: 10,
  },
  contentSearch: {
    width: "100%",
    flexDirection: "row",
    gap: 4,
    justifyContent: "space-between",
  },
});
