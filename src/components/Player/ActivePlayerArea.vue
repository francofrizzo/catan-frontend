<template>
  <div class="active-player-area player-area-subarea" v-if="playerState">
    <div class="section resources">
      <resource-deck
        v-for="(quantity, resource) in playerState.resources"
        :key="resource"
        :resource="resource"
        :quantity="quantity"
      />
    </div>

    <div class="section construction">
      <button
        @click="startBuildingRoad()"
        :disabled="!availableActions.includes('BuildRoad')"
      >
        <div class="road" />
      </button>
      <button
        @click="startBuildingSettlement()"
        :disabled="!availableActions.includes('BuildSettlement')"
      >
        <div class="settlement" />
      </button>
      <button
        @click="startBuildingCity()"
        :disabled="!availableActions.includes('BuildCity')"
      >
        <div class="city" />
      </button>
    </div>

    <div class="section development-cards">
      <button
        @click="buyDevelopmentCard()"
        :disabled="!availableActions.includes('BuyDevelopmentCard')"
      >
        Comprar carta de desarrollo
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import Action from "@/models/Action";
import Player from "@/models/Player";
import PrivatePlayerState from "@/models/PrivatePlayerState";
import Resource, { getResourceIcon } from "@/models/Resource";

import game from "@/game";

import ResourceDeck from "@/components/Elements/ResourceDeck.vue";

export default defineComponent({
  props: {
    player: { type: Object as PropType<Player>, required: true },
  },
  computed: {
    playerState(): PrivatePlayerState | null {
      return game.privateState;
    },
    availableActions(): Action[] {
      return game.availableActions;
    },
  },
  methods: {
    getResourceIcon,
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
  },
  components: { ResourceDeck },
});
</script>

<style lang="scss">
.active-player-area {
  .resources,
  .construction {
    margin-left: -0.3rem;
    margin-right: -0.3rem;

    > * {
      margin-left: 0.3rem;
      margin-right: 0.3rem;
    }
  }

  .construction {
    button {
      padding: $construction-button-padding;
    }
    .road,
    .settlement,
    .city {
      width: $construction-button-icon-size;
      height: $construction-button-icon-size;
    }
  }
}

@each $player, $color-name in $player-color-names {
  .player-area-#{$player} {
    .active-player-area {
      .construction {
        button {
          background: map-get($player-light-gradients, $player);
        }
        .road {
          @include board-piece-shadow;
          @include board-piece-image(
            url("../../assets/road-#{$color-name}-side-2.png")
          );
          transform: rotate(60deg);
        }
        .settlement {
          @include board-piece-shadow;
          @include board-piece-image(
            url("../../assets/settlement-#{$color-name}.png")
          );
        }
        .city {
          @include board-piece-shadow;
          @include board-piece-image(
            url("../../assets/city-#{$color-name}.png")
          );
        }
      }
    }
  }
}
</style>
