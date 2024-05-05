<script setup lang="ts">
import {
  type ShallowRef,
  onBeforeMount,
  shallowRef,
  triggerRef,
  inject,
  ref,
  computed,
  provide
} from 'vue'
import type {
  NumberSearchExcludeEqualToType,
  NumberType
} from '../types/SupportedDatatypesTypeDeclaration'
import InclusiveNumberSearch from './InclusiveNumberSearch.vue'
import ExclusiveNumberSearch from './ExclusiveNumberSearch.vue'
import type { AccessibilityType } from '../types/accessibility'

const index = inject('index') as number,
  accessibility = inject('accessibility') as ShallowRef<AccessibilityType>,
  openatnumbersearchexcludenumberwindow = ref(false),
  cards = inject('cards') as ShallowRef<NumberType[]>,
  holder = shallowRef<NumberType['search']['multiple']>()
provide('numbersearchcard', holder)

function openExcludeWindow() {
  if (
    holder.value?.greaterthan ||
    holder.value?.lessthan ||
    (holder.value?.notequalto as NumberSearchExcludeEqualToType).pages.length > 0 ||
    holder.value?.notequalto?.single ||
    (holder.value?.fromto?.from && holder.value?.fromto?.to)
  ) {
    openatnumbersearchexcludenumberwindow.value = true
  }
}

const done = computed(() => {
  return (
    (parseFloat(holder.value?.greaterthan as string) < parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.greaterthan as string) >=
        parseFloat(cards.value[index].result.min)) ||
    (parseFloat(holder.value?.lessthan as string) < parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.lessthan as string) > parseFloat(cards.value[index].result.min)) ||
    (holder.value?.equalto as NumberSearchExcludeEqualToType).pages.length > 0 ||
    (parseFloat(holder.value?.equalto?.single as string) <
      parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.equalto?.single as string) >
        parseFloat(cards.value[index].result.min)) ||
    (holder.value?.notequalto as NumberSearchExcludeEqualToType).pages.length > 0 ||
    (parseFloat(holder.value?.notequalto?.single as string) <
      parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.notequalto?.single as string) >
        parseFloat(cards.value[index].result.min)) ||
    (parseFloat(holder.value?.fromto?.from as string) <
      parseFloat(holder.value?.fromto?.to as string) &&
      parseFloat(holder.value?.fromto?.from as string) <
        parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.fromto?.from as string) >
        parseFloat(cards.value[index].result.min) &&
      parseFloat(holder.value?.fromto?.to as string) < parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.fromto?.to as string) > parseFloat(cards.value[index].result.min))
  )
})

const exclude = computed(() => {
  return (
    (parseFloat(holder.value?.greaterthan as string) < parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.greaterthan as string) >=
        parseFloat(cards.value[index].result.min)) ||
    (parseFloat(holder.value?.lessthan as string) < parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.lessthan as string) > parseFloat(cards.value[index].result.min)) ||
    (parseFloat(holder.value?.fromto?.from as string) <
      parseFloat(holder.value?.fromto?.to as string) &&
      parseFloat(holder.value?.fromto?.from as string) <
        parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.fromto?.from as string) >
        parseFloat(cards.value[index].result.min) &&
      parseFloat(holder.value?.fromto?.to as string) < parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.fromto?.to as string) > parseFloat(cards.value[index].result.min))
  )
})

const clear = computed(() => {
  return (
    (parseFloat(holder.value?.greaterthan as string) < parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.greaterthan as string) >=
        parseFloat(cards.value[index].result.min)) ||
    (parseFloat(holder.value?.lessthan as string) < parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.lessthan as string) > parseFloat(cards.value[index].result.min)) ||
    (holder.value?.equalto as NumberSearchExcludeEqualToType).pages.length > 0 ||
    (parseFloat(holder.value?.equalto?.single as string) <
      parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.equalto?.single as string) >
        parseFloat(cards.value[index].result.min)) ||
    (holder.value?.notequalto as NumberSearchExcludeEqualToType).pages.length > 0 ||
    (parseFloat(holder.value?.notequalto?.single as string) <
      parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.notequalto?.single as string) >
        parseFloat(cards.value[index].result.min)) ||
    (parseFloat(holder.value?.fromto?.from as string) <
      parseFloat(holder.value?.fromto?.to as string) &&
      parseFloat(holder.value?.fromto?.from as string) <
        parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.fromto?.from as string) >
        parseFloat(cards.value[index].result.min) &&
      parseFloat(holder.value?.fromto?.to as string) < parseFloat(cards.value[index].result.max) &&
      parseFloat(holder.value?.fromto?.to as string) > parseFloat(cards.value[index].result.min))
  )
})

onBeforeMount(() => {
  holder.value = JSON.parse(
    JSON.stringify(cards.value[index].search.multiple)
  ) as NumberType['search']['multiple']
  triggerRef(holder)
})
</script>

<template>
  <transition name="modal">
    <div class="position-fixed h-100 w-100 overflow-auto user-select-none" style="z-index: 1800">
      <div class="modal-mask h-100 w-100 modal-mask-background">
        <div class="modal-wrapper text-center">
          <div class="modal-container d-block">
            <div class="d-block" style="height: 36.855rem !important">
              <div
                class="position-relative flex-box flex-direction-row w-100 p-0 m-0 flex-nowrap justify-content-center align-items-center"
              >
                <div class="flex-fill" style="z-index: 860">
                  <div
                    style="
                      background-color: #fff;
                      padding: 0.63rem 0.63rem 0 0.63rem;
                      white-space: nowrap;
                    "
                    class="shadow-sm d-block"
                  >
                    <ul
                      class="list-style-none flex-box flex-direction-row w-100 p-0 m-0 flex-nowrap justify-content-start align-items-center"
                    >
                      <li class="flex-shrink-0 flex-grow-0 align-self-stretch">
                        <div
                          class="text-lowercase tab m-0"
                          style="
                            padding: 0.315rem 1.89rem;
                            font-size: 1em;
                            background-color: #f0e68c;
                            border-top-right-radius: 0.504rem;
                            border-top-left-radius: 0.504rem;
                          "
                        >
                          {{ cards[index].info.name }}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div
                  class="position-absolute flex-w-1-dot-75-rem"
                  style="right: 10px; z-index: 900"
                >
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
                    <img
                      src="http://localhost:5175/src/components/icons/close.png"
                      style="width: 30px; height: 30px"
                      class="align-middle"
                    />
                  </a>
                </div>
              </div>
              <div class="d-block position-relative">
                <div
                  class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
                  style="padding: 0.504rem 0"
                >
                  <div class="flex-w-50">
                    <span class="d-inline-block p-0 m-0 letter-spacing align-middle">
                      Max:
                      {{ cards[index].result.max }}
                    </span>
                  </div>
                  <div class="flex-w-50">
                    <span class="d-inline-block p-0 m-0 letter-spacing align-middle">
                      Min:
                      {{ cards[index].result.min }}
                    </span>
                  </div>
                </div>
                <InclusiveNumberSearch from="NUMBER-SEARCHER-MODAL"></InclusiveNumberSearch>
                <template v-if="openatnumbersearchexcludenumberwindow">
                  <div
                    class="d-block"
                    style="padding: 0 5px; background-color: #f8f8f8; border-bottom: 2px solid blue"
                  >
                    <ExclusiveNumberSearch
                      @close:atnumbersearchexcludenumberwindow="
                        ($val: boolean) => (openatnumbersearchexcludenumberwindow = $val)
                      "
                      from="NUMBER-SEARCHER-MODAL"
                    ></ExclusiveNumberSearch>
                  </div>
                </template>
              </div>
            </div>
            <div
              class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
              style="padding: 0.63rem 0.63rem 0.756rem 0.63rem"
            >
              <div class="flex-w-100-over-3" style="padding-right: 0.4725rem">
                <button
                  :style="done ? 'background-color: #F0E68C;' : 'background-color: #eee;'"
                  :disabled="done ? false : true"
                  class="btn w-100 shadow-sm font-family"
                  style="padding: 0.378rem; font-size: 1rem; border-radius: 0.756rem"
                >
                  Search
                </button>
              </div>
              <div class="flex-w-100-over-3" style="padding-right: 0.1575rem">
                <button
                  @click="openExcludeWindow()"
                  @keypress.enter="openExcludeWindow()"
                  class="btn w-100 shadow-sm font-family"
                  style="padding: 0.378rem; font-size: 1rem; border-radius: 0.756rem"
                  :style="
                    exclude ? 'background-color: #2196F3;color:#fff;' : 'background-color:#eee;'
                  "
                  :disabled="exclude ? false : true"
                >
                  Exclude
                </button>
              </div>
              <div class="flex-w-100-over-3" style="padding-left: 0.315rem">
                <button
                  :disabled="clear ? false : true"
                  :style="clear ? 'background-color:red;color:#fff;' : 'background-color:#eee;'"
                  class="btn w-100 shadow-sm font-family"
                  style="padding: 0.378rem; font-size: 1rem; border-radius: 0.756rem"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-mask-background {
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-mask {
  top: 0;
  left: 0;
  display: table;
  transition: opacity 0.3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-container {
  margin: 0 auto;
  background-color: #f8f8f8;
  border-radius: 0.126rem;
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
  width: 34.65rem;
}
.modal-enter,
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
