import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable } from "react-native";
import { color } from "../constants/color";

export function ArrowBack(){
    return(
        <Pressable
                onPress={() => router.back()}
                style={{ borderWidth: 1, borderRadius: 8, padding: 1, width:33, justifyContent:"center", alignItems:"center", marginLeft: 8, marginBottom: 10 }}
              >
                <Ionicons
                  name="arrow-back-outline"
                  size={30}
                  color={color.gray50}
                />
              </Pressable>
    )
}