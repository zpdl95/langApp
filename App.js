import React, { useRef } from "react";
import { Animated, PanResponder } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: tomato;
`;

const Box = styled.View`
  background-color: violet;
  width: 200px;
  height: 200px;
`;
const AnimatedBox = Animated.createAnimatedComponent(Box);

export default function App() {
  /* 애니메이션에 들어갈 값은 Animated로 만든다 */
  /* Animated로 만든 값은 직접변경하지 않는다  */
  /* 모든 컴포넌트에 애니메이션을 만들 수 없다 */
  /* useRef()는 다시 렌더링 될때마다 초기값으로 돌아가길 원하지 않는 value값을 기억함 .current속성을 가진 값에 넣어줌 */
  const POSITION = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  /* interpolate = 보간법: 두 지점을 주면 그 가운데 있는 지점을 추정하는것 */
  const borderRadius = POSITION.y.interpolate({
    inputRange: [-200, 200],
    outputRange: [100, 0],
  });
  const bgColor = POSITION.y.interpolate({
    inputRange: [-200, 200],
    outputRange: ["red", "blue"],
  });
  const panResponder = useRef(
    PanResponder.create({
      /* 모든 pressEvent를 감지할지 안할지 결정하는 함수 */
      onStartShouldSetPanResponder: () => true,

      /* 터치가 감지될때 실행 터치가 끝나면 종료되는 듯함 */
      onPanResponderGrant: () => {
        console.log("터치 시작");
        /* offset은 POSITION의 움직임의 시작지점으로 설정됨.
        setOffset = 저장된 offset값을 x,y값으로 설정함. _value는 offset값으로 생각됨 */
        POSITION.setOffset({ x: POSITION.x._value, y: POSITION.y._value });
      },

      /* 터치의 움직임에 반응해 실행 움직일때마다 실행. 터치좌표값을 줌
      이 좌표값은 offset이 있으면 offset값을 시작좌표값으로 실행됨 */
      onPanResponderMove: (event, { dx, dy }) => {
        console.log("움직이는중");
        /* setValue = 직접 x,y값을 변경 */
        POSITION.setValue({
          x: dx,
          y: dy,
        });
      },
      /* 터치를 때면 실행 */
      onPanResponderRelease: () => {
        console.log("손땜");
        /* offset을 0으로 만듬 */
        POSITION.flattenOffset();
      },
    })
  ).current;
  console.log("rendering...");
  return (
    <Container>
      <AnimatedBox
        {...panResponder.panHandlers} /* 터치관련 함수를 props형태로 받는다 */
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
