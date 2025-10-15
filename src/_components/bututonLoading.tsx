import * as React from "react";
import { Button } from "react-native-paper";
import { useThemeColors } from "../hook/useThemeColors";
const ButtonLoading = ({ text }: { text: string }) => {
  const color = useThemeColors();
  return (
    <Button
      icon="loading"
      mode="contained"
      loading
      style={{
        borderRadius: 10,
        backgroundColor: color.roxo,
      }}
    >
      {text}
    </Button>
  );
};
export default ButtonLoading;
