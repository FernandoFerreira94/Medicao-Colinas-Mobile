import * as React from "react";
import { Button } from "react-native-paper";
import { color } from "../constants/color";

const ButtonLoading = ({ text }: { text: string }) => (
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

export default ButtonLoading;
