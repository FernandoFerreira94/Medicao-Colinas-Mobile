import Card from "@/src/_components/card";
import { MonthYearDropdown } from "@/src/_components/data";
import { InputSeracrh } from "@/src/_components/InputSeracrh";
import { Localidade } from "@/src/_components/localidade";
import { TypeMEdicao } from "@/src/_components/typeMedicao";
import { color } from "@/src/constants/color";
import { useAppContext } from "@/src/context/useAppContext";
import { useFetchAllLojas } from "@/src/hook/useFetchAllLojas";
import { supabase } from "@/src/lib/supabase";
import { LojaProps } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Toast } from "react-native-toast-notifications";

const { width, height } = Dimensions.get("window");

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnim] = useState(new Animated.Value(-width / 2));
  const {
    searchTerm,
    setUser,
    setSession,
    month,
    year,
    localidade,
    user,
    typeMedicao,
  } = useAppContext();

  const firstName = user?.nome_completo.split(" ")[0];

  const toggleMenu = () => {
    if (menuOpen) {
      Animated.timing(menuAnim, {
        toValue: -width / 2,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setMenuOpen(false));
    } else {
      setMenuOpen(true);
      Animated.timing(menuAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const { data, isLoading } = useFetchAllLojas(
    typeMedicao,
    month,
    year,
    localidade,
    searchTerm
  );

  async function handleDeslogar() {
    const { data: sessionData } = await supabase.auth.getSession();
    setUser(null);
    console.log("Sessão atual:", sessionData);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Toast.show("Ops, erro ao deslogar, tente mais tarde", {
          type: "danger",
        });
        console.error(error);
        return;
      }

      router.replace("/");
    } catch (err) {
      console.error("Erro inesperado ao deslogar:", err);
    }
  }

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

  return (
    <View style={{ flex: 1, backgroundColor: color.roxo }}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {firstName} - {user?.funcao}
        </Text>
        <TouchableOpacity onPress={toggleMenu} style={styles.hamburger}>
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.containerSearch}>
        <View style={{ width: "100%", alignItems: "flex-end" }}>
          <MonthYearDropdown />
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
        <View style={styles.content}>
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
              Ativos ( {activeLeituras} / {activeCount} ){" "}
            </Text>
            <Text
              style={{
                color: color.red,
                fontWeight: "semibold",
                fontSize: 14,
              }}
            >
              Vagos ( {vacanLeitura} / {vacantCount} ){" "}
            </Text>
          </View>
          <ScrollView style={{ width: "100%" }}>
            {isLoading && (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: 100,
                  width: "100%",
                }}
              >
                <ActivityIndicator size="large" color={color.roxo} />
                <Text>Carregando...</Text>
              </View>
            )}
            {data &&
              (sortedLojas && sortedLojas.length > 0 ? (
                <>
                  {sortedLojas.slice(0, 20).map((loja) => {
                    if (!loja.id) {
                      console.error(
                        "ID ausente ou inválido para uma loja:",
                        loja
                      );
                      return null;
                    }
                    return <Card key={loja.id} loja={loja} />;
                  })}
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
      {menuOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleMenu}
        >
          <Animated.View style={[styles.sideMenu, { left: menuAnim }]}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menu</Text>
            </View>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="grid-outline" size={24} color="#3D3C6C" />
              <Text style={styles.menuText}>Painel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="person-outline" size={24} color="#3D3C6C" />
              <Text style={styles.menuText}>Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItemOut}
              onPress={handleDeslogar}
            >
              <Ionicons name="log-out-outline" size={24} color={color.gray50} />
              <Text style={{ color: color.gray50, fontWeight: "semibold" }}>
                Deslogar
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 45,
    marginBottom: 10,
    backgroundColor: color.roxo,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  hamburger: {
    padding: 5,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: "rgba(0,0,0,0.4)", // sombra para o resto do dashboard
    zIndex: 10,
  },
  sideMenu: {
    position: "absolute",
    top: 0,
    width: width / 2,
    height: height,
    backgroundColor: "#fff",
  },
  menuHeader: {
    width: "100%",
    height: 100,
    backgroundColor: color.roxo,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  menuTitle: {
    backgroundColor: "#3D3C6C",
    color: "#fff",
    fontSize: 20,
  },
  menuItem: {
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 15,
  },
  menuItemOut: {
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 15,
    marginTop: "auto",
    marginBottom: 40,
    backgroundColor: color.red,
  },
  menuText: {
    fontSize: 16,
    color: "#3D3C6C",
  },
  content: {
    backgroundColor: color.roxoLight,
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 15,
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
