// src/hooks/useLeituraForm.ts

import { getLeituraAnterior } from "@/src/action/GetLeituraAnterior";
import { useAppContext } from "@/src/context/useAppContext";
import { useCreateLeitura } from "@/src/hook/useCreateLeitura";
import { useFetchLojaSingle } from "@/src/hook/useFetchLoja";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Toast } from "react-native-toast-notifications";
import { useThemeColors } from "../hook/useThemeColors";

const date = new Date();
const currentDay = date.getDate();
const currentMonth = date.getMonth() + 1;
const currentYear = date.getFullYear();
const currentDate = `${currentDay}/${currentMonth}/${currentYear}`;

interface LeituraFormProps {
  lojaId: string | undefined;
  medidorId: string | undefined;
}

export function useLeituraForm({ lojaId, medidorId }: LeituraFormProps) {
  const color = useThemeColors();
  const queryClient = useQueryClient();
  const { month, year, user } = useAppContext();
  const firstName = user?.nome_completo.split(" ")[0];

  // Estados Locais
  const [medicaoAtual, setMedicaoAtual] = useState<string>("");
  const [isHave, setIsHave] = useState(true); // Indica se já existe leitura salva
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [detalheLeitura, setDetalheLeitura] = useState("");

  // Busca de Dados
  const { data: lojaData } = useFetchLojaSingle(lojaId, medidorId, month, year);
  const isBusway = lojaData?.medidor?.numero_relogio === "BUSWAY";

  // Cálculos e Validação
  const leituraAnterior = getLeituraAnterior(
    Number(lojaData?.medidor?.leituras[0]?.leitura_anterior ?? 0),
    Number(lojaData?.medidor?.ultima_leitura ?? 0)
  );

  const leituraAtualNum = Number(medicaoAtual.replace(",", "."));

  const consumoCalculado = isBusway
    ? leituraAtualNum
    : leituraAtualNum > leituraAnterior
      ? leituraAtualNum - leituraAnterior
      : 0;

  const isLeituraValida = isBusway
    ? leituraAtualNum >= 0
    : leituraAtualNum >= leituraAnterior;

  const getBorderColor = (): string => {
    if (
      medicaoAtual === "" ||
      isNaN(leituraAtualNum) ||
      leituraAtualNum === 0
    ) {
      return color.red;
    }
    return isLeituraValida ? color.green : color.red;
  };

  // Mutação (Registro)
  const { mutate, isPending } = useCreateLeitura({
    onSuccess: (data) => {
      Toast.show(
        `Leitura da loja ${data?.nome_loja_leitura} feita com sucesso`,
        { type: "success" }
      );
      setIsModalVisible(false);
      queryClient.invalidateQueries({
        queryKey: ["lojaSingle", lojaId, medidorId, month, year],
      });
      router.replace("/page/dashboard/page");
    },
    onError: (error) => {
      Toast.show("Erro ao registrar leitura: " + error, { type: "danger" });
      setIsModalVisible(false);
    },
  });

  // Efeito para carregar dados iniciais
  useEffect(() => {
    if (
      (lojaData?.medidor?.leituras.length &&
        lojaData?.medidor?.leituras[0]?.leitura_atual) ||
      lojaData?.medidor.leituras[0]?.detalhes_leitura
    ) {
      setMedicaoAtual(String(lojaData?.medidor?.leituras[0]?.leitura_atual));
      setDetalheLeitura(lojaData?.medidor?.leituras[0]?.detalhes_leitura || "");
      setIsHave(false);
      return;
    }
    setMedicaoAtual("");
    setDetalheLeitura("");
    setIsHave(true);
  }, [lojaData]);

  // Função para abrir o modal com validação
  const handleOpenModal = (photoUri: string | null) => {
    if (
      medicaoAtual === "" ||
      isNaN(leituraAtualNum) ||
      leituraAtualNum === 0
    ) {
      Toast.show("O valor da leitura atual é obrigatório.", {
        type: "warning",
      });
      return;
    }

    if (!isLeituraValida) {
      const warningMessage = isBusway
        ? "O consumo deve ser um valor positivo."
        : "A leitura atual deve ser maior que a leitura anterior.";
      Toast.show(warningMessage, { type: "warning" });
      return;
    }

    if (!photoUri) {
      Toast.show("É obrigatório anexar uma foto da leitura.", {
        type: "warning",
      });
      return;
    }

    setIsModalVisible(true);
  };

  const handleRegistrarLeitura = (photoUri: string | null) => {
    if (!lojaData?.medidor || !photoUri) return;

    const detalhes_acrescetar =
      detalheLeitura.trim() === ""
        ? "Nenhum detalhe adicional fornecido."
        : detalheLeitura;

    const full_detalhes = `Leitura feita por ${firstName} - ${user?.funcao} / Data: ${currentDate}. Detalhes a acrescentar: ${detalhes_acrescetar}`;

    const newLeitura = {
      medidor_id: lojaData.medidor.id || "",
      mes: month,
      ano: year,
      // O campo 'leitura_anterior' será a base para o próximo mês
      leitura_anterior: lojaData?.medidor?.ultima_leitura,
      leitura_atual: leituraAtualNum,
      photo_uri: photoUri,

      nome_usuario: `${firstName} - ${user?.funcao}`,
      detalhes_leitura: full_detalhes,
      data_leitura: new Date().toISOString(),
      nome_loja_leitura: lojaData?.loja?.nome_loja || "",
    };

    mutate(newLeitura);
  };

  const verifyPhoto = () => !!lojaData?.medidor?.leituras[0]?.foto_url;

  return {
    // Dados
    lojaData,
    leituraAnterior,
    consumoCalculado,
    isPending,
    isHave,
    verifyPhoto,
    // Estados
    medicaoAtual,
    detalheLeitura,
    isModalVisible,
    // Setters
    setMedicaoAtual,
    setDetalheLeitura,
    setIsModalVisible,
    // Ações/Validações
    getBorderColor,
    handleOpenModal,
    handleRegistrarLeitura,
  };
}
