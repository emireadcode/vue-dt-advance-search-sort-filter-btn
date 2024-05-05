<script setup lang="ts">
import {
  shallowRef,
  provide,
  inject,
  type ShallowRef,
  onBeforeMount,
  onMounted,
  triggerRef
} from 'vue'
import {
  enableAllCardsTabIndex,
  disableAllCardsChildrenTabIndex,
  disableAllCardsFilterItemTabIndex,
  disableOtherCardsChildrenTabIndex
} from './helperfunctions/accessibility'
import type { PrimitiveType } from './types/SupportedDatatypesTypeDeclaration'
import type { AccessibilityType } from './types/accessibility'
import RefreshUndoRedoCloseButton from './RefreshUndoRedoCloseButton.vue'
import CardComponent from './CardComponent.vue'

const emits = defineEmits<{
    (e: 'modal:close', action: boolean): void
  }>(),
  accessibility = shallowRef<AccessibilityType>({
    cardscontainerref: null,
    refreshundoredoclosetabindex: false,
    cardsref: [],
    cardstabindex: [],
    cardschildrentabindex: [],
    cardsmultiplesearchopenstatus: [],
    cardsfilteritemtabindex: [],
    updateAccessibility: () => {}
  })
;
accessibility.value.updateAccessibility = () => {
  triggerRef(accessibility)
}
triggerRef(accessibility)

let cards = inject('cards') as ShallowRef<PrimitiveType[]>

provide('accessibility', accessibility)

function enableAllCardsTabIndexAndDisableAllCardsChildrenAndFilterItemTabIndex() {
  enableAllCardsTabIndex(accessibility);
  disableAllCardsChildrenTabIndex(accessibility);
  disableAllCardsFilterItemTabIndex(accessibility);
}

function enableACardChildrenTabIndexAndDisableOtherCardsChildrenTabIndex(index: number) {
  (accessibility.value.cardschildrentabindex as boolean[])[index] = true;
  disableOtherCardsChildrenTabIndex(index, accessibility)
}

onMounted(() => {
  (accessibility.value.refreshundoredoclosecontainerref as HTMLDivElement).focus();
})

onBeforeMount(() => {
  accessibility.value.refreshundoredoclosetabindex = true;
  console.log(cards.value);
  for(let index=0; index<Object.keys(cards.value).length; index++) {
    (accessibility.value.cardstabindex as boolean[])[index] = false;
    (accessibility.value.cardschildrentabindex as boolean[])[index] = false;
    (accessibility.value.cardsmultiplesearchopenstatus as boolean[])[index] = false;
    (accessibility.value.cardsfilteritemtabindex as boolean[])[index] = false;
  }
  accessibility.value.updateAccessibility();
});
</script>

<template>
  <div class="position-relative m-0 p-0 d-block h-100" aria-modal="true" role="dialog">
    <div class="position-fixed w-100 h-100 l-0 t-0 m-0 p-0 user-select-none">
      <div class="d-block position-relative m-0 p-0">
        <div
          class="position-fixed w-100 l-0 t-0 m-0 p-0 shadow"
          style="z-index: 1000; height: 4.08333rem; pointer-events: auto"
        >
          <div
            tabindex="-1"
            :ref="(el) => (accessibility.refreshundoredoclosecontainerref = el as HTMLDivElement)"
            class="flex-box flex-direction-row w-100 h-100 flex-nowrap justify-content-center align-items-center p-0 m-0"
            @click.self="
              () => {
                accessibility.refreshundoredoclosecontainerref?.focus();
                accessibility.refreshundoredoclosetabindex = true;
                accessibility.updateAccessibility();
              }
            "
          >
            <div class="flex-w-25 align-self-stretch border-black text-center p-1">
              <RefreshUndoRedoCloseButton
                btn-img-name="refresh.png"
                btn-title="Refresh"
              ></RefreshUndoRedoCloseButton>
            </div>
            <div class="flex-w-25 align-self-stretch border-black text-center p-1">
              <RefreshUndoRedoCloseButton
                btn-img-name="undo.png"
                btn-title="Undo"
              ></RefreshUndoRedoCloseButton>
            </div>
            <div class="flex-w-25 align-self-stretch border-black text-center p-1">
              <RefreshUndoRedoCloseButton
                btn-img-name="redo.png"
                btn-title="Redo"
              ></RefreshUndoRedoCloseButton>
            </div>
            <div class="flex-w-25 align-self-stretch border-black text-center p-1">
              <RefreshUndoRedoCloseButton
                @modal:close="($val: boolean) => emits('modal:close', $val)"
                btn-img-name="close.png"
                btn-title="Close"
              ></RefreshUndoRedoCloseButton>
            </div>
          </div>
        </div>
      </div>
      <div
        tabindex="-1"
        class="d-block vh-100 m-0"
        style="z-index: 980; padding: 4.08333rem 0 0 0 !important"
      >
        <div
          tabindex="-1"
          :ref="(el) => (accessibility.cardscontainerref = el as HTMLDivElement)"
          @click.self="
            () => {
              (accessibility.cardscontainerref as HTMLDivElement).focus();
              enableAllCardsTabIndexAndDisableAllCardsChildrenAndFilterItemTabIndex();
            }
          "
          class="d-block m-0 overflow-y-auto overflow-x-hidden h-100"
          style="padding: 0.875rem 1.75rem important; z-index: 990; background-color: snow"
        >
          <div
            tabindex="-1"
            @click.self="
              () => {
                (accessibility.cardscontainerref as HTMLDivElement).focus();
                enableAllCardsTabIndexAndDisableAllCardsChildrenAndFilterItemTabIndex();
              }
            "
            class="d-block"
            style="height: auto !important; padding: 0.875rem 0 !important"
          >
            <ul
              tabindex="-1"
              @click.self="
                () => {
                  (accessibility.cardscontainerref as HTMLDivElement).focus();
                  enableAllCardsTabIndexAndDisableAllCardsChildrenAndFilterItemTabIndex();
                }
              "
              id="card-container"
              class="flex-box flex-direction-row w-100 flex-wrap align-items-center justify-content-start list-style-none m-0 p-0"
            >
              <li
                tabindex="-1"
                @click.self="
                  () => {
                    (accessibility.cardscontainerref as HTMLDivElement).focus();
                    enableAllCardsTabIndexAndDisableAllCardsChildrenAndFilterItemTabIndex();
                  }
                "
                v-for="(card, index) in cards"
                :key="index"
                class="flex-w-100-over-3 m-0"
                style="padding: 0.875rem !important; min-width: 26.25rem !important"
              >
                <div
                  :tabindex="(accessibility.cardstabindex as boolean[])[index] ? 0 : -1"
                  :aria-describedby="'info-' + card.info.attribute"
                  @focus.self="
                    () => {
                      (accessibility.cardsref as HTMLDivElement[])[index].focus();
                      enableAllCardsTabIndexAndDisableAllCardsChildrenAndFilterItemTabIndex();
                    }
                  "
                  @click="
                    () => {
                      enableACardChildrenTabIndexAndDisableOtherCardsChildrenTabIndex(index)
                    }
                  "
                  @keyup.enter="
                    () => {
                      enableACardChildrenTabIndexAndDisableOtherCardsChildrenTabIndex(index)
                    }
                  "
                  :ref="
                    (el) =>
                      ((accessibility.cardsref as HTMLDivElement[])[index] = el as HTMLDivElement)
                  "
                  class="d-block shadow card"
                  style="background-color: white"
                >
                  <card-component :index="index"></card-component>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.p-1 {
  padding-top: 1.108333rem !important;
  padding-bottom: 1.108333rem !important;
}
.card {
  border: 2px solid transparent;
  outline: none;
}
.card:focus {
  border: 2px solid black;
  outline: none;
}
</style>
