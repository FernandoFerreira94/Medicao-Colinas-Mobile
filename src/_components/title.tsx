import { StyleSheet, Text, View } from "react-native"
import { color } from "../constants/color"

export function Title({text}: {text: string}){
    return(
      <View style={styles.header}>
        
        <Text style={styles.headerText}>{text}</Text>
      </View>
    )
}


const styles = StyleSheet.create({
  
  headerText: {
    fontSize: 20,
    color: color.gray50,
    fontWeight: "bold",
  },  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    marginBottom: 20,
  },
})