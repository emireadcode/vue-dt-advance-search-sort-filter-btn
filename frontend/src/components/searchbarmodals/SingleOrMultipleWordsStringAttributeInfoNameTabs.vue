<script setup lang="ts">
import type {
  SingleWordStringConcatenatedFieldType,
  SingleWordStringType,
  MultipleWordsStringType,
  MultipleWordsStringConcatenatedFieldType,
  NumberStringType
} from '../types/SupportedDatatypesTypeDeclaration'
import { inject, triggerRef, type ShallowRef, onMounted } from 'vue'
import type { AccessibilityType } from '../types/accessibility'

const accessibility = inject('accessibility') as ShallowRef<AccessibilityType>,
  index = inject('index') as number,
  cards = inject('cards') as ShallowRef<
    (MultipleWordsStringType | SingleWordStringType | NumberStringType)[]
  >
function updateAttributeButtonTabClicked(bindex?: number | undefined) {
  if (cards.value[index].concatenated !== undefined) {
    Object.values(
      cards.value[index].concatenated as
        | MultipleWordsStringConcatenatedFieldType
        | SingleWordStringConcatenatedFieldType
    ).forEach((concatenated, i) => {
      if ('' + (bindex as number) === '' + i) {
        ;(concatenated.search as { tabclicked: boolean }).tabclicked = true
        if (
          concatenated.enableincludeandexcludesearch !== undefined &&
          concatenated.enableincludeandexcludesearch === true
        ) {
          ;(
            concatenated.search as {
              includeorexcludestartswithcontainsendswithequaltoformat:
                | 'STARTS-WITH'
                | 'CONTAINS'
                | 'ENDS-WITH'
                | 'EQUAL-TO'
            }
          ).includeorexcludestartswithcontainsendswithequaltoformat = 'STARTS-WITH'
          ;(
            concatenated.search as { includeorexcludeformat: 'INCLUDE' | 'EXCLUDE' | '@NUMBER' }
          ).includeorexcludeformat = 'INCLUDE'
        }
      } else {
        ;(concatenated.search as { tabclicked: boolean }).tabclicked = false
      }
    })
  }
  triggerRef(cards)
}

function setTabDefaultSelection() {
  if (!cards.value[index].concatenated) {
    cards.value[index].search.multiple.tabclicked = true
    if (
      cards.value[index].enableincludeandexcludesearch !== undefined &&
      cards.value[index].enableincludeandexcludesearch === true
    ) {
      cards.value[index].search.multiple.includeorexcludestartswithcontainsendswithequaltoformat =
        'STARTS-WITH'
      cards.value[index].search.multiple.includeorexcludeformat = 'INCLUDE'
    }
  } else {
    Object.values(
      cards.value[index].concatenated as
        | MultipleWordsStringConcatenatedFieldType
        | SingleWordStringConcatenatedFieldType
    ).forEach((concatenated, i) => {
      if (i === 0) {
        ;(concatenated.search as { tabclicked: boolean }).tabclicked = true
      } else {
        ;(concatenated.search as { tabclicked: boolean }).tabclicked = false
      }
      if (
        concatenated.enableincludeandexcludesearch !== undefined &&
        concatenated.enableincludeandexcludesearch === true
      ) {
        ;(
          concatenated.search as {
            includeorexcludestartswithcontainsendswithequaltoformat:
              | 'STARTS-WITH'
              | 'CONTAINS'
              | 'ENDS-WITH'
              | 'EQUAL-TO'
          }
        ).includeorexcludestartswithcontainsendswithequaltoformat = 'STARTS-WITH'
        ;(
          concatenated.search as { includeorexcludeformat: 'INCLUDE' | 'EXCLUDE' | '@NUMBER' }
        ).includeorexcludeformat = 'INCLUDE'
      }
    })
  }
  triggerRef(cards)
}

function setConcatenatedTabClicked(cindex: number) {
  ;(
    (
      cards.value[index].concatenated as
        | MultipleWordsStringConcatenatedFieldType
        | SingleWordStringConcatenatedFieldType
    )[cindex].search as { tabclicked: boolean }
  ).tabclicked = true
  triggerRef(cards)
  updateAttributeButtonTabClicked(cindex)
}

onMounted(() => {
  setTabDefaultSelection()
})
</script>

<template>
  <div
    class="position-relative flex-box flex-direction-row w-100 p-0 m-0 flex-nowrap justify-content-end align-items-center"
  >
    <div class="flex-fill" style="z-index: 860">
      <div
        style="background-color: #fff; padding: 10px 0.5rem 0 0.5rem; white-space: nowrap"
        class="shadow-sm d-block overflow-x-auto"
      >
        <template v-if="!(cards[index] as MultipleWordsStringType).concatenated">
          <ul
            class="list-style-none flex-box flex-direction-row w-100 p-0 m-0 flex-nowrap justify-content-start align-items-center"
          >
            <li class="flex-shrink-0 flex-grow-0 align-self-stretch">
              <button
                aria-disabled="true"
                class="text-lowercase tab"
                style="
                  padding: 5px 8px;
                  font-size: 1em;
                  background-color: #f0e68c;
                  border-top-right-radius: 8px;
                  border-top-left-radius: 8px;
                "
              >
                {{ (cards[index] as MultipleWordsStringType).info.name }}
              </button>
            </li>
          </ul>
        </template>
        <template v-else>
          <ul
            class="list-style-none flex-box flex-direction-row w-100 p-0 m-0 flex-nowrap justify-content-start align-items-center"
          >
            <li
              v-for="(concatenated, cindex) in (cards[index] as MultipleWordsStringType)
                .concatenated"
              class="flex-shrink-0 flex-grow-0 align-self-stretch"
              :key="cindex + 'll-aaa-a'"
            >
              <button
                :style="
                  concatenated.search?.tabclicked
                    ? 'background-color:#F0E68C;'
                    : 'background-color:lightgray;'
                "
                @keypress.enter="setConcatenatedTabClicked(parseInt('' + cindex) as number)"
                @click="setConcatenatedTabClicked(parseInt('' + cindex) as number)"
                class="text-lowercase tab"
                style="
                  padding: 5px 8px;
                  font-size: 1em;
                  border-top-right-radius: 8px;
                  border-top-left-radius: 8px;
                "
              >
                {{ concatenated.name }}
              </button>
            </li>
          </ul>
        </template>
      </div>
    </div>
    <div class="position-absolute flex-w-1-dot-75-rem" style="right: 10px; z-index: 900">
      <a
        class="d-block underline-none m-0 p-0 cursor-pointer"
        @keypress.enter="
          () => {
            ;(accessibility.cardsmultiplesearchopenstatus as boolean[])[index] = false
            accessibility.updateAccessibility()
          }
        "
        @click="
          () => {
            ;(accessibility.cardsmultiplesearchopenstatus as boolean[])[index] = false
            accessibility.updateAccessibility()
          }
        "
      >
        <img src="http://localhost:5175/src/components/icons/close.png" style="width: 30px; height: 30px" class="align-middle" />
      </a>
    </div>
  </div>
</template>

<style scoped>
.tab {
  border: none;
  outline: 1px solid gray;
}
</style>
