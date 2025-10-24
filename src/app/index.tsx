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
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput as Input } from "react-native-paper";
import { useToast } from "react-native-toast-notifications";
import Logo from "../../assets/images/Logo.png";
import InputPapel from "../_components/InputMatricula";
import { useAppContext } from "../context/useAppContext";
import { useSignIn } from "../hook/useSignIn";
import { useThemeColors } from "../hook/useThemeColors";

export default function Login() {
  const { setUser, setSession } = useAppContext();
  const color = useThemeColors();

  const toast = useToast();
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useSignIn({
    onSuccess: (data) => {
      setUser(data.user);
      setSession(data.session);
      router.push("/page/dashboard/page");
    },
    onError: (error) => {
      toast.show("Erro ao realizar login!" + error, { type: "danger" });
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
        <View style={[styles.container, { backgroundColor: color.roxo }]}>
          <View style={[styles.content, { backgroundColor: color.white }]}>
            <Image source={Logo} style={styles.image} />
            <View style={styles.form}>
              <InputPapel text={matricula} setText={setMatricula} />

              <Link href="/page/forgot/page" asChild>
                <TouchableOpacity style={styles.link}>
                  <Text style={[styles.linkText, { color: color.gray900 }]}>
                    Esqueceu sua matricula?
                  </Text>
                </TouchableOpacity>
              </Link>

              <Input
                mode="outlined"
                value={password}
                onChangeText={setPassword}
                label="Senha"
                placeholder="Digite sua matricula"
                textColor={color.gray900}
                activeOutlineColor={color.roxo}
                placeholderTextColor={color.grayPlaceholder900}
                style={{
                  color: color.gray50,
                  backgroundColor: color.roxoLight,
                  borderRadius: 24,
                  borderWidth: 0,
                  height: 40,
                  fontSize: 14,
                }}
                right={
                  showPassword ? (
                    <Input.Icon
                      size={22}
                      icon="eye-off"
                      onPress={toggleShowPassword}
                    />
                  ) : (
                    <Input.Icon
                      size={22}
                      icon="eye"
                      onPress={toggleShowPassword}
                    />
                  )
                }
                secureTextEntry={!showPassword}
              />

              <TouchableOpacity
                style={[styles.button, { backgroundColor: color.roxo }]}
                activeOpacity={0.9}
                onPress={handleLogin}
              >
                {isPending ? (
                  <View style={[styles.buttonText]}>
                    <ActivityIndicator size={"small"} color={color.gray50} />
                  </View>
                ) : (
                  <Text style={{ color: color.gray50 }}>Acessar</Text>
                )}
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
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "90%",
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

  link: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 8,
    marginTop: 8,
  },
  linkText: {
    fontSize: 14,
  },
  button: {
    width: "100%",
    padding: 12,

    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    width: "100%",
    fontWeight: "600",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
});
