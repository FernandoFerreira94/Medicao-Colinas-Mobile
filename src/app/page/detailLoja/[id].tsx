// app/page/detailLoja/[id].tsx (Exemplo)
import { ArrowBack } from '@/src/_components/arrowBack';
import { SideBar } from '@/src/_components/sideBar';
import { Title } from '@/src/_components/title';
import { color } from '@/src/constants/color';
import { useAppContext } from '@/src/context/useAppContext';
import { useFetchLojaSingle } from '@/src/hook/useFetchLoja';
import { LeituraProps } from '@/src/types';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { InfoItem } from '../perfil/page';

export default function DetailLoja() {
    const params = useLocalSearchParams();
    const {month, year} = useAppContext()

    const [medicaoAtual, setMedicaoAtual] = useState<string | number>("")
    const [isHave,setIsHave] = useState(true)

    const lojaId = typeof params.id === 'string' ? params.id : undefined;
    const medidorId = typeof params.idMedidor === 'string' ? params.idMedidor : undefined;

    const {data} = useFetchLojaSingle(lojaId, medidorId)

  
    function verificarExistencia(
  leituras: LeituraProps[] | undefined, // Aceita undefined para ser seguro
  chave: 'mes' | 'ano',            // Restringe as chaves permitidas
  valor: number
): boolean {
  // 1. Verifica se o array existe e não está vazio
  if (!leituras || leituras.length === 0) {
    return false;
  }

  // 2. Usa o método 'some' para verificar se PELO MENOS UM elemento satisfaz a condição
  return leituras.some((leitura) => {
    // Acessa a propriedade dinamicamente com base na 'chave'
    return leitura[chave] === valor;
  });
}
    const verifyMonth = verificarExistencia(data?.medidor?.leituras, "mes", month)
    const verifyYear = verificarExistencia(data?.medidor?.leituras, "ano", year)

console.log(verifyMonth)
console.log(verifyYear)
    useEffect(()=>{

    if (verifyMonth && verifyYear) {
    setMedicaoAtual(data?.medidor?.leituras[0]?.leitura_atual || "")
    setIsHave(false)
    console.log("tem medicao" + data?.medidor?.leituras[0]?.leitura_atual )
    setIsHave(true)
    setMedicaoAtual("")
    return
}

setMedicaoAtual("")
console.log("noa tem")

    },[])



  return (
    <View style={{flex: 1, backgroundColor: color.roxo}}>
        <SideBar/>
         <ArrowBack/>
         <Title text={"Detalhes loja"} />
      <View style={styles.content}>

    <KeyboardAvoidingView 
                style={{flex:1}} // Aplica o estilo flex: 1 aqui
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Comportamento: 'padding' é melhor para iOS, 'height' ou 'padding' para Android
                keyboardVerticalOffset={0} // Ajuste conforme a altura do seu cabeçalho (0 se não tiver cabeçalho fixo)
            >

        <ScrollView style={{ width: "100%", flex:1 }}>
        <View style={{gap:8, marginTop:8, marginBottom:40, paddingHorizontal: 4,  width:"100%", flex:1}}>

        <InfoItem label="Nome loja" value={data?.loja.nome_loja}/>
        <InfoItem label="Complexo" value={data?.loja.complexo}/>
        <InfoItem label="Numero loja" value={`${data?.loja.prefixo_loja} - ${data?.loja.numero_loja}`}/>
        <InfoItem label="Tipo medição" value={data?.medidor.tipo_medicao}/>
        <InfoItem label="Numero relogio" value={data?.medidor.numero_relogio}/>
        <InfoItem label="Localização relogio" value={data?.medidor.localidade}/>
        {data?.medidor.tipo_medicao === "Energia" && <InfoItem label='Quadro' value={data.medidor.quadro_distribuicao || "Não localizado"} />}
        <InfoItem label="Leitura anterior" value={String(data?.medidor?.leituras[0]?.leitura_anterior) || String(data?.medidor.ultima_leitura) || "--- ---"}/>
        <Text style={{   fontWeight: "bold",
    fontSize: 17,
    color: color.gray900,}}>Leitura atual</Text>
       <TextInput style={{
           width: "100%",
           backgroundColor: color.white,
           justifyContent: "center",
           borderRadius: 10,
           paddingHorizontal: 14,
           paddingVertical: 8,
           borderWidth: 3,
           fontSize:17
}}
    placeholder='Digite a leitura'
    keyboardType='numeric'
    value={String(medicaoAtual)}
    onChangeText={setMedicaoAtual}
    editable={isHave}
    />
        <InfoItem label="Consumo" value={String(data?.medidor?.leituras[0]?.consumo_mensal) || "--- ---"}/>
        <InfoItem label="Informação relogio" value={data?.medidor.detalhes || "Sem informação"}/>
        <InfoItem label="Informação medição" value={data?.medidor?.leituras[0]?.detalhes_leitura || "Sem informação"}/>

        <TouchableOpacity style={{width:"100%", height:50, marginTop:8, borderWidth: 2, borderRadius: 10, justifyContent:"center", alignItems:"center", backgroundColor:color.roxo}}>
            <Text style={{color: color.gray50, fontSize:18}}>Registrar leitura
            </Text>
        </TouchableOpacity>

        </View>
            </ScrollView>
    </KeyboardAvoidingView>
      </View>
     
    </View>
  );
}



const styles = StyleSheet.create({
  content: {
    backgroundColor: color.roxoLight,
    width: "100%",
    flex:1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 15,
    paddingHorizontal: 10,
   
  }
})