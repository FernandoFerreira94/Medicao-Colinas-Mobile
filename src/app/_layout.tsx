import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { LogBox } from "react-native";
import { ToastProvider } from "react-native-toast-notifications";
import { AppProvider } from "../context/AppProvider";
import { useAppContext } from "../context/useAppContext";
import { supabase } from "../lib/supabase";
LogBox.ignoreLogs(["SafeAreaView has been deprecated"]);

const queryClient = new QueryClient();

export default function RootLayout() {
  //useAgendarNotificacao();
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <StatusBar style="light" />
        <MainLayout />
      </AppProvider>
    </QueryClientProvider>
  );
}

function MainLayout() {
  const { setUser } = useAppContext();

  useEffect(() => {
    async function loadSession() {
      // Garante que pega a sessão ativa no carregamento
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (session) {
        const { data: userData } = await supabase
          .from("usuarios")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        setUser(userData);
        router.replace("/page/dashboard/page");
      } else {
        setUser(null);
        router.replace("/");
      }

      // Listener para mudanças de auth
      const { data: listener } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (session) {
            const { data: userData } = await supabase
              .from("usuarios")
              .select("*")
              .eq("user_id", session.user.id)
              .single();

            setUser(userData);
            router.replace("/page/dashboard/page");
          } else {
            setUser(null);
            router.replace("/");
          }
        }
      );

      return () => listener.subscription?.unsubscribe();
    }

    loadSession();
  }, []);

  return (
    <ToastProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="page/dashboard/page"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="page/forgot/page"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="page/perfil/page"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="page/detailLoja/[id]"
          options={{ headerShown: false }}
        />
      </Stack>
    </ToastProvider>
  );
}
