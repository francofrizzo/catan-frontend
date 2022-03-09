import PublicGameState from "@/models/PublicGameState";
import PrivateGameState from "@/models/PrivateGameState";

const baseURL = "ws://localhost:7123";

export function subscribeToPublicUpdates(
  gameId: string,
  callback: (data: PublicGameState) => void
) {
  const ws = new WebSocket(`${baseURL}/game/${gameId}/updates`);
  ws.onmessage = ({ data }) => {
    callback(JSON.parse(data));
  };
}

export function subscribeToPrivateUpdates(
  gameId: string,
  playerId: number,
  callback: (data: PrivateGameState) => void
) {
  const ws = new WebSocket(
    `${baseURL}/game/${gameId}/player/${playerId}/updates`
  );
  ws.onmessage = ({ data }) => {
    callback(JSON.parse(data));
  };
}
