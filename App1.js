import React, { useRef, useState } from "react";
import { Animated, PanResponder, Text, View, Dimensions } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import icons from "./icons";

const { width: deviceWidth } = Dimensions.get("window");

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
  position: absolute;
`;

const CardContainer = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
`;

const Btn = styled.TouchableOpacity``;

const BtnContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  width: 40%;
`;

export default function App() {
  /* Values */
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.Value(0)).current;
  const rotation = position.interpolate({
    inputRange: [-250, 250],
    outputRange: ["-30deg", "30deg"],
    extrapolate:
      "extend" /* input범위 밖으로 나갔을때 어떻게 처리할지 명시["clamp","extend","identity"] */,
  });
  const secondScale = position.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [1, 0.5, 1],
    extrapolate: "clamp",
  });
  /* Animations */
  const onPressIn = Animated.spring(scale, {
    toValue: 0.9,
    tension: 100,
    useNativeDriver: true,
  });
  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });
  const goCenter = Animated.spring(position, {
    toValue: 0,
    useNativeDriver: true,
  });
  const goLeft = Animated.spring(position, {
    toValue: -(deviceWidth + 50),
    useNativeDriver: true,
    tension: 20,
    restSpeedThreshold: 400 /* 애니메이션이 해당속도가 되면 종료시킴(애니메이션은 점점 느려지면서 끝나는데 빨리끝낼 수 있는 설정) */,
    restDisplacementThreshold: 100 /* 애니메이션의 남은거리가 해당값에 다다르면 종료시킴(애니메이션의 이동거리가 길면 애니메이션이 늦게끝남) */,
  });
  const goRight = Animated.spring(position, {
    toValue: deviceWidth + 50,
    useNativeDriver: true,
    tension: 20,
    restSpeedThreshold: 400,
    restDisplacementThreshold: 100,
  });
  /* PanResponders */
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onPressIn.start();
      },
      onPanResponderMove: (_, { dx }) => {
        position.setValue(dx);
      },
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -240) {
          goLeft.start(onDismiss);
        } else if (dx > 240) {
          goRight.start(onDismiss);
        } else {
          Animated.parallel([onPressOut, goCenter]).start();
        }
      },
    })
  ).current;
  /* State */
  const [index, setIndex] = useState(0);

  /* onDismiss함수를 사용해서 2장의 카드로 카드가 무한정 작동되도록 보이게 만듬
  앞카드가 사라지면 바로 가운데로 순간이동해 다음카드로 보이게함
  애니메이션 소스를 줄이기 위한 트릭 */
  const onDismiss = () => {
    setIndex((prev) => prev + 1);
    position.setValue(0);
    scale.setValue(1);
  };
  const closePress = () => goLeft.start(onDismiss);
  const checkPress = () => goRight.start(onDismiss);
  return (
    <Container>
      <CardContainer>
        <Card style={{ transform: [{ scale: secondScale }] }}>
          <Ionicons name={icons[index + 1]} color="#192a56" size={98} />
          <Text>back</Text>
        </Card>
        <Card
          {...panResponder.panHandlers}
          style={{
            transform: [
              { scale },
              { translateX: position },
              { rotateZ: rotation },
            ],
          }}
        >
          <Ionicons name={icons[index]} color="#192a56" size={98} />
          <Text>Front</Text>
        </Card>
      </CardContainer>
      <BtnContainer>
        <Btn onPress={closePress}>
          <Ionicons name="close-circle" color="white" size={50} />
        </Btn>
        <Btn onPress={checkPress}>
          <Ionicons name="checkmark-circle" color="white" size={50} />
        </Btn>
      </BtnContainer>
    </Container>
  );
}
