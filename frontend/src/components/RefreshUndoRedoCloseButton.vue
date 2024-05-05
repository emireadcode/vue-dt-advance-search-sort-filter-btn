<script setup lang="ts">
import { inject, type ShallowRef } from 'vue'
import {
  enableAllCardsTabIndex,
  disableAllCardsChildrenTabIndex,
  disableAllCardsFilterItemTabIndex
} from './helperfunctions/accessibility'
import type { AccessibilityType } from './types/accessibility'

const props = defineProps<{
    btnImgName: string
    btnTitle: 'Refresh' | 'Undo' | 'Redo' | 'Close'
  }>(),
  emits = defineEmits<{
    (e: 'modal:close', action: boolean): void
  }>(),
  accessibility = inject('accessibility') as ShallowRef<AccessibilityType>
function enableAllCardsTabIndexDisableAllCardsChildrenAndFilterableTabIndex() {
  disableAllCardsChildrenTabIndex(accessibility)
  disableAllCardsFilterItemTabIndex(accessibility)
  enableAllCardsTabIndex(accessibility)
}

function emitClose() {
  if (props.btnTitle === 'Close') {
    emits('modal:close', false)
  }
}
</script>

<template>
  <div class="d-inline-block align-middle">
    <button
      :tabindex="accessibility.refreshundoredoclosetabindex ? 0 : -1"
      aria-pressed="false"
      :aria-label="btnTitle"
      type="button"
      @keyup.enter="
        () => {
          enableAllCardsTabIndexDisableAllCardsChildrenAndFilterableTabIndex()
          emitClose()
        }
      "
      @click="
        () => {
          enableAllCardsTabIndexDisableAllCardsChildrenAndFilterableTabIndex()
          emitClose()
        }
      "
      @focus="enableAllCardsTabIndexDisableAllCardsChildrenAndFilterableTabIndex()"
      style="background-color: #fff"
      class="control-img-btn m-0 p-0 cursor-pointer"
      :title="btnTitle"
    >
      <img :src="'http://localhost:5175/src/components/icons/' + btnImgName" class="wh-1-dot-75-rem" />
    </button>
  </div>
</template>

<style scoped>
.control-img-btn {
  border: none;
  outline: none;
}
.control-img-btn:focus,
.control-img-btn:hover,
.control-img-btn:active {
  outline: 2px dashed blue;
}
</style>
