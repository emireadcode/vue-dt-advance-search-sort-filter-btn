<script setup lang="ts">
import { provide, inject, type ShallowRef } from 'vue'
import AscDescOrMix from './AscDescOrMix.vue'
import FilterableResultDisplayer from './FilterableResultDisplayer.vue'
import SearchBar from './SearchBar.vue'
import type { PrimitiveType } from './types/SupportedDatatypesTypeDeclaration'

const props = defineProps<{
    index: number
  }>(),
  index = props.index,
  cards = inject('cards') as ShallowRef<PrimitiveType[]>
;
provide('index', index);
</script>

<template>
  <div
    class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center shadow-sm m-0"
    style="padding: 0.182291875rem 0"
  >
    <span
      :id="'info-' + cards[index].info.attribute"
      class="m-0 p-0 text-capitalize text-center letter-spacing font-bold font-0-dot-80-rem"
    >
      {{ cards[index].info.name }}
    </span>
  </div>
  <div class="d-block" style="padding: 0 0.583333333rem !important">
    <AscDescOrMix></AscDescOrMix>
    <SearchBar></SearchBar>
    <FilterableResultDisplayer></FilterableResultDisplayer>
  </div>
</template>
