import React, { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

interface TileSet {
  image: PIXI.Texture;
  tilesAcross: number;
  tileWidth: number;
  tileHeight: number;
}

const Graphics = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application>();

  useEffect(() => {
    if (containerRef.current) {
      const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      containerRef.current.appendChild(app.view);
      appRef.current = app;
    }
  }, []);

  const loadTileSet = async (
    src: string,
    tileWidth: number,
    tileHeight: number,
  ): Promise<TileSet> => {
    const texture = await PIXI.Texture.from(src);
    return {
      image: texture,
      tilesAcross: Math.floor(texture.width / tileWidth),
      tileWidth,
      tileHeight,
    };
  };

  const drawTile = (
    x: number,
    y: number,
    tileSet: TileSet,
    tile: number,
    flipped = false,
  ): void => {
    if (!appRef.current) return;

    const tx = (tile % tileSet.tilesAcross) * tileSet.tileWidth;
    const ty = Math.floor(tile / tileSet.tilesAcross) * tileSet.tileHeight;

    const sprite = new PIXI.Sprite(tileSet.image);
    sprite.setTransform(x, y);
    if (flipped) {
      sprite.scale.x = -1;
      sprite.x += tileSet.tileWidth;
    }
    sprite.setFrame(
      new PIXI.Rectangle(tx, ty, tileSet.tileWidth, tileSet.tileHeight),
    );
    appRef.current.stage.addChild(sprite);
  };

  return <div ref={containerRef} />;
};

export default Graphics;
