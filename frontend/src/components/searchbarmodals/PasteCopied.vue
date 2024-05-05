<script setup lang="ts">
import { format } from 'date-fns'
import { watch, ref, onBeforeUnmount, onBeforeMount, type WatchStopHandle } from 'vue'
import type { DuplicateCheckerObjectType } from '../types/days_months_years_types'
import { removeDelimiters } from '../utility/dd_mm_yy_utility_fns'

const emits = defineEmits<{
    (e: 'return:newlypasteditems', action: string[][]): void
  }>(),
  props = defineProps<{
    pastearea:
      | 'DATE-DATETIME-DD-MM-YYYY-AREA'
      | 'YEAR-AREA'
      | 'WORD-DISPLAY-AREA-WITH-ATNUMBER-BEEN-CLICKED-BUT-WITHOUT-INCLUDE-AND-EXCLUDE'
      | 'WORD-DISPLAY-AREA-WITH-ATNUMBER-BUT-NOT-YET-CLICKED-AND-WITHOUT-INCLUDE-AND-EXCLUDE'
      | 'WORD-DISPLAY-AREA-WITHOUT-INCLUDE-EXCLUDE-AND-ATNUMBER'
      | 'WORD-DISPLAY-AREA-WITH-INCLUDE-EXCLUDE-AND-ATNUMBER'
      | 'WORD-DISPLAY-AREA-WITH-INCLUDE-AND-EXCLUDE-BUT-WITHOUT-ATNUMBER'
      | 'ATNUMBER-INCLUSIVE-EQUAL-TO'
      | 'ATNUMBER-INCLUSIVE-NOT-EQUAL-TO'
      | 'ATNUMBER-EXCLUSIVE-EQUAL-TO'
      | 'ATNUMBER-EXCLUSIVE-FROM-TO'
      | 'NUMBER-INCLUSIVE-EQUAL-TO'
      | 'NUMBER-INCLUSIVE-NOT-EQUAL-TO'
      | 'NUMBER-EXCLUSIVE-EQUAL-TO'
      | 'NUMBER-EXCLUSIVE-FROM-TO'
    receiveclosepastemodalsignal?: number | undefined
    title: string
    min?: string | undefined
    max?: string | undefined
    datatype:
      | 'NumberFromNumberString'
      | 'NumberRange'
      | 'DateTime'
      | 'Date'
      | 'Year'
      | 'MultipleWordsString'
      | 'SingleWordString'
      | 'NumberString'
      | 'Number'
  }>()
let pastemultiplelines = ref(false),
  pastetextarearef = ref<HTMLTextAreaElement>(),
  pasteexpanded = ref(false),
  pasteditemloading = ref(false),
  pastedmultiplelinesoftext = ref(''),
  hassomethingtopaste = ref(false),
  pasteditemvalidity = ref<string[][]>([]),
  duplicateCheckerObject = {} as DuplicateCheckerObjectType,
  actualpasteddata = '',
  unwatchpastedmultiplelinesoftext: WatchStopHandle,
  unwatchclosepasted: WatchStopHandle

function openPasteArea() {
  pastemultiplelines.value = true
  pasteexpanded.value = false
  pastedmultiplelinesoftext.value = ''
  pasteditemloading.value = false
  duplicateCheckerObject = {} as DuplicateCheckerObjectType

  let tt: ReturnType<typeof setTimeout>
  tt = setTimeout(() => {
    ;(pastetextarearef.value as HTMLTextAreaElement).focus()
    clearTimeout(tt)
  }, 50)
}

function handlePaste(e: ClipboardEvent) {
  const { clipboardData } = e
  const pastedText = (clipboardData as DataTransfer).getData('text')
  return pastedText
}

function pasteMultilineWordsCopiedFromSomewhere(e: any) {
  ;(pastetextarearef.value as HTMLTextAreaElement).maxLength = 5000
  actualpasteddata = handlePaste(e)
  let pastelengthresizetimer: ReturnType<typeof setTimeout>
  pastelengthresizetimer = setTimeout(() => {
    ;(pastetextarearef.value as HTMLTextAreaElement).maxLength = 0
    clearTimeout(pastelengthresizetimer)
  }, 10)
}

function findRejectedAndAcceptedLines(
  actualtext: string,
  textareaacceptedtext: string,
  max?: string | undefined,
  min?: string | undefined
) {
  let actualtextArray = actualtext.split('\n')
  let textareaacceptedtextArray = textareaacceptedtext.split('\n')
  if (textareaacceptedtextArray[textareaacceptedtextArray.length - 1].trim() !== '') {
    if (
      textareaacceptedtextArray[textareaacceptedtextArray.length - 1] !==
      actualtextArray[textareaacceptedtextArray.length - 1]
    ) {
      textareaacceptedtextArray.splice(textareaacceptedtextArray.length - 1, 1)
      actualtextArray.splice(textareaacceptedtextArray.length - 1, 1)
    }
  }
  for (let i = 0; i < textareaacceptedtextArray.length; i++) {
    if (textareaacceptedtextArray[i].trim() === '') {
      textareaacceptedtextArray.splice(i, 1)
      continue
    }
  }
  if (props.datatype === 'Date') {
    return removeDuplicateAndValidateDateLine(
      textareaacceptedtextArray,
      min as string,
      max as string
    )
  } else if (props.datatype === 'Year' || props.datatype === 'Number') {
    return removeDuplicateAndValidateNumericLine(
      textareaacceptedtextArray,
      min as string,
      max as string
    )
  } else if (props.datatype === 'NumberRange') {
    return removeDuplicateAndValidateNumericRangeLine(
      textareaacceptedtextArray,
      min as string,
      max as string
    )
  } else if (props.datatype === 'NumberFromNumberString') {
    return removeDuplicateAndValidateNumericLineWithoutLimit(textareaacceptedtextArray)
  } else {
    return removeDuplicateAndValidateStringLine(textareaacceptedtextArray)
  }
}

function removeDuplicateAndValidateNumericRangeLine(
  acceptedArray: string[],
  min: string,
  max: string
) {
  let newArray: [string, string][] = [],
    index = 0
  acceptedArray.forEach((item) => {
    if (item.trim().length > 0) {
      if (
        (duplicateCheckerObject as DuplicateCheckerObjectType)['' + item] === undefined ||
        (duplicateCheckerObject as DuplicateCheckerObjectType)['' + item] === null
      ) {
        ;(duplicateCheckerObject as DuplicateCheckerObjectType)['' + item] = ''
        if (/^\d+(\.\d+)?\s*-\s*\d+(\.\d+)?$/g.test(item)) {
          let splititem = item.split('-')
          if (parseFloat(splititem[0].trim()) < parseFloat(splititem[1].trim())) {
            if (
              parseFloat(splititem[0].trim()) > parseFloat(min) &&
              parseFloat(splititem[1].trim()) < parseFloat(max)
            ) {
              let isoverlappingrange = false
              for (let i = 0; i < newArray.length; i++) {
                if (newArray[i][1] !== 'ERROR') {
                  let splititem1 = newArray[i][0].split('-')
                  if (
                    (parseFloat(splititem[0].trim()) >= parseFloat(splititem1[0].trim()) &&
                      parseFloat(splititem[0].trim()) < parseFloat(splititem1[1].trim()) &&
                      parseFloat(splititem[1].trim()) >= parseFloat(splititem1[1].trim())) ||
                    (parseFloat(splititem[0].trim()) >= parseFloat(splititem1[0].trim()) &&
                      parseFloat(splititem[1].trim()) <= parseFloat(splititem1[1].trim())) || //here
                    ((parseFloat(splititem[1].trim()) >= parseFloat(splititem1[1].trim()) ||
                      (parseFloat(splititem[1].trim()) <= parseFloat(splititem1[1].trim()) &&
                        parseFloat(splititem[1].trim()) >= parseFloat(splititem1[0].trim()))) &&
                      parseFloat(splititem[0].trim()) <= parseFloat(splititem1[0].trim())) ||
                    parseFloat(splititem[1].trim()) === parseFloat(splititem1[0].trim()) ||
                    parseFloat(splititem[0].trim()) === parseFloat(splititem1[1].trim())
                  ) {
                    isoverlappingrange = true
                    break
                  }
                }
              }
              if (!isoverlappingrange) {
                newArray[index] = [item, 'GOOD']
                hassomethingtopaste.value = true
              } else {
                newArray[index] = [item, 'ERROR']
              }
            } else {
              newArray[index] = [item, 'ERROR']
            }
          } else {
            newArray[index] = [item, 'ERROR']
          }
        } else {
          newArray[index] = [item, 'ERROR']
        }
        index++
      }
    }
  })
  return newArray
}

function removeDuplicateAndValidateNumericLineWithoutLimit(acceptedArray: string[]) {
  let newArray: [string, string][] = [],
    index = 0
  acceptedArray.forEach((item) => {
    if (item.trim() !== '') {
      if (
        (duplicateCheckerObject as DuplicateCheckerObjectType)['' + item] === undefined ||
        (duplicateCheckerObject as DuplicateCheckerObjectType)['' + item] === null
      ) {
        if (/^\s*\d+(\.\d+)?\s*$/g.test(item)) {
          ;(duplicateCheckerObject as DuplicateCheckerObjectType)['' + item] = ''
          newArray[index] = [item, 'GOOD']
          hassomethingtopaste.value = true
        } else {
          ;(duplicateCheckerObject as DuplicateCheckerObjectType)['' + item] = ''
          newArray[index] = [item, 'ERROR']
        }
        index++
      }
    }
  })
  return newArray
}

function removeDuplicateAndValidateDateLine(acceptedArray: string[], min: string, max: string) {
  let newArray: [string, string][] = [],
    index = 0
  acceptedArray.forEach((item) => {
    if (item.trim() !== '') {
      if (
        duplicateCheckerObject['' + item] === undefined ||
        duplicateCheckerObject['' + item] === null
      ) {
        try {
          let removedDelimiter = removeDelimiters(item)
          if (removedDelimiter[1]) {
            if (
              format(new Date(removedDelimiter[0] as string), 'yyyy-MM-dd') >=
                format(new Date(min), 'yyyy-MM-dd') &&
              format(new Date(removedDelimiter[0] as string), 'yyyy-MM-dd') <=
                format(new Date(max), 'yyyy-MM-dd')
            ) {
              duplicateCheckerObject['' + item] = ''
              newArray[index] = [item, 'DATE']
              hassomethingtopaste.value = true
            } else {
              duplicateCheckerObject['' + item] = ''
              newArray[index] = [item, 'OUT-OF-RANGE']
            }
          } else {
            let splited = (removedDelimiter[0] as string).split(' ')
            if (splited.length === 1 || splited.length === 2) {
              duplicateCheckerObject['' + item] = ''
              newArray[index] = [item, 'ERROR']
            } else {
              duplicateCheckerObject['' + item] = ''
              newArray[index] = [item, 'INDETERMINATE']
            }
          }
        } catch (ex) {
          let invaliddatetest = testInvalidDateValidity(item, min, max)
          if (invaliddatetest === 'VALID') {
            duplicateCheckerObject['' + item] = ''
            newArray[index] = [item, 'DATE']
            hassomethingtopaste.value = true
          } else if (invaliddatetest === 'OUT-OF-RANGE') {
            duplicateCheckerObject['' + item] = ''
            newArray[index] = [item, 'OUT-OF-RANGE']
          } else if (invaliddatetest === 'INDETERMINATE') {
            duplicateCheckerObject['' + item] = ''
            newArray[index] = [item, 'INDETERMINATE']
          } else {
            duplicateCheckerObject['' + item] = ''
            newArray[index] = [item, 'ERROR']
          }
        }
        index++
      }
    }
  })
  return newArray
}

function removeDuplicateAndValidateNumericLine(
  acceptedArray: string[],
  min?: string | undefined,
  max?: string | undefined
) {
  let newArray: [string, string][] = [],
    index = 0
  acceptedArray.forEach((item) => {
    if (item.trim() !== '') {
      if (
        (duplicateCheckerObject as DuplicateCheckerObjectType)['' + item] === undefined ||
        (duplicateCheckerObject as DuplicateCheckerObjectType)['' + item] === null
      ) {
        if (max !== undefined && min !== undefined) {
          if (/^\s*\d+(\.\d+)?\s*$/g.test(item)) {
            if (parseFloat(item) > parseFloat(min) && parseFloat(item) < parseFloat(max)) {
              ;(duplicateCheckerObject as DuplicateCheckerObjectType)['' + item] = ''
              newArray[index] = [item, 'GOOD']
              hassomethingtopaste.value = true
            } else {
              ;(duplicateCheckerObject as DuplicateCheckerObjectType)['' + item] = ''
              newArray[index] = [item, 'ERROR']
            }
          } else {
            ;(duplicateCheckerObject as DuplicateCheckerObjectType)['' + item] = ''
            newArray[index] = [item, 'ERROR']
          }
        }
        index++
      }
    }
  })
  return newArray
}

function removeDuplicateAndValidateStringLine(acceptedArray: string[]) {
  let newArray: string[][] = [],
    index = 0
  acceptedArray.forEach((item: string) => {
    if (item.trim() !== '') {
      if (
        duplicateCheckerObject['' + item] === undefined ||
        duplicateCheckerObject['' + item] === null
      ) {
        if (item.length <= 40) {
          duplicateCheckerObject['' + item] = ''
          newArray[index] = [item, 'GOOD']
        } else {
          duplicateCheckerObject['' + item] = ''
          newArray[index] = [item, 'ERROR']
        }
        index++
      }
    }
  })
  return newArray
}

function testInvalidDateValidity(pasteddate: string, min: string, max: string) {
  let delimiterRemovedDate = removeDelimiters(pasteddate),
    delimiterRemovedDateArray = (delimiterRemovedDate[0] as string).split(' '),
    teststringdate = ''
  try {
    if (delimiterRemovedDateArray.length === 3) {
      if (
        (parseInt(delimiterRemovedDateArray[1]) < 13 &&
          parseInt(delimiterRemovedDateArray[2]) < 13) ||
        (parseInt(delimiterRemovedDateArray[0]) < 13 && parseInt(delimiterRemovedDateArray[1]) < 13)
      ) {
        return 'INDETERMINATE'
      } else {
        for (let i = delimiterRemovedDateArray.length - 1; i >= 0; i--) {
          teststringdate += delimiterRemovedDateArray[i]
          if (i > 0) {
            teststringdate += ' '
          }
        }
        if (
          format(new Date(teststringdate), 'yyyy-MM-dd') >= format(new Date(min), 'yyyy-MM-dd') &&
          format(new Date(teststringdate), 'yyyy-MM-dd') <= format(new Date(max), 'yyyy-MM-dd')
        ) {
          return 'VALID'
        } else {
          return 'OUT-OF-RANGE'
        }
      }
    } else {
      return 'ERROR'
    }
  } catch (ex) {
    return 'ERROR'
  }
}

onBeforeUnmount(() => {
  unwatchpastedmultiplelinesoftext()
  unwatchclosepasted()
})

onBeforeMount(() => {
  unwatchclosepasted = watch(
    () => props.receiveclosepastemodalsignal,
    () => {
      pastemultiplelines.value = false
      pasteexpanded.value = false
      pastedmultiplelinesoftext.value = ''
      pasteditemloading.value = false
      duplicateCheckerObject = {} as DuplicateCheckerObjectType
    }
  )
  unwatchpastedmultiplelinesoftext = watch(
    () => pastedmultiplelinesoftext.value,
    (text) => {
      pasteditemloading.value = true
      let pt: ReturnType<typeof setTimeout>
      pt = setTimeout(() => {
        if (
          props.datatype === 'NumberRange' ||
          props.datatype === 'Date' ||
          props.datatype === 'Year' ||
          props.datatype === 'Number'
        ) {
          pasteditemvalidity.value = findRejectedAndAcceptedLines(
            actualpasteddata,
            text,
            props.max,
            props.min
          ) as string[][]
        } else {
          pasteditemvalidity.value = findRejectedAndAcceptedLines(
            actualpasteddata,
            text
          ) as string[][]
        }
        pasteditemloading.value = false
        pasteexpanded.value = true
        clearTimeout(pt)
      }, 200)
    }
  )
})
</script>

<template>
  <div class="d-block" style="padding: 5px 0">
    <div class="d-block position-relative p-0 m-0">
      <template v-if="pastemultiplelines">
        <div
          class="w-100 position-absolute t-0 l-0 shadow-sm overflow-hidden"
          style="background-color: #fff; border: 1px solid #fff; z-index: 1000"
        >
          <div
            class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
            :style="
              props.pastearea === 'ATNUMBER-INCLUSIVE-EQUAL-TO' ||
              props.pastearea === 'ATNUMBER-INCLUSIVE-NOT-EQUAL-TO' ||
              props.pastearea === 'ATNUMBER-EXCLUSIVE-EQUAL-TO' ||
              props.pastearea === 'ATNUMBER-EXCLUSIVE-FROM-TO' ||
              props.pastearea === 'NUMBER-INCLUSIVE-EQUAL-TO' ||
              props.pastearea === 'NUMBER-INCLUSIVE-NOT-EQUAL-TO' ||
              props.pastearea === 'NUMBER-EXCLUSIVE-EQUAL-TO' ||
              props.pastearea === 'NUMBER-EXCLUSIVE-FROM-TO'
                ? 'height: 50px;'
                : 'height: 30px;'
            "
          >
            <div
              class="flex-fill"
              :style="
                props.pastearea === 'ATNUMBER-INCLUSIVE-EQUAL-TO' ||
                props.pastearea === 'ATNUMBER-INCLUSIVE-NOT-EQUAL-TO' ||
                props.pastearea === 'ATNUMBER-EXCLUSIVE-EQUAL-TO' ||
                props.pastearea === 'ATNUMBER-EXCLUSIVE-FROM-TO' ||
                props.pastearea === 'NUMBER-INCLUSIVE-EQUAL-TO' ||
                props.pastearea === 'NUMBER-INCLUSIVE-NOT-EQUAL-TO' ||
                props.pastearea === 'NUMBER-EXCLUSIVE-EQUAL-TO' ||
                props.pastearea === 'NUMBER-EXCLUSIVE-FROM-TO'
                  ? 'font-size: 0.73rem'
                  : 'font-size: 0.85rem;'
              "
            >
              <template
                v-if="
                  props.pastearea === 'ATNUMBER-INCLUSIVE-EQUAL-TO' ||
                  props.pastearea === 'ATNUMBER-INCLUSIVE-NOT-EQUAL-TO' ||
                  props.pastearea === 'ATNUMBER-EXCLUSIVE-EQUAL-TO' ||
                  props.pastearea === 'ATNUMBER-EXCLUSIVE-FROM-TO' ||
                  props.pastearea === 'NUMBER-INCLUSIVE-EQUAL-TO' ||
                  props.pastearea === 'NUMBER-INCLUSIVE-NOT-EQUAL-TO' ||
                  props.pastearea === 'NUMBER-EXCLUSIVE-EQUAL-TO' ||
                  props.pastearea === 'NUMBER-EXCLUSIVE-FROM-TO'
                "
              >
                <div class="d-block" style="padding: 2px">Press Ctrl + V on a PC</div>
                <div class="d-block" style="padding: 2px">Command + V on an Apple Mac.</div>
              </template>
              <template v-else> Press Ctrl + V on a PC or Command + V on an Apple Mac. </template>
            </div>
            <div class="flex-grow-0 flex-shrink-0 text-center">
              <a
                @keypress.enter="pastemultiplelines = false"
                @click="pastemultiplelines = false"
                class="d-inline-block cursor-pointer"
                title="Close"
              >
                <img
                  src="http://localhost:5175/src/components/icons/close.png"
                  style="width: 20px; height: 20px"
                  class="align-middle"
                />
              </a>
            </div>
          </div>
          <div class="d-block position-relative p-0 m-0">
            <div
              class="d-block p-0 m-0"
              style="background-color: #fff"
              :style="
                props.pastearea === 'NUMBER-INCLUSIVE-EQUAL-TO' ||
                props.pastearea === 'NUMBER-INCLUSIVE-NOT-EQUAL-TO' ||
                props.pastearea === 'NUMBER-EXCLUSIVE-EQUAL-TO' ||
                props.pastearea === 'NUMBER-EXCLUSIVE-FROM-TO'
                  ? 'height: 188px;'
                  : props.pastearea === 'ATNUMBER-INCLUSIVE-EQUAL-TO' ||
                    props.pastearea === 'ATNUMBER-INCLUSIVE-NOT-EQUAL-TO'
                  ? 'height: 178px;'
                  : props.pastearea === 'ATNUMBER-EXCLUSIVE-EQUAL-TO' ||
                    props.pastearea === 'ATNUMBER-EXCLUSIVE-FROM-TO'
                  ? 'height: 201px;'
                  : props.pastearea === 'DATE-DATETIME-DD-MM-YYYY-AREA'
                  ? 'height: 432px;'
                  : props.pastearea === 'YEAR-AREA'
                  ? 'height: 200px;'
                  : props.pastearea === 'WORD-DISPLAY-AREA-WITH-INCLUDE-EXCLUDE-AND-ATNUMBER' ||
                    props.pastearea ===
                      'WORD-DISPLAY-AREA-WITH-INCLUDE-AND-EXCLUDE-BUT-WITHOUT-ATNUMBER'
                  ? 'height: 208px;'
                  : props.pastearea ===
                    'WORD-DISPLAY-AREA-WITH-ATNUMBER-BUT-NOT-YET-CLICKED-AND-WITHOUT-INCLUDE-AND-EXCLUDE'
                  ? 'height: 333px;'
                  : props.pastearea ===
                    'WORD-DISPLAY-AREA-WITH-ATNUMBER-BEEN-CLICKED-BUT-WITHOUT-INCLUDE-AND-EXCLUDE'
                  ? 'height: 362.7px;'
                  : 'height: 375px;'
              "
            >
              <textarea
                :ref="(el) => (pastetextarearef = el as HTMLTextAreaElement)"
                style="border: 1px solid gray; padding: 5px; resize: none; background-color: #fff"
                class="w-100 h-100 text-left d-inline-block overflow-auto"
                maxlength="0"
                v-model="pastedmultiplelinesoftext"
                @paste="(e: ClipboardEvent) => pasteMultilineWordsCopiedFromSomewhere(e)"
              ></textarea>
            </div>
            <template v-if="pasteditemloading">
              <div
                style="padding: 26px 0px"
                class="t-0 l-0 w-100 position-absolute m-0 h-100 modal-mask-background-1"
              >
                <img
                  src="http://localhost:5175/src/components/icons/loading.gif"
                  style="width: 80px; height: 80px"
                  class="align-middle"
                />
              </div>
            </template>
          </div>
          <template
            v-if="
              props.datatype === 'MultipleWordsString' ||
              props.datatype === 'SingleWordString' ||
              props.datatype === 'NumberString'
            "
          >
            <div class="d-block" style="background-color: #fff; padding: 5px 0; font-size: 0.8rem">
              Max letters per line = 40, Total Max letters for all lines = 5000
            </div>
          </template>
        </div>
        <Teleport to="body">
          <div v-if="pasteexpanded" class="d-block position-relative">
            <Transition name="modal">
              <div
                class="position-fixed h-100 w-100 overflow-auto user-select-none"
                style="z-index: 1800"
              >
                <div class="modal-mask h-100 w-100 modal-mask-background-2">
                  <div class="modal-wrapper text-center">
                    <div class="modal-container d-block shadow" style="height: auto; width: 560px">
                      <div class="d-block m-0 p-0">
                        <div
                          class="shadow-sm flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                          style="height: 30px; padding: 0 3px"
                        >
                          <div class="text-left flex-fill" style="font-size: 0.8rem">
                            <div
                              class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                            >
                              <slot name="outcomeidentifier"></slot>
                            </div>
                          </div>
                          <div class="flex-grow-0 flex-shrink-0 text-center">
                            <a
                              @keypress.enter="
                                () => {
                                  pastemultiplelines = false
                                  pastedmultiplelinesoftext = ''
                                  pasteditemloading = false
                                  pasteexpanded = false
                                  duplicateCheckerObject = {} as DuplicateCheckerObjectType
                                }
                              "
                              @click="
                                () => {
                                  pastemultiplelines = false
                                  pastedmultiplelinesoftext = ''
                                  pasteditemloading = false
                                  pasteexpanded = false
                                  duplicateCheckerObject = {} as DuplicateCheckerObjectType
                                }
                              "
                              class="d-inline-block cursor-pointer"
                              title="Close"
                            >
                              <img
                                src="http://localhost:5175/src/components/icons/close.png"
                                style="width: 20px; height: 20px"
                                class="align-middle"
                              />
                            </a>
                          </div>
                        </div>
                        <div class="d-block" style="padding: 10px">
                          <template v-if="datatype === 'Date'"> </template>
                          <template v-else>
                            <button
                              @keypress.enter="emits('return:newlypasteditems', pasteditemvalidity)"
                              @click="emits('return:newlypasteditems', pasteditemvalidity)"
                              class="btn w-100 text-center"
                              style="padding: 5px"
                            >
                              Add Pasted
                            </button>
                          </template>
                        </div>
                        <div class="d-block">
                          <ul class="d-block list-style-none m-0 p-0">
                            <li
                              v-for="(item, i) in pasteditemvalidity"
                              :key="'expand-include-' + i"
                            >
                              <div class="d-block" style="padding: 5px">
                                <div
                                  :style="
                                    datatype === 'Date'
                                      ? item[1] === 'ERROR'
                                        ? 'background-color:red;color:#fff;'
                                        : item[1] === 'OUT-OF-DATE-RANGE'
                                        ? 'background-color:yellow;color:black;'
                                        : item[1] === 'INDETERMINATE'
                                        ? 'background-color:pink;color:black;'
                                        : 'background-color:#fff;'
                                      : datatype === 'Year'
                                      ? item[1] === 'ERROR'
                                        ? 'background-color:red;color:#fff;'
                                        : item[1] === 'OUT-OF-YEAR-RANGE'
                                        ? 'background-color:yellow;color:black;'
                                        : 'background-color:#fff;'
                                      : item[1] === 'ERROR'
                                      ? 'background-color:red;color:#fff;'
                                      : 'background-color:#fff;'
                                  "
                                  class="shadow-sm flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                                  style="border-radius: 20px; padding: 8px"
                                >
                                  <div
                                    class="ellipsis overflow-hidden text-left flex-fill letter-spacing font-0-dot-875-rem"
                                  >
                                    {{ item[0] }}
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </Teleport>
      </template>
      <div
        class="d-block text-center"
        :style="
          props.pastearea === 'DATE-DATETIME-DD-MM-YYYY-AREA' ? 'padding: 8px 0' : 'padding: 0'
        "
      >
        <button
          class="btn shadow-sm w-100 font-family"
          style="background-color: #f0e68c"
          :style="
            props.pastearea === 'DATE-DATETIME-DD-MM-YYYY-AREA'
              ? 'border-radius: 15px; padding: 3px; font-size: 1rem;'
              : props.pastearea === 'YEAR-AREA' ||
                props.pastearea ===
                  'WORD-DISPLAY-AREA-WITH-ATNUMBER-BEEN-CLICKED-BUT-WITHOUT-INCLUDE-AND-EXCLUDE' ||
                props.pastearea ===
                  'WORD-DISPLAY-AREA-WITH-ATNUMBER-BUT-NOT-YET-CLICKED-AND-WITHOUT-INCLUDE-AND-EXCLUDE' ||
                props.pastearea === 'WORD-DISPLAY-AREA-WITHOUT-INCLUDE-EXCLUDE-AND-ATNUMBER' ||
                props.pastearea === 'WORD-DISPLAY-AREA-WITH-INCLUDE-EXCLUDE-AND-ATNUMBER' ||
                props.pastearea ===
                  'WORD-DISPLAY-AREA-WITH-INCLUDE-AND-EXCLUDE-BUT-WITHOUT-ATNUMBER'
              ? 'padding: 4px; font-size: 0.90rem;'
              : 'padding: 4px 0; font-size: 0.80rem;'
          "
          @keypress.enter="openPasteArea()"
          @click="openPasteArea()"
        >
          Paste multiple lines of
          <span class="text-lowercase">{{ title }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-mask-background-1 {
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-mask-background-2 {
  background-color: rgba(57, 56, 56, 0.99);
}
.modal-mask {
  top: 0;
  left: 0;
  display: table;
  transition: opacity 0.3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-container {
  margin: 0px auto;
  background-color: #f8f8f8;
  border-radius: 2px;
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
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
noindex:-o-prefocus,
input[type='number'] {
  padding-right: 1.5em;
}
@media all and (-webkit-min-device-pixel-ratio: 10000),
  not all and (-webkit-min-device-pixel-ratio: 0) {
  input[type='number'] {
    padding-right: 1.5em;
  }
}
</style>
