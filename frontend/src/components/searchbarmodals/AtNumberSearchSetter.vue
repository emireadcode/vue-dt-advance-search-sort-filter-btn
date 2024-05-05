<script setup lang="ts">
import { nextTick, computed, triggerRef, ref, inject, type ShallowRef } from 'vue'
import type {
  NumberSearchType,
  AtNumber,
  SingleWordStringType,
  NumberStringType
} from '../types/SupportedDatatypesTypeDeclaration'

defineProps<{
  from?: 'TABPANELWITHINCLUDEANDEXCLUDE' | undefined
}>()

const holder = inject('numbersearchcard') as ShallowRef<AtNumber<NumberSearchType>>,
  index = inject('index') as number,
  emits = defineEmits<{
    (e: 'open:atnumbersearchwindow', action: boolean): void
    (e: 'enable:atnumbersearchwindowopenerbutton', action: boolean): void
  }>(),
  thematchref = ref<HTMLInputElement>(),
  fromthispattern = ref<string>(),
  cards = inject('cards') as ShallowRef<(SingleWordStringType | NumberStringType)[]>
function addMatchAndPattern() {
  nextTick(() => {
    if (
      (thematchref.value as HTMLInputElement) !== undefined &&
      /^\s*\d+\s*$/g.test((thematchref.value as HTMLInputElement).value as string) &&
      fromthispattern.value !== undefined &&
      (fromthispattern.value as string).length <= 40 &&
      (fromthispattern.value as string).length > 0 &&
      /\d+ns/g.test(fromthispattern.value as string)
    ) {
      if (holder.value.thematchfromthispattern.length === 0) {
        holder.value.thematchfromthispattern = [
          {
            thematch: (thematchref.value as HTMLInputElement).value as string,
            fromthispattern: fromthispattern.value as string
          }
        ]
      } else {
        holder.value.thematchfromthispattern = [
          ...holder.value.thematchfromthispattern,
          {
            thematch: (thematchref.value as HTMLInputElement).value,
            fromthispattern: fromthispattern.value as string
          }
        ]
      }
      triggerRef(holder)
      fromthispattern.value = ''
      ;(thematchref.value as HTMLInputElement).value = '0'
    }
  })
}
function checkWhetherToEnableExclude() {
  if (
    (holder.value.search.fromto.from.trim().length > 0 &&
      holder.value.search.fromto.to.trim().length > 0 &&
      /^\s*\d+(\.\d+)?\s*$/g.test(holder.value.search.fromto.from) &&
      /^\s*\d+(\.\d+)?\s*$/g.test(holder.value.search.fromto.to) &&
      parseFloat(holder.value.search.fromto.from) < parseFloat(holder.value.search.fromto.to)) ||
    (holder.value.search.greaterthan.trim().length > 0 &&
      /^\s*\d+(\.\d+)?\s*$/g.test(holder.value.search.greaterthan)) ||
    (holder.value.search.lessthan.trim().length > 0 &&
      /^\s*\d+(\.\d+)?\s*$/g.test(holder.value.search.lessthan))
  ) {
    emits('enable:atnumbersearchwindowopenerbutton', false)
  }
}

let addnewpatternguard = computed(() => {
  return (
    (thematchref.value as HTMLInputElement) !== undefined &&
    /^\s*\d+\s*$/g.test((thematchref.value as HTMLInputElement).value as string) &&
    fromthispattern.value !== undefined &&
    (fromthispattern.value as string).length <= 40 &&
    (fromthispattern.value as string).length > 0 &&
    /\d+ns/g.test(fromthispattern.value as string)
  )
})
</script>

<template>
  <div class="d-block">
    <div class="d-block" style="padding: 0px 0.5rem 8px 0.5rem">
      <div
        class="flex-box flex-direction-row w-100 h-100 p-0 m-0 flex-nowrap justify-content-center align-items-center"
      >
        <div class="flex-fill align-self-stretch">
          <button
            @click="
              () => {
                emits('open:atnumbersearchwindow', true)
                checkWhetherToEnableExclude()
              }
            "
            @keypress.enter="
              () => {
                emits('open:atnumbersearchwindow', true)
                checkWhetherToEnableExclude()
              }
            "
            class="btn w-100 shadow-sm"
            style="padding: 5px"
          >
            Open @Number Picker
          </button>
        </div>
        <slot name="closeatnumbersearch"></slot>
      </div>
    </div>
    <div
      class="d-block"
      style="padding: 5px 0.5rem 10px 0.5rem"
      :style="
        from !== undefined && from === 'TABPANELWITHINCLUDEANDEXCLUDE'
          ? 'height: 80px;'
          : 'height:90px;'
      "
    >
      <div
        class="shadow-sm flex-box flex-direction-row w-100 h-100 p-0 m-0 flex-nowrap justify-content-center align-items-center"
        style="background-color: #e8e8e8"
      >
        <div class="flex-fill">
          {{ cards[index].result.data.length > 0 ? cards[index].result.data[0].row : 'No Data' }}
        </div>
      </div>
    </div>
    <div class="d-block" style="padding: 5px 0.5rem 5px 0.5rem">
      <div
        class="flex-box flex-direction-row w-100 p-0 m-0 flex-nowrap justify-content-center align-items-center"
      >
        <div class="flex-fill align-self-stretch" style="padding-right: 5px">
          <div
            style="padding: 5px 0; font-size: 0.9rem"
            class="shadow-sm flex-box flex-direction-row w-100 m-0 flex-nowrap justify-content-center align-items-center"
          >
            last
            <div class="flex-shrink-0 flex-grow-0" style="padding: 0 10px">
              <input
                type="number"
                min="0"
                value="0"
                style="
                  background-color: #ffff99;
                  height: 32px;
                  width: 100px;
                  border: none;
                  outline: 0.063rem solid black;
                "
              />
            </div>
            digits
          </div>
        </div>
        <div class="flex-fill align-self-stretch" style="padding-left: 5px">
          <div
            style="padding: 5px 0; font-size: 0.9rem"
            class="shadow-sm flex-box flex-direction-row w-100 m-0 flex-nowrap justify-content-center align-items-center"
          >
            first
            <div class="flex-shrink-0 flex-grow-0" style="padding: 0 10px">
              <input
                type="number"
                min="0"
                value="0"
                style="
                  background-color: #ffff99;
                  height: 32px;
                  width: 100px;
                  border: none;
                  outline: 0.063rem solid black;
                "
              />
            </div>
            digits
          </div>
        </div>
      </div>
      <div
        class="flex-box flex-direction-row w-100 p-0 m-0 flex-nowrap justify-content-center align-items-center"
      >
        <div class="flex-fill align-self-stretch" style="padding: 13px 0">
          <div
            style="padding: 5px 0; font-size: 0.9rem"
            class="shadow-sm flex-box flex-direction-row w-100 m-0 flex-nowrap justify-content-center align-items-center"
          >
            the
            <div class="flex-shrink-0 flex-grow-0" style="padding: 0 10px">
              <input
                type="number"
                min="0"
                value="0"
                style="
                  background-color: #ffff99;
                  height: 32px;
                  width: 100px;
                  border: none;
                  outline: 0.063rem solid black;
                "
              />
            </div>
            digits, before the last
            <div class="flex-shrink-0 flex-grow-0" style="padding: 0 10px">
              <input
                type="number"
                min="0"
                value="0"
                style="height: 32px; width: 100px; border: none; outline: 0.063rem solid black"
              />
            </div>
            characters
          </div>
        </div>
      </div>
      <div
        class="flex-box flex-direction-row w-100 p-0 m-0 flex-nowrap justify-content-center align-items-center"
      >
        <div class="flex-fill align-self-stretch" style="padding: 0 0 13px 0">
          <div
            style="padding: 5px 0; font-size: 0.9rem"
            class="shadow-sm flex-box flex-direction-row w-100 m-0 flex-nowrap justify-content-center align-items-center"
          >
            after the first
            <div class="flex-shrink-0 flex-grow-0" style="padding: 0 10px">
              <input
                type="number"
                min="0"
                value="0"
                style="height: 32px; width: 100px; border: none; outline: 0.063rem solid black"
              />
            </div>
            characters, the next
            <div class="flex-shrink-0 flex-grow-0" style="padding: 0 10px">
              <input
                type="number"
                min="0"
                value="0"
                style="
                  background-color: #ffff99;
                  height: 32px;
                  width: 100px;
                  border: none;
                  outline: 0.063rem solid black;
                "
              />
            </div>
            digits
          </div>
        </div>
      </div>
      <div class="d-block shadow-sm" style="padding: 6px">
        <div
          style="font-size: 0.9rem; padding: 0 0 8px 0"
          class="flex-box flex-direction-row w-100 m-0 flex-nowrap justify-content-center align-items-center"
        >
          the
          <div class="flex-shrink-0 flex-grow-0" style="padding: 0 10px">
            <input
              :ref="(el) => (thematchref = el as HTMLInputElement)"
              type="number"
              min="0"
              value="0"
              style="
                background-color: #ffff99;
                height: 32px;
                width: 60px;
                border: none;
                outline: 0.063rem solid black;
              "
            />
          </div>
          match from this
          <div class="flex-shrink-0 flex-grow-0" style="padding: 0 10px">
            <input
              v-model="fromthispattern"
              type="text"
              style="height: 32px; width: 230px; border: none; outline: 0.063rem solid black"
            />
          </div>
          pattern
        </div>
        <div class="d-block" style="padding: 4px 0">
          <button
            @click="addMatchAndPattern()"
            @keypress.enter="addMatchAndPattern()"
            class="btn w-100 shadow-sm"
            style="padding: 5px"
            :style="
              addnewpatternguard
                ? 'background-color: blue; color: #fff;'
                : 'background-color:#B8B8B8;color:gray;'
            "
            :disabled="addnewpatternguard ? false : true"
          >
            Add New Match and Pattern
          </button>
        </div>
      </div>
      <!--
      
      <table class="w-100 text-center m-0 p-0">
        <tr class="w-100" style="border:1px solid gray;">
          <th style="width:20%;border:1px solid gray;">Match</th>
          <th style="width:80%;border:1px solid gray;">Pattern</th>
        </tr>
        <tr v-for="(matchandpattern, index) in holder.thematchfromthispattern" class="w-100" style="border:1px solid gray;" :style="((index as number)%2===0)?'background-color:#E8E8E8;' : 'background-color:#fff;'">
          <td style="width:20%;border:1px solid gray;">{{matchandpattern.thematch}}</td>
          <td style="width:80%;border:1px solid gray;">{{matchandpattern.fromthispattern}}</td>
        </tr>
      </table>
      <div class="d-block" style="padding:8px 2px;">
        <span style="font-size:0.7rem;">
          please note! patterns must not be more than 40 characters
          <span style="padding: 0 5px;">
            <button class="btn shadow-sm" style="font-size:0.7rem;padding:4px 6px;background-color:green;color:#fff;">
              Read more about pattern
            </button>
          </span>
        </span>
      </div>

      -->
    </div>
  </div>
</template>
