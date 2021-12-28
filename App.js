import React, { useRef } from "react";
import { Animated, PanResponder, View } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #00a8ff;
`;

const Card = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  width: 300px;
  height: 300px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  elevation: 6; /* 안드로이드 그림자 설정 */
`;

export default function App() {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onPressIn();
      },
      onPanResponderMove: (_, { dx }) => {
        position.setValue(dx);
      },
      onPanResponderRelease: () => {
        Animated.parallel([
          onPressOut,
          Animated.spring(position, {
            toValue: 0,
            useNativeDriver: true,
          }),
        ]).start();
      },
    })
  ).current;
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.Value(0)).current;
  const onPressIn = () =>
    Animated.spring(scale, {
      toValue: 0.9,
      tension: 100,
      useNativeDriver: true,
    }).start();
  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });
  return (
    <Container>
      <Card
        {...panResponder.panHandlers}
        style={{
          transform: [{ scale }, { translateX: position }],
        }}
      >
        <Ionicons name="pizza" color="#192a56" size={98} />
      </Card>
    </Container>
  );
}
