<script setup lang="ts">
import { type ShallowRef, shallowRef, onBeforeMount, ref, triggerRef, inject, nextTick } from 'vue'
import SearchByDDMMYYYYFormat from './SearchByDDMMYYYYFormat.vue'
import SearchByDaysMonthsYearsFormat from './SearchByDaysMonthsYearsFormat.vue'
import { format } from 'date-fns'
import type { DateType } from '../types/SupportedDatatypesTypeDeclaration'
import type { AccessibilityType } from '../types/accessibility'

let accessibility = inject('accessibility') as ShallowRef<AccessibilityType>,
  excludedates = ref<boolean>(),
  excludedatesignal = ref(0)

const index = inject('index') as number,
  holder = inject('cards') as ShallowRef<DateType[]>,
  cards = shallowRef<DateType[]>(),
  disableexcludebutton = ref(true)

function triggerCard() {
  nextTick(() => {
    triggerRef(cards)
  })
}

function updateExcludeDate(val: { action: boolean; format: 'RANGE' | 'MULTIPLE-OR-SINGLE' }) {
  excludedates.value = val.action
  ;((cards.value as DateType[])[index] as DateType).search.dd_mm_yyyy.format = val.format
  triggerCard()
  disableexcludebutton.value = true
}

onBeforeMount(() => {
  cards.value = JSON.parse(JSON.stringify(holder.value))
  triggerCard()
  excludedates.value = false
})
</script>

<template>
  <transition name="modal">
    <div class="position-fixed h-100 w-100 overflow-auto user-select-none" style="z-index: 1800">
      <div class="modal-mask h-100 w-100">
        <div class="modal-wrapper text-center">
          <div class="modal-container d-block">
            <div class="d-block" style="height: 36.855rem !important">
              <div
                class="position-relative flex-box flex-direction-row w-100 p-0 m-0 flex-nowrap justify-content-end align-items-center"
              >
                <div class="flex-fill" style="z-index: 860">
                  <div
                    style="
                      background-color: #fff;
                      padding: 0.63rem 0.315rem 0 0.315rem;
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
                          {{ (cards as DateType[])[index].info.name }}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="position-absolute flex-w-1-dot-75-rem" style="right: 5px; z-index: 900">
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
              <div class="d-block m-0 p-0">
                <div
                  class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center m-0"
                  style="padding: 0.504rem 0"
                >
                  <div class="flex-w-50 p-0 m-0 letter-spacing font-family">
                    Min:
                    {{
                      format(
                        new Date((cards as DateType[])[index].result.min),
                        ((cards as DateType[])[index] as DateType).dateFormat
                          .replace(/mmmm/g, 'MMMM')
                          .replace(/mmm/g, 'MMM')
                          .replace(/mm/g, 'MM')
                          .replace(/dddd/g, 'EEEE')
                          .replace(/ddd/g, 'EEE')
                      )
                    }}
                  </div>
                  <div class="flex-w-50 p-0 m-0 letter-spacing font-family">
                    Max:
                    {{
                      format(
                        new Date((cards as DateType[])[index].result.max),
                        ((cards as DateType[])[index] as DateType).dateFormat
                          .replace(/mmmm/g, 'MMMM')
                          .replace(/mmm/g, 'MMM')
                          .replace(/mm/g, 'MM')
                          .replace(/dddd/g, 'EEEE')
                          .replace(/ddd/g, 'EEE')
                      )
                    }}
                  </div>
                </div>
                <div
                  class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
                  style="border: 0.063rem solid gray"
                >
                  <div class="flex-w-50 align-self-stretch">
                    <a
                      @keypress.enter="
                        () => {
                          disableexcludebutton = true
                          excludedates = false
                          ;(((cards as DateType[])[index] as DateType).search.format as
                            | 'DD/MM/YYYY'
                            | 'Day(s), Month(s), Year(s)') = 'DD/MM/YYYY'
                          ;((cards as DateType[])[index] as DateType).search.dd_mm_yyyy.format =
                            'RANGE'
                          triggerCard()
                        }
                      "
                      @click="
                        () => {
                          disableexcludebutton = true
                          excludedates = false
                          ;(((cards as DateType[])[index] as DateType).search.format as
                            | 'DD/MM/YYYY'
                            | 'Day(s), Month(s), Year(s)') = 'DD/MM/YYYY'
                          ;((cards as DateType[])[index] as DateType).search.dd_mm_yyyy.format =
                            'RANGE'
                          triggerCard()
                        }
                      "
                      class="font-family date-format align-middle underline-none d-block cursor-pointer m-0"
                      style="outline: 0.063rem solid rgba(0, 0, 0, 0.2); padding: 0.126rem 0"
                      :style="
                        ((cards as DateType[])[index] as DateType).search.format === 'DD/MM/YYYY'
                          ? 'background-color:green;color: #fff;'
                          : 'background-color:gray;color: #fff;'
                      "
                    >
                      DD/MM/YYYY
                    </a>
                  </div>
                  <div class="flex-w-50 align-self-stretch">
                    <a
                      @keypress.enter="
                        () => {
                          disableexcludebutton = true
                          excludedates = false
                          ;(((cards as DateType[])[index] as DateType).search.format as
                            | 'DD/MM/YYYY'
                            | 'Day(s), Month(s), Year(s)') = 'Day(s), Month(s), Year(s)'
                          triggerCard()
                        }
                      "
                      @click="
                        () => {
                          disableexcludebutton = true
                          excludedates = false
                          ;(((cards as DateType[])[index] as DateType).search.format as
                            | 'DD/MM/YYYY'
                            | 'Day(s), Month(s), Year(s)') = 'Day(s), Month(s), Year(s)'
                          triggerCard()
                        }
                      "
                      class="font-family date-format align-middle underline-none d-block cursor-pointer m-0"
                      style="outline: 0.063rem solid rgba(0, 0, 0, 0.2); padding: 0.126rem 0"
                      :style="
                        (((cards as DateType[])[index] as DateType).search.format as
                          | 'DD/MM/YYYY'
                          | 'Day(s), Month(s), Year(s)') === 'Day(s), Month(s), Year(s)'
                          ? 'background-color:green;color: #fff;'
                          : 'background-color:gray;color: #fff;'
                      "
                    >
                      Day(s), Month(s), Year(s)
                    </a>
                  </div>
                </div>
                <div class="d-block">
                  <template
                    v-if="
                      (((cards as DateType[])[index] as DateType).search.format as
                        | 'DD/MM/YYYY'
                        | 'Day(s), Month(s), Year(s)') === 'DD/MM/YYYY'
                    "
                  >
                    <SearchByDDMMYYYYFormat
                      @enable:excludebutton="($val: boolean) => (disableexcludebutton = $val)"
                      :excludedates="excludedates as boolean"
                      @update:excludedates="($val: any) => updateExcludeDate($val)"
                    ></SearchByDDMMYYYYFormat>
                  </template>
                  <template v-else>
                    <SearchByDaysMonthsYearsFormat
                      @enable:excludebutton="($val: boolean) => (disableexcludebutton = $val)"
                      :excludedatesignal="excludedatesignal"
                    ></SearchByDaysMonthsYearsFormat>
                  </template>
                </div>
              </div>
            </div>
            <div
              style="padding: 0.63rem 0.63rem 0.756rem 0.63rem"
              class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center"
            >
              <div
                class="align-self-stretch"
                style="padding-right: 0.4725rem"
                :class="[
                  (((cards as DateType[])[index] as DateType).search.format === 'DD/MM/YYYY' &&
                    ((cards as DateType[])[index] as DateType).search.dd_mm_yyyy.format ===
                      'RANGE') ||
                  ((cards as DateType[])[index] as DateType).search.format ===
                    'Day(s), Month(s), Year(s)'
                    ? 'flex-w-100-over-3'
                    : 'flex-w-50'
                ]"
              >
                <button
                  class="btn shadow-sm w-100 font-family"
                  style="padding: 0.378rem; font-size: 1rem; color: #fff; background-color: gray"
                >
                  Search
                </button>
              </div>
              <template
                v-if="
                  (((cards as DateType[])[index] as DateType).search.format === 'DD/MM/YYYY' &&
                    ((cards as DateType[])[index] as DateType).search.dd_mm_yyyy.format ===
                      'RANGE') ||
                  ((cards as DateType[])[index] as DateType).search.format ===
                    'Day(s), Month(s), Year(s)'
                "
              >
                <div class="flex-w-100-over-3 align-self-stretch" style="padding-right: 0.1575rem">
                  <button
                    :style="
                      disableexcludebutton
                        ? 'background-color: #E8E8E8;color:gray;'
                        : 'color:#fff;background-color: blue;'
                    "
                    :aria-disabled="disableexcludebutton"
                    @click="
                      () => {
                        ;((cards as DateType[])[index] as DateType).search.format ===
                          'DD/MM/YYYY' &&
                        ((cards as DateType[])[index] as DateType).search.dd_mm_yyyy.format ===
                          'RANGE'
                          ? !disableexcludebutton
                            ? (excludedates = true)
                            : (excludedates = false)
                          : excludedatesignal++
                      }
                    "
                    @keypress.enter="
                      () => {
                        ;((cards as DateType[])[index] as DateType).search.format ===
                          'DD/MM/YYYY' &&
                        ((cards as DateType[])[index] as DateType).search.dd_mm_yyyy.format ===
                          'RANGE'
                          ? !disableexcludebutton
                            ? (excludedates = true)
                            : (excludedates = false)
                          : excludedatesignal++
                      }
                    "
                    class="btn shadow-sm w-100 font-family"
                    style="padding: 0.378rem; font-size: 1rem"
                  >
                    Exclude dates
                  </button>
                </div>
              </template>
              <div
                class="align-self-stretch"
                style="padding-left: 0.315rem"
                :class="[
                  (((cards as DateType[])[index] as DateType).search.format === 'DD/MM/YYYY' &&
                    ((cards as DateType[])[index] as DateType).search.dd_mm_yyyy.format ===
                      'RANGE') ||
                  ((cards as DateType[])[index] as DateType).search.format ===
                    'Day(s), Month(s), Year(s)'
                    ? 'flex-w-100-over-3'
                    : 'flex-w-50'
                ]"
              >
                <button
                  class="btn shadow-sm w-100 font-family"
                  style="padding: 0.378rem; font-size: 1rem; color: #fff; background-color: gray"
                >
                  Cancel
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
.date-format {
  background-color: #dcdcdc;
  color: black;
}
.date-format:hover {
  background-color: #17a2b8;
}
.modal-mask {
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
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
