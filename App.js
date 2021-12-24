import React, { useRef, useState } from "react";
import { Animated, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Box = styled.View`
  background-color: violet;
  width: 200px;
  height: 200px;
`;
const AnimatedBox = Animated.createAnimatedComponent(Box);

export default function App() {
  const [up, setUp] = useState(false);

  /* 애니메이션에 들어갈 값은 Animated로 만든다 */
  /* Animated로 만든 값은 직접변경하지 않는다  */
  /* 모든 컴포넌트에 애니메이션을 만들 수 없다 */
  /* useRef()는 다시 렌더링 될때마다 초기값으로 돌아가길 원하지 않는 value값을 기억함 */
  const Y = useRef(new Animated.Value(0)).current;
  const toggleUp = () => setUp((prev) => !prev);
  const moveUp = () => {
    Animated.timing(Y, {
      toValue: up ? 200 : -200 /* Value가 얼만큼 커지거나 작아질지 선택 */,
      useNativeDriver: true /* 애니메이션의 동작을 native가 관리함. 매초마다 native쪽으로 정보를 보내줄 필요가 없다 */,
    }).start(toggleUp);
  };
  console.log("fdfd");
  return (
    <Container>
      <TouchableOpacity onPress={moveUp}>
        <AnimatedBox style={{ transform: [{ translateY: Y }] }} />
      </TouchableOpacity>
    </Container>
  );
}

/* Animated.decay() 초기속도로 시작해서 점점느려지고 멈춤 */
/* Animated.spring() 물리 모델 제공 */
/* Animated.timing() 일정시간동안 애니메이션 작동 */
