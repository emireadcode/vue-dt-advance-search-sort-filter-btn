<script setup lang="ts">
import { inject, type ShallowRef, triggerRef, } from "vue";
import type {
  MultipleWordsStringType, 
  NumberStringType,
  SingleWordStringType,
  MultipleWordsStringConcatenatedFieldType,
  SingleWordStringConcatenatedFieldType,
} from "../types/SupportedDatatypesTypeDeclaration";

const 
  emits = defineEmits<{
    (e: "disable:searchphraseinputbox", action: boolean): void;
  }>(),

  buttonnames = ['starts with', 'contains', 'equal to', 'ends with'],

  cards = inject("cards") as ShallowRef<(MultipleWordsStringType | SingleWordStringType | NumberStringType)[]>,

  index = inject("index") as number,

  concatfieldindex = inject("concatfieldindex") as number | undefined
;

function updateFormat(format: "STARTS-WITH" | "CONTAINS" | "ENDS-WITH" | "EQUAL-TO") {
  if(concatfieldindex === undefined) {
    cards.value[index].search.multiple.includeorexcludestartswithcontainsendswithequaltoformat = format;
  }
  else {
    ((cards.value[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[concatfieldindex as number].search as ({
      includeorexcludestartswithcontainsendswithequaltoformat: 'STARTS-WITH' | 'CONTAINS' | 'ENDS-WITH' | 'EQUAL-TO';
    })).includeorexcludestartswithcontainsendswithequaltoformat = format;
  }
  triggerRef(cards);
  emits(
    'disable:searchphraseinputbox',
    format==='STARTS-WITH'?
    true
    : (
      format==='CONTAINS'?
      false
      : (
        format==='ENDS-WITH'?
        true
        :
        true
      )
    )
  )
}

</script>

<template>
  <div class="d-block" style="padding: 7px 0px 15px 0px;">
    <ul class="list-style-none flex-box flex-direction-row w-100 p-0 m-0 flex-nowrap justify-content-start align-items-center">
      <li
        class="flex-w-25 align-self-stretch"
        v-for="(name, bindex) in buttonnames"
        :key="bindex + 'bn'"
      >
        <button
          :style="
            (
              (((concatfieldindex === undefined)? cards[index].search.multiple : (cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[concatfieldindex as number].search)?.includeorexcludestartswithcontainsendswithequaltoformat==='STARTS-WITH' && name==='starts with')
              ||
              (((concatfieldindex === undefined)? cards[index].search.multiple : (cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[concatfieldindex as number].search)?.includeorexcludestartswithcontainsendswithequaltoformat==='ENDS-WITH' && name==='ends with')
              ||
              (((concatfieldindex === undefined)? cards[index].search.multiple : (cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[concatfieldindex as number].search)?.includeorexcludestartswithcontainsendswithequaltoformat==='CONTAINS' && name==='contains')
              ||
              (((concatfieldindex === undefined)? cards[index].search.multiple : (cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[concatfieldindex as number].search)?.includeorexcludestartswithcontainsendswithequaltoformat==='EQUAL-TO' && name==='equal to')
            )?
              'background-color:#F0E68C;' 
              : 
              'background-color:lightgray;'
          "
          @keypress.enter="() => {
            name==='starts with'? updateFormat('STARTS-WITH')
            : (
              name==='ends with'? updateFormat('ENDS-WITH')
              : (
                name==='contains'? updateFormat('CONTAINS')
                : updateFormat('EQUAL-TO')
              )
            );
          }"
          @click="() => {
            name==='starts with'? updateFormat('STARTS-WITH')
            : (
              name==='ends with'? updateFormat('ENDS-WITH')
              : (
                name==='contains'? updateFormat('CONTAINS')
                : updateFormat('EQUAL-TO')
              )
            );
          }"
          class="text-lowercase tab w-100" 
          style="padding:5px;font-size:0.9em;border-top-right-radius: 8px;border-top-left-radius: 8px;"
        >
          {{ name }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.tab {
  border: none;
  outline: 1px solid gray;
}
</style>