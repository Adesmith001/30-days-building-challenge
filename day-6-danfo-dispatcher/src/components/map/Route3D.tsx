import {
  Html,
  Line,
} from "@react-three/drei";
import { STOP_BY_ID } from "../../data/stops";
import type { RouteDefinition } from "../../data/routes";
import type { GameState } from "../../types/game";

interface Props {
  route: RouteDefinition;
  state: GameState;
}

function routeColor(
  traffic: string,
  closed: boolean,
) {
  if (closed) return "#c51d1d";
  if (traffic === "madness") return "#c51d1d";
  if (traffic === "go-slow") return "#d58d00";
  if (traffic === "slow") return "#b59b27";

  return "#202020";
}

export function Route3D({
  route,
  state,
}: Props) {
  const from = STOP_BY_ID[route.from].position;
  const to = STOP_BY_ID[route.to].position;

  const runtime = state.routes[route.id];

  const closed =
    runtime.closedUntil > state.now;

  const midpoint: [number, number, number] = [
    (from[0] + to[0]) / 2,
    0.13,
    (from[2] + to[2]) / 2,
  ];

  const severe =
    runtime.traffic === "go-slow" ||
    runtime.traffic === "madness" ||
    closed;

  return (
    <group>
      <Line
        points={[
          [from[0], 0.07, from[2]],
          [to[0], 0.07, to[2]],
        ]}
        color={routeColor(
          runtime.traffic,
          closed,
        )}
        lineWidth={closed ? 5 : severe ? 4 : 2.7}
        dashed={closed}
        dashScale={5}
      />

      {severe && (
        <Html
          position={midpoint}
          center
          distanceFactor={10}
        >
          <div
            className={`
              whitespace-nowrap border px-2 py-1
              text-[9px] font-black
              shadow-[2px_2px_0_#171717]
              ${
                closed ||
                runtime.traffic === "madness"
                  ? "border-red-700 bg-red-100 text-red-700"
                  : "border-amber-700 bg-[#ffd000]"
              }
            `}
          >
            {closed
              ? "ROAD CLOSED"
              : runtime.traffic.toUpperCase()}
          </div>
        </Html>
      )}
    </group>
  );
}