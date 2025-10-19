// app/page/detailLoja/[id].tsx (Código final limpo ajustado)

import { ArrowBack } from "@/src/_components/arrowBack";
import { ConfirmationModal } from "@/src/_components/ConfirmationModal";
import { ImageZoomModal } from "@/src/_components/ImagemZoomModal";
import { SideBar } from "@/src/_components/sideBar";
import { Title } from "@/src/_components/title";
import { useImagePickerValidation } from "@/src/hook/useImagePickerValidation";
import { useLeituraForm } from "@/src/hook/useLeituraForm";
import { useThemeColors } from "@/src/hook/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ActivityIndicator } from "react-native-paper";
import { InfoItem } from "../perfil/page";

export default function DetailLoja() {
  const color = useThemeColors();
  const params = useLocalSearchParams();
  const lojaId = typeof params.id === "string" ? params.id : undefined;
  const medidorId =
    typeof params.idMedidor === "string" ? params.idMedidor : undefined;

  // 🎯 1. Uso do Hook de Lógica Central
  const {
    lojaData,
    leituraAnterior,
    consumoCalculado,
    isPending,
    isHave,
    verifyPhoto,
    medicaoAtual,
    detalheLeitura,
    isModalVisible,
    setMedicaoAtual,
    setDetalheLeitura,
    setIsModalVisible,
    getBorderColor,
    handleOpenModal,
    handleRegistrarLeitura,
  } = useLeituraForm({ lojaId, medidorId });

  const [isModalImg, setIsModalImg] = useState(false);

  // 🎯 2. Uso do Hook de Imagem
  const { photoUri, handleImagePick } = useImagePickerValidation();

  // 3. Funções de Ação (Adaptadas para os hooks)
  const openModalWithValidation = () => handleOpenModal(photoUri);
  const registerLeitura = () => handleRegistrarLeitura(photoUri);
  const isImageDisabled = verifyPhoto() || !isHave; // Desabilita se já houver foto ou se a leitura estiver salva
  const currentImageUri =
    photoUri || lojaData?.medidor?.leituras[0]?.foto_url || null;

  return (
    <View style={{ flex: 1, backgroundColor: color.roxo }}>
      <SideBar />
      <ArrowBack />
      <Title text={"Detalhes loja"} />
      <View style={[styles.content, { backgroundColor: color.roxoLight }]}>
        <KeyboardAwareScrollView
          style={{ flex: 1, width: "100%" }}
          enableOnAndroid={true}
          extraScrollHeight={60}
          keyboardOpeningTime={0}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* AQUI ESTÁ A VERIFICAÇÃO PRINCIPAL */}
          {!lojaData ? (
            // --- ESTADO DE CARREGAMENTO (LOADING) ---
            <View style={styles.loadingContainer}>
              <ActivityIndicator size={"large"} color={color.roxo} />
              <Text style={{ fontSize: 16, fontWeight: "semibold" }}>
                Carregando dados da loja...
              </Text>
            </View>
          ) : (
            // --- CONTEÚDO DA LOJA (APÓS O FETCH) ---
            <ScrollView style={{ width: "100%", flex: 1 }}>
              <View style={styles.infoContainer}>
                {/* As informações da loja agora só são renderizadas quando lojaData não é nulo */}
                <InfoItem label="Nome loja" value={lojaData.loja.nome_loja} />
                <InfoItem label="Complexo" value={lojaData.loja.complexo} />
                <InfoItem
                  label="Tipo medição"
                  value={lojaData.medidor.tipo_medicao}
                />
                <InfoItem
                  label="Numero relogio"
                  value={lojaData.medidor.numero_relogio}
                />
                <InfoItem
                  label="Localização relogio"
                  value={lojaData.medidor.localidade}
                />
                {lojaData.medidor.tipo_medicao === "Energia" && (
                  <InfoItem
                    label="Localização quadro"
                    value={lojaData.medidor.quadro_distribuicao || "--- ---"}
                  />
                )}
                <InfoItem
                  label="Leitura anterior"
                  value={String(leituraAnterior)}
                />

                {/* --- INPUT DE LEITURA ATUAL --- */}
                <Text style={[styles.label, { color: color.gray900 }]}>
                  Leitura atual *
                </Text>
                <TextInput
                  style={[
                    styles.textInputBase,
                    {
                      borderColor: getBorderColor(),
                      backgroundColor: color.white,
                    },
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
                <Text style={[styles.label, { color: color.gray900 }]}>
                  Foto do Medidor *
                </Text>
                <TouchableOpacity
                  style={[
                    styles.photoButton,
                    {
                      borderColor: photoUri ? color.green : color.roxo,
                      backgroundColor: color.white,
                    },
                  ]}
                  onPress={() => handleImagePick(!isHave)}
                  disabled={isImageDisabled}
                >
                  <Ionicons
                    name={
                      photoUri || verifyPhoto()
                        ? "checkmark-circle"
                        : "camera-outline"
                    }
                    size={24}
                    color={photoUri || verifyPhoto() ? color.green : color.roxo}
                  />
                  <Text
                    style={{
                      color: color.roxo,
                      fontWeight: "semibold",
                      fontSize: 16,
                    }}
                  >
                    {photoUri || verifyPhoto()
                      ? "Foto Anexada"
                      : "Tirar Foto / Escolher da Galeria"}
                  </Text>
                </TouchableOpacity>

                {/* Visualização da foto nova ou já salva */}
                {currentImageUri && (
                  <TouchableOpacity onPress={() => setIsModalImg(true)}>
                    <Image
                      source={{ uri: currentImageUri }}
                      style={styles.imagePreview}
                    />
                  </TouchableOpacity>
                )}

                <Text style={[styles.label, { color: color.gray900 }]}>
                  Detalhe da leitura
                </Text>
                <TextInput
                  style={styles.textInputBase}
                  placeholder="Digite algum detalhe"
                  value={detalheLeitura}
                  onChangeText={setDetalheLeitura}
                  editable={isHave}
                  multiline
                  numberOfLines={8}
                  placeholderTextColor={color.gray900}
                />

                {/* --- BOTÃO DE REGISTRO --- */}
                <TouchableOpacity
                  style={[
                    styles.registerButton,
                    {
                      backgroundColor: isHave
                        ? color.roxo
                        : color.roxoPlaceholder,
                    },
                  ]}
                  onPress={openModalWithValidation}
                  disabled={!isHave}
                >
                  <Text
                    style={[
                      styles.registerButtonText,
                      { color: color.gray50 },
                    ]}
                  >
                    {isPending ? (
                      <ActivityIndicator size={"small"} color={color.gray50} />
                    ) : isHave ? (
                      "Registrar Leitura"
                    ) : (
                      "Leitura registrada"
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
          {/* FIM DA VERIFICAÇÃO PRINCIPAL */}
        </KeyboardAwareScrollView>
      </View>

      <ConfirmationModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={registerLeitura}
        leituraAtual={medicaoAtual}
        leituraAnterior={leituraAnterior}
        consumoCalculado={consumoCalculado}
        isPending={isPending}
      />

      <ImageZoomModal
        isVisible={isModalImg}
        onClose={() => setIsModalImg(false)}
        uri={currentImageUri || ""}
      />
    </View>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  content: {
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
  },
  textInputBase: {
    width: "100%",
    justifyContent: "center",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 2,
    fontSize: 15,
  },
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
    borderRadius: 10,
    borderWidth: 2,
    gap: 10,
    marginBottom: 8,
  },
  imagePreview: {
    width: "100%",
    height: 400,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: "contain",
  },
  registerButton: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  registerButtonText: {
    fontSize: 16,
    height: 23,
    justifyContent: "center",
    alignItems: "center",
  },
  // NOVO ESTILO PARA O LOADING
  loadingContainer: {
    width: "100%",
    paddingTop: 40,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
});