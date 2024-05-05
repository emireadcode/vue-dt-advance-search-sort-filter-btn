<script setup lang="ts">
import { type ShallowRef, triggerRef, inject, computed } from 'vue'
import type {
  NumberSearchExcludeFromToType,
  NumberSearchExcludeEqualToType,
  NumberType,
  SingleWordStringType,
  AtNumber,
  NumberSearchType,
  NumberStringType
} from '../types/SupportedDatatypesTypeDeclaration'
import PasteCopied from './PasteCopied.vue'
import { addNewInputEntry } from '../helperfunctions/addnewlypastedandnewinputentry'
import PastedItemAndNewlyInputedEntryDisplayer from './PastedItemAndNewlyInputedEntryDisplayer.vue'

const holder = inject('numbersearchcard') as ShallowRef<
    NumberType['search']['multiple'] | AtNumber<NumberSearchType>
  >,
  index = inject('index') as number,
  props = defineProps<{
    from?:
      | undefined
      | 'NUMBER-SEARCHER-MODAL'
      | 'NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL'
  }>(),
  emits = defineEmits<{
    (e: 'close:atnumbersearchexcludenumberwindow', action: boolean): void
  }>(),
  cards = inject('cards') as ShallowRef<NumberType[] | SingleWordStringType[] | NumberStringType[]>
function triggerHolder() {
  triggerRef(holder)
}

async function addLocalNewInputEntry(
  newinputentry: [string, string] | string,
  inputtype: 'EXCLUDE-FROM-TO' | 'EXCLUDE-EQUAL-TO'
) {
  await addNewInputEntry(
    newinputentry,
    inputtype,
    holder as ShallowRef<NumberType['search']['multiple'] | AtNumber<NumberSearchType>>,
    props.from
  )
}

async function addPastedItems(
  pasteditems: string[][],
  inputtype: 'EXCLUDE-FROM-TO' | 'EXCLUDE-EQUAL-TO'
) {
  let time: ReturnType<typeof setTimeout>[] = [],
    timeIndex = 0
  for (let i = 0; i < pasteditems.length; i++) {
    let item = pasteditems[i]
    if (item[1] !== 'ERROR') {
      let splititem = inputtype === 'EXCLUDE-EQUAL-TO' ? '' : item[0].split('-')
      time[timeIndex] = setTimeout(async () => {
        await addNewInputEntry(
          inputtype === 'EXCLUDE-EQUAL-TO' ? item[0] : [splititem[0].trim(), splititem[1].trim()],
          inputtype,
          holder as ShallowRef<NumberType['search']['multiple'] | AtNumber<NumberSearchType>>,
          props.from
        )
        clearTimeout(time[timeIndex])
      }, 10)
      timeIndex++
    }
  }
  inputtype === 'EXCLUDE-EQUAL-TO'
    ? (
        (props.from === 'NUMBER-SEARCHER-MODAL'
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search
        )?.exclude?.equalto as NumberSearchExcludeEqualToType
      ).closepaste++
    : (
        (props.from === 'NUMBER-SEARCHER-MODAL'
          ? (holder.value as NumberType['search']['multiple'])
          : (holder.value as AtNumber<NumberSearchType>).search
        )?.exclude?.fromto as NumberSearchExcludeFromToType
      ).closepaste++
  triggerRef(holder)
}

const excludeAddNewFromTo = computed(() => {
  if (props.from === 'NUMBER-SEARCHER-MODAL') {
    if ((holder.value as NumberType['search']['multiple'])?.tab === 'GREATER-THAN') {
      return (
        parseFloat(
          (
            (holder.value as NumberType['search']['multiple'])?.exclude
              ?.fromto as NumberSearchExcludeFromToType
          ).singleto
        ) < parseFloat(cards.value[index].result.max) &&
        parseFloat(
          (
            (holder.value as NumberType['search']['multiple'])?.exclude
              ?.fromto as NumberSearchExcludeFromToType
          ).singlefrom
        ) < parseFloat(cards.value[index].result.max) &&
        parseFloat(
          (
            (holder.value as NumberType['search']['multiple'])?.exclude
              ?.fromto as NumberSearchExcludeFromToType
          ).singlefrom
        ) > parseFloat((holder.value as NumberType['search']['multiple'])?.greaterthan as string) &&
        parseFloat(
          (
            (holder.value as NumberType['search']['multiple'])?.exclude
              ?.fromto as NumberSearchExcludeFromToType
          ).singlefrom
        ) <
          parseFloat(
            (
              (holder.value as NumberType['search']['multiple'])?.exclude
                ?.fromto as NumberSearchExcludeFromToType
            ).singleto
          )
      )
    } else if ((holder.value as NumberType['search']['multiple'])?.tab === 'LESS-THAN') {
      return (
        parseFloat(
          (
            (holder.value as NumberType['search']['multiple'])?.exclude
              ?.fromto as NumberSearchExcludeFromToType
          ).singleto
        ) > parseFloat(cards.value[index].result.min) &&
        parseFloat(
          (
            (holder.value as NumberType['search']['multiple'])?.exclude
              ?.fromto as NumberSearchExcludeFromToType
          ).singlefrom
        ) > parseFloat(cards.value[index].result.min) &&
        parseFloat(
          (
            (holder.value as NumberType['search']['multiple'])?.exclude
              ?.fromto as NumberSearchExcludeFromToType
          ).singleto
        ) < parseFloat((holder.value as NumberType['search']['multiple'])?.lessthan as string) &&
        parseFloat(
          (
            (holder.value as NumberType['search']['multiple'])?.exclude
              ?.fromto as NumberSearchExcludeFromToType
          ).singlefrom
        ) <
          parseFloat(
            (
              (holder.value as NumberType['search']['multiple'])?.exclude
                ?.fromto as NumberSearchExcludeFromToType
            ).singleto
          )
      )
    } else {
      return (
        parseFloat(
          (
            (holder.value as NumberType['search']['multiple'])?.exclude
              ?.fromto as NumberSearchExcludeFromToType
          ).singlefrom
        ) >
          parseFloat((holder.value as NumberType['search']['multiple'])?.fromto?.from as string) &&
        parseFloat(
          (
            (holder.value as NumberType['search']['multiple'])?.exclude
              ?.fromto as NumberSearchExcludeFromToType
          ).singleto
        ) < parseFloat((holder.value as NumberType['search']['multiple'])?.fromto?.to as string) &&
        parseFloat(
          (
            (holder.value as NumberType['search']['multiple'])?.exclude
              ?.fromto as NumberSearchExcludeFromToType
          ).singlefrom
        ) <
          parseFloat(
            (
              (holder.value as NumberType['search']['multiple'])?.exclude
                ?.fromto as NumberSearchExcludeFromToType
            ).singleto
          )
      )
    }
  } else {
    if ((holder.value as AtNumber<NumberSearchType>).search?.tab === 'GREATER-THAN') {
      return (
        /^\s*\d+(\.\d+)?\s*$/g.test(
          (
            (holder.value as AtNumber<NumberSearchType>).search?.exclude
              ?.fromto as NumberSearchExcludeFromToType
          ).singlefrom
        ) &&
        /^\s*\d+(\.\d+)?\s*$/g.test(
          (
            (holder.value as AtNumber<NumberSearchType>).search?.exclude
              ?.fromto as NumberSearchExcludeFromToType
          ).singleto
        ) &&
        parseFloat(
          (
            (holder.value as AtNumber<NumberSearchType>).search?.exclude
              ?.fromto as NumberSearchExcludeFromToType
          ).singlefrom
        ) >
          parseFloat((holder.value as AtNumber<NumberSearchType>).search?.greaterthan as string) &&
        parseFloat(
          (
            (holder.value as AtNumber<NumberSearchType>).search?.exclude
              ?.fromto as NumberSearchExcludeFromToType
          ).singlefrom
        ) <
          parseFloat(
            (
              (holder.value as AtNumber<NumberSearchType>).search?.exclude
                ?.fromto as NumberSearchExcludeFromToType
            ).singleto
          )
      )
    } else if ((holder.value as AtNumber<NumberSearchType>).search?.tab === 'LESS-THAN') {
      return (
        /^\s*\d+(\.\d+)?\s*$/g.test(
          (
            (holder.value as AtNumber<NumberSearchType>).search?.exclude
              ?.fromto as NumberSearchExcludeFromToType
          ).singlefrom
        ) &&
        /^\s*\d+(\.\d+)?\s*$/g.test(
          (
            (holder.value as AtNumber<NumberSearchType>).search?.exclude
              ?.fromto as NumberSearchExcludeFromToType
          ).singleto
        ) &&
        parseFloat(
          (
            (holder.value as AtNumber<NumberSearchType>).search?.exclude
              ?.fromto as NumberSearchExcludeFromToType
          ).singleto
        ) < parseFloat((holder.value as AtNumber<NumberSearchType>).search?.lessthan as string) &&
        parseFloat(
          (
            (holder.value as AtNumber<NumberSearchType>).search?.exclude
              ?.fromto as NumberSearchExcludeFromToType
          ).singlefrom
        ) <
          parseFloat(
            (
              (holder.value as AtNumber<NumberSearchType>).search?.exclude
                ?.fromto as NumberSearchExcludeFromToType
            ).singleto
          )
      )
    } else {
      return (
        /^\s*\d+(\.\d+)?\s*$/g.test(
          (
            (holder.value as AtNumber<NumberSearchType>).search?.exclude
              ?.fromto as NumberSearchExcludeFromToType
          ).singlefrom
        ) &&
        /^\s*\d+(\.\d+)?\s*$/g.test(
          (
            (holder.value as AtNumber<NumberSearchType>).search?.exclude
              ?.fromto as NumberSearchExcludeFromToType
          ).singleto
        ) &&
        parseFloat(
          (
            (holder.value as AtNumber<NumberSearchType>).search?.exclude
              ?.fromto as NumberSearchExcludeFromToType
          ).singlefrom
        ) >
          parseFloat((holder.value as AtNumber<NumberSearchType>).search?.fromto?.from as string) &&
        parseFloat(
          (
            (holder.value as AtNumber<NumberSearchType>).search?.exclude
              ?.fromto as NumberSearchExcludeFromToType
          ).singleto
        ) < parseFloat((holder.value as AtNumber<NumberSearchType>).search?.fromto?.to as string) &&
        parseFloat(
          (
            (holder.value as AtNumber<NumberSearchType>).search?.exclude
              ?.fromto as NumberSearchExcludeFromToType
          ).singlefrom
        ) <
          parseFloat(
            (
              (holder.value as AtNumber<NumberSearchType>).search?.exclude
                ?.fromto as NumberSearchExcludeFromToType
            ).singleto
          )
      )
    }
  }
})

const excludeAddNewEqualto = computed(() => {
  if (props.from === 'NUMBER-SEARCHER-MODAL') {
    if ((holder.value as NumberType['search']['multiple'])?.tab === 'GREATER-THAN') {
      return (
        parseFloat(
          (
            (holder.value as NumberType['search']['multiple'])?.exclude
              ?.equalto as NumberSearchExcludeEqualToType
          ).single
        ) > parseFloat((holder.value as NumberType['search']['multiple'])?.greaterthan as string) &&
        parseFloat(
          (
            (holder.value as NumberType['search']['multiple'])?.exclude
              ?.equalto as NumberSearchExcludeEqualToType
          ).single
        ) < parseFloat(cards.value[index].result.max)
      )
    } else if ((holder.value as NumberType['search']['multiple'])?.tab === 'LESS-THAN') {
      return (
        parseFloat(
          (
            (holder.value as NumberType['search']['multiple'])?.exclude
              ?.equalto as NumberSearchExcludeEqualToType
          ).single
        ) < parseFloat((holder.value as NumberType['search']['multiple'])?.lessthan as string) &&
        parseFloat(
          (
            (holder.value as NumberType['search']['multiple'])?.exclude
              ?.equalto as NumberSearchExcludeEqualToType
          ).single
        ) > parseFloat(cards.value[index].result.min)
      )
    } else {
      return (
        parseFloat(
          (
            (holder.value as NumberType['search']['multiple'])?.exclude
              ?.equalto as NumberSearchExcludeEqualToType
          ).single
        ) >
          parseFloat((holder.value as NumberType['search']['multiple'])?.fromto?.from as string) &&
        parseFloat(
          (
            (holder.value as NumberType['search']['multiple'])?.exclude
              ?.equalto as NumberSearchExcludeEqualToType
          ).single
        ) < parseFloat((holder.value as NumberType['search']['multiple'])?.fromto?.to as string)
      )
    }
  } else {
    if ((holder.value as AtNumber<NumberSearchType>).search?.tab === 'GREATER-THAN') {
      return (
        parseFloat(
          (
            (holder.value as AtNumber<NumberSearchType>).search?.exclude
              ?.equalto as NumberSearchExcludeEqualToType
          ).single
        ) >
          parseFloat((holder.value as AtNumber<NumberSearchType>).search?.greaterthan as string) &&
        /^\s*\d+(\.\d+)?\s*$/g.test(
          (
            (holder.value as AtNumber<NumberSearchType>).search?.exclude
              ?.equalto as NumberSearchExcludeEqualToType
          ).single
        )
      )
    } else if ((holder.value as AtNumber<NumberSearchType>).search?.tab === 'LESS-THAN') {
      return (
        parseFloat(
          (
            (holder.value as AtNumber<NumberSearchType>).search?.exclude
              ?.equalto as NumberSearchExcludeEqualToType
          ).single
        ) < parseFloat((holder.value as AtNumber<NumberSearchType>).search?.lessthan as string) &&
        /^\s*\d+(\.\d+)?\s*$/g.test(
          (
            (holder.value as AtNumber<NumberSearchType>).search?.exclude
              ?.equalto as NumberSearchExcludeEqualToType
          ).single
        )
      )
    } else {
      return (
        /^\s*\d+(\.\d+)?\s*$/g.test(
          (
            (holder.value as AtNumber<NumberSearchType>).search?.exclude
              ?.equalto as NumberSearchExcludeEqualToType
          ).single
        ) &&
        parseFloat(
          (
            (holder.value as AtNumber<NumberSearchType>).search?.exclude
              ?.equalto as NumberSearchExcludeEqualToType
          ).single
        ) >
          parseFloat((holder.value as AtNumber<NumberSearchType>).search?.fromto?.from as string) &&
        parseFloat(
          (
            (holder.value as AtNumber<NumberSearchType>).search?.exclude
              ?.equalto as NumberSearchExcludeEqualToType
          ).single
        ) < parseFloat((holder.value as AtNumber<NumberSearchType>).search?.fromto?.to as string)
      )
    }
  }
})

const fnc1 = computed(() => {
  return (props.from === 'NUMBER-SEARCHER-MODAL'
    ? (holder.value as NumberType['search']['multiple'])
    : (holder.value as AtNumber<NumberSearchType>).search
  )?.tab === 'GREATER-THAN'? 
  cards.value[index].result.max
  : (
    (props.from === 'NUMBER-SEARCHER-MODAL'? 
      (holder.value as NumberType['search']['multiple'])
      : 
      (holder.value as AtNumber<NumberSearchType>).search
    )?.tab === 'LESS-THAN'? 
    (props.from === 'NUMBER-SEARCHER-MODAL'
      ? (holder.value as NumberType['search']['multiple'])
      : (holder.value as AtNumber<NumberSearchType>).search
    )?.lessthan
    : 
    (props.from === 'NUMBER-SEARCHER-MODAL'
      ? (holder.value as NumberType['search']['multiple'])
      : (holder.value as AtNumber<NumberSearchType>).search
    )?.fromto?.to
  )
})

const fnc2 = computed(() => {
  return (
    props.from === 'NUMBER-SEARCHER-MODAL'? 
    (holder.value as NumberType['search']['multiple'])
    : 
    (holder.value as AtNumber<NumberSearchType>).search
  )?.tab === 'LESS-THAN'? 
  cards.value[index].result.min
  : (
    (
      props.from === 'NUMBER-SEARCHER-MODAL'? 
      (holder.value as NumberType['search']['multiple'])
      : 
      (holder.value as AtNumber<NumberSearchType>).search
    )?.tab === 'GREATER-THAN'? 
    (
      props.from === 'NUMBER-SEARCHER-MODAL'? 
      (holder.value as NumberType['search']['multiple'])
      : 
      (holder.value as AtNumber<NumberSearchType>).search
    )?.greaterthan
    : 
    (
      props.from === 'NUMBER-SEARCHER-MODAL'? 
      (holder.value as NumberType['search']['multiple'])
      : 
      (holder.value as AtNumber<NumberSearchType>).search
    )?.fromto?.from
  )
})

const fnc3 = computed(() => {
  return (
    props.from === 'NUMBER-SEARCHER-MODAL'
      ? (holder.value as NumberType['search']['multiple'])
      : (holder.value as AtNumber<NumberSearchType>).search
  )?.greaterthan
})

const fnc4 = computed(() => {
  return (
    props.from === 'NUMBER-SEARCHER-MODAL'
      ? (holder.value as NumberType['search']['multiple'])
      : (holder.value as AtNumber<NumberSearchType>).search
  )?.lessthan
})
</script>

<template>
  <div
    :class="[props.from === 'NUMBER-SEARCHER-MODAL' ? ['position-absolute', 't-0', 'l-0'] : '']"
    class="w-100 h-100 shadow-sm"
    style="z-index: 9000; background-color: #f8f8f8"
  >
    <div class="d-block h-100 m-0 p-0">
      <div class="shadow-sm d-block text-center" style="background-color: blue; padding: 0 0.63rem">
        <a
          class="underline-none cursor-pointer align-middle"
          @click="emits('close:atnumbersearchexcludenumberwindow', false)"
          @keypress.enter="emits('close:atnumbersearchexcludenumberwindow', false)"
        >
          <img
            src="http://localhost:5175/src/components/icons/close.png"
            class="align-middle"
            style="width: 2.205rem; height: 2.205rem"
          />
        </a>
      </div>
      <template v-if="props.from === 'NUMBER-SEARCHER-MODAL'">
        <div
          class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
          style="padding: 0.63rem 0"
        >
          <div class="flex-w-50">
            <span class="d-inline-block p-0 m-0 letter-spacing align-middle">
              Max: {{ fnc1 }}
            </span>
          </div>
          <div class="flex-w-50">
            <span class="d-inline-block p-0 m-0 letter-spacing align-middle">
              Min:
              {{ fnc2 }}
            </span>
          </div>
        </div>
      </template>
      <div class="d-block" style="padding: 0 5px">
        <template
          v-if="
            (props.from === 'NUMBER-SEARCHER-MODAL'
              ? (holder as NumberType['search']['multiple'])
              : (holder as AtNumber<NumberSearchType>).search
            )?.tab === 'GREATER-THAN'
          "
        >
          <div
            class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center shadow-sm"
            style="padding: 0.315rem 0.63rem; background-color: #fff"
          >
            <div class="flex-shrink-0 flex-grow-0 align-middle p-0 m-0">
              <img
                src="http://localhost:5175/src/components/icons/greater-than.png"
                style="width: 1.575rem; height: 1.575rem"
                class="align-middle"
              />
            </div>
            <div
              class="m-0 flex-shrink-0 flex-grow-0 letter-spacing font-bold align-middle"
              style="padding: 0.315rem 0 0.063rem 0.315rem"
            >
              {{ fnc3 }}
            </div>
          </div>
        </template>
        <template
          v-else-if="
            (props.from === 'NUMBER-SEARCHER-MODAL'
              ? (holder as NumberType['search']['multiple'])
              : (holder as AtNumber<NumberSearchType>).search
            )?.tab === 'LESS-THAN'
          "
        >
          <div
            class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center shadow-sm"
            style="padding: 0.315rem 0.63rem; background-color: #fff"
          >
            <div class="flex-shrink-0 flex-grow-0 align-middle p-0 m-0">
              <img
                src="http://localhost:5175/src/components/icons/less-than.png"
                style="width: 1.575rem; height: 1.575rem"
                class="align-middle"
              />
            </div>
            <div
              class="m-0 flex-shrink-0 flex-grow-0 letter-spacing font-bold align-middle"
              style="padding: 0.315rem 0 0.053rem 0.315rem"
            >
              {{ fnc4 }}
            </div>
          </div>
        </template>
        <template v-else>
          <div
            class="d-block shadow-sm text-center"
            style="padding: 0.315rem 0.63rem; background-color: #fff"
          >
            <img
              src="http://localhost:5175/src/components/icons/range.png"
              style="width: 1.575rem; height: 1.575rem"
              class="align-middle"
            />
          </div>
        </template>
      </div>
      <div class="d-block text-center" style="padding: 0.63rem 0 0.315rem 0">
        <span class="d-inline-block letter-spacing font-bold font-0-dot-70-rem">Exclude By</span>
      </div>
      <div class="d-block" style="padding: 0.315rem">
        <div class="d-block">
          <div
            class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
          >
            <div class="flex-w-60" style="padding-right: 0.315rem">
              <div class="d-block" style="background-color: #fff">
                <div class="d-block text-center shadow-sm" style="padding: 0.315rem 0">
                  <span class="d-inline-block letter-spacing font-0-dot-80-rem">RANGE</span>
                </div>
                <div class="d-block shadow-sm" style="padding: 0.63rem 0.315rem 0.315rem">
                  <div
                    class="w-100 flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
                  >
                    <div class="flex-fill p-0 m-0 align-self-stretch">
                      <div
                        class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
                      >
                        <div class="flex-w-50 p-0 m-0 align-self-stretch">
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
                                    : (holder as AtNumber<NumberSearchType>).search
                                  )?.exclude?.fromto as NumberSearchExcludeFromToType
                                ).singlefrom
                              "
                              type="text"
                              class="w-100 text-left"
                              style="height: 1.89rem; z-index: 1110"
                            />
                          </div>
                        </div>
                        <div class="flex-w-50 p-0 m-0 align-self-stretch">
                          <div class="d-block" style="padding-bottom: 0.315rem">
                            <label>To</label>
                          </div>
                          <div class="d-block">
                            <template
                              v-if="
                                (
                                  (props.from === 'NUMBER-SEARCHER-MODAL'
                                    ? (holder as NumberType['search']['multiple'])
                                    : (holder as AtNumber<NumberSearchType>).search
                                  )?.exclude?.fromto as NumberSearchExcludeFromToType
                                ).singlefrom.trim().length > 0
                              "
                            >
                              <input
                                aria-disabled="false"
                                @input="triggerHolder()"
                                v-model="
                                  (
                                    (props.from === 'NUMBER-SEARCHER-MODAL'
                                      ? (holder as NumberType['search']['multiple'])
                                      : (holder as AtNumber<NumberSearchType>).search
                                    )?.exclude?.fromto as NumberSearchExcludeFromToType
                                  ).singleto
                                "
                                @keypress.enter="
                                  excludeAddNewFromTo
                                    ? addLocalNewInputEntry(
                                        [
                                          (
                                            (props.from === 'NUMBER-SEARCHER-MODAL'
                                              ? (holder as NumberType['search']['multiple'])
                                              : (holder as AtNumber<NumberSearchType>).search
                                            )?.exclude?.fromto as NumberSearchExcludeFromToType
                                          )?.singlefrom,
                                          (
                                            (props.from === 'NUMBER-SEARCHER-MODAL'
                                              ? (holder as NumberType['search']['multiple'])
                                              : (holder as AtNumber<NumberSearchType>).search
                                            )?.exclude?.fromto as NumberSearchExcludeFromToType
                                          )?.singleto
                                        ],
                                        'EXCLUDE-FROM-TO'
                                      )
                                    : ''
                                "
                                @keydown.space.prevent
                                type="text"
                                class="w-100 text-left"
                                style="height: 1.89rem; z-index: 1110"
                              />
                            </template>
                            <template v-else>
                              <input
                                @keydown.space.prevent
                                aria-disabled="true"
                                type="text"
                                class="w-100 text-left"
                                style="height: 1.89rem; z-index: 1110"
                              />
                            </template>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="flex-w-1-dot-75-rem p-0 m-0 align-self-stretch">
                      <div class="d-block" style="padding-bottom: 0.315rem">
                        <label>&nbsp;</label>
                      </div>
                      <div class="d-block" style="outline: 0.063rem solid rgba(0, 0, 0, 0.2)">
                        <button
                          :style="
                            excludeAddNewFromTo
                              ? 'background-color: #F0E68C;'
                              : 'background-color: #eee;'
                          "
                          :disabled="excludeAddNewFromTo ? false : true"
                          :class="[excludeAddNewFromTo ? 'cursor-pointer' : '']"
                          @keypress.enter="
                            excludeAddNewFromTo
                              ? addLocalNewInputEntry(
                                  [
                                    (
                                      (props.from === 'NUMBER-SEARCHER-MODAL'
                                        ? (holder as NumberType['search']['multiple'])
                                        : (holder as AtNumber<NumberSearchType>).search
                                      )?.exclude?.fromto as NumberSearchExcludeFromToType
                                    )?.singlefrom,
                                    (
                                      (props.from === 'NUMBER-SEARCHER-MODAL'
                                        ? (holder as NumberType['search']['multiple'])
                                        : (holder as AtNumber<NumberSearchType>).search
                                      )?.exclude?.fromto as NumberSearchExcludeFromToType
                                    )?.singleto
                                  ],
                                  'EXCLUDE-FROM-TO'
                                )
                              : ''
                          "
                          @click="
                            excludeAddNewFromTo
                              ? addLocalNewInputEntry(
                                  [
                                    (
                                      (props.from === 'NUMBER-SEARCHER-MODAL'
                                        ? (holder as NumberType['search']['multiple'])
                                        : (holder as AtNumber<NumberSearchType>).search
                                      )?.exclude?.fromto as NumberSearchExcludeFromToType
                                    )?.singlefrom,
                                    (
                                      (props.from === 'NUMBER-SEARCHER-MODAL'
                                        ? (holder as NumberType['search']['multiple'])
                                        : (holder as AtNumber<NumberSearchType>).search
                                      )?.exclude?.fromto as NumberSearchExcludeFromToType
                                    )?.singleto
                                  ],
                                  'EXCLUDE-FROM-TO'
                                )
                              : ''
                          "
                          class="btn w-100 shadow-sm font-0-dot-85-rem text-center"
                          style="height: 1.89rem; padding: 0 0.126rem"
                        >
                          <img src="http://localhost:5175/src/components/icons/add.png" class="wh-1-dot-25-rem align-middle" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <paste-copied
                    :pastearea="
                      props.from === 'NUMBER-SEARCHER-MODAL'
                        ? 'NUMBER-EXCLUSIVE-FROM-TO'
                        : 'ATNUMBER-EXCLUSIVE-FROM-TO'
                    "
                    @return:newlypasteditems="
                      ($val: string[][]) => {
                        addPastedItems($val, 'EXCLUDE-FROM-TO')
                      }
                    "
                    :receiveclosepastemodalsignal="
                      (
                        (props.from === 'NUMBER-SEARCHER-MODAL'
                          ? (holder as NumberType['search']['multiple'])
                          : (holder as AtNumber<NumberSearchType>).search
                        )?.exclude?.fromto as NumberSearchExcludeFromToType
                      )?.closepaste
                    "
                    title="none overlapping a-b range"
                    :datatype="'NumberRange'"
                    :max="
                      ((props.from === 'NUMBER-SEARCHER-MODAL'
                        ? (holder as NumberType['search']['multiple'])
                        : (holder as AtNumber<NumberSearchType>).search
                      )?.tab === 'GREATER-THAN'
                        ? cards[index].result.max
                        : (props.from === 'NUMBER-SEARCHER-MODAL'
                            ? (holder as NumberType['search']['multiple'])
                            : (holder as AtNumber<NumberSearchType>).search
                          )?.tab === 'LESS-THAN'
                        ? (props.from === 'NUMBER-SEARCHER-MODAL'
                            ? (holder as NumberType['search']['multiple'])
                            : (holder as AtNumber<NumberSearchType>).search
                          )?.lessthan
                        : (props.from === 'NUMBER-SEARCHER-MODAL'
                            ? (holder as NumberType['search']['multiple'])
                            : (holder as AtNumber<NumberSearchType>).search
                          )?.fromto?.to) as string
                    "
                    :min="
                      ((props.from === 'NUMBER-SEARCHER-MODAL'
                        ? (holder as NumberType['search']['multiple'])
                        : (holder as AtNumber<NumberSearchType>).search
                      )?.tab === 'LESS-THAN'
                        ? cards[index].result.min
                        : (props.from === 'NUMBER-SEARCHER-MODAL'
                            ? (holder as NumberType['search']['multiple'])
                            : (holder as AtNumber<NumberSearchType>).search
                          )?.tab === 'GREATER-THAN'
                        ? (props.from === 'NUMBER-SEARCHER-MODAL'
                            ? (holder as NumberType['search']['multiple'])
                            : (holder as AtNumber<NumberSearchType>).search
                          )?.greaterthan
                        : (props.from === 'NUMBER-SEARCHER-MODAL'
                            ? (holder as NumberType['search']['multiple'])
                            : (holder as AtNumber<NumberSearchType>).search
                          )?.fromto?.from) as string
                    "
                  >
                    <template v-slot:outcomeidentifier>
                      <div
                        class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                      >
                        <div class="flex-fill text-center">
                          <div
                            class="d-inline-block align-middle"
                            style="background-color: #fff; width: 0.945rem; height: 0.945rem"
                          ></div>
                          Pasted Lines
                        </div>
                        <div class="flex-fill text-center">
                          <div
                            class="d-inline-block align-middle"
                            style="background-color: red; width: 0.945rem; height: 0.945rem"
                          ></div>
                          Invalid Numbers
                        </div>
                      </div>
                    </template>
                  </paste-copied>
                  <PastedItemAndNewlyInputedEntryDisplayer
                    :paginationarea="
                      props.from === 'NUMBER-SEARCHER-MODAL'
                        ? 'NUMBER-EXCLUSIVE-FROM-TO'
                        : 'ATNUMBER-EXCLUSIVE-FROM-TO'
                    "
                    :current="[
                      (
                        (props.from === 'NUMBER-SEARCHER-MODAL'
                          ? (holder as NumberType['search']['multiple'])
                          : (holder as AtNumber<NumberSearchType>).search
                        )?.exclude?.fromto as NumberSearchExcludeFromToType
                      )?.signal,
                      (
                        (props.from === 'NUMBER-SEARCHER-MODAL'
                          ? (holder as NumberType['search']['multiple'])
                          : (holder as AtNumber<NumberSearchType>).search
                        )?.exclude?.fromto as NumberSearchExcludeFromToType
                      )?.current
                    ]"
                    :tree="
                      (props.from === 'NUMBER-SEARCHER-MODAL'
                        ? (holder as NumberType['search']['multiple'])
                        : (holder as AtNumber<NumberSearchType>).search
                      )?.exclude?.fromto as NumberSearchExcludeFromToType
                    "
                    treetype="NumberSearchExcludeFromToType"
                    :scrollareaid="cards[index].scroll.areaid + '-exclude-from-to'"
                    @update:current="
                      ($val: number) => {
                        ;(
                          (props.from === 'NUMBER-SEARCHER-MODAL'
                            ? (holder as NumberType['search']['multiple'])
                            : (holder as AtNumber<NumberSearchType>).search
                          )?.exclude?.fromto as NumberSearchExcludeFromToType
                        ).current = $val
                        triggerHolder()
                      }
                    "
                  ></PastedItemAndNewlyInputedEntryDisplayer>
                </div>
              </div>
            </div>
            <div class="flex-w-40" style="padding-left: 0.315rem">
              <div class="d-block" style="background-color: #fff">
                <div class="d-block text-center shadow-sm" style="padding: 0.315rem 0">
                  <span class="d-inline-block letter-spacing font-0-dot-80-rem">EQUAL TO</span>
                </div>
                <div class="d-block shadow-sm" style="padding: 0.63rem 0.315rem 0.315rem">
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
                    <div
                      class="flex-fill p-0 m-0 align-self-stretch"
                      style="padding-right: 0.126rem"
                    >
                      <input
                        @input="triggerHolder()"
                        v-model="
                          (
                            (props.from === 'NUMBER-SEARCHER-MODAL'
                              ? (holder as NumberType['search']['multiple'])
                              : (holder as AtNumber<NumberSearchType>).search
                            )?.exclude?.equalto as NumberSearchExcludeEqualToType
                          ).single
                        "
                        type="text"
                        @keydown.space.prevent
                        @keypress.enter="
                          excludeAddNewEqualto
                            ? addLocalNewInputEntry(
                                (
                                  (props.from === 'NUMBER-SEARCHER-MODAL'
                                    ? (holder as NumberType['search']['multiple'])
                                    : (holder as AtNumber<NumberSearchType>).search
                                  )?.exclude?.equalto as NumberSearchExcludeEqualToType
                                )?.single,
                                'EXCLUDE-EQUAL-TO'
                              )
                            : ''
                        "
                        class="w-100 text-left"
                        style="height: 1.89rem; z-index: 1110"
                      />
                    </div>
                    <div
                      class="flex-w-1-dot-75-rem p-0 m-0 align-self-stretch"
                      style="outline: 0.063rem solid rgba(0, 0, 0, 0.2)"
                    >
                      <button
                        @click="
                          excludeAddNewEqualto
                            ? addLocalNewInputEntry(
                                (
                                  (props.from === 'NUMBER-SEARCHER-MODAL'
                                    ? (holder as NumberType['search']['multiple'])
                                    : (holder as AtNumber<NumberSearchType>).search
                                  )?.exclude?.equalto as NumberSearchExcludeEqualToType
                                )?.single,
                                'EXCLUDE-EQUAL-TO'
                              )
                            : ''
                        "
                        @keypress.enter="
                          excludeAddNewEqualto
                            ? addLocalNewInputEntry(
                                (
                                  (props.from === 'NUMBER-SEARCHER-MODAL'
                                    ? (holder as NumberType['search']['multiple'])
                                    : (holder as AtNumber<NumberSearchType>).search
                                  )?.exclude?.equalto as NumberSearchExcludeEqualToType
                                )?.single,
                                'EXCLUDE-EQUAL-TO'
                              )
                            : ''
                        "
                        :class="[excludeAddNewEqualto ? 'cursor-pointer' : '']"
                        class="btn w-100 shadow-sm font-0-dot-85-rem"
                        style="height: 1.89rem; padding: 0 0.126rem"
                        :style="
                          excludeAddNewEqualto
                            ? 'background-color: #F0E68C;'
                            : 'background-color: #eee;'
                        "
                        :disabled="excludeAddNewEqualto ? false : true"
                      >
                        <img src="http://localhost:5175/src/components/icons/add.png" class="wh-1-dot-25-rem align-middle" />
                      </button>
                    </div>
                  </div>
                  <paste-copied
                    :pastearea="
                      props.from === 'NUMBER-SEARCHER-MODAL'
                        ? 'NUMBER-EXCLUSIVE-EQUAL-TO'
                        : 'ATNUMBER-EXCLUSIVE-EQUAL-TO'
                    "
                    @return:newlypasteditems="
                      ($val: string[][]) => {
                        addPastedItems($val, 'EXCLUDE-EQUAL-TO')
                      }
                    "
                    :receiveclosepastemodalsignal="
                      (
                        (props.from === 'NUMBER-SEARCHER-MODAL'
                          ? (holder as NumberType['search']['multiple'])
                          : (holder as AtNumber<NumberSearchType>).search
                        )?.exclude?.equalto as NumberSearchExcludeEqualToType
                      )?.closepaste
                    "
                    title="numbers"
                    datatype="Number"
                    :max="
                      ((props.from === 'NUMBER-SEARCHER-MODAL'
                        ? (holder as NumberType['search']['multiple'])
                        : (holder as AtNumber<NumberSearchType>).search
                      )?.tab === 'GREATER-THAN'
                        ? cards[index].result.max
                        : (props.from === 'NUMBER-SEARCHER-MODAL'
                            ? (holder as NumberType['search']['multiple'])
                            : (holder as AtNumber<NumberSearchType>).search
                          )?.tab === 'LESS-THAN'
                        ? (props.from === 'NUMBER-SEARCHER-MODAL'
                            ? (holder as NumberType['search']['multiple'])
                            : (holder as AtNumber<NumberSearchType>).search
                          )?.lessthan
                        : (props.from === 'NUMBER-SEARCHER-MODAL'
                            ? (holder as NumberType['search']['multiple'])
                            : (holder as AtNumber<NumberSearchType>).search
                          )?.fromto?.to) as string
                    "
                    :min="
                      ((props.from === 'NUMBER-SEARCHER-MODAL'
                        ? (holder as NumberType['search']['multiple'])
                        : (holder as AtNumber<NumberSearchType>).search
                      )?.tab === 'LESS-THAN'
                        ? cards[index].result.min
                        : (props.from === 'NUMBER-SEARCHER-MODAL'
                            ? (holder as NumberType['search']['multiple'])
                            : (holder as AtNumber<NumberSearchType>).search
                          )?.tab === 'GREATER-THAN'
                        ? (props.from === 'NUMBER-SEARCHER-MODAL'
                            ? (holder as NumberType['search']['multiple'])
                            : (holder as AtNumber<NumberSearchType>).search
                          )?.greaterthan
                        : (props.from === 'NUMBER-SEARCHER-MODAL'
                            ? (holder as NumberType['search']['multiple'])
                            : (holder as AtNumber<NumberSearchType>).search
                          )?.fromto?.from) as string
                    "
                  >
                    <template v-slot:outcomeidentifier>
                      <div
                        class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                      >
                        <div class="flex-fill text-center">
                          <div
                            class="d-inline-block align-middle"
                            style="background-color: #fff; width: 0.945rem; height: 0.945rem"
                          ></div>
                          Pasted Lines
                        </div>
                        <div class="flex-fill text-center">
                          <div
                            class="d-inline-block align-middle"
                            style="background-color: red; width: 0.945rem; height: 0.945rem"
                          ></div>
                          Invalid Numbers
                        </div>
                      </div>
                    </template>
                  </paste-copied>
                  <PastedItemAndNewlyInputedEntryDisplayer
                    :paginationarea="
                      props.from === 'NUMBER-SEARCHER-MODAL'
                        ? 'NUMBER-EXCLUSIVE-EQUAL-TO'
                        : 'ATNUMBER-EXCLUSIVE-EQUAL-TO'
                    "
                    :current="[
                      (
                        (props.from === 'NUMBER-SEARCHER-MODAL'
                          ? (holder as NumberType['search']['multiple'])
                          : (holder as AtNumber<NumberSearchType>).search
                        )?.exclude?.equalto as NumberSearchExcludeEqualToType
                      ).signal,
                      (
                        (props.from === 'NUMBER-SEARCHER-MODAL'
                          ? (holder as NumberType['search']['multiple'])
                          : (holder as AtNumber<NumberSearchType>).search
                        )?.exclude?.equalto as NumberSearchExcludeEqualToType
                      )?.current
                    ]"
                    :tree="
                      (props.from === 'NUMBER-SEARCHER-MODAL'
                        ? (holder as NumberType['search']['multiple'])
                        : (holder as AtNumber<NumberSearchType>).search
                      )?.exclude?.equalto as NumberSearchExcludeEqualToType
                    "
                    treetype="NumberSearchExcludeEqualToType"
                    :scrollareaid="cards[index].scroll.areaid + '-exclude-equal-to'"
                    @update:current="
                      ($val: number) => {
                        ;(
                          (props.from === 'NUMBER-SEARCHER-MODAL'
                            ? (holder as NumberType['search']['multiple'])
                            : (holder as AtNumber<NumberSearchType>).search
                          )?.exclude?.equalto as NumberSearchExcludeEqualToType
                        ).current = $val
                        triggerHolder()
                      }
                    "
                  ></PastedItemAndNewlyInputedEntryDisplayer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
