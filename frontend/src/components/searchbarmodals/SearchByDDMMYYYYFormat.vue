<script setup lang="ts">
import VisibleCalendarDatePicker from './VisibleCalendarDatePicker.vue';
import { nextTick, inject, triggerRef, ref, onBeforeMount, type ShallowRef } from 'vue';
import PasteCopied from './PasteCopied.vue';
import type { DateType } from '../types/SupportedDatatypesTypeDeclaration';

const cards = inject('cards') as ShallowRef<DateType[]>,
  emits = defineEmits<{
    (e: 'enable:excludebutton', action: boolean): void
    (
      e: 'update:excludedates',
      action: { action: boolean; format: 'RANGE' | 'MULTIPLE-OR-SINGLE' }
    ): void
  }>(),
  selectionformat = ref<'RANGE' | 'MULTIPLE-OR-SINGLE'>(),
  index = inject('index') as number,
  props = defineProps<{
    excludedates: boolean
  }>(),
  resetcalendarsignal = ref(0)
;

function triggerCard() {
  nextTick(() => {
    triggerRef(cards)
  })
}

onBeforeMount(() => {
  selectionformat.value = cards.value[index].search.dd_mm_yyyy.format
})
</script>

<template>
  <div class="d-block" style="padding: 0 10px">
    <paste-copied
      pastearea="DATE-DATETIME-DD-MM-YYYY-AREA"
      :title="cards[index].info.name"
      :datatype="cards[index].info.datatype"
      :max="cards[index].result.max as string"
      :min="cards[index].result.min as string"
    >
      <template v-slot:outcomeidentifier>
        <div
          class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
        >
          <div class="flex-fill text-center">
            <div
              class="d-inline-block align-middle"
              style="background-color: #fff; width: 15px; height: 15px"
            ></div>
            Pasted Lines
          </div>
          <div class="flex-fill text-center">
            <div
              class="d-inline-block align-middle"
              style="background-color: red; width: 15px; height: 15px"
            ></div>
            Invalid Dates
          </div>
          <div class="flex-fill text-center">
            <div
              class="d-inline-block align-middle"
              style="background-color: yellow; width: 15px; height: 15px"
            ></div>
            Out of Range
          </div>
          <div class="flex-fill text-center">
            <div
              class="d-inline-block align-middle"
              style="background-color: pink; width: 15px; height: 15px"
            ></div>
            Indeterminate
          </div>
        </div>
      </template>
    </paste-copied>
    <div
      class="flex-box flex-direction-row flex-nowrap justify-content-start align-items-center w-100"
      style="border: 1px solid gray"
    >
      <div class="flex-w-50 align-self-stretch">
        <a
          @keypress.enter="
            () => {
              resetcalendarsignal++
              selectionformat = 'RANGE'
              emits('update:excludedates', { action: false, format: 'RANGE' })
            }
          "
          @click="
            () => {
              resetcalendarsignal++
              selectionformat = 'RANGE'
              emits('update:excludedates', { action: false, format: 'RANGE' })
            }
          "
          class="font-family letter-spacing cursor-pointer d-block underline-none"
          :style="
            selectionformat === 'RANGE' ? 'background-color:green;' : 'background-color:gray;'
          "
          style="color: #fff; padding: 2px 0"
        >
          Range
        </a>
      </div>
      <div class="flex-w-50 align-self-stretch">
        <a
          @keypress.enter="
            () => {
              resetcalendarsignal++
              selectionformat = 'MULTIPLE-OR-SINGLE'
              emits('update:excludedates', { action: false, format: 'MULTIPLE-OR-SINGLE' })
            }
          "
          @click="
            () => {
              resetcalendarsignal++
              selectionformat = 'MULTIPLE-OR-SINGLE'
              emits('update:excludedates', { action: false, format: 'MULTIPLE-OR-SINGLE' })
            }
          "
          class="font-family letter-spacing cursor-pointer d-block underline-none"
          :style="
            selectionformat === 'MULTIPLE-OR-SINGLE'
              ? 'background-color:green;'
              : 'background-color:gray;'
          "
          style="color: #fff; padding: 2px 0"
        >
          Multiple or Single
        </a>
      </div>
    </div>
    <div class="d-block" style="padding-bottom: 2px">
      <VisibleCalendarDatePicker
        :from="'DD-MM-YYYY'"
        @enable:excludebutton="($val: boolean) => emits('enable:excludebutton', $val)"
        :resetcalendarsignal="resetcalendarsignal"
        :selectionformat="selectionformat"
        :excludedates="props.excludedates"
        :isoweek="cards[index].isoweek"
        :selections="cards[index].search.dd_mm_yyyy.dates"
        :maxdate="cards[index].result.max as string"
        :mindate="cards[index].result.min as string"
        @update:selections="
          ($val: DateType['search']['dd_mm_yyyy']['dates']) => {
            cards[index].search.dd_mm_yyyy.dates = $val
            triggerCard()
          }
        "
      ></VisibleCalendarDatePicker>
    </div>
  </div>
</template>
