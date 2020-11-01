import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions, TextInput } from "react-native";
import Animated, { Easing } from "react-native-reanimated";
import Svg, { Image, Circle, ClipPath } from "react-native-svg";

import { TapGestureHandler, State } from "react-native-gesture-handler";

const {
  Value,
  event,
  block,
  eq,
  cond,
  set,
  Clock,
  startClock,
  stopClock,
  debug,
  timing,
  clockRunning,
  interpolate,
  Extrapolate,
  concat,
} = Animated;

const { width, height } = Dimensions.get("window");

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    timing(clock, state, config),
    cond(state.finished, debug("stop clock", stopClock(clock))),
    state.position,
  ]);
}

const index = () => {
  const buttonOpacity = useRef(new Value(1)).current;
  const onStateChange = event([
    {
      nativeEvent: ({ state }) =>
        block([
          cond(
            eq(state, State.END),
            set(buttonOpacity, runTiming(new Clock(), 1, 0))
          ),
        ]),
    },
  ]);
  const closeState = event([
    {
      nativeEvent: ({ state }) =>
        block([
          cond(
            eq(state, State.END),
            set(buttonOpacity, runTiming(new Clock(), 0, 1))
          ),
        ]),
    },
  ]);
  const buttonY = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [100, 0],
    extrapolate: Extrapolate.CLAMP,
  });
  const bgY = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [-height / 3 - 30, 0],
    extrapolate: Extrapolate.CLAMP,
  });
  const cardZIndex = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [1, -1],
    extrapolate: Extrapolate.CLAMP,
  });
  const cardOpacity = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [1, 0],
    extrapolate: Extrapolate.CLAMP,
  });
  const cardY = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [0, 100],
    extrapolate: Extrapolate.CLAMP,
  });
  const rotateCross = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [180, 360],
    extrapolate: Extrapolate.CLAMP,
  });
  return (
    <View style={{ flex: 1, justifyContent: "flex-end" }}>
      <Animated.View
        style={{ ...StyleSheet.absoluteFill, transform: [{ translateY: bgY }] }}
      >
        <Svg height={height + 50} width={width}>
          <ClipPath id="clip">
            <Circle r={height + 50} cx={width / 2} />
          </ClipPath>
          <Image
            href={require("../assets/flower.jpg")}
            width={width}
            height={height + 50}
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#clip)"
          />
        </Svg>
      </Animated.View>
      <View
        style={{
          height: height / 3,
        }}
      >
        <TapGestureHandler onHandlerStateChange={onStateChange}>
          <Animated.View
            style={[
              styles.button,
              {
                backgroundColor: "white",
                opacity: buttonOpacity,
                transform: [{ translateY: buttonY }],
              },
            ]}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Sign In</Text>
          </Animated.View>
        </TapGestureHandler>
        <Animated.View
          style={[
            styles.button,
            {
              backgroundColor: "#0e8ef2",
              opacity: buttonOpacity,
              transform: [{ translateY: buttonY }],
            },
          ]}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
            Sign Up with Facebook
          </Text>
        </Animated.View>
        <Animated.View
          style={{
            height: height / 3,
            ...StyleSheet.absoluteFill,
            top: null,
            justifyContent: "center",
            zIndex: cardZIndex,
            opacity: cardOpacity,
            transform: [{ translateY: cardY }],
          }}
        >
          <TapGestureHandler onHandlerStateChange={closeState}>
            <Animated.View style={styles.closeButton}>
              <Animated.Text
                style={{
                  fontSize: 15,
                  transform: [{ rotate: concat(rotateCross, "deg") }],
                }}
              >
                X
              </Animated.Text>
            </Animated.View>
          </TapGestureHandler>
          <TextInput
            placeholder="E-mail"
            onChangeText={() => {}}
            style={styles.input}
            placeholderTextColor="black"
          />
          <TextInput
            placeholder="Password"
            onChangeText={() => {}}
            style={styles.input}
            placeholderTextColor="black"
          />
          <Animated.View style={styles.button}>
            <Text style={{ color: "black", fontWeight: "bold", fontSize: 20 }}>
              Submit
            </Text>
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  button: {
    height: 70,
    width: "80%",
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
    backgroundColor: "white",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowColor: "black",
    shadowOpacity: 0.2,
    elevation: 5,
    left: 50,
  },
  input: {
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    paddingLeft: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    borderColor: "#ccc",
  },
  closeButton: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "white",
    position: "absolute",
    top: -30,
    left: width / 2 - 20,
  },
});
