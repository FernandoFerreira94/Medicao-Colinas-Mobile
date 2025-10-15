import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Toast } from "react-native-toast-notifications";
import { useAppContext } from "../context/useAppContext";
import { useThemeColors } from "../hook/useThemeColors";
import { supabase } from "../lib/supabase";

const { width, height } = Dimensions.get("window");

export function SideBar() {
  const color = useThemeColors();
  const { user, setUser } = useAppContext();

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnim] = useState(new Animated.Value(-width / 2));

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

  async function handleDeslogar() {
    const { data: sessionData } = await supabase.auth.getSession();
    setUser(null);
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
  return (
    <>
      <View style={[styles.header, { backgroundColor: color.roxo }]}>
        <Text style={[styles.title, { color: color.gray50 }]}>
          {firstName} - {user?.funcao}
        </Text>
        <TouchableOpacity onPress={toggleMenu} style={styles.hamburger}>
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {menuOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleMenu}
        >
          <Animated.View
            style={[
              styles.sideMenu,
              { left: menuAnim, backgroundColor: color.white },
            ]}
          >
            <View style={[styles.menuHeader, { backgroundColor: color.roxo }]}>
              <Text
                style={[
                  styles.menuTitle,
                  { backgroundColor: color.roxo, color: color.gray50 },
                ]}
              >
                Menu
              </Text>
            </View>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.replace("/page/dashboard/page")}
            >
              <Ionicons name="grid-outline" size={24} color="#3D3C6C" />
              <Text style={[styles.menuText, { color: color.roxo }]}>
                Painel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/page/perfil/page")}
            >
              <Ionicons name="person-outline" size={24} color="#3D3C6C" />
              <Text style={[styles.menuText, { color: color.roxo }]}>
                Perfil
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItemOut, { backgroundColor: color.red }]}
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
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 45,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  hamburger: {
    padding: 5,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
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
  },
  menuHeader: {
    width: "100%",
    height: 100,

    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  menuTitle: {
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
  },
  menuText: {
    fontSize: 16,
  },

});
