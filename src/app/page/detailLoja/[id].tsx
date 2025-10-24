// app/page/detailLoja/[id].tsx

import { ArrowBack } from "@/src/_components/arrowBack";
import { ConfirmationModal } from "@/src/_components/ConfirmationModal";
import { ImageZoomModal } from "@/src/_components/ImagemZoomModal";
import { SideBar } from "@/src/_components/sideBar";
import { Title } from "@/src/_components/title";
import { useAppContext } from "@/src/context/useAppContext";
import { useImagePickerValidation } from "@/src/hook/useImagePickerValidation";
import { useLeituraForm } from "@/src/hook/useLeituraForm";
import { useThemeColors } from "@/src/hook/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ActivityIndicator } from "react-native-paper";
import { InfoItem } from "../perfil/page";

const date = new Date();
const day = date.getDate();

export default function DetailLoja() {
  const { user } = useAppContext();
  const color = useThemeColors();
  const params = useLocalSearchParams();
  const lojaId = typeof params.id === "string" ? params.id : undefined;
  const medidorId =
    typeof params.idMedidor === "string" ? params.idMedidor : undefined;

  // 🎯 1. Hook central da leitura
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
  const { photoUri, handleImagePick } = useImagePickerValidation();

  const openModalWithValidation = () => handleOpenModal(photoUri);
  const registerLeitura = () => handleRegistrarLeitura(photoUri);

  const isImageDisabled = verifyPhoto() || !isHave;
  const currentImageUri =
    photoUri || lojaData?.medidor?.leituras[0]?.foto_url || null;

  const isVerificad = !!lojaData?.medidor.leituras[0]?.leitura_atual;

  const shouldDisableButton2 = () => {
    if (user?.is_adm) return false;
    return day > 10;
  };
  const shouldDisable = shouldDisableButton2();

  const textoMedicao = isVerificad
    ? "Medição coletada"
    : shouldDisable
      ? "Medição não está liberada"
      : "Medição";

  const btnDisable = isVerificad ? false : shouldDisable ? true : false;

  return (
    <View style={{ flex: 1, backgroundColor: color.roxo }}>
      <SideBar />
      <ArrowBack />
      <Title
        text={`${lojaData?.loja?.nome_loja}  ${lojaData?.loja?.prefixo_loja}-${lojaData?.loja?.numero_loja}`}
      />

      <View style={[styles.content, { backgroundColor: color.roxoLight }]}>
        <KeyboardAwareScrollView
          style={{ flex: 1, width: "100%" }}
          enableOnAndroid={true}
          extraScrollHeight={80}
          keyboardOpeningTime={0}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 120, // espaço pro teclado
          }}
        >
          {!lojaData ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size={"large"} color={color.roxo} />
              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                Carregando dados da loja...
              </Text>
            </View>
          ) : (
            <View style={styles.infoContainer}>
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
                label="Informações medidor"
                value={lojaData.medidor.detalhes || "--- ---"}
              />
              <InfoItem
                label="Leitura anterior"
                value={String(leituraAnterior)}
              />

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
                    fontWeight: "600",
                    fontSize: 16,
                  }}
                >
                  {photoUri || verifyPhoto()
                    ? "Foto Anexada"
                    : "Tirar Foto / Escolher da Galeria"}
                </Text>
              </TouchableOpacity>

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
                style={[
                  styles.textInputBase,
                  {
                    backgroundColor: color.white,
                    minHeight: 120,
                    textAlignVertical: "top",
                  },
                ]}
                placeholder="Digite algum detalhe"
                value={detalheLeitura}
                onChangeText={setDetalheLeitura}
                editable={isHave}
                multiline
                numberOfLines={6}
                placeholderTextColor={color.gray900}
              />

              <TouchableOpacity
                style={[
                  styles.registerButton,
                  {
                    backgroundColor:
                      isVerificad || shouldDisable
                        ? color.roxoPlaceholder
                        : color.roxo,
                  },
                ]}
                onPress={openModalWithValidation}
                disabled={btnDisable}
              >
                <Text
                  style={[styles.registerButtonText, { color: color.gray50 }]}
                >
                  {textoMedicao}
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
  loadingContainer: {
    width: "100%",
    paddingTop: 40,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
});
