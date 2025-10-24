import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // 🔹 novo campo obrigatório
    shouldShowList: true, // 🔹 novo campo obrigatório
  }),
});

export default function useAgendarNotificacao() {
  useEffect(() => {
    async function configurarNotificacoes() {
      if (!Device.isDevice) return;

      // Verifica se já foi configurado
      const jaConfigurado = await AsyncStorage.getItem("notificacao_agendada");
      if (jaConfigurado) {
        console.log("📅 Notificação já agendada anteriormente.");
        return;
      }

      // Configura canal no Android
      if (Device.osName === "Android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Notificações Padrão",
          importance: Notifications.AndroidImportance.HIGH,
          sound: "default",
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      // Solicita permissão
      let { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const { status: novoStatus } =
          await Notifications.requestPermissionsAsync();
        status = novoStatus;
      }

      if (status !== "granted") {
        console.log("🚫 Permissão para notificações não concedida.");
        return;
      }

      // Calcula próxima data (dia 1 do próximo mês às 7h)
      const hoje = new Date();
      const proximo = new Date(hoje.getFullYear(), hoje.getMonth(), 1, 7, 0, 0);
      if (hoje.getDate() >= 1 && hoje > proximo) {
        proximo.setMonth(proximo.getMonth() + 1);
      }

      // Agenda notificação recorrente
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Medição Liberada ⚡",
          body: "Bom dia! Já está liberado a coleta de medição de Energia, Água e Gás.",
          sound: true,
        },
        trigger: {
          day: 1,
          hour: 7,
          minute: 0,
          repeats: true,
          channelId: "default",
        },
      });

      // Marca como agendada
      await AsyncStorage.setItem("notificacao_agendada", "true");
      console.log("✅ Notificação mensal agendada com sucesso.");
    }

    configurarNotificacoes();
  }, []);
}
