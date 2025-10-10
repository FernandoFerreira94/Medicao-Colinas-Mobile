import { recoverRegistration } from "@/src/service/recoverRegistration";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useToast } from "react-native-toast-notifications";
import { color } from "../../../constants/color";

export default function Forgot() {
  const [nomeCompleto, setCnomeCompleto] = useState("");
  const [matriculaRecover, setMatriculaRecover] = useState("");
  const [required, serRequired] = useState("");
  const [isLoading, setLoading] = useState(false);

  const textToCopy = matriculaRecover ? matriculaRecover : "";

  const toast = useToast();

  const handleCopy = async () => {
    await Clipboard.setStringAsync(textToCopy);
    toast.show("Matricula copiada com sucesso!", { type: "success" });
  };

  async function handleVerificar() {
    if (!nomeCompleto || nomeCompleto === " ") {
      serRequired("Campo obrigatorio!!!");
      return;
    }
    const result = await recoverRegistration(nomeCompleto);
    setLoading(true);

    if (result?.error) {
      toast.show(`Error: ${result?.error}`, { type: "danger" });
      setLoading(false);
      return;
    }
    if (!result) {
      toast.show("Atenção: Nome de usuário nao encontrado", { type: "danger" });
      setLoading(false);
      return;
    }

    setMatriculaRecover(result.data?.matricula);
    serRequired("");
    setLoading(false);
  }

  const normalizeName = (name: string): string => {
    if (!name) return "";

    const wordsToExclude = ["de", "da", "do", "dos", "das"];

    // Converte a string para minúsculas e divide em palavras
    return name
      .toLowerCase()
      .split(" ")
      .map((word) => {
        if (wordsToExclude.includes(word)) {
          return word;
        }
        // Caso contrário, retorna a primeira letra maiúscula e o resto da palavra
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" "); // Junta as palavras novamente em uma string
  };

  return (
    <>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            <View style={styles.header}>
              <Pressable
                onPress={() => router.back()}
                style={{ borderWidth: 1, borderRadius: 8, padding: 1 }}
              >
                <Ionicons
                  name="arrow-back-outline"
                  size={28}
                  color={color.gray900}
                />
              </Pressable>
              <Text
                style={{
                  fontSize: 18,
                  color: color.gray900,
                  fontWeight: "semibold",
                }}
              >
                Recuperar matricula
              </Text>
            </View>
            <View style={styles.content}>
              <Text style={{ fontSize: 16, color: color.gray50 }}>
                Digite seu nome completo
              </Text>
              <TextInput
                style={[
                  styles.input,
                  required !== "" && { borderWidth: 2, borderColor: "red" },
                ]}
                placeholder="Digite seu nome completo"
                value={nomeCompleto}
                onChangeText={(text) => setCnomeCompleto(normalizeName(text))}
                placeholderTextColor={color.grayPlaceholder900}
              />
              {required && (
                <Text style={{ color: color.red, fontSize: 12 }}>
                  {required}
                </Text>
              )}
              <TouchableOpacity style={styles.button} onPress={handleVerificar}>
                <Text
                  style={{
                    color: color.gray50,
                    fontWeight: "semibold",
                    fontSize: 16,
                  }}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    "Verificar"
                  )}
                </Text>
              </TouchableOpacity>

              {matriculaRecover && (
                <View>
                  <Text
                    style={{ fontSize: 16, color: color.gray50, marginTop: 10 }}
                  >
                    Matricula: {matriculaRecover}
                  </Text>
                  <TouchableOpacity
                    style={styles.buttonDefault}
                    onPress={handleCopy}
                  >
                    <Text
                      style={{
                        color: color.gray900,
                        fontWeight: "semibold",
                        fontSize: 16,
                      }}
                    >
                      Copiar
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 40,
    marginBottom: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 20,
    paddingHorizontal: 20,
    height: 50,
  },
  content: {
    backgroundColor: color.roxo,
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20,
    padding: 20,
    paddingTop: 50,
    gap: 10,
  },
  input: {
    marginTop: 10,
    width: "100%",
    padding: 12,
    backgroundColor: color.roxoLight,
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  button: {
    width: "100%",
    padding: 12,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: color.gray50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonDefault: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.white,
    marginTop: 20,
  },
});
