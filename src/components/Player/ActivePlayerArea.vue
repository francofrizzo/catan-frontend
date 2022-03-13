<template>
  <div class="active-player-area player-area-subarea" v-if="playerState">
    <div class="section resources">
      <card-deck
        v-for="(quantity, resource) in playerState.resources"
        :key="resource"
        :quantity="quantity"
      >
        <popup-menu>
          <template #buttons>
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
.player-area-subarea.active-player-area {
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

.popup-menu-container {
  position: relative;
  display: inline-block;

  .popup-menu {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    flex-direction: column-reverse;
    padding-bottom: $quantity-indicator-size / 2 + 0.5rem;
    visibility: hidden;
    z-index: 1;

    button {
      @include round(1.75rem);
      font-size: 1.2rem;
      background-color: $secondary-background-color;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      margin-top: 0.2rem;
      transition: transform 200ms cubic-bezier(0.175, 0.885, 0.32, 1.275),
        opacity 200ms ease;
      opacity: 0;
      transform: scale(-20%);
    }
  }

  &:hover {
    .popup-menu {
      visibility: visible;

      button {
        opacity: 1;
        transform: none;
      }
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
