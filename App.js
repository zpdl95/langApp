import React, { useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  Text,
  View,
  Dimensions,
  Easing,
} from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import icons from "./icons";

const BLACK_COLOR = "#1e272e";
const GRAY = "#485460";
const GREEN = "#2ecc71";
const RED = "#e74c3c";

const Container = styled.View`
  flex: 1;
  background-color: ${BLACK_COLOR};
`;

const Edge = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const WordContainer = styled(Animated.createAnimatedComponent(View))`
  background-color: ${GRAY};
  height: 100px;
  width: 100px;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
`;

const Word = styled.Text`
  font-size: 30px;
  color: ${(props) => props.color};
  font-weight: 600;
`;
const Center = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
`;

const IconCards = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  padding: 5px 10px;
  border-radius: 10px;
  z-index: 10;
`;

export default function App() {
  /* Values */
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scaleOne = position.y.interpolate({
    inputRange: [-300, -30],
    outputRange: [1.6, 1],
    extrapolate: "clamp",
  });
  const scaleTwo = position.y.interpolate({
    inputRange: [30, 300],
    outputRange: [1, 1.6],
    extrapolate: "clamp",
  });
  /* Animations */
  const onPress = Animated.spring(scale, {
    toValue: 0.9,
    useNativeDriver: true,
  });
  const outPress = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });
  const goHome = Animated.spring(position, {
    toValue: { x: 0, y: 0 },
    useNativeDriver: true,
  });
  const onDrop = Animated.timing(scale, {
    toValue: 0,
    useNativeDriver: true,
    easing: Easing.linear,
    duration: 50,
  });
  const doOpacity = Animated.timing(opacity, {
    toValue: 0,
    useNativeDriver: true,
    easing: Easing.linear,
    duration: 50,
  });
  /* PanResponders */
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onPress.start();
      },
      onPanResponderMove: (_, { dx, dy }) => {
        position.setValue({ x: dx, y: dy });
      },
      onPanResponderRelease: (_, { dy }) => {
        if (dy >= 200 || dy <= -200) {
          Animated.sequence([
            Animated.parallel([onDrop, doOpacity]),
            Animated.timing(position, {
              toValue: 0,
              useNativeDriver: true,
              duration: 50,
              easing: Easing.linear,
            }),
          ]).start(nextIcon);
        } else {
          Animated.parallel([outPress, goHome]).start();
        }
      },
    })
  ).current;
  /* State */
  const [index, setIndex] = useState(0);
  const nextIcon = () => {
    setIndex((prev) => prev + 1);
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(opacity, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };
  return (
    <Container>
      <Edge>
        <WordContainer style={{ transform: [{ scale: scaleOne }] }}>
          <Word color={GREEN}>알아</Word>
        </WordContainer>
      </Edge>
      <Center>
        <IconCards
          {...panResponder.panHandlers}
          style={{
            opacity,
            transform: [...position.getTranslateTransform(), { scale }],
          }}
        >
          <Ionicons name={icons[index]} color={GRAY} size={80} />
        </IconCards>
      </Center>
      <Edge>
        <WordContainer style={{ transform: [{ scale: scaleTwo }] }}>
          <Word color={RED}>몰라</Word>
        </WordContainer>
      </Edge>
    </Container>
  );
}
