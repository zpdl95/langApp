import React, { useRef, useState } from "react";
import { Animated, Dimensions } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: tomato;
`;

const Box = styled.Pressable`
  background-color: violet;
  width: 200px;
  height: 200px;
`;
const AnimatedBox = Animated.createAnimatedComponent(Box);

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function App() {
  /* 애니메이션에 들어갈 값은 Animated로 만든다 */
  /* Animated로 만든 값은 직접변경하지 않는다  */
  /* 모든 컴포넌트에 애니메이션을 만들 수 없다 */
  /* useRef()는 다시 렌더링 될때마다 초기값으로 돌아가길 원하지 않는 value값을 기억함 .current속성을 가진 값에 넣어줌 */
  const POSITION = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const topLeft = Animated.timing(POSITION, {
    toValue: {
      x: -SCREEN_WIDTH / 2 + 100,
      y: -SCREEN_HEIGHT / 2 + 100,
    },
    useNativeDriver: false,
  });
  const bottomLeft = Animated.timing(POSITION, {
    toValue: {
      x: -SCREEN_WIDTH / 2 + 100,
      y: SCREEN_HEIGHT / 2 - 100,
    },
    useNativeDriver: false,
  });
  const bottomRight = Animated.timing(POSITION, {
    toValue: {
      x: SCREEN_WIDTH / 2 - 100,
      y: SCREEN_HEIGHT / 2 - 100,
    },
    useNativeDriver: false,
  });
  const topRight = Animated.timing(POSITION, {
    toValue: {
      x: SCREEN_WIDTH / 2 - 100,
      y: -SCREEN_HEIGHT / 2 + 100,
    },
    useNativeDriver: false,
  });
  const moveUp = () => {
    Animated.loop(
      Animated.sequence([topLeft, bottomLeft, bottomRight, topRight])
    ).start();
  };
  /* interpolate = 보간법: 두 지점을 주면 그 가운데 있는 지점을 추정하는것 */
  const borderRadius = POSITION.y.interpolate({
    inputRange: [-200, 200],
    outputRange: [100, 0],
  });
  const bgColor = POSITION.y.interpolate({
    inputRange: [-200, 200],
    outputRange: ["red", "blue"],
  });

  return (
    <Container>
      <AnimatedBox
        onPress={moveUp}
        style={{
          borderRadius,
          transform: [...POSITION.getTranslateTransform()],
          backgroundColor:
            bgColor /* backgroundColor옵션은 nativeDriver사용중일때는 불가능 */,
        }}
      ></AnimatedBox>
    </Container>
  );
}

/* Animated.decay() 초기속도로 시작해서 점점느려지고 멈춤 */
/* Animated.spring() 물리 모델 제공 */
/* Animated.timing() 일정시간동안 애니메이션 작동 */
