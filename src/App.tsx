import { styled } from "styled-components";
import { useEffect } from "react";

export function App() {
  return (
    <>
      <Root>
        <h1>TEST</h1>
      </Root>
    </>
  );
}

const Root = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
