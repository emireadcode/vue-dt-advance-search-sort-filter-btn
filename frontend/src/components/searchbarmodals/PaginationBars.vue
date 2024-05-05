<script setup lang="ts">
import { ref, onBeforeMount, type WatchStopHandle, watch, onBeforeUnmount } from 'vue'

const current = ref(0),
  props = defineProps<{
    paginationarea:
      | 'RESULT-DISPLAYER-VERTICAL'
      | 'RESULT-DISPLAYER-HORIZONTAL'
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
    length: number
    currentandsignal: [number, number]
  }>(),
  emits = defineEmits<{
    (e: 'update:current', action: number): void
  }>(),
  inputpagenumberref = ref()
let unwatchcurrent: WatchStopHandle

function previousOrNextClicked(previousornext: 'PREVIOUS' | 'NEXT' | 'INPUT') {
  if (previousornext === 'NEXT') {
    if (current.value < props.length) {
      current.value++
      if (
        props.paginationarea === 'RESULT-DISPLAYER-VERTICAL' ||
        props.paginationarea === 'RESULT-DISPLAYER-HORIZONTAL' ||
        props.paginationarea ===
          'WORD-DISPLAY-AREA-WITH-ATNUMBER-BEEN-CLICKED-BUT-WITHOUT-INCLUDE-AND-EXCLUDE' ||
        props.paginationarea ===
          'WORD-DISPLAY-AREA-WITH-ATNUMBER-BUT-NOT-YET-CLICKED-AND-WITHOUT-INCLUDE-AND-EXCLUDE' ||
        props.paginationarea === 'WORD-DISPLAY-AREA-WITHOUT-INCLUDE-EXCLUDE-AND-ATNUMBER' ||
        props.paginationarea === 'WORD-DISPLAY-AREA-WITH-INCLUDE-EXCLUDE-AND-ATNUMBER' ||
        props.paginationarea === 'WORD-DISPLAY-AREA-WITH-INCLUDE-AND-EXCLUDE-BUT-WITHOUT-ATNUMBER'
      ) {
        if (props.length > 9 && props.length <= 99) {
          if (inputpagenumberref.value) {
            if (current.value >= 4 && current.value <= props.length - 2) {
              inputpagenumberref.value.value = current.value
            }
          }
        } else if (props.length > 99 && props.length <= 99999) {
          if (inputpagenumberref.value) {
            if (current.value >= 3 && current.value <= props.length - 1) {
              inputpagenumberref.value.value = current.value
            }
          }
        } else {
          if (inputpagenumberref.value) {
            if (current.value >= 2 && current.value <= props.length - 1) {
              inputpagenumberref.value.value = current.value
            }
          }
        }
      } else if (
        props.paginationarea === 'NUMBER-INCLUSIVE-EQUAL-TO' ||
        props.paginationarea === 'NUMBER-INCLUSIVE-NOT-EQUAL-TO' ||
        props.paginationarea === 'ATNUMBER-INCLUSIVE-EQUAL-TO' ||
        props.paginationarea === 'ATNUMBER-INCLUSIVE-NOT-EQUAL-TO'
      ) {
        if (props.length > 6 && props.length <= 99) {
          if (inputpagenumberref.value) {
            if (current.value >= 3 && current.value <= props.length - 2) {
              inputpagenumberref.value.value = current.value
            }
          }
        } else if (props.length > 99 && props.length <= 99999) {
          if (inputpagenumberref.value) {
            if (current.value >= 2 && current.value <= props.length - 1) {
              inputpagenumberref.value.value = current.value
            }
          }
        } else {
          if (inputpagenumberref.value) {
            if (current.value >= 2 && current.value <= props.length) {
              inputpagenumberref.value.value = current.value
            }
          }
        }
      } else if (
        props.paginationarea === 'ATNUMBER-EXCLUSIVE-EQUAL-TO' ||
        props.paginationarea === 'NUMBER-EXCLUSIVE-EQUAL-TO'
      ) {
        if (props.length > 5 && props.length <= 99) {
          if (inputpagenumberref.value) {
            if (current.value >= 2 && current.value <= props.length - 2) {
              inputpagenumberref.value.value = current.value
            }
          }
        } else {
          if (inputpagenumberref.value) {
            if (current.value >= 2 && current.value <= props.length) {
              inputpagenumberref.value.value = current.value
            }
          }
        }
      } else {
        if (props.length > 8 && props.length <= 99) {
          if (inputpagenumberref.value) {
            if (current.value >= 4 && current.value <= props.length - 3) {
              inputpagenumberref.value.value = current.value
            }
          }
        } else if (props.length > 99 && props.length <= 99999) {
          if (inputpagenumberref.value) {
            if (current.value >= 3 && current.value <= props.length - 1) {
              inputpagenumberref.value.value = current.value
            }
          }
        } else {
          if (inputpagenumberref.value) {
            if (current.value >= 2 && current.value <= props.length) {
              inputpagenumberref.value.value = current.value
            }
          }
        }
      }
      emits('update:current', current.value - 1)
    }
  } else if (previousornext === 'PREVIOUS') {
    if (current.value > 1) {
      current.value--
      if (
        props.paginationarea === 'RESULT-DISPLAYER-VERTICAL' ||
        props.paginationarea === 'RESULT-DISPLAYER-HORIZONTAL' ||
        props.paginationarea ===
          'WORD-DISPLAY-AREA-WITH-ATNUMBER-BEEN-CLICKED-BUT-WITHOUT-INCLUDE-AND-EXCLUDE' ||
        props.paginationarea ===
          'WORD-DISPLAY-AREA-WITH-ATNUMBER-BUT-NOT-YET-CLICKED-AND-WITHOUT-INCLUDE-AND-EXCLUDE' ||
        props.paginationarea === 'WORD-DISPLAY-AREA-WITHOUT-INCLUDE-EXCLUDE-AND-ATNUMBER' ||
        props.paginationarea === 'WORD-DISPLAY-AREA-WITH-INCLUDE-EXCLUDE-AND-ATNUMBER' ||
        props.paginationarea === 'WORD-DISPLAY-AREA-WITH-INCLUDE-AND-EXCLUDE-BUT-WITHOUT-ATNUMBER'
      ) {
        if (props.length > 9 && props.length <= 99) {
          if (inputpagenumberref.value) {
            if (current.value >= 4 && current.value <= props.length - 2) {
              inputpagenumberref.value.value = current.value
            }
          }
        } else if (props.length > 99 && props.length <= 99999) {
          if (inputpagenumberref.value) {
            if (current.value >= 3 && current.value <= props.length - 1) {
              inputpagenumberref.value.value = current.value
            }
          }
        } else {
          if (inputpagenumberref.value) {
            if (current.value >= 2 && current.value <= props.length - 1) {
              inputpagenumberref.value.value = current.value
            }
          }
        }
      } else if (
        props.paginationarea === 'NUMBER-INCLUSIVE-EQUAL-TO' ||
        props.paginationarea === 'NUMBER-INCLUSIVE-NOT-EQUAL-TO' ||
        props.paginationarea === 'ATNUMBER-INCLUSIVE-EQUAL-TO' ||
        props.paginationarea === 'ATNUMBER-INCLUSIVE-NOT-EQUAL-TO'
      ) {
        if (props.length > 6 && props.length <= 99) {
          if (inputpagenumberref.value) {
            if (current.value >= 3 && current.value <= props.length - 2) {
              inputpagenumberref.value.value = current.value
            }
          }
        } else if (props.length > 99 && props.length <= 99999) {
          if (inputpagenumberref.value) {
            if (current.value >= 2 && current.value <= props.length - 1) {
              inputpagenumberref.value.value = current.value
            }
          }
        } else {
          if (inputpagenumberref.value) {
            if (current.value >= 2 && current.value <= props.length) {
              inputpagenumberref.value.value = current.value
            }
          }
        }
      } else if (
        props.paginationarea === 'ATNUMBER-EXCLUSIVE-EQUAL-TO' ||
        props.paginationarea === 'NUMBER-EXCLUSIVE-EQUAL-TO'
      ) {
        if (props.length > 5 && props.length <= 99) {
          if (inputpagenumberref.value) {
            if (current.value >= 2 && current.value <= props.length - 2) {
              inputpagenumberref.value.value = current.value
            }
          }
        } else {
          if (inputpagenumberref.value) {
            if (current.value >= 2 && current.value <= props.length) {
              inputpagenumberref.value.value = current.value
            }
          }
        }
      } else {
        if (props.length > 8 && props.length <= 99) {
          if (inputpagenumberref.value) {
            if (current.value >= 4 && current.value <= props.length - 3) {
              inputpagenumberref.value.value = current.value
            }
          }
        } else if (props.length > 99 && props.length <= 99999) {
          if (inputpagenumberref.value) {
            if (current.value >= 3 && current.value <= props.length - 1) {
              inputpagenumberref.value.value = current.value
            }
          }
        } else {
          if (inputpagenumberref.value) {
            if (current.value >= 2 && current.value <= props.length) {
              inputpagenumberref.value.value = current.value
            }
          }
        }
      }
      emits('update:current', current.value - 1)
    }
  } else {
    current.value = inputpagenumberref.value.value
    emits('update:current', current.value - 1)
  }
}

function setCurrent(pageindex: number) {
  current.value = pageindex
  emits('update:current', current.value === 0 ? 0 : current.value - 1)
}

onBeforeMount(() => {
  current.value = props.currentandsignal[1] + 1
  unwatchcurrent = watch(
    () => props.currentandsignal[0],
    () => {
      current.value = props.currentandsignal[1] + 1
      if (
        props.paginationarea === 'RESULT-DISPLAYER-VERTICAL' ||
        props.paginationarea === 'RESULT-DISPLAYER-HORIZONTAL' ||
        props.paginationarea ===
          'WORD-DISPLAY-AREA-WITH-ATNUMBER-BEEN-CLICKED-BUT-WITHOUT-INCLUDE-AND-EXCLUDE' ||
        props.paginationarea ===
          'WORD-DISPLAY-AREA-WITH-ATNUMBER-BUT-NOT-YET-CLICKED-AND-WITHOUT-INCLUDE-AND-EXCLUDE' ||
        props.paginationarea === 'WORD-DISPLAY-AREA-WITHOUT-INCLUDE-EXCLUDE-AND-ATNUMBER' ||
        props.paginationarea === 'WORD-DISPLAY-AREA-WITH-INCLUDE-EXCLUDE-AND-ATNUMBER' ||
        props.paginationarea === 'WORD-DISPLAY-AREA-WITH-INCLUDE-AND-EXCLUDE-BUT-WITHOUT-ATNUMBER'
      ) {
        if (props.length > 9 && props.length <= 99) {
          if (inputpagenumberref.value) {
            if (current.value >= 4 && current.value <= props.length - 2) {
              inputpagenumberref.value.value = current.value
            }
          }
        } else if (props.length > 99 && props.length <= 99999) {
          if (inputpagenumberref.value) {
            if (current.value >= 3 && current.value <= props.length - 1) {
              inputpagenumberref.value.value = current.value
            }
          }
        } else {
          if (inputpagenumberref.value) {
            if (current.value >= 2 && current.value <= props.length - 1) {
              inputpagenumberref.value.value = current.value
            }
          }
        }
      } else if (
        props.paginationarea === 'NUMBER-INCLUSIVE-EQUAL-TO' ||
        props.paginationarea === 'NUMBER-INCLUSIVE-NOT-EQUAL-TO' ||
        props.paginationarea === 'ATNUMBER-INCLUSIVE-EQUAL-TO' ||
        props.paginationarea === 'ATNUMBER-INCLUSIVE-NOT-EQUAL-TO'
      ) {
        if (props.length > 6 && props.length <= 99) {
          if (inputpagenumberref.value) {
            if (current.value >= 3 && current.value <= props.length - 2) {
              inputpagenumberref.value.value = current.value
            }
          }
        } else if (props.length > 99 && props.length <= 99999) {
          if (inputpagenumberref.value) {
            if (current.value >= 2 && current.value <= props.length - 1) {
              inputpagenumberref.value.value = current.value
            }
          }
        } else {
          if (inputpagenumberref.value) {
            if (current.value >= 2 && current.value <= props.length) {
              inputpagenumberref.value.value = current.value
            }
          }
        }
      } else if (
        props.paginationarea === 'ATNUMBER-EXCLUSIVE-EQUAL-TO' ||
        props.paginationarea === 'NUMBER-EXCLUSIVE-EQUAL-TO'
      ) {
        if (props.length > 5 && props.length <= 99) {
          if (inputpagenumberref.value) {
            if (current.value >= 2 && current.value <= props.length - 2) {
              inputpagenumberref.value.value = current.value
            }
          }
        } else {
          if (inputpagenumberref.value) {
            if (current.value >= 2 && current.value <= props.length) {
              inputpagenumberref.value.value = current.value
            }
          }
        }
      } else {
        if (props.length > 8 && props.length <= 99) {
          if (inputpagenumberref.value) {
            if (current.value >= 4 && current.value <= props.length - 3) {
              inputpagenumberref.value.value = current.value
            }
          }
        } else if (props.length > 99 && props.length <= 99999) {
          if (inputpagenumberref.value) {
            if (current.value >= 3 && current.value <= props.length - 1) {
              inputpagenumberref.value.value = current.value
            }
          }
        } else {
          if (inputpagenumberref.value) {
            if (current.value >= 2 && current.value <= props.length) {
              inputpagenumberref.value.value = current.value
            }
          }
        }
      }
    }
  )
})

onBeforeUnmount(() => {
  unwatchcurrent()
})
</script>

<template>
  <div class="d-block h-100" style="padding: 0.063rem 0">
    <ul
      class="h-100 m-0 p-0 flex-box flex-direction-row flex-nowrap list-style-none justify-content-center align-items-center w-100"
    >
      <template v-if="length <= 1">
        <li
          style="padding: 0px 3px 0px 0; width: 10%; height: 26px"
          class="flex-grow-0 flex-shrink-0 text-center"
        >
          <button
            :disabled="length > 1 ? false : true"
            @keypress.enter="previousOrNextClicked('PREVIOUS')"
            @click="previousOrNextClicked('PREVIOUS')"
            class="btn shadow-sm w-100 text-center p-0 m-0"
            style="z-index: 910"
          >
            <img
              src="http://localhost:5175/src/components/icons/previous.png"
              class="align-middle"
              style="width: 13px; height: 13px"
            />
          </button>
        </li>
      </template>
      <li class="flex-fill text-center" style="height: 26px">
        <template v-if="length > 1">
          <ul
            class="h-100 m-0 p-0 flex-box flex-direction-row flex-nowrap list-style-none justify-content-center align-items-center w-100"
          >
            <li
              style="padding: 0px 3px 0px 0; height: 26px"
              class="flex-grow-0 flex-shrink-0 text-center"
              :style="
                props.paginationarea === 'RESULT-DISPLAYER-VERTICAL' ||
                props.paginationarea === 'RESULT-DISPLAYER-HORIZONTAL' ||
                props.paginationarea ===
                  'WORD-DISPLAY-AREA-WITH-ATNUMBER-BEEN-CLICKED-BUT-WITHOUT-INCLUDE-AND-EXCLUDE' ||
                props.paginationarea ===
                  'WORD-DISPLAY-AREA-WITH-ATNUMBER-BUT-NOT-YET-CLICKED-AND-WITHOUT-INCLUDE-AND-EXCLUDE' ||
                props.paginationarea === 'WORD-DISPLAY-AREA-WITHOUT-INCLUDE-EXCLUDE-AND-ATNUMBER' ||
                props.paginationarea === 'WORD-DISPLAY-AREA-WITH-INCLUDE-EXCLUDE-AND-ATNUMBER' ||
                props.paginationarea ===
                  'WORD-DISPLAY-AREA-WITH-INCLUDE-AND-EXCLUDE-BUT-WITHOUT-ATNUMBER'
                  ? length <= 9
                    ? 'width:' + 100 / (length + 2) + '%;'
                    : 'width: 9.090909091%;'
                  : ''
              "
            >
              <button
                :disabled="length > 1 ? false : true"
                @keypress.enter="previousOrNextClicked('PREVIOUS')"
                @click="previousOrNextClicked('PREVIOUS')"
                class="btn shadow-sm w-100 text-center p-0 m-0"
                style="z-index: 910"
              >
                <img
                  src="http://localhost:5175/src/components/icons/previous.png"
                  class="align-middle"
                  style="width: 13px; height: 13px"
                />
              </button>
            </li>
            <template
              v-if="
                props.paginationarea === 'RESULT-DISPLAYER-VERTICAL' ||
                props.paginationarea === 'RESULT-DISPLAYER-HORIZONTAL' ||
                props.paginationarea ===
                  'WORD-DISPLAY-AREA-WITH-ATNUMBER-BEEN-CLICKED-BUT-WITHOUT-INCLUDE-AND-EXCLUDE' ||
                props.paginationarea ===
                  'WORD-DISPLAY-AREA-WITH-ATNUMBER-BUT-NOT-YET-CLICKED-AND-WITHOUT-INCLUDE-AND-EXCLUDE' ||
                props.paginationarea === 'WORD-DISPLAY-AREA-WITHOUT-INCLUDE-EXCLUDE-AND-ATNUMBER' ||
                props.paginationarea === 'WORD-DISPLAY-AREA-WITH-INCLUDE-EXCLUDE-AND-ATNUMBER' ||
                props.paginationarea ===
                  'WORD-DISPLAY-AREA-WITH-INCLUDE-AND-EXCLUDE-BUT-WITHOUT-ATNUMBER'
              "
            >
              <template v-if="length <= 9">
                <li
                  class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                  v-for="pageindex in length"
                  :key="pageindex + '-pagination'"
                  :style="'width:' + 100 / (length + 2) + '%;'"
                  style="padding: 0 3px"
                >
                  <button
                    class="shadow-sm text-center btn h-100 w-100 m-0"
                    style="font-size: 0.8rem"
                    :style="
                      current > 0 && current === pageindex ? 'background-color: #F0E68C;' : ''
                    "
                    @keypress.enter="setCurrent(pageindex)"
                    @click="setCurrent(pageindex)"
                  >
                    {{ pageindex }}
                  </button>
                </li>
              </template>
              <template v-else>
                <template v-if="length > 9 && length <= 99">
                  <template v-for="pageindex in length">
                    <template v-if="pageindex < 4">
                      <li
                        style="width: 9.090909091%; padding: 0 3px"
                        class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                        :key="pageindex + '-pagination'"
                      >
                        <button
                          class="shadow-sm text-center btn h-100 w-100 m-0"
                          style="font-size: 0.8rem"
                          :style="
                            current > 0 && current === pageindex ? 'background-color: #F0E68C;' : ''
                          "
                          @keypress.enter="setCurrent(pageindex)"
                          @click="setCurrent(pageindex)"
                        >
                          {{ pageindex }}
                        </button>
                      </li>
                    </template>
                    <template v-else-if="pageindex === 4">
                      <li
                        style="width: 18.181818182%; padding: 0 3px"
                        class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                        :key="pageindex + '-pagination'"
                      >
                        <input
                          :ref="(el) => (inputpagenumberref = el)"
                          type="number"
                          class="shadow-sm w-100 text-center h-100"
                          style="font-size: 0.8rem"
                          :style="
                            current >= 4 && current <= length - 2
                              ? 'background-color: #F0E68C;'
                              : ''
                          "
                          min="4"
                          :max="length - 2"
                          maxlength="2"
                          size="3"
                          value="4"
                          @change="previousOrNextClicked('INPUT')"
                          @keypress.enter="previousOrNextClicked('INPUT')"
                        />
                      </li>
                    </template>
                    <template v-else>
                      <template v-if="pageindex + 2 > length">
                        <li
                          style="width: 18.181818182%; padding: 0 3px"
                          class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                          :key="pageindex + '-pagination'"
                        >
                          <button
                            class="shadow-sm text-center btn h-100 w-100 m-0"
                            style="font-size: 0.8rem"
                            :style="
                              current > 0 && current === pageindex
                                ? 'background-color: #F0E68C;'
                                : ''
                            "
                            @keypress.enter="setCurrent(pageindex)"
                            @click="setCurrent(pageindex)"
                          >
                            {{ pageindex }}
                          </button>
                        </li>
                      </template>
                    </template>
                  </template>
                </template>
                <template v-else-if="length > 99 && length <= 99999">
                  <template v-for="pageindex in length">
                    <template v-if="pageindex < 3">
                      <li
                        style="width: 9.090909091%; padding: 0 3px"
                        class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                        :key="pageindex + '-pagination'"
                      >
                        <button
                          class="shadow-sm text-center btn h-100 w-100 m-0"
                          style="font-size: 0.8rem"
                          :style="
                            current > 0 && current === pageindex ? 'background-color: #F0E68C;' : ''
                          "
                          @keypress.enter="setCurrent(pageindex)"
                          @click="setCurrent(pageindex)"
                        >
                          {{ pageindex }}
                        </button>
                      </li>
                    </template>
                    <template v-else-if="pageindex === 3">
                      <li
                        style="width: 31.818181818%; padding: 0 3px"
                        class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                        :key="pageindex + '-pagination'"
                      >
                        <input
                          :ref="(el) => (inputpagenumberref = el)"
                          type="number"
                          class="shadow-sm w-100 text-center h-100"
                          style="font-size: 0.8rem"
                          :style="
                            current >= 3 && current <= length - 1
                              ? 'background-color: #F0E68C;'
                              : ''
                          "
                          min="3"
                          :max="length - 1"
                          maxlength="5"
                          size="6"
                          value="3"
                          @change="previousOrNextClicked('INPUT')"
                          @keypress.enter="previousOrNextClicked('INPUT')"
                        />
                      </li>
                    </template>
                    <template v-else>
                      <template v-if="pageindex + 1 > length">
                        <li
                          style="width: 31.818181818%; padding: 0 3px"
                          class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                          :key="pageindex + '-pagination'"
                        >
                          <button
                            class="shadow-sm text-center btn h-100 w-100 m-0"
                            style="font-size: 0.8rem"
                            :style="
                              current > 0 && current === pageindex
                                ? 'background-color: #F0E68C;'
                                : ''
                            "
                            @keypress.enter="setCurrent(pageindex)"
                            @click="setCurrent(pageindex)"
                          >
                            {{ pageindex }}
                          </button>
                        </li>
                      </template>
                    </template>
                  </template>
                </template>
                <template v-else>
                  <template v-for="pageindex in length">
                    <template v-if="pageindex < 2">
                      <li
                        style="width: 9.090909091%; padding: 0 3px"
                        class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                        :key="pageindex + '-pagination'"
                      >
                        <button
                          class="shadow-sm text-center btn h-100 w-100 m-0"
                          style="font-size: 0.8rem"
                          :style="
                            current > 0 && current === pageindex ? 'background-color: #F0E68C;' : ''
                          "
                          @keypress.enter="setCurrent(pageindex)"
                          @click="setCurrent(pageindex)"
                        >
                          {{ pageindex }}
                        </button>
                      </li>
                    </template>
                    <template v-else-if="pageindex === 2">
                      <li
                        style="width: 36.363636364%; padding: 0 3px"
                        class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                        :key="pageindex + '-pagination'"
                      >
                        <input
                          :ref="(el) => (inputpagenumberref = el)"
                          type="number"
                          class="shadow-sm w-100 text-center h-100"
                          style="font-size: 0.8rem"
                          :style="
                            current >= 2 && current <= length - 1
                              ? 'background-color: #F0E68C;'
                              : ''
                          "
                          min="2"
                          :max="length - 1"
                          maxlength="13"
                          size="14"
                          value="2"
                          @change="previousOrNextClicked('INPUT')"
                          @keypress.enter="previousOrNextClicked('INPUT')"
                        />
                      </li>
                    </template>
                    <template v-else>
                      <template v-if="pageindex + 1 > length">
                        <li
                          style="width: 36.363636364%; padding: 0 3px"
                          class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                          :key="pageindex + '-pagination'"
                        >
                          <button
                            class="shadow-sm text-center btn h-100 w-100 m-0"
                            style="font-size: 0.8rem"
                            :style="
                              current > 0 && current === pageindex
                                ? 'background-color: #F0E68C;'
                                : ''
                            "
                            @keypress.enter="setCurrent(pageindex)"
                            @click="setCurrent(pageindex)"
                          >
                            {{ pageindex }}
                          </button>
                        </li>
                      </template>
                    </template>
                  </template>
                </template>
              </template>
            </template>
            <template
              v-else-if="
                props.paginationarea === 'NUMBER-INCLUSIVE-EQUAL-TO' ||
                props.paginationarea === 'NUMBER-INCLUSIVE-NOT-EQUAL-TO' ||
                props.paginationarea === 'ATNUMBER-INCLUSIVE-EQUAL-TO' ||
                props.paginationarea === 'ATNUMBER-INCLUSIVE-NOT-EQUAL-TO'
              "
            >
              <template v-if="length <= 6">
                <li
                  class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                  v-for="pageindex in length"
                  :key="pageindex + '-pagination'"
                  :style="'width:' + 100 / (length + 2) + '%;'"
                  style="padding: 0 3px"
                >
                  <button
                    class="shadow-sm text-center btn h-100 w-100 m-0"
                    style="font-size: 0.8rem"
                    :style="
                      current > 0 && current === pageindex ? 'background-color: #F0E68C;' : ''
                    "
                    @keypress.enter="setCurrent(pageindex)"
                    @click="setCurrent(pageindex)"
                  >
                    {{ pageindex }}
                  </button>
                </li>
              </template>
              <template v-else>
                <template v-if="length > 6 && length <= 99">
                  <template v-for="pageindex in length">
                    <template v-if="pageindex < 3">
                      <li
                        style="width: 16.6667%; padding: 0 3px"
                        class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                        :key="pageindex + '-pagination'"
                      >
                        <button
                          class="shadow-sm text-center btn h-100 w-100 m-0"
                          style="font-size: 0.8rem"
                          :style="
                            current > 0 && current === pageindex ? 'background-color: #F0E68C;' : ''
                          "
                          @keypress.enter="setCurrent(pageindex)"
                          @click="setCurrent(pageindex)"
                        >
                          {{ pageindex }}
                        </button>
                      </li>
                    </template>
                    <template v-else-if="pageindex === 3">
                      <li
                        style="width: 33.334%; padding: 0 3px"
                        class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                        :key="pageindex + '-pagination'"
                      >
                        <input
                          :ref="(el) => (inputpagenumberref = el)"
                          type="number"
                          class="shadow-sm w-100 text-center h-100"
                          style="font-size: 0.8rem"
                          :style="
                            current >= 3 && current <= length - 2
                              ? 'background-color: #F0E68C;'
                              : ''
                          "
                          min="3"
                          :max="length - 2"
                          maxlength="2"
                          size="3"
                          value="3"
                          @change="previousOrNextClicked('INPUT')"
                          @keypress.enter="previousOrNextClicked('INPUT')"
                        />
                      </li>
                    </template>
                    <template v-else>
                      <template v-if="pageindex + 2 > length">
                        <li
                          style="width: 16.667%; padding: 0 3px"
                          class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                          :key="pageindex + '-pagination'"
                        >
                          <button
                            class="shadow-sm text-center btn h-100 w-100 m-0"
                            style="font-size: 0.8rem"
                            :style="
                              current > 0 && current === pageindex
                                ? 'background-color: #F0E68C;'
                                : ''
                            "
                            @keypress.enter="setCurrent(pageindex)"
                            @click="setCurrent(pageindex)"
                          >
                            {{ pageindex }}
                          </button>
                        </li>
                      </template>
                    </template>
                  </template>
                </template>
                <template v-else-if="length > 99 && length <= 99999">
                  <template v-for="pageindex in length">
                    <template v-if="pageindex < 2">
                      <li
                        style="width: 16.667%; padding: 0 3px"
                        class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                        :key="pageindex + '-pagination'"
                      >
                        <button
                          class="shadow-sm text-center btn h-100 w-100 m-0"
                          style="font-size: 0.8rem"
                          :style="
                            current > 0 && current === pageindex ? 'background-color: #F0E68C;' : ''
                          "
                          @keypress.enter="setCurrent(pageindex)"
                          @click="setCurrent(pageindex)"
                        >
                          {{ pageindex }}
                        </button>
                      </li>
                    </template>
                    <template v-else-if="pageindex === 2">
                      <li
                        style="width: 50.001%; padding: 0 3px"
                        class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                        :key="pageindex + '-pagination'"
                      >
                        <input
                          :ref="(el) => (inputpagenumberref = el)"
                          type="number"
                          class="shadow-sm w-100 text-center h-100"
                          style="font-size: 0.8rem"
                          :style="
                            current >= 2 && current <= length - 1
                              ? 'background-color: #F0E68C;'
                              : ''
                          "
                          min="2"
                          :max="length - 1"
                          maxlength="5"
                          size="6"
                          value="2"
                          @change="previousOrNextClicked('INPUT')"
                          @keypress.enter="previousOrNextClicked('INPUT')"
                        />
                      </li>
                    </template>
                    <template v-else>
                      <template v-if="pageindex + 1 > length">
                        <li
                          style="width: 33.334%; padding: 0 3px"
                          class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                          :key="pageindex + '-pagination'"
                        >
                          <button
                            class="shadow-sm text-center btn h-100 w-100 m-0"
                            style="font-size: 0.8rem"
                            :style="
                              current > 0 && current === pageindex
                                ? 'background-color: #F0E68C;'
                                : ''
                            "
                            @keypress.enter="setCurrent(pageindex)"
                            @click="setCurrent(pageindex)"
                          >
                            {{ pageindex }}
                          </button>
                        </li>
                      </template>
                    </template>
                  </template>
                </template>
                <template v-else>
                  <template v-for="pageindex in length">
                    <template v-if="pageindex < 2">
                      <li
                        style="width: 16.667%; padding: 0 3px"
                        class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                        :key="pageindex + '-pagination'"
                      >
                        <button
                          class="shadow-sm text-center btn h-100 w-100 m-0"
                          style="font-size: 0.8rem"
                          :style="
                            current > 0 && current === pageindex ? 'background-color: #F0E68C;' : ''
                          "
                          @keypress.enter="setCurrent(pageindex)"
                          @click="setCurrent(pageindex)"
                        >
                          {{ pageindex }}
                        </button>
                      </li>
                    </template>
                    <template v-else-if="pageindex === 2">
                      <li
                        style="width: 83.335%; padding: 0 3px"
                        class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                        :key="pageindex + '-pagination'"
                      >
                        <input
                          :ref="(el) => (inputpagenumberref = el)"
                          type="number"
                          class="shadow-sm w-100 text-center h-100"
                          style="font-size: 0.8rem"
                          :style="
                            current >= 2 && current <= length ? 'background-color: #F0E68C;' : ''
                          "
                          min="2"
                          :max="length"
                          maxlength="13"
                          size="14"
                          value="2"
                          @change="previousOrNextClicked('INPUT')"
                          @keypress.enter="previousOrNextClicked('INPUT')"
                        />
                      </li>
                    </template>
                  </template>
                </template>
              </template>
            </template>
            <template
              v-else-if="
                props.paginationarea === 'ATNUMBER-EXCLUSIVE-EQUAL-TO' ||
                props.paginationarea === 'NUMBER-EXCLUSIVE-EQUAL-TO'
              "
            >
              <template v-if="length <= 5">
                <li
                  class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                  v-for="pageindex in length"
                  :key="pageindex + '-pagination'"
                  :style="'width:' + 100 / (length + 2) + '%;'"
                  style="padding: 0 3px"
                >
                  <button
                    class="shadow-sm text-center btn h-100 w-100 m-0"
                    style="font-size: 0.8rem"
                    :style="
                      current > 0 && current === pageindex ? 'background-color: #F0E68C;' : ''
                    "
                    @keypress.enter="setCurrent(pageindex)"
                    @click="setCurrent(pageindex)"
                  >
                    {{ pageindex }}
                  </button>
                </li>
              </template>
              <template v-else>
                <template v-if="length > 5 && length <= 99">
                  <template v-for="pageindex in length">
                    <template v-if="pageindex < 2">
                      <li
                        style="width: 20%; padding: 0 3px"
                        class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                        :key="pageindex + '-pagination'"
                      >
                        <button
                          class="shadow-sm text-center btn h-100 w-100 m-0"
                          style="font-size: 0.8rem"
                          :style="
                            current > 0 && current === pageindex ? 'background-color: #F0E68C;' : ''
                          "
                          @keypress.enter="setCurrent(pageindex)"
                          @click="setCurrent(pageindex)"
                        >
                          {{ pageindex }}
                        </button>
                      </li>
                    </template>
                    <template v-else-if="pageindex === 2">
                      <li
                        style="width: 40%; padding: 0 3px"
                        class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                        :key="pageindex + '-pagination'"
                      >
                        <input
                          :ref="(el) => (inputpagenumberref = el)"
                          type="number"
                          class="shadow-sm w-100 text-center h-100"
                          style="font-size: 0.8rem"
                          :style="
                            current >= 2 && current <= length - 2
                              ? 'background-color: #F0E68C;'
                              : ''
                          "
                          min="2"
                          :max="length - 2"
                          maxlength="2"
                          size="3"
                          value="2"
                          @change="previousOrNextClicked('INPUT')"
                          @keypress.enter="previousOrNextClicked('INPUT')"
                        />
                      </li>
                    </template>
                    <template v-else>
                      <template v-if="pageindex + 2 > length">
                        <li
                          style="width: 20%; padding: 0 3px"
                          class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                          :key="pageindex + '-pagination'"
                        >
                          <button
                            class="shadow-sm text-center btn h-100 w-100 m-0"
                            style="font-size: 0.8rem"
                            :style="
                              current > 0 && current === pageindex
                                ? 'background-color: #F0E68C;'
                                : ''
                            "
                            @keypress.enter="setCurrent(pageindex)"
                            @click="setCurrent(pageindex)"
                          >
                            {{ pageindex }}
                          </button>
                        </li>
                      </template>
                    </template>
                  </template>
                </template>
                <template v-else>
                  <template v-for="pageindex in length">
                    <template v-if="pageindex < 2">
                      <li
                        style="width: 20%; padding: 0 3px"
                        class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                        :key="pageindex + '-pagination'"
                      >
                        <button
                          class="shadow-sm text-center btn h-100 w-100 m-0"
                          style="font-size: 0.8rem"
                          :style="
                            current > 0 && current === pageindex ? 'background-color: #F0E68C;' : ''
                          "
                          @keypress.enter="setCurrent(pageindex)"
                          @click="setCurrent(pageindex)"
                        >
                          {{ pageindex }}
                        </button>
                      </li>
                    </template>
                    <template v-else-if="pageindex === 2">
                      <li
                        style="width: 80%; padding: 0 3px"
                        class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                        :key="pageindex + '-pagination'"
                      >
                        <input
                          :ref="(el) => (inputpagenumberref = el)"
                          type="number"
                          class="shadow-sm w-100 text-center h-100"
                          style="font-size: 0.8rem"
                          :style="
                            current >= 2 && current <= length ? 'background-color: #F0E68C;' : ''
                          "
                          min="2"
                          :max="length"
                          maxlength="13"
                          size="14"
                          value="2"
                          @change="previousOrNextClicked('INPUT')"
                          @keypress.enter="previousOrNextClicked('INPUT')"
                        />
                      </li>
                    </template>
                  </template>
                </template>
              </template>
            </template>
            <template v-else>
              <template v-if="length <= 8">
                <li
                  class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                  v-for="pageindex in length"
                  :key="pageindex + '-pagination'"
                  :style="'width:' + 100 / (length + 2) + '%;'"
                  style="padding: 0 3px"
                >
                  <button
                    class="shadow-sm text-center btn h-100 w-100 m-0"
                    style="font-size: 0.8rem"
                    :style="
                      current > 0 && current === pageindex ? 'background-color: #F0E68C;' : ''
                    "
                    @keypress.enter="setCurrent(pageindex)"
                    @click="setCurrent(pageindex)"
                  >
                    {{ pageindex }}
                  </button>
                </li>
              </template>
              <template v-else>
                <template v-if="length > 8 && length <= 99">
                  <template v-for="pageindex in length">
                    <template v-if="pageindex < 4">
                      <li
                        style="width: 12.5%; padding: 0 3px"
                        class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                        :key="pageindex + '-pagination'"
                      >
                        <button
                          class="shadow-sm text-center btn h-100 w-100 m-0"
                          style="font-size: 0.8rem"
                          :style="
                            current > 0 && current === pageindex ? 'background-color: #F0E68C;' : ''
                          "
                          @keypress.enter="setCurrent(pageindex)"
                          @click="setCurrent(pageindex)"
                        >
                          {{ pageindex }}
                        </button>
                      </li>
                    </template>
                    <template v-else-if="pageindex === 4">
                      <li
                        style="width: 25%; padding: 0 3px"
                        class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                        :key="pageindex + '-pagination'"
                      >
                        <input
                          :ref="(el) => (inputpagenumberref = el)"
                          type="number"
                          class="shadow-sm w-100 text-center h-100"
                          style="font-size: 0.8rem"
                          :style="
                            current >= 4 && current <= length - 3
                              ? 'background-color: #F0E68C;'
                              : ''
                          "
                          min="4"
                          :max="length - 3"
                          maxlength="2"
                          size="3"
                          value="4"
                          @change="previousOrNextClicked('INPUT')"
                          @keypress.enter="previousOrNextClicked('INPUT')"
                        />
                      </li>
                    </template>
                    <template v-else>
                      <template v-if="pageindex + 3 > length">
                        <li
                          style="width: 12.5%; padding: 0 3px"
                          class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                          :key="pageindex + '-pagination'"
                        >
                          <button
                            class="shadow-sm text-center btn h-100 w-100 m-0"
                            style="font-size: 0.8rem"
                            :style="
                              current > 0 && current === pageindex
                                ? 'background-color: #F0E68C;'
                                : ''
                            "
                            @keypress.enter="setCurrent(pageindex)"
                            @click="setCurrent(pageindex)"
                          >
                            {{ pageindex }}
                          </button>
                        </li>
                      </template>
                    </template>
                  </template>
                </template>
                <template v-else-if="length > 99 && length <= 99999">
                  <template v-for="pageindex in length">
                    <template v-if="pageindex < 3">
                      <li
                        style="width: 12.5%; padding: 0 3px"
                        class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                        :key="pageindex + '-pagination'"
                      >
                        <button
                          class="shadow-sm text-center btn h-100 w-100 m-0"
                          style="font-size: 0.8rem"
                          :style="
                            current > 0 && current === pageindex ? 'background-color: #F0E68C;' : ''
                          "
                          @keypress.enter="setCurrent(pageindex)"
                          @click="setCurrent(pageindex)"
                        >
                          {{ pageindex }}
                        </button>
                      </li>
                    </template>
                    <template v-else-if="pageindex === 3">
                      <li
                        style="width: 37.5%; padding: 0 3px"
                        class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                        :key="pageindex + '-pagination'"
                      >
                        <input
                          :ref="(el) => (inputpagenumberref = el)"
                          type="number"
                          class="shadow-sm w-100 text-center h-100"
                          style="font-size: 0.8rem"
                          :style="
                            current >= 3 && current <= length - 1
                              ? 'background-color: #F0E68C;'
                              : ''
                          "
                          min="3"
                          :max="length - 1"
                          maxlength="5"
                          size="6"
                          value="2"
                          @change="previousOrNextClicked('INPUT')"
                          @keypress.enter="previousOrNextClicked('INPUT')"
                        />
                      </li>
                    </template>
                    <template v-else>
                      <template v-if="pageindex + 1 > length">
                        <li
                          style="width: 37.5%; padding: 0 3px"
                          class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                          :key="pageindex + '-pagination'"
                        >
                          <button
                            class="shadow-sm text-center btn h-100 w-100 m-0"
                            style="font-size: 0.8rem"
                            :style="
                              current > 0 && current === pageindex
                                ? 'background-color: #F0E68C;'
                                : ''
                            "
                            @keypress.enter="setCurrent(pageindex)"
                            @click="setCurrent(pageindex)"
                          >
                            {{ pageindex }}
                          </button>
                        </li>
                      </template>
                    </template>
                  </template>
                </template>
                <template v-else>
                  <template v-for="pageindex in length">
                    <template v-if="pageindex < 2">
                      <li
                        style="width: 12.5%; padding: 0 3px"
                        class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                        :key="pageindex + '-pagination'"
                      >
                        <button
                          class="shadow-sm text-center btn h-100 w-100 m-0"
                          style="font-size: 0.8rem"
                          :style="
                            current > 0 && current === pageindex ? 'background-color: #F0E68C;' : ''
                          "
                          @keypress.enter="setCurrent(pageindex)"
                          @click="setCurrent(pageindex)"
                        >
                          {{ pageindex }}
                        </button>
                      </li>
                    </template>
                    <template v-else-if="pageindex === 2">
                      <li
                        style="width: 87.5%; padding: 0 3px"
                        class="flex-grow-0 flex-shrink-0 align-self-stretch text-center m-0"
                        :key="pageindex + '-pagination'"
                      >
                        <input
                          :ref="(el) => (inputpagenumberref = el)"
                          type="number"
                          class="shadow-sm w-100 text-center h-100"
                          style="font-size: 0.8rem"
                          :style="
                            current >= 2 && current <= length ? 'background-color: #F0E68C;' : ''
                          "
                          min="2"
                          :max="length"
                          maxlength="13"
                          size="14"
                          value="2"
                          @change="previousOrNextClicked('INPUT')"
                          @keypress.enter="previousOrNextClicked('INPUT')"
                        />
                      </li>
                    </template>
                  </template>
                </template>
              </template>
            </template>
            <li
              style="padding: 0px 0px 0px 3px; height: 26px"
              class="flex-grow-0 flex-shrink-0 text-center"
              :style="
                props.paginationarea === 'RESULT-DISPLAYER-VERTICAL' ||
                props.paginationarea === 'RESULT-DISPLAYER-HORIZONTAL' ||
                props.paginationarea ===
                  'WORD-DISPLAY-AREA-WITH-ATNUMBER-BEEN-CLICKED-BUT-WITHOUT-INCLUDE-AND-EXCLUDE' ||
                props.paginationarea ===
                  'WORD-DISPLAY-AREA-WITH-ATNUMBER-BUT-NOT-YET-CLICKED-AND-WITHOUT-INCLUDE-AND-EXCLUDE' ||
                props.paginationarea === 'WORD-DISPLAY-AREA-WITHOUT-INCLUDE-EXCLUDE-AND-ATNUMBER' ||
                props.paginationarea === 'WORD-DISPLAY-AREA-WITH-INCLUDE-EXCLUDE-AND-ATNUMBER' ||
                props.paginationarea ===
                  'WORD-DISPLAY-AREA-WITH-INCLUDE-AND-EXCLUDE-BUT-WITHOUT-ATNUMBER'
                  ? length <= 9
                    ? 'width:' + 100 / (length + 2) + '%;'
                    : 'width: 9.090909091%;'
                  : ''
              "
            >
              <button
                :disabled="length > 1 ? false : true"
                @keypress.enter="previousOrNextClicked('NEXT')"
                @click="previousOrNextClicked('NEXT')"
                class="btn shadow-sm w-100 text-center p-0 m-0"
                style="z-index: 910"
              >
                <img
                  src="http://localhost:5175/src/components/icons/next.png"
                  class="align-middle"
                  style="width: 13px; height: 13px"
                />
              </button>
            </li>
          </ul>
        </template>
      </li>
      <template v-if="length <= 1">
        <li
          style="padding: 0px 0px 0px 3px; width: 10%; height: 26px"
          class="flex-grow-0 flex-shrink-0 text-center"
        >
          <button
            :disabled="length > 1 ? false : true"
            @keypress.enter="previousOrNextClicked('NEXT')"
            @click="previousOrNextClicked('NEXT')"
            class="btn shadow-sm w-100 text-center p-0 m-0"
            style="z-index: 910"
          >
            <img src="http://localhost:5175/src/components/icons/next.png" class="align-middle" style="width: 13px; height: 13px" />
          </button>
        </li>
      </template>
    </ul>
  </div>
</template>
