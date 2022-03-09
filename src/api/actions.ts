import axios from "axios";

import PublicGameState from "@/models/PublicGameState";
import PrivateGameState from "@/models/PrivateGameState";

const baseURL = "http://localhost:7123/";

export const createGame = async (): Promise<string> => {
  const { data } = await axios.request({
    baseURL,
    method: "POST",
    url: "/game",
    data: { player_names: ["Player 1", "Player 2", "Player 3", "Player 4"] },
  });
  return data;
};

export const getGamePublicState = async (
  gameId: string
): Promise<PublicGameState> => {
  const { data } = await axios.request({
    baseURL,
    method: "GET",
    url: `/game/${gameId}`,
  });
  return data;
};
export const getGamePrivateState = async (
  gameId: string,
  playerId: number
): Promise<PrivateGameState> => {
  const { data } = await axios.request({
    baseURL,
    method: "GET",
    url: `/game/${gameId}/player/${playerId}`,
  });
  return data;
};
export const executeGameAction = async (
  gameId: string,
  playerId: number,
  action: string,
  args: any
): Promise<void> => {
  await axios.request({
    baseURL,
    method: "POST",
    url: `/game/${gameId}/player/${playerId}/action`,
    data: {
      action,
      args,
    },
  });
};
