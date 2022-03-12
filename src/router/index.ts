import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import StartView from "../views/StartView.vue";
import GameView from "../views/GameView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "start",
    component: StartView,
  },
  {
    path: "/:gameId",
    name: "game",
    props: ({ params }) => ({ gameId: params.gameId }),
    component: GameView,
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
