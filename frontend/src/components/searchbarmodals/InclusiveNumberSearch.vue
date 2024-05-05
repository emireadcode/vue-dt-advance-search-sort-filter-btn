<script setup lang="ts">
import {
  triggerRef,
  type WatchStopHandle,
  watch,
  inject,
  type ShallowRef,
  computed,
  onMounted,
  onBeforeUnmount
} from 'vue'
import type {
  NumberType,
  SingleWordStringType,
  NumberStringType,
  NumberSearchType,
  NumberSearchExcludeEqualToType,
  NumberSearchExcludeFromToType,
  AtNumber
} from '../types/SupportedDatatypesTypeDeclaration'
import {
  addNewInputEntry,
  setTabAndResetOthers
} from '../helperfunctions/addnewlypastedandnewinputentry'
import PasteCopied from './PasteCopied.vue'
import PastedItemAndNewlyInputedEntryDisplayer from './PastedItemAndNewlyInputedEntryDisplayer.vue'

const holder = inject('numbersearchcard') as ShallowRef<
    NumberType['search']['multiple'] | AtNumber<NumberSearchType>
  >,
  index = inject('index') as number,
  props = defineProps<{
    from: 'NUMBER-SEARCHER-MODAL' | 'NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL'
  }>(),
  emits = defineEmits<{
    (e: 'enable:atnumbersearchwindowopenerbutton', action: boolean): void
  }>(),
  cards = inject('cards') as ShallowRef<NumberType[] | SingleWordStringType[] | NumberStringType[]>
let unwatchgreaterthan: WatchStopHandle,
  unwatchlessthan: WatchStopHandle,
  unwatchequalto: WatchStopHandle,
  unwatchnotequalto: WatchStopHandle,
  unwatchfromto: WatchStopHandle,
  unwatchequaltolength: WatchStopHandle,
  unwatchnotequaltolength: WatchStopHandle

function triggerHolder() {
  triggerRef(holder)
}

async function addLocalNewInputEntry(
  newinputentry: string,
  inputtype: 'EQUAL-TO' | 'NOT-EQUAL-TO'
) {
  await addNewInputEntry(
    newinputentry,
    inputtype,
    holder as ShallowRef<NumberType['search']['multiple'] | AtNumber<NumberSearchType>>,
    props.from
  )
}

async function addPastedItems(pasteditems: string[][], inputtype: 'NOT-EQUAL-TO' | 'EQUAL-TO') {
  let time: ReturnType<typeof setTimeout>[] = [],
    timeIndex = 0
  for (let i = 0; i < pasteditems.length; i++) {
    let item = pasteditems[i]
    if (item[1] !== 'ERROR') {
      time[timeIndex] = setTimeout(async () => {
        await addNewInputEntry(
          item[0],
          inputtype,
          holder as ShallowRef<NumberType['search']['multiple'] | AtNumber<NumberSearchType>>,
          props.from
        )
        clearTimeout(time[timeIndex])
      }, 10)
      timeIndex++
    }
  }
  inputtype === 'EQUAL-TO'
    ? (props.from === 'NUMBER-SEARCHER-MODAL'
        ? (holder.value as NumberType['search']['multiple'])
        : (holder.value as AtNumber<NumberSearchType>).search
      ).equalto.closepaste++
    : (props.from === 'NUMBER-SEARCHER-MODAL'
        ? (holder.value as NumberType['search']['multiple'])
        : (holder.value as AtNumber<NumberSearchType>).search
      ).notequalto.closepaste++
  triggerRef(holder)
}

function resetExclude(action: boolean) {
  if (action) {
    ;(props.from === 'NUMBER-SEARCHER-MODAL'
      ? (holder.value as NumberType['search']['multiple'])
      : (holder.value as AtNumber<NumberSearchType>).search
    ).exclude.equalto = {
      single: '',
      loading: false,
      addloading: false,
      shake: [],
      signal: 0,
      enteredwheninpage: false,
      enteredwhennotinpage: false,
      current: 0,
      closepaste: 0,
      show: [],
      bottom: false,
      pages: [],
      deleting: false,
      addeditemsref: [],
      inneraddeditemsref: [],
      endoflistitemref: undefined
    } as NumberSearchExcludeEqualToType
    ;(props.from === 'NUMBER-SEARCHER-MODAL'
      ? (holder.value as NumberType['search']['multiple'])
      : (holder.value as AtNumber<NumberSearchType>).search
    ).exclude.fromto = {
      singlefrom: '',
      singleto: '',
      loading: false,
      addloading: false,
      enteredwheninpage: false,
      enteredwhennotinpage: false,
      shake: [],
      signal: 0,
      current: 0,
      closepaste: 0,
      show: [],
      bottom: false,
      pages: [],
      deleting: false,
      addeditemsref: [],
      inneraddeditemsref: [],
      endoflistitemref: undefined
    } as NumberSearchExcludeFromToType
    triggerHolder()
  }
}

const equaltoAddNew = computed(() => {
  return props.from === 'NUMBER-SEARCHER-MODAL'
    ? parseFloat((holder.value as NumberType['search']['multiple'])?.equalto.single as string) <=
        parseFloat(cards.value[index].result.max) &&
        parseFloat((holder.value as NumberType['search']['multiple'])?.equalto.single as string) >=
          parseFloat(cards.value[index].result.min)
    : /^\s*\d+(\.\d+)?\s*$/g.test(
        (holder.value as AtNumber<NumberSearchType>).search.equalto.single
      )
})

const notequaltoAddNew = computed(() => {
  return props.from === 'NUMBER-SEARCHER-MODAL'
    ? parseFloat((holder.value as NumberType['search']['multiple'])?.notequalto.single as string) <=
        parseFloat(cards.value[index].result.max) &&
        parseFloat(
          (holder.value as NumberType['search']['multiple'])?.notequalto.single as string
        ) >= parseFloat(cards.value[index].result.min)
    : /^\s*\d+(\.\d+)?\s*$/g.test(
        (holder.value as AtNumber<NumberSearchType>).search.notequalto.single
      )
})

onMounted(() => {
  unwatchgreaterthan = watch(
    () =>
      (props.from === 'NUMBER-SEARCHER-MODAL'
        ? (holder.value as NumberType['search']['multiple'])
        : (holder.value as AtNumber<NumberSearchType>).search
      )?.greaterthan as string,
    (x) => {
      if (x.trim().length > 0 && /^\s*\d+(\.\d+)?\s*$/g.test(x)) {
        setTabAndResetOthers(
          'GREATER-THAN',
          holder as ShallowRef<NumberType['search']['multiple'] | AtNumber<NumberSearchType>>,
          props.from
        )
        if (props.from !== 'NUMBER-SEARCHER-MODAL') {
          emits('enable:atnumbersearchwindowopenerbutton', false)
        }
        resetExclude(true)
      } else {
        if (props.from !== 'NUMBER-SEARCHER-MODAL') {
          emits('enable:atnumbersearchwindowopenerbutton', true)
        }
      }
    }
  )
  unwatchlessthan = watch(
    () =>
      (props.from === 'NUMBER-SEARCHER-MODAL'
        ? (holder.value as NumberType['search']['multiple'])
        : (holder.value as AtNumber<NumberSearchType>).search
      )?.lessthan as string,
    (x) => {
      if (x.trim().length > 0 && /^\s*\d+(\.\d+)?\s*$/g.test(x)) {
        setTabAndResetOthers(
          'LESS-THAN',
          holder as ShallowRef<NumberType['search']['multiple'] | AtNumber<NumberSearchType>>,
          props.from
        )
        if (props.from !== 'NUMBER-SEARCHER-MODAL') {
          emits('enable:atnumbersearchwindowopenerbutton', false)
        }
        resetExclude(true)
      } else {
        if (props.from !== 'NUMBER-SEARCHER-MODAL') {
          emits('enable:atnumbersearchwindowopenerbutton', true)
        }
      }
    }
  )
  unwatchequalto = watch(
    () =>
      (props.from === 'NUMBER-SEARCHER-MODAL'
        ? (holder.value as NumberType['search']['multiple'])
        : (holder.value as AtNumber<NumberSearchType>).search
      )?.equalto.single as string,
    (x) => {
      if (x.trim().length > 0 && /^\s*\d+(\.\d+)?\s*$/g.test(x)) {
        setTabAndResetOthers(
          'EQUAL-TO',
          holder as ShallowRef<NumberType['search']['multiple'] | AtNumber<NumberSearchType>>,
          props.from
        )
        resetExclude(true)
      }
    }
  )
  unwatchnotequalto = watch(
    () =>
      (props.from === 'NUMBER-SEARCHER-MODAL'
        ? (holder.value as NumberType['search']['multiple'])
        : (holder.value as AtNumber<NumberSearchType>).search
      )?.notequalto.single as string,
    (x) => {
      if (x.trim().length > 0 && /^\s*\d+(\.\d+)?\s*$/g.test(x)) {
        setTabAndResetOthers(
          'NOT-EQUAL-TO',
          holder as ShallowRef<NumberType['search']['multiple'] | AtNumber<NumberSearchType>>,
          props.from
        )
        resetExclude(true)
      }
    }
  )
  unwatchfromto = watch(
    [
      () =>
        (props.from === 'NUMBER-SEARCHER-MODAL'
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search
        )?.fromto.from as string,
      () =>
        (props.from === 'NUMBER-SEARCHER-MODAL'
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search
        )?.fromto.to as string
    ],
    ([x, y]) => {
      if (
        x.trim().length > 0 &&
        y.trim().length > 0 &&
        /^\s*\d+(\.\d+)?\s*$/g.test(x) &&
        /^\s*\d+(\.\d+)?\s*$/g.test(y)
      ) {
        setTabAndResetOthers(
          'FROM-TO',
          holder as ShallowRef<NumberType['search']['multiple'] | AtNumber<NumberSearchType>>,
          props.from
        )
        if (props.from !== 'NUMBER-SEARCHER-MODAL') {
          emits('enable:atnumbersearchwindowopenerbutton', false)
        }
        resetExclude(true)
      } else {
        if (props.from !== 'NUMBER-SEARCHER-MODAL') {
          emits('enable:atnumbersearchwindowopenerbutton', true)
        }
      }
    }
  )
  unwatchequaltolength = watch(
    () =>
      (props.from === 'NUMBER-SEARCHER-MODAL'
        ? (holder.value as NumberType['search']['multiple'])
        : (holder.value as AtNumber<NumberSearchType>).search
      )?.equalto.pages.length,
    (x) => {
      if ((x as number) > 0) {
        setTabAndResetOthers(
          'EQUAL-TO',
          holder as ShallowRef<NumberType['search']['multiple'] | AtNumber<NumberSearchType>>,
          props.from
        )
        resetExclude(true)
      }
    }
  )
  unwatchnotequaltolength = watch(
    () =>
      (props.from === 'NUMBER-SEARCHER-MODAL'
        ? (holder.value as NumberType['search']['multiple'])
        : (holder.value as AtNumber<NumberSearchType>).search
      )?.notequalto.pages.length,
    (x) => {
      if ((x as number) > 0) {
        setTabAndResetOthers(
          'NOT-EQUAL-TO',
          holder as ShallowRef<NumberType['search']['multiple'] | AtNumber<NumberSearchType>>,
          props.from
        )
        resetExclude(true)
      }
    }
  )
})

onBeforeUnmount(() => {
  unwatchgreaterthan()
  unwatchlessthan()
  unwatchequalto()
  unwatchnotequalto()
  unwatchfromto()
  unwatchequaltolength()
  unwatchnotequaltolength()
})
</script>

<template>
  <div
    class="d-block"
    style="z-index: 8000"
    :style="
      props.from === 'NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL'
        ? 'padding: 0.8rem 0.3rem;'
        : 'padding: 0 0.5rem;height:100%;'
    "
  >
    <div class="d-block" style="padding: 0 0 0.945rem 0">
      <div
        class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
      >
        <div class="flex-w-50" style="padding-right: 0.315rem">
          <div class="d-block shadow-sm" style="padding: 0.315rem; background-color: #fff">
            <div class="d-block" style="padding-bottom: 0.315rem">
              <img
                src="http://localhost:5175/src/components/icons/greater-than.png"
                class="align-middle"
                style="width: 1.512rem; height: 1.512rem"
              />
            </div>
            <div class="d-block">
              <input
                @keydown.space.prevent
                @input="triggerHolder()"
                v-model="
                  (
                    (props.from === 'NUMBER-SEARCHER-MODAL'
                      ? (holder as NumberType['search']['multiple'])
                      : (holder as AtNumber<NumberSearchType>).search) as NumberSearchType
                  ).greaterthan
                "
                type="text"
                class="w-100 text-left"
                style="height: 1.89rem"
              />
            </div>
          </div>
        </div>
        <div class="flex-w-50" style="padding-left: 0.315rem">
          <div class="d-block shadow-sm" style="padding: 0.315rem; background-color: #fff">
            <div class="d-block" style="padding-bottom: 0.315rem">
              <img
                src="http://localhost:5175/src/components/icons/less-than.png"
                class="align-middle"
                style="width: 1.512rem; height: 1.512rem"
              />
            </div>
            <div class="d-block">
              <input
                @keydown.space.prevent
                @input="triggerHolder()"
                v-model="
                  (
                    (props.from === 'NUMBER-SEARCHER-MODAL'
                      ? (holder as NumberType['search']['multiple'])
                      : (holder as AtNumber<NumberSearchType>).search) as NumberSearchType
                  ).lessthan
                "
                type="text"
                class="w-100 text-left"
                style="height: 1.89rem"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="d-block" style="padding: 0 0 0.945rem 0">
      <div
        class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
      >
        <div class="flex-w-50" style="padding-right: 0.315rem">
          <div class="d-block shadow-sm" style="padding: 0.315rem; background-color: #fff">
            <div class="d-block" style="padding-bottom: 0.315rem">
              <img
                src="http://localhost:5175/src/components/icons/equal-to.png"
                class="align-middle"
                style="width: 1.512rem; height: 1.512rem"
              />
            </div>
            <div
              class="shadow-sm flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
            >
              <div class="flex-fill p-0 m-0 align-self-stretch" style="padding-right: 0.126rem">
                <input
                  @keydown.space.prevent
                  @keypress.enter="
                    equaltoAddNew
                      ? addLocalNewInputEntry(
                          (
                            (
                              (props.from === 'NUMBER-SEARCHER-MODAL'
                                ? (holder as NumberType['search']['multiple'])
                                : (holder as AtNumber<NumberSearchType>).search) as NumberSearchType
                            ).equalto as NumberSearchExcludeEqualToType
                          ).single,
                          'EQUAL-TO'
                        )
                      : ''
                  "
                  @input="triggerHolder()"
                  v-model="
                    (
                      (
                        (props.from === 'NUMBER-SEARCHER-MODAL'
                          ? (holder as NumberType['search']['multiple'])
                          : (holder as AtNumber<NumberSearchType>).search) as NumberSearchType
                      ).equalto as NumberSearchExcludeEqualToType
                    ).single
                  "
                  type="text"
                  class="w-100 text-left"
                  style="height: 1.89rem; z-index: 1110"
                />
              </div>
              <div
                class="flex-w-1-dot-75-rem p-0 m-0 align-self-stretch"
                style="background-color: #eee; outline: 0.063rem solid rgba(0, 0, 0, 0.2)"
              >
                <button
                  :disabled="equaltoAddNew ? false : true"
                  @keypress.enter="
                    equaltoAddNew
                      ? addLocalNewInputEntry(
                          (
                            (
                              (props.from === 'NUMBER-SEARCHER-MODAL'
                                ? (holder as NumberType['search']['multiple'])
                                : (holder as AtNumber<NumberSearchType>).search) as NumberSearchType
                            ).equalto as NumberSearchExcludeEqualToType
                          ).single,
                          'EQUAL-TO'
                        )
                      : ''
                  "
                  @click="
                    equaltoAddNew
                      ? addLocalNewInputEntry(
                          (
                            (
                              (props.from === 'NUMBER-SEARCHER-MODAL'
                                ? (holder as NumberType['search']['multiple'])
                                : (holder as AtNumber<NumberSearchType>).search) as NumberSearchType
                            ).equalto as NumberSearchExcludeEqualToType
                          ).single,
                          'EQUAL-TO'
                        )
                      : ''
                  "
                  class="btn w-100 text-center"
                  :class="[equaltoAddNew ? 'cursor-pointer' : '']"
                  :style="equaltoAddNew ? 'background-color: #F0E68C;' : 'background-color:#eee;'"
                  style="height: 1.89rem; padding: 0 0.126rem"
                >
                  <img src="http://localhost:5175/src/components/icons/add.png" class="wh-1-dot-25-rem align-middle" />
                </button>
              </div>
            </div>
            <paste-copied
              :pastearea="
                props.from === 'NUMBER-SEARCHER-MODAL'
                  ? 'NUMBER-INCLUSIVE-EQUAL-TO'
                  : 'ATNUMBER-INCLUSIVE-EQUAL-TO'
              "
              :receiveclosepastemodalsignal="
                (props.from === 'NUMBER-SEARCHER-MODAL'
                  ? (holder as NumberType['search']['multiple'])
                  : (holder as AtNumber<NumberSearchType>).search
                ).equalto.closepaste
              "
              title="numbers"
              :datatype="
                props.from === 'NUMBER-SEARCHER-MODAL' ? 'Number' : 'NumberFromNumberString'
              "
              :max="cards[index].result.max as string"
              :min="cards[index].result.min as string"
              @return:newlypasteditems="
                ($val: string[][]) => {
                  addPastedItems($val, 'EQUAL-TO')
                }
              "
            >
              <template v-slot:outcomeidentifier>
                <div
                  class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                >
                  <div class="flex-fill text-center">
                    <div
                      class="d-inline-block align-middle shadow-sm"
                      style="background-color: #fff; width: 0.945rem; height: 0.945rem"
                    ></div>
                    Valid
                  </div>
                  <div class="flex-fill text-center">
                    <div
                      class="d-inline-block align-middle shadow-sm"
                      style="background-color: red; width: 0.945rem; height: 0.945rem"
                    ></div>
                    Invalid
                  </div>
                </div>
              </template>
            </paste-copied>
            <PastedItemAndNewlyInputedEntryDisplayer
              :paginationarea="
                props.from === 'NUMBER-SEARCHER-MODAL'
                  ? 'NUMBER-INCLUSIVE-EQUAL-TO'
                  : 'ATNUMBER-INCLUSIVE-EQUAL-TO'
              "
              :current="[
                (props.from === 'NUMBER-SEARCHER-MODAL'
                  ? (holder as NumberType['search']['multiple'])
                  : (holder as AtNumber<NumberSearchType>).search
                ).equalto.signal,
                (props.from === 'NUMBER-SEARCHER-MODAL'
                  ? (holder as NumberType['search']['multiple'])
                  : (holder as AtNumber<NumberSearchType>).search
                ).equalto.current
              ]"
              :tree="
                (
                  (props.from === 'NUMBER-SEARCHER-MODAL'
                    ? (holder as NumberType['search']['multiple'])
                    : (holder as AtNumber<NumberSearchType>).search) as NumberSearchType
                ).equalto as NumberSearchExcludeEqualToType
              "
              treetype="NumberSearchExcludeEqualToType"
              :scrollareaid="cards[index].scroll.areaid + '-equal-to'"
              @update:current="
                ($val: number) => {
                  ;(props.from === 'NUMBER-SEARCHER-MODAL'
                    ? (holder as NumberType['search']['multiple'])
                    : (holder as AtNumber<NumberSearchType>).search
                  ).equalto.current = $val
                  triggerHolder()
                }
              "
            ></PastedItemAndNewlyInputedEntryDisplayer>
          </div>
        </div>
        <div class="flex-w-50" style="padding-left: 0.315rem">
          <div class="d-block shadow-sm" style="padding: 0.315rem; background-color: #fff">
            <div class="d-block" style="padding-bottom: 0.315rem">
              <img
                src="http://localhost:5175/src/components/icons/not-equal-to.png"
                class="align-middle"
                style="width: 1.512rem; height: 1.512rem"
              />
            </div>
            <div
              class="shadow-sm flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
            >
              <div class="flex-fill p-0 m-0 align-self-stretch" style="padding-right: 0.126rem">
                <input
                  @keydown.space.prevent
                  @keypress.enter="
                    notequaltoAddNew
                      ? addLocalNewInputEntry(
                          (
                            (
                              (props.from === 'NUMBER-SEARCHER-MODAL'
                                ? (holder as NumberType['search']['multiple'])
                                : (holder as AtNumber<NumberSearchType>).search) as NumberSearchType
                            ).notequalto as NumberSearchExcludeEqualToType
                          ).single,
                          'NOT-EQUAL-TO'
                        )
                      : ''
                  "
                  @input="triggerHolder()"
                  v-model="
                    (
                      (
                        (props.from === 'NUMBER-SEARCHER-MODAL'
                          ? (holder as NumberType['search']['multiple'])
                          : (holder as AtNumber<NumberSearchType>).search) as NumberSearchType
                      ).notequalto as NumberSearchExcludeEqualToType
                    ).single
                  "
                  type="text"
                  class="w-100 text-left"
                  style="height: 1.89rem; z-index: 1110"
                />
              </div>
              <div
                class="flex-w-1-dot-75-rem p-0 m-0 align-self-stretch"
                style="background-color: #eee; outline: 0.063rem solid rgba(0, 0, 0, 0.2)"
              >
                <button
                  :disabled="notequaltoAddNew ? false : true"
                  @keypress.enter="
                    notequaltoAddNew
                      ? addLocalNewInputEntry(
                          (
                            (
                              (props.from === 'NUMBER-SEARCHER-MODAL'
                                ? (holder as NumberType['search']['multiple'])
                                : (holder as AtNumber<NumberSearchType>).search) as NumberSearchType
                            ).notequalto as NumberSearchExcludeEqualToType
                          ).single,
                          'NOT-EQUAL-TO'
                        )
                      : ''
                  "
                  @click="
                    notequaltoAddNew
                      ? addLocalNewInputEntry(
                          (
                            (
                              (props.from === 'NUMBER-SEARCHER-MODAL'
                                ? (holder as NumberType['search']['multiple'])
                                : (holder as AtNumber<NumberSearchType>).search) as NumberSearchType
                            ).notequalto as NumberSearchExcludeEqualToType
                          ).single,
                          'NOT-EQUAL-TO'
                        )
                      : ''
                  "
                  class="btn w-100 text-center"
                  :class="[notequaltoAddNew ? 'cursor-pointer' : '']"
                  :style="
                    notequaltoAddNew ? 'background-color: #F0E68C;' : 'background-color:#eee;'
                  "
                  style="height: 1.89rem; padding: 0 0.126rem"
                >
                  <img src="http://localhost:5175/src/components/icons/add.png" class="wh-1-dot-25-rem align-middle" />
                </button>
              </div>
            </div>
            <paste-copied
              :pastearea="
                props.from === 'NUMBER-SEARCHER-MODAL'
                  ? 'NUMBER-INCLUSIVE-NOT-EQUAL-TO'
                  : 'ATNUMBER-INCLUSIVE-NOT-EQUAL-TO'
              "
              :receiveclosepastemodalsignal="
                (props.from === 'NUMBER-SEARCHER-MODAL'
                  ? (holder as NumberType['search']['multiple'])
                  : (holder as AtNumber<NumberSearchType>).search
                ).notequalto.closepaste
              "
              title="numbers"
              :datatype="
                props.from === 'NUMBER-SEARCHER-MODAL' ? 'Number' : 'NumberFromNumberString'
              "
              :max="cards[index].result.max as string"
              :min="cards[index].result.min as string"
              @return:newlypasteditems="
                ($val: string[][]) => {
                  addPastedItems($val, 'NOT-EQUAL-TO')
                }
              "
            >
              <template v-slot:outcomeidentifier>
                <div
                  class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                >
                  <div class="flex-fill text-center">
                    <div
                      class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
                    >
                      <div
                        class="flex-grow-0 flex-shrink-0 shadow-sm"
                        style="background-color: #fff; width: 1.134rem; height: 1.134rem"
                      ></div>
                      <div
                        class="font-family flex-grow-0 flex-shrink-0"
                        style="padding-left: 0.189rem"
                      >
                        Valid
                      </div>
                    </div>
                  </div>
                  <div class="flex-fill text-center">
                    <div
                      class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
                    >
                      <div
                        class="flex-grow-0 flex-shrink-0 shadow-sm"
                        style="background-color: red; width: 1.134rem; height: 1.134rem"
                      ></div>
                      <div
                        class="font-family flex-grow-0 flex-shrink-0"
                        style="padding-left: 0.189rem"
                      >
                        Invalid
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </paste-copied>
            <PastedItemAndNewlyInputedEntryDisplayer
              :paginationarea="
                props.from === 'NUMBER-SEARCHER-MODAL'
                  ? 'NUMBER-INCLUSIVE-NOT-EQUAL-TO'
                  : 'ATNUMBER-INCLUSIVE-NOT-EQUAL-TO'
              "
              :current="[
                (props.from === 'NUMBER-SEARCHER-MODAL'
                  ? (holder as NumberType['search']['multiple'])
                  : (holder as AtNumber<NumberSearchType>).search
                ).notequalto.signal,
                (props.from === 'NUMBER-SEARCHER-MODAL'
                  ? (holder as NumberType['search']['multiple'])
                  : (holder as AtNumber<NumberSearchType>).search
                ).notequalto.current
              ]"
              :tree="
                (
                  (props.from === 'NUMBER-SEARCHER-MODAL'
                    ? (holder as NumberType['search']['multiple'])
                    : (holder as AtNumber<NumberSearchType>).search) as NumberSearchType
                ).notequalto as NumberSearchExcludeEqualToType
              "
              treetype="NumberSearchExcludeEqualToType"
              :scrollareaid="cards[index].scroll.areaid + '-not-equal-to'"
              @update:current="
                ($val: number) => {
                  ;(props.from === 'NUMBER-SEARCHER-MODAL'
                    ? (holder as NumberType['search']['multiple'])
                    : (holder as AtNumber<NumberSearchType>).search
                  ).notequalto.current = $val
                  triggerHolder()
                }
              "
            ></PastedItemAndNewlyInputedEntryDisplayer>
          </div>
        </div>
      </div>
    </div>
    <div
      style="padding: 0.315rem; background-color: #fff"
      class="shadow-sm flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
    >
      <div class="flex-grow-1 flex-shrink-1">
        <div class="d-block" style="padding-bottom: 0.315rem">
          <label>From</label>
        </div>
        <div class="d-block">
          <input
            @keydown.space.prevent
            @input="triggerHolder()"
            v-model="
              (
                (props.from === 'NUMBER-SEARCHER-MODAL'
                  ? (holder as NumberType['search']['multiple'])
                  : (holder as AtNumber<NumberSearchType>).search) as NumberSearchType
              ).fromto.from
            "
            type="text"
            class="w-100 text-left"
            style="height: 1.89rem"
          />
        </div>
      </div>
      <div class="flex-grow-1 flex-shrink-1">
        <div class="d-block" style="padding-bottom: 0.315rem">
          <label>To</label>
        </div>
        <div class="d-block">
          <input
            @keydown.space.prevent
            @input="triggerHolder()"
            v-model.trim="
              (
                (props.from === 'NUMBER-SEARCHER-MODAL'
                  ? (holder as NumberType['search']['multiple'])
                  : (holder as AtNumber<NumberSearchType>).search) as NumberSearchType
              ).fromto.to
            "
            type="text"
            class="w-100 text-left"
            style="height: 1.89rem"
          />
        </div>
      </div>
    </div>
  </div>
</template>
