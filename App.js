import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Asset } from "expo";
import { AppLoading } from "expo-asset";

import MusicScreen from "./screens/index";

export default function App() {
  const [isReady, setReady] = useState(false);

  const cacheImages = (image) => {
    return images.map((image) => {
      if (typeof image === "string") {
        return Image.prefetch(image);
      } else {
        return Asset.fromModule(image).downloadAsync();
      }
    });
  };

  const _loadAssetsAsync = async () => {
    const imageAssets = cacheImages([require("./assets/flower.jpg")]);

    await Promise.all([...imageAssets, ...fontAssets]);
  };

  if (isReady) {
    return (
      <AppLoading
        startAsync={_loadAssetsAsync}
        onFinish={() => setReady(true)}
        onError={console.warn}
      />
    );
  }

  return <MusicScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
