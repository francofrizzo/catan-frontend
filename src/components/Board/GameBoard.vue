<template>
  <div class="board" :style="boardStyle">
    {{ game.state.boardState }}
    <div class="board-background"></div>
    <tile
      v-for="tile in tiles"
      :key="`tile:${tile.id}`"
      :tile="tile"
      :style="tile.style"
    />
    <edge
      v-for="edge in edges"
      :key="`edge:${edge.corners[0]}:${edge.corners[1]}`"
      :corners="edge.corners"
      :road="edge.road"
      :style="edge.style"
      :direction="edge.direction"
    />
    <corner
      v-for="corner in corners"
      :key="`corner:${corner.id}`"
      :corner="corner"
      :style="corner.style"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Board from "@/models/Board";
import Tile from "@/models/Tile";
import Corner from "@/models/Corner";
import Road from "@/models/Road";

import TileComponent from "@/components/Board/BoardTile.vue";
import CornerComponent from "@/components/Board/BoardCorner.vue";
import EdgeComponent from "@/components/Board/BoardEdge.vue";

export type BoardMode = "default" | "building-settlement";

const mod = (n: number, m: number): number => ((n % m) + m) % m;

const tileAspectRatio = Math.sqrt(4 / 3);
const boardHeight = 90; // in vh -- this should coincide with sass variable $board-height
const boardWidth = boardHeight * tileAspectRatio;
const tileWidth = boardHeight * 0.185977255;
const tileHeight = tileWidth * tileAspectRatio;

type VectorInPolarCoordinates = { angle: number; distance: number };
const polarToRectangular = ({
  angle,
  distance,
}: VectorInPolarCoordinates): [number, number] => [
  distance * Math.sin(angle),
  -distance * Math.cos(angle),
];
const sumVectors = (
  [x1, y1]: [number, number],
  [x2, y2]: [number, number]
): [number, number] => [x1 + x2, y1 + y2];

const generateTileCoordinates = (): [number, number][] => {
  const polarCoordinates: VectorInPolarCoordinates[] = [];
  for (let i = 0; i < 19; i++) {
    if (i === 0) {
      polarCoordinates.push({ angle: 0, distance: 0 });
    } else if (i >= 1 && i <= 6) {
      polarCoordinates.push({
        angle: i * (Math.PI / 3) + Math.PI / 6,
        distance: tileWidth,
      });
    } else if (i >= 6) {
      polarCoordinates.push({
        angle: (i - 5) * (Math.PI / 6),
        distance: i % 2 === 0 ? 2 * tileWidth : 1.5 * tileHeight,
      });
    }
  }
  return polarCoordinates.map(polarToRectangular);
};

const generateCornerCoordinates = (): [number, number][] => {
  const layers: VectorInPolarCoordinates[][][] = [];
  const generateTroika = (
    base: VectorInPolarCoordinates[]
  ): VectorInPolarCoordinates[][] => {
    const troika: VectorInPolarCoordinates[][] = [];
    for (let j = 0; j < 3; j++) {
      troika.push([
        ...base,
        {
          angle: base[0].angle + (j - 1) * (Math.PI / 6),
          distance: j === 1 ? tileHeight / 2 : tileWidth,
        },
      ]);
    }
    return troika;
  };

  layers.push([]);
  for (let i = 0; i < 6; i++) {
    layers[0].push([
      {
        angle: (i + 1) * (Math.PI / 3),
        distance: tileHeight / 2,
      },
    ]);
  }

  layers.push([]);
  layers[0].forEach((vectors) => {
    layers[1].push(...generateTroika(vectors));
  });
  layers[1].push(layers[1].shift()!);

  layers.push([]);
  layers[1].forEach((vectors, index) => {
    const indexInSide = mod(index - 2, 3);
    if (indexInSide === 0 || indexInSide === 2) {
      const troika = generateTroika(vectors);
      if (indexInSide === 2) {
        troika.shift();
      }
      layers[2].push(...troika);
    }
  });
  layers[2].unshift(layers[2].pop()!);

  return ([] as VectorInPolarCoordinates[][])
    .concat(...layers)
    .map((vectors) => vectors.map(polarToRectangular).reduce(sumVectors));
};

const tileCoordinates = generateTileCoordinates();
const cornerCoordinates = generateCornerCoordinates();

export default defineComponent({
  inject: ["game"],
  computed: {
    board(): Board {
      return this.game.publicState!.board;
    },
    boardStyle(): Record<string, string> {
      return {
        width: `${boardWidth}vh`,
        height: `${boardHeight}vh`,
        position: "relative",
      };
    },
    tiles(): (Tile & { style: Record<string, string> })[] {
      return this.board.tiles.map((tile) => {
        return {
          ...tile,
          style: {
            width: `${tileWidth}vh`,
            height: `${tileHeight}vh`,
            marginLeft: `-${tileWidth / 2}vh`,
            marginTop: `-${tileHeight / 2}vh`,
            left: `${boardWidth / 2 + tileCoordinates[tile.id][0]}vh`,
            top: `${boardHeight / 2 + tileCoordinates[tile.id][1]}vh`,
          },
        };
      });
    },
    corners(): (Corner & { style: Record<string, string> })[] {
      return this.board.corners.map((corner) => {
        return {
          ...corner,
          style: {
            left: `${boardWidth / 2 + cornerCoordinates[corner.id][0]}vh`,
            top: `${boardHeight / 2 + cornerCoordinates[corner.id][1]}vh`,
          },
        };
      });
    },
    edges(): {
      corners: [number, number];
      road: Road | null;
      style: Record<string, string>;
      direction: number;
    }[] {
      return ([] as [number, number][])
        .concat(
          ...this.corners.map((corner) =>
            corner.adjacentCorners
              .filter((adjCornerId) => adjCornerId > corner.id)
              .map(
                (adjCornerId) => [corner.id, adjCornerId] as [number, number]
              )
          )
        )
        .map(([corner1, corner2]) => {
          const corner1Coords = cornerCoordinates[corner1];
          const corner2Coords = cornerCoordinates[corner2];
          let rotation = 0;
          if (Math.abs(corner1Coords[0] - corner2Coords[0]) > 1) {
            if (
              (corner1Coords[0] < corner2Coords[0] &&
                corner1Coords[1] < corner2Coords[1]) ||
              (corner1Coords[0] > corner2Coords[0] &&
                corner1Coords[1] > corner2Coords[1])
            ) {
              rotation = -(Math.PI / 3);
            } else {
              rotation = Math.PI / 3;
            }
          }
          return {
            corners: [corner1, corner2],
            road:
              this.board.roads.find(
                (road) =>
                  (road.corners[0] === corner1 &&
                    road.corners[1] === corner2) ||
                  (road.corners[1] === corner1 && road.corners[0] === corner2)
              ) ?? null,
            style: {
              height: `${tileHeight / 2}vh`,
              marginTop: `-${tileHeight / 4}vh`,
              left: `${
                boardWidth / 2 + (corner1Coords[0] + corner2Coords[0]) / 2
              }vh`,
              top: `${
                boardHeight / 2 + (corner1Coords[1] + corner2Coords[1]) / 2
              }vh`,
              transform: `rotate(${rotation}rad)`,
            },
            direction: rotation === 0 ? 0 : rotation < 0 ? 1 : 2,
          };
        });
    },
  },
  components: {
    Tile: TileComponent,
    Corner: CornerComponent,
    Edge: EdgeComponent,
  },
});
</script>

<style lang="scss">
.board {
  position: relative;
  filter: drop-shadow(0px 18px 10px rgba(0, 0, 0, 0.45));
  // transform: perspective(50vh) rotateX(5deg) translateY(-4vh);

  .board-background {
    @include absolute-cover;
    background-image: url("../../assets/board-background.png");
    background-size: cover;
    animation: fade-in 1600ms;
  }

  .tile {
    @for $i from 0 through 18 {
      &:nth-child(#{$i + 2}) {
        animation: wait ($i * 40ms), fade-in 800ms ($i * 40ms);
      }
    }
  }
}
</style>
