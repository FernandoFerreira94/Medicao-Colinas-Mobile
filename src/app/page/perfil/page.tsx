import { SideBar } from "@/src/_components/sideBar";
import { color } from "@/src/constants/color";
import { StyleSheet, Text, View } from "react-native";

export default function Perfil(){

    return(
       <View style={{ flex: 1, backgroundColor: color.roxo, }}>
             <SideBar/>
             <View style={{flexDirection: "row", alignItems:"center", width:"100%", justifyContent:"space-between", paddingHorizontal: 14, marginBottom: 20 }}>
                       <Text style={{fontSize: 20, color: color.gray50, fontWeight:"bold"}}>Perfil teste
                         </Text> 
                       </View>
              <View style={styles.content}>
                <Text>Nome completo </Text>
                 </View>
        </View>
    )
}

const styles = StyleSheet.create({
 content: {
    backgroundColor: color.roxoLight,
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
    paddingHorizontal: 10,
  },
})