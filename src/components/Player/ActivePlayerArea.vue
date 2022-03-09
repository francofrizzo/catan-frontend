<template>
  <div class="active-player-area" v-if="playerState">
    <p v-if="actionError">{{ actionError }}</p>

    <h4>Actions</h4>

    <button v-if="availableActions.includes('RollDice')" @click="rollDice()">
      Roll Dice
    </button>

    <button v-if="availableActions.includes('Pass')" @click="pass()">
      Pass
    </button>

    <h4>Resources</h4>
    <ul class="resources">
      <li v-for="(quantity, resource) in playerState.resources" :key="resource">
        {{ getResourceIcon(resource) }} {{ resource }}: {{ quantity }}
        <button
          :disabled="!availableActions.includes('Collect')"
          @click="collect(resource)"
        >
          +1
        </button>
        <button
          :disabled="!availableActions.includes('Discard')"
          @click="discard(resource)"
        >
          -1
        </button>
      </li>
    </ul>

    <h4>Building</h4>

    <button
      @click="startBuildingSettlement()"
      :disabled="!availableActions.includes('BuildSettlement')"
    >
      Build Settlement
    </button>

    <button
      @click="startBuildingCity()"
      :disabled="!availableActions.includes('BuildCity')"
    >
      Build City
    </button>

    <button
      @click="startBuildingRoad()"
      :disabled="!availableActions.includes('BuildRoad')"
    >
      Build Road
    </button>

    <h4>Development cards</h4>
    <button
      @click="buyDevelopmentCard()"
      :disabled="!availableActions.includes('BuyDevelopmentCard')"
    >
      Buy
    </button>

    <ul class="resources">
      <li v-for="card in playerState.allDevelopmentCards" :key="card.id">
        {{ card.type }}
        <template v-if="card.played"> (played) </template>
        <button
          :disabled="
            !availableActions.includes('PlayDevelopmentCard') || !card.playable
          "
          @click="playDevelopmentCard(card.id)"
        >
          Play
        </button>
      </li>
    </ul>

    <h4>Achievement tokens</h4>
    <ul class="resources">
      <li v-for="token in player.achievementTokens" :key="token.id">
        {{ token.type }}
      </li>
    </ul>

    <hr />

    <div
      v-for="(action, actionKey) in actions"
      v-show="action.available"
      :key="actionKey"
    >
      <div v-for="[arg, type] in action.args" :key="arg">
        <input
          v-if="typeof type === 'string'"
          v-model="actionArgs[arg]"
          :placeholder="arg"
        />
        <template v-else>
          <input
            v-for="[subarg] in type"
            :key="subarg"
            v-model="actionArgs[`${arg}:${subarg}`]"
            :placeholder="`${arg}:${subarg}`"
          />
        </template>
      </div>
      <button @click="executeAction(actionKey)">
        {{ actionKey }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import Action from "@/models/Action";
import Player from "@/models/Player";
import PrivatePlayerState from "@/models/PrivatePlayerState";

import game from "@/game";
import Resource, { getResourceIcon } from "@/models/Resource";

type ActionArgs = [
  string,
  "string" | "number" | [string | number, "string" | "number"][]
][];

export default defineComponent({
  props: {
    player: { type: Object as PropType<Player>, required: true },
  },
  data: () => ({
    actionArgs: {} as any,
    actionError: "",
  }),
  computed: {
    playerState(): PrivatePlayerState | null {
      return game.privateState;
    },
    actions(): Record<string, { available: boolean; args: ActionArgs }> {
      return game.actions;
    },
    availableActions(): Action[] {
      return game.availableActions;
    },
  },
  methods: {
    getResourceIcon,
    rollDice() {
      game.rollDice();
    },
    pass() {
      game.pass();
    },
    startBuildingSettlement() {
      game.startBuildingSettlement();
    },
    startBuildingCity() {
      game.startBuildingCity();
    },
    startBuildingRoad() {
      game.startBuildingRoad();
    },
    collect(resource: Resource) {
      game.collectResource(resource);
    },
    discard(resource: Resource) {
      game.discardResource(resource);
    },
    buyDevelopmentCard() {
      game.buyDevelopmentCard();
    },
    playDevelopmentCard(cardId: number) {
      game.playDevelopmentCard(cardId);
    },
    async executeAction(actionKey: Action) {
      try {
        await game.executeActionLegacy(actionKey, this.actionArgs);
        this.actionArgs = {};
        this.actionError = "";
      } catch (err: any) {
        this.actionError = err.message;
      }
    },
  },
});
</script>

<style lang="scss">
.player-area {
  .resources {
    text-align: left;
  }
}
</style>
