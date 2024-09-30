import type { PlayerId, RuneClient } from "rune-sdk/multiplayer";

export const MOVE_SPEED = 4;
export const MOVE_ACCEL = 1;

export const tileMap = [
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12],
  [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12],
  [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12],
  [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12],
  [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12],
  [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12],
  [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12],
  [20, 21, 21, 21, 21, 11, 11, 21, 21, 21, 21, 22],
  [-1, -1, -1, -1, -1, 10, 12, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, 20, 22, -1, -1, -1, -1, -1],
];

export const blocks = [
  [200, 50],
  [300, 120],
  [50, 200],
  [80, 400],
  [500, 100],
  [480, 300],
  [550, 200],
  [300, 400],
  [700, 450],
];

export type EntityType = "PLAYER" | "BLOCK";

export enum Animation {
  IDLE = 0,

  WALK = 6,
}

export type Entity = {
  x: number;
  y: number;
  sprite: number;
  type: EntityType;
  playerId?: PlayerId;
};

export type Player = {
  controls: Controls;
  animation: Animation;
  vx: number;
  vy: number;
  flipped: boolean;
} & Entity;

export type Controls = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
};

export interface GameState {
  entities: Entity[];
  players: Player[];
}

type GameActions = {
  controls: (controls: Controls) => void;
};

declare global {
  const Rune: RuneClient<GameState, GameActions>;
}

function isValidPosition(state: GameState, x: number, y: number): boolean {
  x = Math.floor(x / 64);
  y = Math.floor(y / 64);

  return tileMap[y] && tileMap[y][x] >= 0;
}

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: (allPlayerIds) => {
    const initialState: GameState = {
      entities: [],
      // for each of the players Rune says are in the game
      // create a new player entity. We'll initialize their
      // location to place them in the world
      players: allPlayerIds.map((p, index) => {
        return {
          x: (index + 1) * 64,
          y: (index + 1) * 64,
          playerId: p,
          type: "PLAYER",
          sprite: index % 4,
          animation: Animation.IDLE,
          controls: {
            left: false,
            right: false,
            up: false,
            down: false,
          },
          flipped: false,
          vx: 0,
          vy: 0,
        };
      }),
    };

    for (const block of blocks) {
      initialState.entities.push({
        type: "BLOCK",
        x: block[0],
        y: block[1],
        sprite: 4,
      });
    }

    return initialState;
  },

  updatesPerSecond: 30,
  // the update loop where we progress the game based on the current player inputs
  // that have been sent through actions.
  update: ({ game }) => {
    // go through all the players and update them
    for (const player of game.players) {
      // assume the player is doing nothing to start with
      player.animation = Animation.IDLE;

      // for each control that the player has pressed attempt to move them
      // in the appropriate direction. Only move if the player isn't blocked
      // by whatever is in the tile map.
      //
      // The client will run a copy of this logic and update() loop so will
      // immediately update is run. The server will also run a copy of this
      // logic and update() loop but slightly behind the client to allow
      // for any action conflict resolution, e.g. two players try to take
      // the same item. When the server has resolved the conflict the client
      // will rollback its changes if needed and apply the new actions from
      // the authoritative server putting the client back in the correct state.
      if (player.controls.left) {
        player.vx = Math.max(-MOVE_SPEED, player.vx - MOVE_ACCEL);
        player.flipped = true;
      } else if (player.controls.right) {
        player.vx = Math.min(MOVE_SPEED, player.vx + MOVE_ACCEL);
        player.flipped = false;
      } else {
        if (player.vx > 0) {
          player.vx = Math.max(0, player.vx - MOVE_ACCEL);
        } else if (player.vx < 0) {
          player.vx = Math.min(0, player.vx + MOVE_ACCEL);
        }
      }

      if (player.controls.up) {
        player.vy = Math.max(-MOVE_SPEED, player.vy - MOVE_ACCEL);
      } else if (player.controls.down) {
        player.vy = Math.min(MOVE_SPEED, player.vy + MOVE_ACCEL);
      } else {
        if (player.vy > 0) {
          player.vy = Math.max(0, player.vy - MOVE_ACCEL);
        } else if (player.vy < 0) {
          player.vy = Math.min(0, player.vy + MOVE_ACCEL);
        }
      }

      // update players based on their velocities
      if (
        player.vx !== 0 &&
        isValidPosition(game, player.x + player.vx, player.y)
      ) {
        player.x += player.vx;
        player.animation = Animation.WALK;
      }
      if (
        player.vy != 0 &&
        isValidPosition(game, player.x, player.y + player.vy)
      ) {
        player.y += player.vy;
        player.animation = Animation.WALK;
      }
    }
  },
  // actions are the way clients can modify game state. Rune manages
  // how and when these actions are applied to maintain a consistent
  // game state between all clients.
  actions: {
    // Action applied from the client to setup the controls the
    // player is currently pressing. We simple record the controls
    // and let the update() loop actually apply the changes
    controls: (controls, { game, playerId }) => {
      const entity = game.players.find((p) => p.playerId === playerId);

      if (entity && entity.type === "PLAYER") {
        (entity as Player).controls = { ...controls };
      }
    },
  },
});
