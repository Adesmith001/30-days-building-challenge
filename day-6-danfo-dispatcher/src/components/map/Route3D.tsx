import { Html, Line } from "@react-three/drei";
import { STOP_BY_ID } from "../../data/stops";
import type { RouteDefinition } from "../../data/routes";
import type { GameState } from "../../types/game";

interface Props { route: RouteDefinition; state: GameState; }

function routeColor(traffic: string, closed: boolean, focused: boolean) {
  if (closed) return "#c51d1d";
  if (traffic === "madness") return "#c51d1d";
  if (traffic === "go-slow") return focused ? "#d58d00" : "#e2c982";
  if (traffic === "slow") return focused ? "#b59b27" : "#d9cca5";
  return focused ? "#171717" : "#bdb6a8";
}

export function Route3D({ route, state }: Props) {
  const from = STOP_BY_ID[route.from].position;
  const to = STOP_BY_ID[route.to].position;
  const runtime = state.routes[route.id];
  const closed = runtime.closedUntil > state.now;
  const selected = state.danfos.find((danfo) => danfo.id === state.selectedDanfoId);
  const focused = Boolean(selected?.path.includes(route.from) && selected.path.includes(route.to));
  const incidentRoute = state.incident?.routeId === route.id;
  const severe = runtime.traffic === "go-slow" || runtime.traffic === "madness" || closed;
  const showLabel = closed || incidentRoute || focused;
  const midpoint: [number, number, number] = [(from[0] + to[0]) / 2, 0.13, (from[2] + to[2]) / 2];

  return <group>
    <Line points={[[from[0], 0.07, from[2]], [to[0], 0.07, to[2]]]} color={routeColor(runtime.traffic, closed, focused)} lineWidth={closed ? 5 : focused ? 4 : severe ? 2.5 : 1.5} dashed={closed} dashScale={5} />
    {showLabel && <Html position={midpoint} center><div className={`whitespace-nowrap border px-2 py-1 text-[9px] font-black shadow-[2px_2px_0_#171717] ${closed || runtime.traffic === "madness" ? "border-red-700 bg-red-100 text-red-700" : focused ? "border-black bg-[#ffd000]" : "border-amber-700 bg-[#ffd000]"}`}>{closed ? "ROAD CLOSED" : runtime.traffic.toUpperCase()}</div></Html>}
  </group>;
}
