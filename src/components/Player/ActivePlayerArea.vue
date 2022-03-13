<template>
  <div class="active-player-area player-area-subarea">
    <div class="section resources">
      <card-deck
        v-for="(quantity, resource) in playerState.resources"
        :key="resource"
        :quantity="quantity"
      >
        <popup-menu>
          <template #buttons>
            <template v-if="tradingResource === null">
              <button
                @click="collect(resource)"
                v-if="availableActions.includes('Collect')"
              >
                +
              </button>
              <button
                @click="discard(resource)"
                v-if="availableActions.includes('Discard')"
              >
                -
              </button>
              <button
                @click="startTrading(resource)"
                v-if="tradableResources.includes(resource)"
              >
                $-
              </button>
            </template>
            <template v-else>
              <button
                @click="cancelTrading()"
                v-if="tradingResource === resource"
              >
                ×
              </button>
              <button @click="trade(resource)" v-else>$+</button>
            </template>
          </template>
          <resource-card :resource="resource" :disabled="quantity === 0" />
        </popup-menu>
        <template #extra-card>
          <resource-card no-icon :resource="resource" />
        </template>
      </card-deck>
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
      <development-card
        v-for="card in playerState.allDevelopmentCards"
        :key="card.id"
      />

      <popup-menu :disabled="!availableActions.includes('BuyDevelopmentCard')">
        <development-card />

        <template #buttons>
          <button @click="buyDevelopmentCard()">+</button>
        </template>
      </popup-menu>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import Action from "@/models/Action";
import Player from "@/models/Player";
import PrivatePlayerState from "@/models/PrivatePlayerState";
import Resource, { getResourceIcon } from "@/models/Resource";

import CardDeck from "@/components/Elements/CardDeck.vue";
import ResourceCard from "@/components/Elements/ResourceCard.vue";
import DevelopmentCard from "@/components/Elements/DevelopmentCard.vue";
import PopupMenu from "@/components/Elements/PopupMenu.vue";

export default defineComponent({
  inject: ["game"],
  data: () => ({
    tradingResource: null as Resource | null,
  }),
  props: {
    player: { type: Object as PropType<Player>, required: true },
  },
  computed: {
    playerState(): PrivatePlayerState | null {
      return this.game.privateState;
    },
    availableActions(): Action[] {
      return this.game.availableActions;
    },
    tradableResources(): Resource[] {
      if (this.playerState && this.availableActions.includes("Trade")) {
        return [
          Resource.Brick,
          Resource.Grain,
          Resource.Lumber,
          Resource.Ore,
          Resource.Wool,
        ].filter(
          (resource) =>
            this.playerState!.resources[resource] >=
            this.playerState!.exchangeRates[resource]
        );
      } else {
        return [];
      }
    },
  },
  methods: {
    getResourceIcon,
    startBuildingSettlement() {
      this.game.startBuildingSettlement();
    },
    startBuildingCity() {
      this.game.startBuildingCity();
    },
    startBuildingRoad() {
      this.game.startBuildingRoad();
    },
    collect(resource: Resource) {
      this.game.collectResource(resource);
    },
    discard(resource: Resource) {
      this.game.discardResource(resource);
    },
    startTrading(resource: Resource) {
      this.tradingResource = resource;
    },
    trade(resource: Resource) {
      this.game.trade(this.tradingResource!, resource);
      this.tradingResource = null;
    },
    cancelTrading() {
      this.tradingResource = null;
    },
    buyDevelopmentCard() {
      this.game.buyDevelopmentCard();
    },
    playDevelopmentCard(cardId: number) {
      this.game.playDevelopmentCard(cardId);
    },
  },
  components: { CardDeck, ResourceCard, DevelopmentCard, PopupMenu },
});
</script>

<style lang="scss">
.active-player-area {
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
