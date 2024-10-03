import { styled } from "styled-components";
import {
  Container,
  Graphics,
  PixiRef,
  Sprite,
  Stage,
  useApp,
  useTick,
} from "@pixi/react";
import { Texture } from "pixi.js";
import { useEffect, useRef, useState } from "react";
import { PlayerId } from "rune-sdk";
import { GameState } from "./logic/types";

export function App() {
  const [game, setGame] = useState<GameState>();
  const [yourPlayerId, setYourPlayerId] = useState<PlayerId | undefined>();

  useEffect(() => {
    Rune.initClient({
      onChange: ({ game, action, yourPlayerId }) => {
        setGame(game);
        setYourPlayerId(yourPlayerId);
      },
    });
  }, []);

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
