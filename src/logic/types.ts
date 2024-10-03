import { PlayerId, RuneClient } from "rune-sdk";

// types of entities we'll display in the world
export type EntityType = "PLAYER" | "TREE";

// the animation any player is showing - controlled
// from the server so everything is synced
export enum Animation {
  IDLE = 0,
  WALK = 6,
}

// an entity is anything that is displayed in the world
// outside of the base tile map. These will be
// z-sorted to give top down style depth
export type Entity = {
  x: number;
  y: number;
  sprite: number;
  type: EntityType;
  playerId?: PlayerId;
};

// the extra data for the player
export type Player = {
  // the state of the controls for this player - this
  // is the bit thats actually sent regularly across
  // the network
  controls: Controls;
  animation: Animation;
  vx: number;
  vy: number;
  // true if the player is facing left instead of right
  // as the sprites are designed
  flipped: boolean;
} & Entity;

// the controls that we're applying to the game state
// based on which inputs the player is currently pressing
export type Controls = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
};

// this is the core of what we're trying to keep
// in sync across the network. It'll be held on clients
// and server and the Rune platform will keep it
// in sync by applying deterministic actions
export interface GameState {
  entities: Entity[];
  players: Player[];
}

// the actions that players can apply to game state. In
// this case we're only sending the state of the inputs
// the player has - up/down/left/right/movement
type GameActions = {
  controls: (controls: Controls) => void;
};

// define access to the Rune platform APIs
declare global {
  const Rune: RuneClient<GameState, GameActions>;
}
