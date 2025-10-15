import { supabase } from "../lib/supabase";
import type { LeituraProps } from "../types";
import { uploadImageToSupabase } from "./StorageService";

interface LeituraComUriProps extends LeituraProps {
  photo_uri: string;
}

export async function CreateLeitura(new_leitura: LeituraComUriProps) {
  const { photo_uri, ...leitura_to_insert } = new_leitura;
  // 1. **UPLOAD DA IMAGEM**
  let foto_url: string | null = null;

  if (photo_uri) {
    // Tenta fazer o upload (a função lança erro se falhar)
    foto_url = await uploadImageToSupabase(
      photo_uri,
      leitura_to_insert.nome_loja_leitura,
      leitura_to_insert.medidor_id
    );
  }

  if (!foto_url) {
    // Se a foto é obrigatória, trate a falha
    throw new Error("Falha ao obter a URL da foto após o upload.");
  }

  const { data: insertedData, error: insertError } = await supabase
    .from("leituras")
    .insert({
      ...leitura_to_insert,
      foto_url: foto_url, // 🎯 Salva a URL pública no campo `foto_url`
    })
    .select("*")
    .single();

  if (insertError) {
    // Se a inserção falhar, você pode opcionalmente deletar o arquivo do Storage aqui
    // (Lógica de compensação, mas vamos simplificar por enquanto)
    throw new Error("Erro ao inserir a leitura: " + insertError.message);
  }

  const medidorId = insertedData.medidor_id;
  const novaLeitura = insertedData.leitura_atual;
  const { data: updatedMedidor, error: updateError } = await supabase
    .from("medidores")
    .update({ ultima_leitura: novaLeitura })
    .eq("id", medidorId)
    .select("*")
    .single();

  if (updateError) {
    throw new Error("Erro ao atualizar o medidor: " + updateError.message);
  }

  return insertedData;
}
