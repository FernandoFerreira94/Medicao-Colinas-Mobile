import * as FileSystem from "expo-file-system/legacy";
import { supabase } from "../lib/supabase";

export async function uploadImageToSupabase(
  fileUri: string,
  nomeLoja: string,
  medidorId: string
): Promise<string> {
  const bucketName = "leitura-fotos";
  const folderName = medidorId;
  const fileName = `${nomeLoja}/${folderName}/${Date.now()}.jpg`;

  try {
    // Lê o arquivo como base64
    const base64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: "base64",
    });

    // Converte base64 → Uint8Array
    const binary = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

    // Faz o upload direto como array de bytes
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, binary, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (error) {
      console.error("Erro no upload:", error);
      throw new Error("Erro no upload: " + error.message);
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);

    return data.publicUrl;
  } catch (e) {
    console.error("Erro ao converter/upload imagem:", e);
    throw e;
  }
}
