// src/hooks/useImagePickerValidation.ts

import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

import * as FileSystem from "expo-file-system/legacy";
import { Alert } from "react-native";
import { Toast } from "react-native-toast-notifications";

const MAX_IMAGE_SIZE_MB = 20; // Limite de tamanho de imagem no Front-end (1.5 MB)

export function useImagePickerValidation() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  // --- FUNÇÃO AUXILIAR DE VERIFICAÇÃO DE TAMANHO ---
  const checkAndSetPhotoUri = async (uri: string | undefined | null) => {
    if (!uri) return;

    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);

      if (!fileInfo.exists || !fileInfo.size) {
        Toast.show("Falha ao obter informações do arquivo.", {
          type: "danger",
        });
        return;
      }

      const sizeMB = fileInfo.size / (1024 * 1024);

      if (sizeMB > MAX_IMAGE_SIZE_MB) {
        Toast.show(
          `A imagem é muito grande (${sizeMB.toFixed(
            2
          )} MB). O limite é ${MAX_IMAGE_SIZE_MB} MB. Tente tirar outra foto.`,
          { type: "danger", duration: 6000 }
        );
        setPhotoUri(null);
        return;
      }

      setPhotoUri(uri);
    } catch (error) {
      console.error("Erro ao verificar tamanho do arquivo:", error);
      Toast.show("Erro ao processar a imagem.", { type: "danger" });
      setPhotoUri(null);
    }
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
      quality: 0.1, // Compressão
    });

    if (!result.canceled) {
      await checkAndSetPhotoUri(result.assets[0].uri);
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ Uso do enum importado nominalmente
      aspect: [4, 4],
      quality: 0.1, // Compressão
    });

    if (!result.canceled) {
      await checkAndSetPhotoUri(result.assets[0].uri);
    }
  };

  // --- FUNÇÃO PRINCIPAL: SELEÇÃO DA OPÇÃO ---
  const handleImagePick = (isLeituraSaved: boolean) => {
    if (isLeituraSaved) {
      Toast.show(
        "A leitura já foi registrada. Não é possível alterar a foto.",
        { type: "warning" }
      );
      return;
    }

    Alert.alert(
      "Selecionar Imagem",
      "Escolha a origem da foto do medidor:",
      [
        { text: "Câmera", onPress: pickFromCamera, style: "default" },
        { text: "Galeria", onPress: pickFromGallery, style: "default" },
        { text: "Cancelar", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  return {
    photoUri,
    setPhotoUri, // Útil para resetar a foto
    handleImagePick,
    checkAndSetPhotoUri,
  };
}
