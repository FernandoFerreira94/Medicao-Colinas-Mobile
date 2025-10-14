// app/page/detailLoja/[id].tsx

import { ArrowBack } from "@/src/_components/arrowBack";
import { SideBar } from "@/src/_components/sideBar";
import { Title } from "@/src/_components/title";
import { color } from "@/src/constants/color";
import { useAppContext } from "@/src/context/useAppContext";
import { useFetchLojaSingle } from "@/src/hook/useFetchLoja";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
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
import Modal from "react-native-modal";
import { Toast } from "react-native-toast-notifications";
import { InfoItem } from "../perfil/page";

// Cores para validação (adapte-as ao seu arquivo src/constants/color.ts)
const COLORS = {
  ...color,
  verde: "#4CAF50", // Verde de sucesso
  vermelho: "#F44336", // Vermelho de erro
};

export default function DetailLoja() {
  const params = useLocalSearchParams();
  const { month, year } = useAppContext();

  const [medicaoAtual, setMedicaoAtual] = useState<string>("");
  const [isHave, setIsHave] = useState(true);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const lojaId = typeof params.id === "string" ? params.id : undefined;
  const medidorId =
    typeof params.idMedidor === "string" ? params.idMedidor : undefined;

  const { data } = useFetchLojaSingle(lojaId, medidorId, month, year);

  // --- EFEITO: CARREGAMENTO INICIAL DE DADOS ---
  useEffect(() => {
    // Verifica se já existe uma leitura atual salva para o mês/ano
    if (
      data?.medidor?.leituras.length &&
      data.medidor.leituras[0].leitura_atual
    ) {
      setMedicaoAtual(String(data.medidor.leituras[0].leitura_atual));
      setIsHave(false); // Desativa a edição se já houver registro
      return;
    }
    setMedicaoAtual("");
    setIsHave(true);
  }, [data]);

  // --- FUNÇÕES DE CÁLCULO E VALIDAÇÃO ---
  const getLeituraAnterior = (): number => {
    // 1. Tenta usar a leitura anterior do registro do mês (mais precisa)
    const leituraAnteriorDoMes = data?.medidor?.leituras[0]?.leitura_anterior;
    if (leituraAnteriorDoMes !== undefined && leituraAnteriorDoMes !== null) {
      return Number(leituraAnteriorDoMes);
    }
    // 2. Tenta usar a última leitura registrada do medidor (fallback)
    const ultimaLeituraMedidor = data?.medidor?.ultima_leitura;
    if (ultimaLeituraMedidor !== undefined && ultimaLeituraMedidor !== null) {
      return Number(ultimaLeituraMedidor);
    }
    return 0;
  };

  const leituraAnterior = getLeituraAnterior();
  const leituraAtualNum = Number(medicaoAtual.replace(",", ".")); // Garante que a entrada seja tratada como número
  const consumoCalculado =
    leituraAtualNum > leituraAnterior ? leituraAtualNum - leituraAnterior : 0;

  const isLeituraValida = leituraAtualNum > leituraAnterior;

  const getBorderColor = (): string => {
    if (
      medicaoAtual === "" ||
      isNaN(leituraAtualNum) ||
      leituraAtualNum === 0
    ) {
      return color.gray50; // Cor neutra se vazio
    }
    return isLeituraValida ? COLORS.verde : COLORS.vermelho;
  };

  // --- FUNÇÃO DE FOTO ---
  const handleImagePick = async () => {
    // Você pode pedir permissão para câmera e galeria, dependendo do seu uso
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Toast.show("É necessário permissão para acessar a câmera.", {
        type: "danger",
      });
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  // --- FUNÇÃO PARA ABRIR MODAL (Validação Pré-Registro) ---
  const handleOpenModal = () => {
    // 1. Validação de Leitura
    if (
      medicaoAtual === "" ||
      isNaN(leituraAtualNum) ||
      leituraAtualNum === 0
    ) {
      Toast.show("O valor da leitura atual é obrigatório.", { type: "danger" });
      return;
    }
    if (!isLeituraValida) {
      Toast.show("A leitura atual deve ser maior que a leitura anterior.", {
        type: "danger",
      });
      return;
    }

    // 2. Validação da Foto
    if (!photoUri) {
      Toast.show("É obrigatório anexar uma foto da leitura.", {
        type: "danger",
      });
      return;
    }

    // Se tudo estiver OK, abre o modal
    setIsModalVisible(true);
  };

  // --- FUNÇÃO DE REGISTRO NO BANCO (Dentro do Modal) ---
  const handleRegistrarLeitura = () => {
    // 🎯 AQUI É ONDE VOCÊ CHAMARÁ A FUNÇÃO DO SUPABASE PARA INSERT/UPDATE

    // Simulação do sucesso de registro
    Toast.show("Leitura registrada no banco de dados com sucesso!", {
      type: "success",
    });
    setIsModalVisible(false);

    // Opcional: Navegar para outra tela ou resetar o estado
    // router.replace("/page/dashboard/page");
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.roxo }}>
      <SideBar />
      <ArrowBack />
      <Title text={"Detalhes loja"} />

      <View style={styles.content}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          <ScrollView style={{ width: "100%", flex: 1 }}>
            <View style={styles.infoContainer}>
              {/* ITENS DE INFORMAÇÃO DA LOJA/MEDIDOR */}
              <InfoItem label="Nome loja" value={data?.loja.nome_loja} />
              <InfoItem label="Complexo" value={data?.loja.complexo} />
              <InfoItem
                label="Tipo medição"
                value={data?.medidor.tipo_medicao}
              />
              <InfoItem
                label="Numero relogio"
                value={data?.medidor.numero_relogio}
              />
              <InfoItem
                label="Localização relogio"
                value={data?.medidor.localidade}
              />

              <InfoItem
                label="Leitura anterior"
                value={String(leituraAnterior)}
              />

              {/* --- INPUT DE LEITURA ATUAL --- */}
              <Text style={styles.label}>Leitura atual</Text>
              <TextInput
                style={[
                  styles.textInputBase,
                  { borderColor: getBorderColor() },
                ]}
                placeholder="Digite a leitura"
                keyboardType="numeric"
                value={medicaoAtual}
                onChangeText={setMedicaoAtual}
                editable={isHave}
              />

              <InfoItem
                label="Consumo Estimado"
                value={String(consumoCalculado)}
              />

              {/* --- INPUT DE FOTO --- */}
              <Text style={styles.label}>Foto do Medidor (Obrigatório)</Text>
              <TouchableOpacity
                style={[
                  styles.photoButton,
                  { borderColor: photoUri ? COLORS.verde : color.roxo },
                ]}
                onPress={handleImagePick}
              >
                <Ionicons
                  name={photoUri ? "checkmark-circle" : "camera-outline"}
                  size={28}
                  color={photoUri ? COLORS.verde : color.roxo}
                />
                <Text style={{ color: color.roxo, fontWeight: "bold" }}>
                  {photoUri
                    ? "Foto Anexada"
                    : "Tirar Foto / Escolher da Galeria"}
                </Text>
              </TouchableOpacity>

              {photoUri && (
                <Image source={{ uri: photoUri }} style={styles.imagePreview} />
              )}

              {/* --- BOTÃO DE REGISTRO --- */}
              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleOpenModal} // Chama a validação e abre o modal
                disabled={!isHave} // Desabilita se a leitura já estiver salva
              >
                <Text style={styles.registerButtonText}>
                  {isHave ? "Registrar Leitura" : "Leitura Registrada"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      {/* --- MODAL DE CONFIRMAÇÃO --- */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirmação de Medição</Text>

          <Text style={styles.modalQuestion}>A medição está correta?</Text>

          <InfoItem label="Leitura Anterior" value={String(leituraAnterior)} />
          <InfoItem label="Leitura Atual" value={String(leituraAtualNum)} />
          <InfoItem
            label="Consumo Calculado"
            value={String(consumoCalculado)}
          />

          <View style={styles.modalButtonContainer}>
            {/* Botão Voltar (ArrowBack) */}
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: COLORS.vermelho }]}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Voltar</Text>
            </TouchableOpacity>

            {/* Botão Continuar/Registrar */}
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: COLORS.verde }]}
              onPress={handleRegistrarLeitura}
            >
              <Text style={styles.modalButtonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  content: {
    backgroundColor: color.roxoLight,
    width: "100%",
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 15,
    paddingHorizontal: 10,
  },
  infoContainer: {
    gap: 8,
    marginTop: 8,
    marginBottom: 40,
    paddingHorizontal: 4,
    width: "100%",
    flex: 1,
  },
  label: {
    fontWeight: "bold",
    fontSize: 17,
    color: color.gray900,
  },
  textInputBase: {
    width: "100%",
    backgroundColor: color.white,
    justifyContent: "center",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 3,
    fontSize: 17,
  },
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.white,
    padding: 12,
    borderRadius: 10,
    borderWidth: 3, // Aumentei para combinar com o TextInput
    gap: 10,
    marginBottom: 10,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: "cover",
  },
  registerButton: {
    width: "100%",
    height: 50,
    marginTop: 8,
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.roxo,
  },
  registerButtonText: {
    color: color.gray50,
    fontSize: 18,
  },

  // Estilos do Modal
  modalContent: {
    backgroundColor: color.white,
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: color.gray900,
  },
  modalQuestion: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 15,
    color: color.roxo,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    color: color.gray50,
    fontWeight: "bold",
    fontSize: 16,
  },
});
