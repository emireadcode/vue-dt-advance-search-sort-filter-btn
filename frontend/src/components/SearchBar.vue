<script setup lang="ts">
import { inject, type ShallowRef, shallowRef, ref, onBeforeMount, triggerRef } from 'vue'
import type {
  PrimitiveType,
  NumberType,
  MultipleWordsStringType,
  NumberStringType,
  SingleWordStringType
} from './types/SupportedDatatypesTypeDeclaration'
import SwitchableComponent from './SwitchableComponent.vue'
import MapContainer from './searchbarmodals/MapContainer.vue'
import type { AccessibilityType } from './types/accessibility'

/*
import DateTimeSearcherModal from "./searchbarmodals/DateTimeSearcherModal.vue";
import TimeSearcherModal from "./searchbarmodals/TimeSearcherModal.vue";
import YearSearcherModal from "./searchbarmodals/YearSearcherModal.vue";
import KeyToNameMappingSearcherModal from "./searchbarmodals/KeyToNameMappingSearcherModal.vue";
*/

import DateSearcherModal from './searchbarmodals/DateSearcherModal.vue'
import MultipleSingleOrNumberStringWordSearcherModal from './searchbarmodals/MultipleSingleOrNumberStringWordSearcherModal.vue'
import NumberSearcherModal from './searchbarmodals/NumberSearcherModal.vue'

const holder = inject('cards') as ShallowRef<PrimitiveType[]>,
  cards = shallowRef<PrimitiveType[]>(),
  placeclick = ref(false)
;
onBeforeMount(() => {
  cards.value = JSON.parse(JSON.stringify(holder.value))
  triggerCards()
})

function triggerCards() {
  triggerRef(cards)
}

let 
  accessibility = inject('accessibility') as ShallowRef<AccessibilityType>,
  index = inject('index') as number
;
</script>

<template>
  <div class="d-block" style="padding: 0 0 0.410156718rem 0">
    <div
      class="shadow-sm flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
      style="height: 1.75rem"
    >
      <div class="flex-w-3-dot-5-rem p-0 m-0 align-self-stretch">
        <switchable-component truelabel="R" falselabel="U"></switchable-component>
      </div>
      <div class="flex-fill m-0 align-self-stretch p-0">
        <div
          class="position-relative flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center h-100"
        >
          <template
            v-if="
              !(
                (cards as PrimitiveType[])[index].info.datatype === 'Date' ||
                (cards as PrimitiveType[])[index].info.datatype === 'DateTime' ||
                (cards as PrimitiveType[])[index].info.datatype === 'Time' ||
                (cards as PrimitiveType[])[index].info.datatype === 'Year'
              )
            "
          >
            <div class="flex-fill m-0 h-100" style="padding: 0 2px">
              <input
                :tabindex="(accessibility.cardschildrentabindex as boolean[])[index] ? 0 : -1"
                type="text"
                class="w-100 align-middle h-100"
                v-model="
                  (
                    (cards as PrimitiveType[])[index] as
                      | NumberType
                      | SingleWordStringType
                      | NumberStringType
                      | MultipleWordsStringType
                  ).search.single
                "
              />
            </div>
          </template>
          <template
            v-if="
              !(
                (cards as PrimitiveType[])[index].info.datatype === 'Date' ||
                (cards as PrimitiveType[])[index].info.datatype === 'DateTime' ||
                (cards as PrimitiveType[])[index].info.datatype === 'Time' ||
                (cards as PrimitiveType[])[index].info.datatype === 'Year'
              )
            "
          >
            <div class="flex-w-1-dot-75-rem p-0 m-0 h-100" style="outline: 1px solid gray">
              <button 
                title="Search" 
                @click="
                  () => {
                    (accessibility.cardschildrentabindex as boolean[])[index] = true;
                    accessibility.updateAccessibility();
                  }
                " 
                @keyup.enter="
                  () => {
                    (accessibility.cardschildrentabindex as boolean[])[index] = true;
                    accessibility.updateAccessibility();
                  }
                " 
                :tabindex="(accessibility.cardschildrentabindex as boolean[])[index] ? 0 : -1" 
                class="s-search-btn h-100 m-0 cursor-pointer flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
              >
                <img
                  src="http://localhost:5175/src/components/icons/search.png"
                  style="width: 17px; height: 17px"
                  class="align-middle"
                />
              </button>
            </div>
            <div class="flex-w-1-dot-75-rem p-0 m-0 h-100" style="outline: 1px solid gray">
              <button
                title="Multiple"
                class="h-100 m-0 w-100 m-search-modal-opener-btn cursor-pointer flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
                @click="
                  () => {
                    (accessibility.cardschildrentabindex as boolean[])[index] = true;
                    (accessibility.cardsmultiplesearchopenstatus as boolean[])[index] = true;
                    accessibility.updateAccessibility();
                  }
                "
                @keyup.enter="
                  () => {
                    (accessibility.cardschildrentabindex as boolean[])[index] = true;
                    (accessibility.cardsmultiplesearchopenstatus as boolean[])[index] = true;
                    accessibility.updateAccessibility();
                  }
                "
                :tabindex="(accessibility.cardschildrentabindex as boolean[])[index] ? 0 : -1"
              >
                <img src="http://localhost:5175/src/components/icons/m.png" style="width: 17px; height: 17px" class="align-middle" />
              </button>
            </div>
          </template>
          <template v-else>
            <div class="flex-fill p-0 m-0 h-100" style="outline: 1px solid gray">
              <button 
                title="Search" 
                class="h-100 m-0 w-100 m-search-modal-opener-btn cursor-pointer flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100" 
                @click="
                  () => {
                    (accessibility.cardschildrentabindex as boolean[])[index] = true;
                    (accessibility.cardsmultiplesearchopenstatus as boolean[])[index] = true;
                    accessibility.updateAccessibility();
                  }
                " 
                @keyup.enter="
                  () => {
                    ;(accessibility.cardschildrentabindex as boolean[])[index] = true
                    ;(accessibility.cardsmultiplesearchopenstatus as boolean[])[index] = true
                    accessibility.updateAccessibility()
                  }
                " 
                :tabindex="(accessibility.cardschildrentabindex as boolean[])[index] ? 0 : -1"
              >
                <span class="flex-shrink-0 flex-grow-0" style="padding-right: 10px">
                  <img src="http://localhost:5175/src/components/icons/search.png" style="width: 17px; height: 17px" />
                </span>
                <span class="flex-shrink-0 flex-grow-0">
                  Open<span class="text-lowercase m-0" style="padding: 0 3px">{{
                    (cards as PrimitiveType[])[index].info.datatype
                  }}</span
                  >picker
                </span>
              </button>
            </div>
          </template>
          <div class="flex-w-1-dot-75-rem p-0 m-0 h-100" style="outline: 1px solid gray">
            <button
              @click="
                () => {
                  placeclick = true;
                  (accessibility.cardschildrentabindex as boolean[])[index] = true;
                  accessibility.updateAccessibility();
                }
              "
              @keyup.enter="
                () => {
                  placeclick = true;
                  (accessibility.cardschildrentabindex as boolean[])[index] = true;
                  accessibility.updateAccessibility();
                }
              "
              :tabindex="(accessibility.cardschildrentabindex as boolean[])[index] ? 0 : -1"
              class="s-search-btn h-100 m-0 cursor-pointer flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
              style="font-size: 0.9rem"
            >
              <img src="http://localhost:5175/src/components/icons/place.png" style="width: 20px; height: 20px" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <Teleport to="body">
      <template v-if="placeclick">
        <Transition name="modal">
          <div class="position-relative m-0 p-0 d-block h-100" aria-modal="true" role="dialog">
            <div class="position-fixed w-100 h-100 l-0 t-0 m-0 p-0 user-select-none">
              <div class="d-block position-relative m-0 p-0">
                <div
                  class="position-fixed w-100 l-0 t-0 m-0 p-0 shadow"
                  style="z-index: 1000; height: 4.08333rem; pointer-events: auto"
                ></div>
              </div>
              <div
                tabindex="-1"
                class="d-block vh-100 m-0"
                style="z-index: 980; padding: 4.08333rem 0 0 0 !important"
              >
                <div
                  class="d-block m-0 overflow-y-auto overflow-x-hidden h-100"
                  style="padding: 0.875rem 1.75rem important; z-index: 990; background-color: snow"
                >
                  <MapContainer></MapContainer>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </template>
      <template v-else>
        <template v-if="(accessibility.cardsmultiplesearchopenstatus as boolean[])[index]">
          <div class="d-block position-relative">
            <template v-if="(cards as PrimitiveType[])[index].info.datatype === 'Date'">
              <DateSearcherModal></DateSearcherModal>
            </template>
            <template
              v-else-if="
                (cards as PrimitiveType[])[index].info.datatype === 'MultipleWordsString' ||
                (cards as PrimitiveType[])[index].info.datatype === 'SingleWordString' ||
                (cards as PrimitiveType[])[index].info.datatype === 'NumberString'
              "
            >
              <MultipleSingleOrNumberStringWordSearcherModal></MultipleSingleOrNumberStringWordSearcherModal>
            </template>
            <template v-else-if="(cards as PrimitiveType[])[index].info.datatype === 'Number'">
              <NumberSearcherModal></NumberSearcherModal>
            </template>
          </div>
        </template>
      </template>
    </Teleport>
  </div>
</template>

<style scoped>
.m-search-modal-opener-btn,
.s-search-btn {
  border: none;
  outline: 1px solid gray;
}
.s-search-btn:hover,
.s-search-btn:focus,
.s-search-btn:active,
.m-search-modal-opener-btn:hover,
.m-search-modal-opener-btn:focus,
.m-search-modal-opener-btn:active {
  outline: 1px solid grey;
  background-color: grey;
}
</style>
