import GameState from "@/models/GameState";

const baseURL = process.env.VUE_APP_API_BASE_URL;

export function subscribeToUpdates(
  gameId: string,
  callback: (data: {
    event: string;
    eventData?: Record<string, unknown>;
    state: GameState;
  }) => void
) {
  const ws = new WebSocket(`${baseURL}/game/${gameId}/updates`);
  ws.onmessage = ({ data }) => {
    callback(JSON.parse(data));
  };
}
