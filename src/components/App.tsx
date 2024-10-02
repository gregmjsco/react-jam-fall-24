import "./App.css";
import { useEffect, useMemo, useState } from "react";
import React from "react";

import { BlurFilter, TextStyle } from "pixi.js";
import { Stage, Container, Sprite, Text } from "@pixi/react";
import { PlayerId } from "rune-sdk";

import { GameState } from "../logic/types";

const App = () => {
  const [game, setGame] = useState<GameState>();
  const [yourPlayerId, setYourPlayerId] = useState<PlayerId | undefined>();

  const blurFilter = useMemo(() => new BlurFilter(2), []);
  const bunnyUrl = "https://pixijs.io/pixi-react/img/bunny.png";

  useEffect(() => {
    Rune.initClient({
      onChange: ({ game, action, yourPlayerId }) => {
        setGame(game);
        setYourPlayerId(yourPlayerId);
      },
    });
  }, []);

  return (
    <Stage width={800} height={600} options={{ background: 0x1099bb }}>
      <Sprite image={bunnyUrl} x={300} y={150} />
      <Sprite image={bunnyUrl} x={500} y={150} />
      <Sprite image={bunnyUrl} x={400} y={200} />

      <Container x={200} y={200}>
        <Text
          text="Hello World"
          anchor={0.5}
          x={220}
          y={150}
          filters={[blurFilter]}
          style={
            new TextStyle({
              align: "center",
              fill: "0xffffff",
              fontSize: 50,
              letterSpacing: 20,
              dropShadow: true,
              dropShadowColor: "#E72264",
              dropShadowDistance: 6,
            })
          }
        />
      </Container>
    </Stage>
  );
};

export default App;
