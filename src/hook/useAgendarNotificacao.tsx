import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function useAgendarNotificacao() {
  useEffect(() => {
    async function configurarNotificacoes() {
      if (!Device.isDevice) return;

      if (Device.osName === "Android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Notificações Padrão",
          importance: Notifications.AndroidImportance.HIGH, // 🔊 nível alto
          sound: "default", // ✅ usa o som padrão do sistema
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      await Notifications.requestPermissionsAsync({
        ios: { allowSound: true, allowAlert: true, allowBadge: true },
      });

      await Notifications.setNotificationChannelAsync("default", {
        name: "Notificações Padrão",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
      });

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Permissão para notificações não concedida.");
        return;
      }

      const hoje = new Date();
      const proximoDia27 = new Date(
        hoje.getFullYear(),
        hoje.getDate() > 25 ? hoje.getMonth() + 1 : hoje.getMonth(),
        1,
        7,
        0,
        0
      );

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Medição Liberada ⚡",
          body: "Bom dia. Já está liberado a coleta de medição de Energia, Agua e Gás. ",
          sound: true,
        },
        trigger: {
          date: proximoDia27,
          channelId: "default", // Usaremos a sintaxe limpa
        } as Notifications.NotificationTriggerInput, //
      });

      console.log("Notificação agendada para:", proximoDia27);
    }

    configurarNotificacoes();

    // ✅ Quando o usuário tocar na notificação, reagendar para o mês seguinte
    const subscription = Notifications.addNotificationResponseReceivedListener(
      async () => {
        const proximoMes = new Date();
        proximoMes.setMonth(proximoMes.getMonth() + 1);
        proximoMes.setDate(1);
        proximoMes.setHours(4, 0, 0);

        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Medição Liberada ⚡",
            body: "Bom dia. Já está liberado a coleta de medição de Energia, Agua e Gás. ",
            sound: true,
          },
          trigger: {
            date: proximoMes,
            channelId: "default", // Usaremos a sintaxe limpa
          } as Notifications.NotificationTriggerInput, //
        });

        console.log("Próxima notificação agendada para:", proximoMes);
      }
    );

    return () => subscription.remove();
  }, []);
}
