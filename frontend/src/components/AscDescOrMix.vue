<script setup lang="ts">
import { inject, onMounted, nextTick, triggerRef, type ShallowRef } from 'vue'
import type { PrimitiveType } from './types/SupportedDatatypesTypeDeclaration'
import { disableOtherCardsChildrenTabIndex } from './helperfunctions/accessibility'
import type { AccessibilityType } from './types/accessibility'

const cards = inject('cards') as ShallowRef<PrimitiveType[]>,
  accessibility = inject('accessibility') as ShallowRef<AccessibilityType>,
  index = inject('index') as number
onMounted(() => {
  setSortType(cards.value[index].sorttype, false)
})

function setSortType(sorttype: string, clicked: boolean) {
  cards.value[index].sorttype = sorttype
  triggerRef(cards)

  if (clicked) {
    ;(accessibility.value.cardschildrentabindex as boolean[])[index] = true
    accessibility.value.updateAccessibility()
    disableOtherCardsChildrenTabIndex(index, accessibility)
  }

  nextTick(() => {
    //change background colors of asc, desc, and mix buttons
    if (sorttype === 'ASC') {
      (
        document.querySelector(
          '#asc-btn-' + cards.value[index].info.attribute + '.sort-btn'
        ) as HTMLButtonElement
      ).style.backgroundColor = '#F0E68C';
      (
        document.querySelector(
          '#desc-btn-' + cards.value[index].info.attribute + '.sort-btn'
        ) as HTMLButtonElement
      ).style.backgroundColor = '#eee';
      (
        document.querySelector(
          '#mix-btn-' + cards.value[index].info.attribute + '.sort-btn'
        ) as HTMLButtonElement
      ).style.backgroundColor = '#eee';
    } else if (sorttype === 'DESC') {
      (
        document.querySelector(
          '#desc-btn-' + cards.value[index].info.attribute + '.sort-btn'
        ) as HTMLButtonElement
      ).style.backgroundColor = '#F0E68C';
      (
        document.querySelector(
          '#asc-btn-' + cards.value[index].info.attribute + '.sort-btn'
        ) as HTMLButtonElement
      ).style.backgroundColor = '#eee';
      (
        document.querySelector(
          '#mix-btn-' + cards.value[index].info.attribute + '.sort-btn'
        ) as HTMLButtonElement
      ).style.backgroundColor = '#eee';
    } else {
      (
        document.querySelector(
          '#mix-btn-' + cards.value[index].info.attribute + '.sort-btn'
        ) as HTMLButtonElement
      ).style.backgroundColor = '#F0E68C';
      (
        document.querySelector(
          '#desc-btn-' + cards.value[index].info.attribute + '.sort-btn'
        ) as HTMLButtonElement
      ).style.backgroundColor = '#eee';
      (
        document.querySelector(
          '#asc-btn-' + cards.value[index].info.attribute + '.sort-btn'
        ) as HTMLButtonElement
      ).style.backgroundColor = '#eee';
    }
  })
}
</script>

<template>
  <div
    class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
    style="padding: 0.656250749rem 0"
  >
    <div class="flex-w-100-over-3 m-0 align-self-stretch" style="padding: 0 2px 0 0">
      <button
        :id="'asc-btn-' + cards[index].info.attribute"
        aria-pressed="false"
        aria-label="Ascending"
        :tabindex="(accessibility.cardschildrentabindex as boolean[])[index] ? 0 : -1"
        @click="
          () => {
            (accessibility.cardschildrentabindex as boolean[])[index] = true;
            setSortType('ASC', true);
            accessibility.updateAccessibility();
          }
        "
        @keyup.enter="
          () => {
            (accessibility.cardschildrentabindex as boolean[])[index] = true;
            setSortType('ASC', true);
            accessibility.updateAccessibility();
          }
        "
        class="sort-btn m-0 flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center cursor-pointer shadow-sm"
      >
        <img
          :src="'http://localhost:5175/src/components/icons/' + cards[index].img.ascclicked"
          style="height: 1.1667rem !important; width: 1.1667rem"
        />
        <span 
          class="font-bold letter-spacing font-0-dot-80-rem" 
          style="padding-left: 0.175rem"
        >
          ASC
        </span>
      </button>
    </div>
    <div class="flex-w-100-over-3 m-0 align-self-stretch" style="padding: 0 2px">
      <button
        :id="'desc-btn-' + cards[index].info.attribute"
        aria-pressed="false"
        aria-label="Descending"
        :tabindex="(accessibility.cardschildrentabindex as boolean[])[index] ? 0 : -1"
        @click="
          () => {
            (accessibility.cardschildrentabindex as boolean[])[index] = true;
            setSortType('DESC', true);
            accessibility.updateAccessibility();
          }
        "
        @keyup.enter="
          () => {
            (accessibility.cardschildrentabindex as boolean[])[index] = true;
            setSortType('DESC', true);
            accessibility.updateAccessibility();
          }
        "
        class="sort-btn m-0 flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center cursor-pointer shadow-sm"
      >
        <img
          :src="'http://localhost:5175/src/components/icons/' + cards[index].img.descclicked"
          style="height: 1.1667rem !important; width: 1.1667rem"
        />
        <span 
          class="font-bold letter-spacing font-0-dot-80-rem" 
          style="padding-left: 0.175rem"
        >
          DESC
        </span>
      </button>
    </div>
    <div class="flex-w-100-over-3 m-0 align-self-stretch" style="padding: 0 0 0 2px">
      <button
        :id="'mix-btn-' + cards[index].info.attribute"
        aria-pressed="false"
        aria-label="No sorting"
        :tabindex="(accessibility.cardschildrentabindex as boolean[])[index] ? 0 : -1"
        @click="
          () => {
            (accessibility.cardschildrentabindex as boolean[])[index] = true;
            setSortType('MIX', true);
            accessibility.updateAccessibility();
          }
        "
        @keyup.enter="
          () => {
            (accessibility.cardschildrentabindex as boolean[])[index] = true;
            setSortType('MIX', true);
            accessibility.updateAccessibility();
          }
        "
        class="sort-btn m-0 flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center cursor-pointer shadow-sm"
      >
        <img
          :src="'http://localhost:5175/src/components/icons/' + cards[index].img.mixclicked"
          style="height: 1.1667rem !important; width: 1.1667rem !important"
        />
        <span 
          class="font-bold letter-spacing font-0-dot-80-rem" 
          style="padding-left: 0.175rem"
        >
          MIX
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.sort-btn {
  outline: 2px solid gray;
  border: none;
  background-color: #eee;
  border-radius: 10px;
  padding: 0.291667rem;
}

.sort-btn:hover,
.sort-btn:focus,
.sort-btn:active {
  outline: 2px solid blue;
  background-color: gray !important;
}
</style>
