<script setup lang="ts">
import { 
  type WatchStopHandle, 
  watch,
  ref, 
  computed, 
  triggerRef,
  shallowRef,
  provide,
  inject, 
  type ShallowRef, 
  onBeforeMount, 
  onBeforeUnmount 
} from "vue";
import type {
  NumberStringType,
  SingleWordStringType,
  MultipleWordsStringType,
  MultipleWordsStringConcatenatedFieldType,
  StringSearchType,
  SingleWordStringConcatenatedFieldType,
} from "../types/SupportedDatatypesTypeDeclaration";
import DescribeLabel from "./DescribeLabel.vue";
import PasteCopied from "./PasteCopied.vue";
import { addNewInputEntry } from "../helperfunctions/addnewlypastedandnewinputentry";
import PastedItemAndNewlyInputedEntryDisplayer from "./PastedItemAndNewlyInputedEntryDisplayer.vue";
import InclusiveNumberSearch from "./InclusiveNumberSearch.vue";
import ExclusiveNumberSearch from "./ExclusiveNumberSearch.vue";
import AtNumberSearchSetter from "./AtNumberSearchSetter.vue";

const
  holder = shallowRef<StringSearchType>(),
  props = defineProps<{
    openatnumbersearchexcludenumberwindow: boolean;
    concatfieldindex?: number | undefined;
  }>(),
  showatnumbersearchexcludenumberwindowopenerbutton = ref(false),
  emits = defineEmits<{
    (e: "enable:atnumbersearchwindowopenerbutton", action: boolean): void;
    (e: "close:atnumbersearchexcludenumberwindow", action: boolean): void;
    (e: "disable:searchphraseinputbox", action: boolean): void;
    (e: "show:atnumbersearchexcludenumberwindowopenerbutton", action: boolean): void;
  }>(),
  cards = inject("cards") as ShallowRef<(MultipleWordsStringType | SingleWordStringType | NumberStringType)[]>,
  index = inject("index") as number,
  cc = props
;

let unwatchopenatnumbersearchexcludenumberwindow: WatchStopHandle;

provide("concatfieldindex", cc.concatfieldindex as number | undefined);

if(props.concatfieldindex === undefined) {
  if(
    (cards.value[index] as MultipleWordsStringType | SingleWordStringType | NumberStringType).enableatnumbersearch !== undefined
    &&
    (cards.value[index] as MultipleWordsStringType | SingleWordStringType | NumberStringType).enableatnumbersearch === true
  ) {
    provide(
      "numbersearchcard", 
      shallowRef(JSON.parse(JSON.stringify((cards.value[index] as MultipleWordsStringType | SingleWordStringType | NumberStringType).search.multiple.atnumbersearch)))
    )
  }
}
else {
  if(
    (cards.value[index].concatenated as SingleWordStringConcatenatedFieldType)[props.concatfieldindex as number].enableatnumbersearch !== undefined
    &&
    (cards.value[index].concatenated as SingleWordStringConcatenatedFieldType)[props.concatfieldindex as number].enableatnumbersearch === true
  ) {
    provide(
      "numbersearchcard", 
      shallowRef(JSON.parse(JSON.stringify((cards.value[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[props.concatfieldindex as number].search?.atnumbersearch)))
    )
  }
}

function triggerHolder() {
  triggerRef(holder);
}

async function addLocalNewInputEntry(newinputentry: string, inputtype: 'WORD') {
  await addNewInputEntry(
    newinputentry,
    inputtype,
    holder as ShallowRef<StringSearchType>
  );
}

async function addPastedItems(pasteditems: string[][], inputtype: 'WORD') {
  let 
    time: ReturnType<typeof setTimeout>[] = [], 
    timeIndex = 0
  ;
  for(let i=0; i<pasteditems.length; i++) {
    let item = pasteditems[i];
    if (item[1] !== "ERROR") {
      if (item[0].trim().length > 0) {
        time[timeIndex] = setTimeout(async () => {
          await addNewInputEntry(
            item[0],
            inputtype,
            holder as ShallowRef<StringSearchType>
          );
          clearTimeout(time[timeIndex]);
        }, 10);
        timeIndex++;
      }
    }
  }
  (holder.value as StringSearchType).closepaste++;
  triggerRef(holder);
}

function openOrCloseAtNumberSearchWindow(action: boolean) {
  ((
    (props.concatfieldindex === undefined)? 
    cards.value[index].search.multiple 
    : 
    (
      cards.value[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType
    )[props.concatfieldindex as number].search
  ) as {openatnumbersearchwindow: boolean}).openatnumbersearchwindow = action; 
  triggerRef(cards);
  if(action === false) {
    emits('enable:atnumbersearchwindowopenerbutton', true);
  }
}

function openOrCloseAtNumberSearchExcludeNumberWindow(action: boolean) {
  ((
    (props.concatfieldindex === undefined)? 
    cards.value[index].search.multiple 
    : 
    (
      cards.value[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType
    )[props.concatfieldindex as number].search
  ) as {openatnumbersearchexcludenumberwindow: boolean}).openatnumbersearchexcludenumberwindow = action; 
  triggerRef(cards);
}

function closePasteWhenAtNumberIsClicked() {
  (holder.value as StringSearchType).closepaste++;
  triggerRef(holder);
}

const atnumberbuttonstyleguard = computed(() => {
  return (((props.concatfieldindex !== undefined)? (cards.value[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[props.concatfieldindex] : (cards.value[index] as MultipleWordsStringType | NumberStringType | SingleWordStringType)).search as {includeorexcludeformat: '@NUMBER' | 'INCLUDE' | 'EXCLUDE'}).includeorexcludeformat==='@NUMBER'
});

onBeforeMount(() => {
  holder.value = (props.concatfieldindex === undefined)?
    JSON.parse(JSON.stringify(cards.value[index].search.multiple as StringSearchType)) as StringSearchType
    :
    JSON.parse(JSON.stringify((cards.value[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[props.concatfieldindex].search as StringSearchType)) as StringSearchType
  ;
  unwatchopenatnumbersearchexcludenumberwindow = watch(
    () => props.openatnumbersearchexcludenumberwindow,
    (action) => {
      openOrCloseAtNumberSearchExcludeNumberWindow(action);
    }
  )
});

onBeforeUnmount(() => {
  unwatchopenatnumbersearchexcludenumberwindow();
  openOrCloseAtNumberSearchWindow(false);
  openOrCloseAtNumberSearchExcludeNumberWindow(false);
});

</script>

<template>
  <div class="d-block position-relative" style="padding: 15px 0.5rem 10px 0.5rem">
    <DescribeLabel
      context="DESCRIBE-MODAL"
    ></DescribeLabel>
    <div
      class="shadow-sm flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
    >
      <div class="flex-fill p-0 m-0 align-self-stretch">
        <template v-if="cards[index].info.datatype === 'MultipleWordsString'">
          <input
            @keypress.enter="
              addLocalNewInputEntry(
                (holder as StringSearchType).single,
                'WORD'
              )
            "
            v-model="(holder as StringSearchType).single"
            @input="triggerHolder()"
            maxlength="40"
            type="text"
            class="w-100"
            style="height: 30px; padding-right: 1.75rem"
          />
        </template>
        <template v-else>
          <input
            @keydown.space.prevent
            @keypress.enter="
              addLocalNewInputEntry(
                (holder as StringSearchType).single,
                'WORD'
              )
            "
            v-model="(holder as StringSearchType).single"
            @input="triggerHolder()"
            maxlength="40"
            type="text"
            class="w-100"
            style="height: 30px; padding-right: 1.75rem"
          />
        </template>
      </div>
      <div
        class="flex-w-1-dot-75-rem p-0 m-0 align-self-stretch"
        style="background-color: #eee; outline: 1px solid rgba(0, 0, 0, 0.2)"
      >
        <a
          class="cursor-pointer d-block text-center"
          style="padding: 3px 0"
          @keypress.enter="
            addLocalNewInputEntry(
              (holder as StringSearchType).single,
              'WORD'
            )
          "
          @click="
            addLocalNewInputEntry(
              (holder as StringSearchType).single,
              'WORD'
            )
          "
        >
          <img src="http://localhost:5175/src/components/icons/add.png" class="wh-1-dot-25-rem align-middle" />
        </a>
      </div>
    </div>
    <template v-if="
      ((concatfieldindex !== undefined)? (cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[concatfieldindex] : (cards[index] as MultipleWordsStringType | NumberStringType | SingleWordStringType)).enableatnumbersearch !== undefined
      &&
      ((concatfieldindex !== undefined)? (cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[concatfieldindex] : (cards[index] as MultipleWordsStringType | NumberStringType | SingleWordStringType)).enableatnumbersearch === true
    ">
      <template v-if="showatnumbersearchexcludenumberwindowopenerbutton===false">
        <div class="d-block" style="padding:8.5px 0 4.5px 0">
          <button
            :style="atnumberbuttonstyleguard?'background-color:#F0E68C;' : 'background-color:lightgray;'"
            @click="() => {
              closePasteWhenAtNumberIsClicked();
              showatnumbersearchexcludenumberwindowopenerbutton = true;
              emits('show:atnumbersearchexcludenumberwindowopenerbutton', true);
            }"
            @keypress.enter="() => {
              closePasteWhenAtNumberIsClicked();
              showatnumbersearchexcludenumberwindowopenerbutton = true;
              emits('show:atnumbersearchexcludenumberwindowopenerbutton', true);
            }"
            class="letter-spacing text-lowercase btn w-100 shadow-sm font-bold" 
            style="padding:4px 0;font-size:0.9em;background-color: blue;color:#fff;"
          >
            @number
          </button>
        </div>
      </template>
    </template>
    <PasteCopied
      :pastearea="
        ((cards[index].enableincludeandexcludesearch !== undefined && !cards[index].enableincludeandexcludesearch || cards[index].enableincludeandexcludesearch === undefined) && (cards[index].enableatnumbersearch !== undefined && cards[index].enableatnumbersearch))?
        (
          showatnumbersearchexcludenumberwindowopenerbutton?
          'WORD-DISPLAY-AREA-WITH-ATNUMBER-BEEN-CLICKED-BUT-WITHOUT-INCLUDE-AND-EXCLUDE'
          :
          'WORD-DISPLAY-AREA-WITH-ATNUMBER-BUT-NOT-YET-CLICKED-AND-WITHOUT-INCLUDE-AND-EXCLUDE'
        )
        :
        'WORD-DISPLAY-AREA-WITHOUT-INCLUDE-EXCLUDE-AND-ATNUMBER'
      "
      :receiveclosepastemodalsignal="(holder as StringSearchType).closepaste"
      :title="((props.concatfieldindex === undefined)? cards[index].info : ((cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[props.concatfieldindex as number])).name"
      :datatype="(cards[index].info.datatype as 'NumberString' | 'SingleWordString' | 'MultipleWordsString')"
      :text-area-height="'height:357px;'"
      @return:newlypasteditems="($val: string[][]) => { addPastedItems($val, 'WORD'); showatnumbersearchexcludenumberwindowopenerbutton = false; emits('show:atnumbersearchexcludenumberwindowopenerbutton', false); }"
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
            Accepted Lines
          </div>
          <div class="flex-fill text-center">
            <div
              class="d-inline-block align-middle"
              style="background-color: red; width: 15px; height: 15px"
            ></div>
            Invalid Lines
          </div>
        </div>
      </template>
    </PasteCopied>
    <template v-if="showatnumbersearchexcludenumberwindowopenerbutton">
      <template v-if="
        ((concatfieldindex !== undefined)? (cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[concatfieldindex] : (cards[index] as MultipleWordsStringType | NumberStringType | SingleWordStringType)).enableatnumbersearch !== undefined
        &&
        ((concatfieldindex !== undefined)? (cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[concatfieldindex] : (cards[index] as MultipleWordsStringType | NumberStringType | SingleWordStringType)).enableatnumbersearch === true
      ">
        <div class="d-block" style="padding:2px 0">
          <div class="d-block overflow-hidden shadow-sm" style="height:420px;padding: 10px 0px;">
            <AtNumberSearchSetter @enable:atnumbersearchwindowopenerbutton="($val: boolean) => emits('enable:atnumbersearchwindowopenerbutton', $val)" @open:atnumbersearchwindow="($val: boolean) => openOrCloseAtNumberSearchWindow($val)">
              <template v-slot:closeatnumbersearch>
                <div
                  class="flex-w-50 align-self-stretch text-center shadow-sm"
                  style="background-color: blue;border-radius: 0.25rem;"
                >
                  <a
                    class="underline-none cursor-pointer align-middle"
                    @click="() => {
                      showatnumbersearchexcludenumberwindowopenerbutton = false;
                      emits('show:atnumbersearchexcludenumberwindowopenerbutton', false);
                    }"
                    @keypress.enter="() => {
                      showatnumbersearchexcludenumberwindowopenerbutton = false;
                      emits('show:atnumbersearchexcludenumberwindowopenerbutton', false);
                    }"
                  >
                    <img
                      src="http://localhost:5175/src/components/icons/close.png"
                      class="align-middle"
                      style="width: 2.205rem; height: 2.205rem"
                    />
                  </a>
                </div>
              </template>
            </AtNumberSearchSetter>
          </div>
        </div>
      </template>
    </template>
    <template v-else>
      <PastedItemAndNewlyInputedEntryDisplayer
        :paginationarea="
          ((cards[index].enableincludeandexcludesearch !== undefined && !cards[index].enableincludeandexcludesearch || cards[index].enableincludeandexcludesearch === undefined) && (cards[index].enableatnumbersearch !== undefined && cards[index].enableatnumbersearch))?
          (
            showatnumbersearchexcludenumberwindowopenerbutton?
            'WORD-DISPLAY-AREA-WITH-ATNUMBER-BEEN-CLICKED-BUT-WITHOUT-INCLUDE-AND-EXCLUDE'
            :
            'WORD-DISPLAY-AREA-WITH-ATNUMBER-BUT-NOT-YET-CLICKED-AND-WITHOUT-INCLUDE-AND-EXCLUDE'
          )
          :
          'WORD-DISPLAY-AREA-WITHOUT-INCLUDE-EXCLUDE-AND-ATNUMBER'
        "
        :current="[(holder as StringSearchType).signal, (holder as StringSearchType).current]"
        :tree="(holder as StringSearchType)"
        treetype="StringSearchType"
        :scrollareaid="cards[index].scroll.areaid+'-pasted-and-newinputentry'"
        @update:current="($val: number) => { (holder as StringSearchType).current = $val; triggerHolder();}"
      ></PastedItemAndNewlyInputedEntryDisplayer>
    </template>
    <template v-if="((concatfieldindex === undefined)? cards[index].search.multiple : (cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[concatfieldindex as number].search)?.openatnumbersearchwindow">
      <template v-if="
        ((concatfieldindex !== undefined)? (cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[concatfieldindex] : (cards[index] as MultipleWordsStringType | NumberStringType | SingleWordStringType)).enableatnumbersearch !== undefined
        &&
        ((concatfieldindex !== undefined)? (cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[concatfieldindex] : (cards[index] as MultipleWordsStringType | NumberStringType | SingleWordStringType)).enableatnumbersearch === true
      ">
        <div class="w-100 position-absolute t-0 l-0">
          <div class="d-block" style="background-color: #f8f8f8;border-bottom:2px solid blue;">
            <template v-if="((concatfieldindex === undefined)? cards[index].search.multiple : (cards[index].concatenated as MultipleWordsStringConcatenatedFieldType | SingleWordStringConcatenatedFieldType)[concatfieldindex as number].search)?.openatnumbersearchexcludenumberwindow === false">
              <div
                class="shadow-sm d-block text-center"
                style="background-color: blue;"
              >
                <a
                  class="underline-none cursor-pointer align-middle"
                  @click="openOrCloseAtNumberSearchWindow(false)"
                  @keypress.enter="openOrCloseAtNumberSearchWindow(false)"
                >
                  <img
                    src="http://localhost:5175/src/components/icons/close.png"
                    class="align-middle"
                    style="width: 2.205rem; height: 2.205rem"
                  />
                </a>
              </div>
              <InclusiveNumberSearch @enable:atnumbersearchwindowopenerbutton="($val: boolean) => emits('enable:atnumbersearchwindowopenerbutton', $val)" from="NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL"></InclusiveNumberSearch>
            </template>
            <template v-else>
              <ExclusiveNumberSearch @close:atnumbersearchexcludenumberwindow="($val: boolean) => emits('close:atnumbersearchexcludenumberwindow', $val)" from="NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL"></ExclusiveNumberSearch>
            </template>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
