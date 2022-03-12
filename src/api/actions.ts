import axios from "axios";

import GameState from "@/models/GameState";

const baseURL = "/catan/api";

export const createGame = async (): Promise<string> => {
  const { data } = await axios.request({
    baseURL,
    method: "POST",
    url: "/game",
  });
  return data.gameId;
};

export const addPlayerToGame = async (
  gameId: string,
  name: string
): Promise<void> => {
  await axios.request({
    baseURL,
    method: "POST",
    url: `/game/${gameId}/player`,
    data: { name },
  });
};

export const startGame = async (gameId: string): Promise<void> => {
  await axios.request({
    baseURL,
    method: "POST",
    url: `/game/${gameId}/start`,
  });
};

export const getGameState = async (gameId: string): Promise<GameState> => {
  const { data } = await axios.request({
    baseURL,
    method: "GET",
    url: `/game/${gameId}`,
  });
  return data;
};

export const executeGameAction = async (
  gameId: string,
  playerId: number,
  action: string,
  args: unknown
): Promise<void> => {
  await axios.request({
    baseURL,
    method: "POST",
    url: `/game/${gameId}/action`,
    data: {
      action,
      args,
    },
  });
};
