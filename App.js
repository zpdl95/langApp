import React from "react";
import { Animated, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

/* 한번에 animated컴포넌트 생성 , 단점 import 해야함 */
const Box = styled(Animated.createAnimatedComponent(TouchableOpacity))`
  background-color: violet;
  width: 200px;
  height: 200px;
`;

/* const를 2번 사용한 animated컴포넌트 생성, 단점 생성을 2번해야함 */
const AnimatedBox = Animated.createAnimatedComponent(Box);

export default function App() {
  /* 애니메이션에 들어갈 값은 Animated로 만든다 */
  /* Animated로 만든 값은 직접변경하지 않는다  */
  /* 모든 컴포넌트에 애니메이션을 만들 수 없다 */
  const Y = new Animated.Value(0);
  const moveUp = () => {};
  return (
    <Container>
      <Box onPress={moveUp} style={{ transform: [{ translateY: Y }] }}></Box>
    </Container>
  );
}
