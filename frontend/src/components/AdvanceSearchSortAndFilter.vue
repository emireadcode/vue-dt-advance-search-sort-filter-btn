<script setup lang="ts">
import { ref, shallowRef, onBeforeMount, provide } from 'vue'
import type {
  CardType,
  CardInnerType,
  DistinctRecordType,
  PrimitiveType,
  SingleWordConcatenatedType,
  KeyToNameMappingType,
  MultipleWordsStringConcatenatedType,
  DateFormat,
  TimeFormat
} from './types/SupportedDatatypesTypeDeclaration'
import AdvanceSearchSortAndFilterModal from './AdvanceSearchSortAndFilterModal.vue'
import { generateSearchSortAndFilterCards } from './helperfunctions/createcards'

const open = ref(false),
  props = defineProps<{
    config?: CardType<CardInnerType>;
    jsontypes?: CardInnerType[] | undefined;
    multiplewordsstringtypes?:
      | (CardInnerType & { 
        concatenated?: MultipleWordsStringConcatenatedType | undefined; 
        enableincludeandexcludesearch?: boolean | undefined; 
        hasfixedlengthof?: number | undefined;
        enableatnumbersearch?: boolean | undefined;
      })[]
      | undefined;
    datetypes?: (CardInnerType & DateFormat & { isoweek: boolean; })[] | undefined;
    numbertypes?: CardInnerType[] | undefined;
    keytonamemappingtypes?: (CardInnerType & KeyToNameMappingType)[] | undefined;
    datetimetypes?: (CardInnerType & DateFormat & TimeFormat & { isoweek: boolean; })[] | undefined;
    timetypes?: (CardInnerType & TimeFormat)[] | undefined;
    singlewordstringtypes?:
      | (CardInnerType & {
          concatenated?: SingleWordConcatenatedType | undefined;
          enableincludeandexcludesearch?: boolean | undefined;
          hasfixedlengthof?: number | undefined;
          enableatnumbersearch?: boolean | undefined;
        })[]
      | undefined;
    numberstringtypes?:
      | (CardInnerType & {
          concatenated?: SingleWordConcatenatedType | undefined;
          enableincludeandexcludesearch?: boolean | undefined;
          hasfixedlengthof?: number | undefined;
          enableatnumbersearch?: boolean | undefined;
        })[]
      | undefined;
    yeartypes?: CardInnerType[] | undefined;
  }>()
  ;
let cards = shallowRef<PrimitiveType[]>([]);

onBeforeMount(() => {
  fetch('http://localhost:8050/distinct-record', {
    method: 'POST',
    //credentials: "include", // send cookies
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    body: 'config=' + encodeURIComponent(JSON.stringify(props.config))
  })
    .then((res) => res.json())
    .then((json) => {
      cards.value = generateSearchSortAndFilterCards(
        props.config as CardType<CardInnerType>, 
        json as DistinctRecordType
      );
    })
    .catch((_err) => {
      console.log(_err)
    })
})

provide('cards', cards)
</script>

<template>
  <div class="d-block">
    <button v-if="!open && cards" @click="open = true" aria-haspopup="dialog">Open Modal</button>
    <template v-if="open">
      <Teleport to="body">
        <AdvanceSearchSortAndFilterModal
          @modal:close="($val: boolean) => (open = $val)"
        ></AdvanceSearchSortAndFilterModal>
      </Teleport>
    </template>
  </div>
</template>
