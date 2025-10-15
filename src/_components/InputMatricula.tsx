import * as React from "react";
import { TextInput } from "react-native-paper";
import { useThemeColors } from "../hook/useThemeColors";

const InputMatricula = ({
  text,
  setText,
}: {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const color = useThemeColors();
  return (
    <TextInput
      mode="outlined"
      value={text}
      onChangeText={(text) => setText(text)}
      label="Matricula"
      placeholder="Digite sua matricula"
      textColor={color.gray900}
      activeOutlineColor={color.roxo}
      placeholderTextColor={color.grayPlaceholder900}
      style={{
        color: color.gray50,
        backgroundColor: color.roxoLight,
        borderRadius: 24,
        borderWidth: 0,
        height: 40,
        fontSize: 14,
      }}
    />
  );
};

export default InputMatricula;
