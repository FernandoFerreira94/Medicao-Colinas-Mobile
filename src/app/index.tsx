import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useToast } from "react-native-toast-notifications";
import { color } from "../constants/color";
import { useAppContext } from "../context/useAppContext";
import { useSignIn } from "../hook/useSignIn";
import Logo from "../image/Logo.png";

export default function Login() {
  const { setUser, setSession } = useAppContext();

  const toast = useToast();
  const [matricula, setMatricula] = useState("155157");
  const [password, setPassword] = useState("454184");
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useSignIn({
    onSuccess: (data) => {
      setUser(data.user);
      setSession(data.session);
      router.push("/page/dashboard/page");
    },
    onError: (error) => {
      toast.show("Erro ao realizar login!" + error, { type: "danger" });
      console.log(error);
    },
  });

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  function handleLogin() {
    if (!matricula || matricula === " " || !password || password === " ") {
      toast.show("Todos os campos devem ser preenchidos!", { type: "warning" });
      return;
    }

    mutate({ matricula, password });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.content}>
            <Image source={Logo} style={styles.image} />
            <View style={styles.form}>
              <Text style={styles.label}>Matricula</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite sua matricula"
                value={matricula}
                onChangeText={setMatricula}
                keyboardType="default"
                placeholderTextColor={color.grayPlaceholder900}
              />

              <Link href="/page/forgot/page" asChild>
                <TouchableOpacity style={styles.link}>
                  <Text style={styles.linkText}>Esqueceu sua matricula?</Text>
                </TouchableOpacity>
              </Link>
              <View>
                <Text style={styles.label}>Senha</Text>
                <View style={styles.passwordInputWrapper}>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    style={styles.inputPassword}
                    placeholder="Digite sua senha"
                    secureTextEntry={!showPassword} // Inverte o valor de showPassword
                    keyboardType="default"
                    placeholderTextColor={color.grayPlaceholder900}
                  />
                  <TouchableOpacity
                    onPress={toggleShowPassword}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"} // Altera o ícone com base no estado
                      size={20}
                      color={color.gray900}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>
                  {isPending ? <ActivityIndicator size={"small"} /> : "Entrar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: color.roxo,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "90%",
    backgroundColor: color.white,
    paddingBottom: 20,
    paddingTop: 30,
    borderRadius: 20,
    alignItems: "center",
  },
  image: {
    width: "65%",
    height: 100,
    resizeMode: "contain",
    marginBottom: 20,
  },
  form: {
    width: "90%",
  },
  label: {
    color: color.gray900,
    fontSize: 16,
  },
  input: {
    width: "100%",
    padding: 10,
    backgroundColor: color.roxoLight,
    borderRadius: 10,
    marginVertical: 8,
    paddingHorizontal: 14,
    color: color.gray900,
  },
  link: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 4,
  },
  linkText: {
    color: color.gray900,
    fontSize: 14,
  },
  button: {
    width: "100%",
    padding: 12,
    backgroundColor: color.roxo,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: color.white,
    fontWeight: "600",
  },
  passwordInputWrapper: {
    flexDirection: "row", // Para colocar o TextInput e o ícone na mesma linha
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 8,
    borderRadius: 10,
    backgroundColor: color.roxoLight,
  },
  inputPassword: {
    flex: 1, // Permite que o TextInput ocupe o espaço restante
    padding: 10,
    color: color.gray900,
  },
  eyeIcon: {
    paddingRight: 10, // Espaçamento à direita do ícone
    paddingLeft: 5, // Espaçamento à esquerda do ícone
  },
});
