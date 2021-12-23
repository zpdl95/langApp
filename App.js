import React, { useEffect, useState } from "react";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const Box = styled.TouchableOpacity`
  background-color: violet;
  width: 200px;
  height: 200px;
`;

export default function App() {
  const [y, setY] = useState(0); /* y좌표값 저장 */
  const [intervalId, setIntervalId] = useState(null); /* 인터벌 id 저장 */
  const moveUp = () => {
    const id = setInterval(
      () => setY((prev) => prev + 1),
      10
    ); /* 매초 y값 변경 */
    setIntervalId(id);
  };
  console.log("rendering...");
  useEffect(() => {
    /* y값이 200이 되면 인터벌 삭제 */
    if (y === 200) {
      clearInterval(intervalId);
    }
  }, [y, intervalId]);
  return (
    <Container>
      <Box onPress={moveUp} style={{ transform: [{ translateY: -y }] }}></Box>
    </Container>
  );
}
