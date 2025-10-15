// src/_components/ImageZoomModal.tsx

import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy"; // Para Download
import * as MediaLibrary from "expo-media-library"; // Para salvar a foto
import React, { useCallback } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { Toast } from "react-native-toast-notifications";
import { useThemeColors } from "../hook/useThemeColors";

interface ImageZoomModalProps {
  isVisible: boolean;
  onClose: () => void;
  uri: string;
}
export function ImageZoomModal({
  isVisible,
  onClose,
  uri,
}: ImageZoomModalProps) {
  const color = useThemeColors();
  // 1. CHAME O HOOK PRIMEIRO, INCONDICIONALMENTE
  const handleDownload = useCallback(async () => {
    try {
      if (Platform.OS === "android") {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          Toast.show("Permissão de mídia necessária para baixar a imagem.", {
            type: "warning",
          });
          return;
        }
      }

      const fileUri =
        FileSystem.documentDirectory + uri.substring(uri.lastIndexOf("/") + 1);

      const { uri: downloadedUri } = await FileSystem.downloadAsync(
        uri,
        fileUri
      );

      await MediaLibrary.saveToLibraryAsync(downloadedUri);

      Toast.show("Imagem salva na galeria!", { type: "success" });
      onClose();
    } catch (error) {
      console.error("Erro ao tentar baixar ou salvar a imagem:", error);
      Toast.show("Falha ao baixar a imagem.", { type: "danger" });
    }
  }, [uri]); // O Hook é chamado sempre, mesmo que uri seja null

  // 2. AGORA FAÇA O RETORNO ANTECIPADO APÓS OS HOOKS
  if (!uri) return null;

  const images = [{ url: uri }];

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      onRequestClose={onClose}
      animationType="fade"
    >
      <View style={styles.container}>
        {/* Componente de Visualização e Zoom */}
        <ImageViewer
          imageUrls={images}
          enableSwipeDown={true} // Permite fechar arrastando para baixo
          onSwipeDown={onClose}
          renderHeader={() => (
            <View style={styles.header}>
              {/* Ícone de Fechar (X) */}
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close-circle" size={36} color={color.white} />
              </TouchableOpacity>

              {/* Ícone de Download */}
              <TouchableOpacity
                onPress={handleDownload}
                style={styles.downloadButton}
              >
                <Ionicons
                  name="download-outline"
                  size={30}
                  color={color.white}
                />
              </TouchableOpacity>
            </View>
          )}
          // Garante que o fundo seja preto para tela cheia
          backgroundColor="black"
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10, // Garante que fique acima da imagem
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 40 : 10, // Espaço para iOS
    paddingHorizontal: 20,
  },
  closeButton: {
    padding: 10,
  },
  downloadButton: {
    padding: 10,
  },
});
