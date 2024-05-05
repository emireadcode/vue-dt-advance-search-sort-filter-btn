<script setup lang="ts">
import { shallowRef, inject, triggerRef, nextTick, type ShallowRef, onBeforeMount } from 'vue'
import type { KeyToNameType, PrimitiveType } from './types/SupportedDatatypesTypeDeclaration'
import PaginationBars from './searchbarmodals/PaginationBars.vue'
import type { AccessibilityType } from './types/accessibility'

const accessibility = inject('accessibility') as ShallowRef<AccessibilityType>,
  holder = inject('cards') as ShallowRef<PrimitiveType[]>,
  cards = shallowRef<PrimitiveType[]>(),
  index = inject('index') as number
onBeforeMount(() => {
  ;(cards.value as PrimitiveType[]) = JSON.parse(JSON.stringify(holder.value))
  triggerRef(cards)
})

function handleTabPress(e: KeyboardEvent) {
  nextTick(() => {
    if (e.shiftKey) {
      document.getElementById((cards.value as PrimitiveType[])[index].scroll.areaid)?.focus()
      e.preventDefault()
      e.stopPropagation()
    }
  })
}

function updateCurrent(val: number) {
  ;(cards.value as PrimitiveType[])[index].result.current = val
  triggerRef(cards)
}

function selectAllOrNot() {
  ;(cards.value as PrimitiveType[])[index].result.all = !(cards.value as PrimitiveType[])[index]
    .result.all
  triggerRef(cards)

  nextTick(() => {
    ;(cards.value as PrimitiveType[])[index].result.data.forEach((item) => {
      if ((cards.value as PrimitiveType[])[index].result.all) {
        if (!item.checked) {
          item.checked = (cards.value as PrimitiveType[])[index].result.all
          ;(cards.value as PrimitiveType[])[index].result.totalselection++
        }
      } else {
        if (item.checked) {
          item.checked = (cards.value as PrimitiveType[])[index].result.all
          ;(cards.value as PrimitiveType[])[index].result.totalselection--
        }
      }
    })
    triggerRef(cards)

    if ((accessibility.value.cardsfilteritemtabindex as boolean[])[index] === false) {
      ;(accessibility.value.cardsfilteritemtabindex as boolean[])[index] = true
      accessibility.value.updateAccessibility()
    }
  })
}

function handleSelection(i: number) {
  ;(cards.value as PrimitiveType[])[index].result.data[i].checked = !(
    cards.value as PrimitiveType[]
  )[index].result.data[i].checked
  triggerRef(cards)

  nextTick(() => {
    if ((cards.value as PrimitiveType[])[index].result.data[i].checked) {
      ;(cards.value as PrimitiveType[])[index].result.totalselection++
      if (
        (cards.value as PrimitiveType[])[index].result.totalselection ===
        (cards.value as PrimitiveType[])[index].result.data.length
      ) {
        ;(cards.value as PrimitiveType[])[index].result.all = true
      } else {
        ;(cards.value as PrimitiveType[])[index].result.all = false
      }
    } else {
      ;(cards.value as PrimitiveType[])[index].result.totalselection--
      ;(cards.value as PrimitiveType[])[index].result.all = false
    }
    triggerRef(cards)

    if ((accessibility.value.cardsfilteritemtabindex as boolean[])[index] === false) {
      ;(accessibility.value.cardsfilteritemtabindex as boolean[])[index] = true
      accessibility.value.updateAccessibility()
    }
  })
}
</script>

<template>
  <div class="d-block">
    <div class="d-block shadow-sm" style="z-index: 8000">
      <div
        class="m-0 p-0 flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
        style="height: 45px"
      >
        <div class="flex-w-1-dot-75-rem p-0 m-0 h-100" style="outline: 0.063rem solid gray">
          <button
            @click="
              () => {
                ;(accessibility.cardschildrentabindex as boolean[])[index] = true
                accessibility.updateAccessibility()
              }
            "
            @keyup.enter="
              () => {
                ;(accessibility.cardschildrentabindex as boolean[])[index] = true
                accessibility.updateAccessibility()
              }
            "
            :tabindex="(accessibility.cardschildrentabindex as boolean[])[index] ? 0 : -1"
            class="shadow-sm h-100 m-0 cursor-pointer flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
            style="padding: 2.5px 0; border: none"
          >
            <img
              src="http://localhost:5175/src/components/icons/horizontal.png"
              style="width: 20px; height: 20px"
              class="align-middle"
            />
          </button>
        </div>
        <div class="flex-w-1-dot-75-rem p-0 m-0 h-100" style="outline: 0.063rem solid gray">
          <button
            @click="
              () => {
                ;(accessibility.cardschildrentabindex as boolean[])[index] = true
                accessibility.updateAccessibility()
              }
            "
            @keyup.enter="
              () => {
                ;(accessibility.cardschildrentabindex as boolean[])[index] = true
                accessibility.updateAccessibility()
              }
            "
            :tabindex="(accessibility.cardschildrentabindex as boolean[])[index] ? 0 : -1"
            class="h-100 m-0 cursor-pointer flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
            style="padding: 2.5px 0; border: none"
          >
            <img
              src="http://localhost:5175/src/components/icons/vertical.png"
              style="width: 20px; height: 20px"
              class="align-middle"
            />
          </button>
        </div>
        <div class="flex-fill align-self-stretch m-0 p-0">
          <div class="d-block p-0 m-0" style="height: 40%; background-color: pink"></div>
          <div class="d-block p-0 m-0" style="height: 60%; background-color: yellow"></div>
        </div>
        <div class="flex-w-1-dot-75-rem p-0 m-0 h-100" style="outline: 0.063rem solid gray">
          <button
            @click="
              () => {
                ;(accessibility.cardschildrentabindex as boolean[])[index] = true
                accessibility.updateAccessibility()
              }
            "
            @keyup.enter="
              () => {
                ;(accessibility.cardschildrentabindex as boolean[])[index] = true
                accessibility.updateAccessibility()
              }
            "
            :tabindex="(accessibility.cardschildrentabindex as boolean[])[index] ? 0 : -1"
            class="h-100 m-0 cursor-pointer flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
            style="padding: 2.5px 0; border: none"
          >
            <img
              src="http://localhost:5175/src/components/icons/down-arrow.png"
              style="width: 17px; height: 17px"
              class="align-middle"
            />
          </button>
        </div>
        <div class="flex-w-1-dot-75-rem p-0 m-0 h-100" style="outline: 0.063rem solid gray">
          <button
            @click="
              () => {
                ;(accessibility.cardschildrentabindex as boolean[])[index] = true
                accessibility.updateAccessibility()
              }
            "
            @keyup.enter="
              () => {
                ;(accessibility.cardschildrentabindex as boolean[])[index] = true
                accessibility.updateAccessibility()
              }
            "
            :tabindex="(accessibility.cardschildrentabindex as boolean[])[index] ? 0 : -1"
            class="h-100 m-0 cursor-pointer flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
            style="padding: 2.5px 0; border: none"
          >
            <img
              src="http://localhost:5175/src/components/icons/up-arrow.png"
              style="width: 17px; height: 17px"
              class="align-middle"
            />
          </button>
        </div>
        <div class="flex-w-1-dot-75-rem p-0 m-0 h-100" style="outline: 0.063rem solid gray">
          <button
            @click="
              () => {
                ;(accessibility.cardschildrentabindex as boolean[])[index] = true
                accessibility.updateAccessibility()
              }
            "
            @keyup.enter="
              () => {
                ;(accessibility.cardschildrentabindex as boolean[])[index] = true
                accessibility.updateAccessibility()
              }
            "
            :tabindex="(accessibility.cardschildrentabindex as boolean[])[index] ? 0 : -1"
            class="s-search-btn h-100 m-0 cursor-pointer flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
            style="font-size: 0.9rem; border: none"
          >
            <img src="http://localhost:5175/src/components/icons/close.png" style="width: 20px; height: 20px" />
          </button>
        </div>
      </div>
      <div
        style="padding: 0 5px; height: 45px; border: 1px solid #e8e8e8"
        class="m-0 flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
      >
        <div class="flex-shrink-0 flex-grow-0">
          <input
            :tabindex="(accessibility.cardschildrentabindex as boolean[])[index] ? 0 : -1"
            @change="selectAllOrNot()"
            class="align-middle shadow-sm"
            type="checkbox"
            style="width: 15px; height: 15px"
            :checked="(cards as PrimitiveType[])[index].result.all ? true : false"
          />
        </div>
        <div class="flex-fill" style="padding-left: 10px">
          <template
            v-if="parseInt('' + (cards as PrimitiveType[])[index].result.data.length / 100) > 1"
          >
            <PaginationBars
              paginationarea="RESULT-DISPLAYER-VERTICAL"
              :currentandsignal="[
                (cards as PrimitiveType[])[index].result.signal,
                (cards as PrimitiveType[])[index].result.current
              ]"
              :length="parseInt('' + (cards as PrimitiveType[])[index].result.data.length / 100)"
              @update:current="($val: number) => updateCurrent($val)"
            ></PaginationBars>
          </template>
        </div>
      </div>
    </div>
    <div class="d-block position-relative" style="padding-top: 1px">
      <div
        :id="(cards as PrimitiveType[])[index].scroll.areaid"
        class="d-block overflow-y-auto overflow-x-hidden shadow-sm listbox"
        style="height: 16.625rem"
        @focus="
          () => {
            ;(accessibility.cardsfilteritemtabindex as boolean[])[index] = false
            accessibility.updateAccessibility()
          }
        "
        :tabindex="(accessibility.cardschildrentabindex as boolean[])[index] ? 0 : -1"
        @keyup.enter="
          () => {
            ;(accessibility.cardsfilteritemtabindex as boolean[])[index] = true
            accessibility.updateAccessibility()
          }
        "
        @click="
          () => {
            ;(accessibility.cardsfilteritemtabindex as boolean[])[index] = true
            accessibility.updateAccessibility()
          }
        "
      >
        <ul class="d-block list-style-none m-0" style="padding: 5px 0px">
          <li
            class="w-100"
            v-for="(data, dindex) in (cards as PrimitiveType[])[index].result.data"
            :key="(cards as PrimitiveType[])[index].scroll.areaid + '-jjj-' + dindex"
          >
            <template
              v-if="
                (cards as PrimitiveType[])[index].info.datatype === 'Date' ||
                (cards as PrimitiveType[])[index].info.datatype === 'DateTime' ||
                (cards as PrimitiveType[])[index].info.datatype === 'Number' ||
                (cards as PrimitiveType[])[index].info.datatype === 'Time' ||
                (cards as PrimitiveType[])[index].info.datatype === 'Year'
              "
            >
              <div
                class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                style="padding: 1px 5px"
              >
                <div class="flex-shrink-0 flex-grow-0">
                  <input
                    :tabindex="(accessibility.cardsfilteritemtabindex as boolean[])[index] ? 0 : -1"
                    @change="handleSelection(dindex)"
                    :checked="data.checked"
                    :id="(cards as PrimitiveType[])[index].scroll.areaid + 'jjj' + dindex"
                    class="align-middle shadow-sm"
                    type="checkbox"
                    :name="(cards as PrimitiveType[])[index].scroll.areaid"
                    style="width: 15px; height: 15px"
                  />
                </div>
                <div class="flex-fill" style="padding-left: 5px">
                  <div class="d-block" style="padding: 5px">
                    <div class="d-block text-wrap text-break shadow-sm" style="border-radius: 20px">
                      <template v-if="data.row !== null">
                        <label
                          tabindex="-1"
                          style="padding: 8px"
                          :for="(cards as PrimitiveType[])[index].scroll.areaid + 'jjj' + dindex"
                          class="d-block align-middle letter-spacing font-0-dot-875-rem h-100"
                        >
                          <template
                            v-if="(cards as PrimitiveType[])[index].info.datatype === 'DateTime'"
                          >
                            <div
                              class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                            >
                              <div class="flex-fill align-self-stretch">
                                {{ data.row.split('__O__')[0] }}
                              </div>
                              <div class="flex-grow-0 flex-shrink-0 align-self-stretch">
                                {{ data.row.split('__O__')[1] }}
                              </div>
                            </div>
                          </template>
                          <template v-else>
                            {{ data.row }}
                          </template>
                        </label>
                      </template>
                      <template v-else>
                        <label
                          tabindex="-1"
                          style="padding: 8px"
                          :for="(cards as PrimitiveType[])[index].scroll.areaid + 'jjj' + dindex"
                          class="d-block align-middle letter-spacing font-0-dot-875-rem h-100"
                        >
                          NO {{ (cards as PrimitiveType[])[index].info.name }}
                        </label>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div
                class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                style="padding: 1px 5px"
              >
                <div class="flex-shrink-0 flex-grow-0">
                  <input
                    :tabindex="(accessibility.cardsfilteritemtabindex as boolean[])[index] ? 0 : -1"
                    @change="handleSelection(dindex)"
                    :checked="data.checked"
                    :id="(cards as PrimitiveType[])[index].scroll.areaid + 'jjj' + dindex"
                    class="align-middle shadow-sm"
                    type="checkbox"
                    :name="(cards as PrimitiveType[])[index].scroll.areaid"
                    style="width: 15px; height: 15px"
                  />
                </div>
                <div class="flex-fill" style="padding-left: 5px">
                  <div class="d-block" style="padding: 5px">
                    <div class="d-block text-wrap text-break shadow-sm" style="border-radius: 20px">
                      <template v-if="data.row !== null && data.row.trim() !== ''">
                        <label
                          tabindex="-1"
                          style="padding: 8px"
                          :for="(cards as PrimitiveType[])[index].scroll.areaid + 'jjj' + dindex"
                          class="d-block align-middle letter-spacing font-0-dot-875-rem h-100"
                        >{{
                          (cards as PrimitiveType[])[index].info.datatype === 'KeyToName'? 
                            ((cards as PrimitiveType[])[index] as KeyToNameType).keytonamemapping[data.row]
                            :
                            data.row
                        }}
                        </label>
                      </template>
                      <template v-else>
                        <label
                          tabindex="-1"
                          style="padding: 8px"
                          :for="(cards as PrimitiveType[])[index].scroll.areaid + 'jjj' + dindex"
                          class="d-block align-middle letter-spacing font-0-dot-875-rem h-100"
                        >
                          NO {{ (cards as PrimitiveType[])[index].info.name }}
                        </label>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </li>
        </ul>
      </div>
    </div>
    <div class="d-block" style="padding: 0.63rem 0">
      <div
        class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center p-0 m-0"
      >
        <div class="flex-w-50 m-0 align-self-stretch" style="padding: 0 3px 0 0">
          <button
            :class="[
              (cards as PrimitiveType[])[index].result.totalselection === 0
                ? 'cursor-disabled'
                : 'cursor-pointer'
            ]"
            :style="
              (cards as PrimitiveType[])[index].result.totalselection === 0
                ? 'color:grey;opacity:0.6;'
                : 'color:black;opacity:1;'
            "
            :aria-disabled="
              (cards as PrimitiveType[])[index].result.totalselection === 0 ? true : false
            "
            class="btn m-0 flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center shadow-sm"
            style="border-radius: 10px; padding: 0.08rem 0"
            :tabindex="(accessibility.cardschildrentabindex as boolean[])[index] ? 0 : -1"
            @keydown.tab="handleTabPress($event)"
            @blur="
              () => {
                (accessibility.cardsfilteritemtabindex as boolean[])[index] = false;
                accessibility.updateAccessibility()
              }
            "
          >
            <img
              src="http://localhost:5175/src/components/icons/filter.png"
              style="height: 1.1667rem !important; width: 1.1667rem"
              class="align-middle"
            />
            <span class="font-bold letter-spacing font-0-dot-90-rem" style="padding-left: 0.2rem">
              Filter by selected
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type='checkbox'] {
  background-color: #fff;
  border: 1px solid black;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}
input[type='checkbox']:focus,
input[type='checkbox']:hover {
  background-color: #ccc;
  border: none;
}
input[type='checkbox']:checked {
  border: none;
  background-color: #2196f3;
  background: #2196f3
    url('data:image/gif;base64,R0lGODlhCwAKAIABAP////3cnSH5BAEKAAEALAAAAAALAAoAAAIUjH+AC73WHIsw0UCjglraO20PNhYAOw==')
    2px 2px no-repeat;
}
.listbox {
  outline: 1px solid transparent;
  border: none;
}
.listbox:focus {
  outline: 1px solid black;
}
</style>
