// app/page/detailLoja/[id].tsx

import { ArrowBack } from "@/src/_components/arrowBack";
import { SideBar } from "@/src/_components/sideBar";
import { Title } from "@/src/_components/title";
import { color } from "@/src/constants/color";
import { useAppContext } from "@/src/context/useAppContext";
import { useCreateLeitura } from "@/src/hook/useCreateLeitura";
import { useFetchLojaSingle } from "@/src/hook/useFetchLoja";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
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
import { ActivityIndicator } from "react-native-paper";
import { Toast } from "react-native-toast-notifications";
import { InfoItem } from "../perfil/page";

const date = new Date();
const currentDay = date.getDate();
const currentMonth = date.getMonth() + 1;
const currentYear = date.getFullYear();
const currentDate = `${currentDay}/${currentMonth}/${currentYear}`;

export default function DetailLoja() {
  const params = useLocalSearchParams();
  const { month, year, user } = useAppContext();
  const firstName = user?.nome_completo.split(" ")[0];

  const [medicaoAtual, setMedicaoAtual] = useState<string>("");
  const [isHave, setIsHave] = useState(true);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [detalheLeitura, setDetalheLeitura] = useState("");

  const lojaId = typeof params.id === "string" ? params.id : undefined;
  const medidorId =
    typeof params.idMedidor === "string" ? params.idMedidor : undefined;

  const { data } = useFetchLojaSingle(lojaId, medidorId, month, year);
  const { mutate, isPending } = useCreateLeitura({
    onSuccess: () => {
      Toast.show("Leitura registrada com sucesso.", { type: "success" });
      setIsModalVisible(false);
      // router.replace("/page/dashboard/page");
    },
    onError: (error) => {
      Toast.show("Erro ao registrar leitura: " + error, { type: "danger" });
      setIsModalVisible(false);
    },
  });

  // --- EFEITO: CARREGAMENTO INICIAL DE DADOS ---
  useEffect(() => {
    // Verifica se já existe uma leitura atual salva para o mês/ano
    if (
      (data?.medidor?.leituras.length &&
        data?.medidor?.leituras[0]?.leitura_atual) ||
      data?.medidor.leituras[0]?.detalhes_leitura
    ) {
      setMedicaoAtual(String(data?.medidor?.leituras[0]?.leitura_atual));
      setDetalheLeitura(data?.medidor?.leituras[0]?.detalhes_leitura || "");
      setIsHave(false); // Desativa a edição se já houver registro
      return;
    }
    setMedicaoAtual("");
    setDetalheLeitura("");
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

  const isLeituraValida = leituraAtualNum >= leituraAnterior;

  const getBorderColor = (): string => {
    if (
      medicaoAtual === "" ||
      isNaN(leituraAtualNum) ||
      leituraAtualNum === 0
    ) {
      return color.red; // Cor neutra se vazio
    }
    return isLeituraValida ? color.green : color.red;
  };

  // --- FUNÇÃO AUXILIAR: TIRAR FOTO (CÂMERA) ---
  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Toast.show("É necessário permissão para acessar a câmera.", {
        type: "warning",
      });
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [6, 6],
      quality: 0.3,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  // --- FUNÇÃO AUXILIAR: ESCOLHER DA GALERIA ---
  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Toast.show("É necessário permissão para acessar a galeria.", {
        type: "warning",
      });
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [6, 6],
      quality: 0.2,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  // --- FUNÇÃO PRINCIPAL: SELEÇÃO DA OPÇÃO (NOVA LÓGICA) ---
  const handleImagePick = () => {
    Alert.alert(
      "Selecionar Imagem",
      "Escolha a origem da foto do medidor:",
      [
        {
          text: "Câmera",
          onPress: pickFromCamera,
          style: "default",
        },
        {
          text: "Galeria",
          onPress: pickFromGallery,
          style: "default",
        },
        {
          text: "Cancelar",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  // --- FUNÇÃO PARA ABRIR MODAL (Validação Pré-Registro) ---
  const handleOpenModal = () => {
    // 1. Validação de Leitura
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
      Toast.show("A leitura atual deve ser maior que a leitura anterior.", {
        type: "warning",
      });
      return;
    }

    // 2. Validação da Foto
    if (photoUri) {
      Toast.show("É obrigatório anexar uma foto da leitura.", {
        type: "warning",
      });
      return;
    }

    // Se tudo estiver OK, abre o modal
    setIsModalVisible(true);
  };

  const medidor = data?.medidor;
  // --- FUNÇÃO DE REGISTRO NO BANCO (Dentro do Modal) ---
  const handleRegistrarLeitura = () => {
    const newLeitura = {
      medidor_id: medidor?.id,
      mes: month,
      year: year,
      leitura_anterior: medidor?.ultima_leitura,
      leitura_atual: leituraAtualNum,
      foto_url: photoUri,
      consumo_mensal: consumoCalculado,
      nome_usuario: `${firstName} - ${user?.funcao}`,
      detalhes_leitura: `Leitura feito por ${firstName} - ${user?.funcao} / data: ${currentDate},  Detalhes a acrecentar: `,
      data_leitura: new Date("2025-06-01").toISOString(),
      nome_loja_leitura: data?.loja?.nome_loja,
    };

    console.log(newLeitura);
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
              <Text style={styles.label}>Leitura atual *</Text>
              <TextInput
                style={[
                  styles.textInputBase,
                  { borderColor: getBorderColor() },
                ]}
                placeholder="Digite a leitura"
                placeholderTextColor={color.gray900}
                keyboardType="numeric"
                value={medicaoAtual}
                onChangeText={setMedicaoAtual}
                editable={isHave}
              />

              <InfoItem label="Consumo" value={String(consumoCalculado)} />

              {/* --- INPUT DE FOTO --- */}
              <Text style={styles.label}>Foto do Medidor *</Text>
              <TouchableOpacity
                style={[
                  styles.photoButton,
                  { borderColor: photoUri ? color.green : color.roxo },
                ]}
                onPress={handleImagePick}
              >
                <Ionicons
                  name={photoUri ? "checkmark-circle" : "camera-outline"}
                  size={24}
                  color={photoUri ? color.green : color.roxo}
                />
                <Text
                  style={{
                    color: color.roxo,
                    fontWeight: "semibold",
                    fontSize: 16,
                  }}
                >
                  {photoUri
                    ? "Foto Anexada"
                    : "Tirar Foto / Escolher da Galeria"}
                </Text>
              </TouchableOpacity>

              {photoUri && (
                <Image source={{ uri: photoUri }} style={styles.imagePreview} />
              )}
              <Text style={styles.label}>Detalhe da leitura</Text>
              <TextInput
                style={styles.textInputBase}
                placeholder="Digite algum detalhe"
                value={detalheLeitura}
                onChangeText={setDetalheLeitura}
                editable={isHave}
              />

              {/* --- BOTÃO DE REGISTRO --- */}
              <TouchableOpacity
                style={[styles.registerButton, {}]}
                onPress={handleOpenModal} // Chama a validação e abre o modal
                disabled={!isHave} // Desabilita se a leitura já estiver salva
              >
                <Text style={styles.registerButtonText}>
                  {isPending ? (
                    <ActivityIndicator size={"small"} color={color.gray50} />
                  ) : (
                    "Registrar Leitura"
                  )}
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
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Leitura atual
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "semibold",
              textAlign: "center",
            }}
          >
            {String(medicaoAtual)}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "center",
              marginTop: 5,
            }}
          >
            Leitura anterior
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "semibold",
              textAlign: "center",
            }}
          >
            {String(leituraAnterior)}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "center",
              marginTop: 5,
            }}
          >
            Consumo
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "semibold",
              textAlign: "center",
            }}
          >
            {String(consumoCalculado)}
          </Text>

          <Text style={styles.modalQuestion}>Deseja continuar?</Text>

          <View style={styles.modalButtonContainer}>
            {/* Botão Voltar (ArrowBack) */}
            <TouchableOpacity
              style={[
                styles.modalButton,
                { borderColor: color.red, borderWidth: 2 },
              ]}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={{ color: color.red }}>Voltar</Text>
            </TouchableOpacity>

            {/* Botão Continuar/Registrar */}
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: color.roxo }]}
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
    fontSize: 16,
    color: color.gray900,
  },
  textInputBase: {
    width: "100%",
    backgroundColor: color.white,
    justifyContent: "center",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 2,
    fontSize: 17,
  },
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.white,
    padding: 6,
    borderRadius: 10,
    borderWidth: 2, // Aumentei para combinar com o TextInput
    gap: 10,
    marginBottom: 8,
  },
  imagePreview: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: "cover",
  },
  registerButton: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.roxo,
  },
  registerButtonText: {
    color: color.gray50,
    fontSize: 16,
    height: 23,
    justifyContent: "center",
    alignItems: "center",
  },

  // Estilos do Modal
  modalContent: {
    backgroundColor: color.white,
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
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
    marginTop: 10,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    color: color.gray50,
    fontWeight: "semibold",
    fontSize: 16,
  },
});
