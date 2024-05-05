<script setup lang="ts">
import {
  watch,
  nextTick,
  ref,
  shallowRef,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
  triggerRef,
  type WatchStopHandle,
  type ShallowRef
} from 'vue'
import type {
  DaySelectionFormat,
  DaySelectionType,
  DayRangeFirstSelectionType
} from '../types/days_months_years_types'
import { getDayDimensions, fillDayArray } from '../utility/days_months_years_utility_fns'

let unwatchrangecount: WatchStopHandle,
  unwatchmultipleselectcount: WatchStopHandle,
  unwatchformat: WatchStopHandle,
  unwatchnotifytosendsignal: WatchStopHandle

const props = defineProps<{
    notifytosendsignal?: number | undefined
    dayselectionandformat: DaySelectionFormat
    isoweek: boolean
  }>(),
  emits = defineEmits<{
    (e: 'update:dayselectionandformat', action: DaySelectionFormat): void
    (e: 'signal:readyforexclude', action: number): void
  }>(),
  holder = shallowRef<DaySelectionFormat>(),
  days = shallowRef<DaySelectionType>(),
  rangecount = ref(0),
  multipleselectcount = ref(0),
  rangefirstselection = ref<DayRangeFirstSelectionType>(),
  loadingMovement = ref(false)
function triggerHolder() {
  triggerRef(holder)
}

function addDay(day: number) {
  if ((holder.value as DaySelectionFormat).format === 'RANGE') {
    if (rangecount.value < 2) {
      if (
        (days.value as DaySelectionType)[day].selected === 'DESELECTED' ||
        (days.value as DaySelectionType)[day].selected === 'HIGHLIGHTED'
      ) {
        ;(days.value as DaySelectionType)[day].selected = 'SELECTED'
        rangecount.value++
        if (rangecount.value === 1) {
          rangefirstselection.value = { day }
          trackDayBoxMouseMovement()
        } else {
          unTrackDayBoxMouseMovement()
          rangefirstselection.value = { day: -1 }
        }
      } else {
        ;((days.value as DaySelectionType)[day] as DaySelectionType[number]).selected = 'DESELECTED'
        rangefirstselection.value = { day: -1 }
        rangecount.value = 0
        unTrackDayBoxMouseMovement()
      }
    } else {
      deselectAll()
      rangecount.value = 1
      ;(days.value as DaySelectionType)[day].selected = 'SELECTED'
      rangefirstselection.value = { day }
      trackDayBoxMouseMovement()
    }
  } else {
    if ((days.value as DaySelectionType)[day].selected === 'DESELECTED') {
      ;(days.value as DaySelectionType)[day].selected = 'SELECTED'
      multipleselectcount.value++
    } else {
      ;(days.value as DaySelectionType as DaySelectionType)[day].selected = 'DESELECTED'
      multipleselectcount.value--
    }
  }
  triggerRef(days)
}

function deselectAll() {
  for (let day in days.value as DaySelectionType) {
    ;(days.value as DaySelectionType)[day].selected = 'DESELECTED'
  }
}

function whereisMouse(pointx: number) {
  let result = { day: -1 }
  for (let day in days.value as DaySelectionType) {
    if (
      pointx >= parseFloat('' + (days.value as DaySelectionType)[day].x1) &&
      pointx <= parseFloat('' + (days.value as DaySelectionType)[day].x2)
    ) {
      result = {
        day: parseInt(day)
      }
      break
    }
  }
  return result
}

function mouseMovement(event: { pageX: number; pageY: number }) {
  nextTick(() => {
    if (loadingMovement.value === false) {
      loadingMovement.value = true
      if ((holder.value as DaySelectionFormat).format === 'RANGE') {
        if ((rangefirstselection.value as DayRangeFirstSelectionType).day > -1) {
          let mousePointed = whereisMouse(event.pageX)
          for (let day in days.value as DaySelectionType) {
            if (parseInt(day) > (rangefirstselection.value as DayRangeFirstSelectionType).day) {
              if (parseInt(day) <= mousePointed.day) {
                ;(days.value as DaySelectionType)[day].selected = 'HIGHLIGHTED'
              } else {
                if ((days.value as DaySelectionType)[day].selected === 'HIGHLIGHTED') {
                  ;(days.value as DaySelectionType)[day].selected = 'DESELECTED'
                }
              }
            } else {
              if (parseInt(day) < (rangefirstselection.value as DayRangeFirstSelectionType).day) {
                if (parseInt(day) >= mousePointed.day) {
                  ;(days.value as DaySelectionType)[day].selected = 'HIGHLIGHTED'
                } else {
                  if ((days.value as DaySelectionType)[day].selected === 'HIGHLIGHTED') {
                    ;(days.value as DaySelectionType)[day].selected = 'DESELECTED'
                  }
                }
              }
            }
          }
        }
      }
      loadingMovement.value = false
    }
    triggerRef(days)
  })
}

function processDimensions() {
  getDayDimensions(days as ShallowRef<DaySelectionType>)
}

function unTrackDayBoxMouseMovement() {
  if (document.getElementById('daybox')) {
    ;(document.getElementById('daybox') as HTMLDivElement).removeEventListener(
      'mousemove',
      mouseMovement,
      true
    )
  }
}

function trackDayBoxMouseMovement() {
  if (document.getElementById('daybox')) {
    ;(document.getElementById('daybox') as HTMLDivElement).addEventListener(
      'mousemove',
      mouseMovement,
      true
    )
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', processDimensions, true)
  window.removeEventListener('scroll', processDimensions, true)
  unTrackDayBoxMouseMovement()
  unwatchformat()
  unwatchrangecount()
  unwatchmultipleselectcount()
  unwatchnotifytosendsignal()
})

onMounted(() => {
  unwatchnotifytosendsignal = watch(
    () => props.notifytosendsignal as number,
    () => {
      ;(holder.value as DaySelectionFormat).days = days.value as DaySelectionType
      triggerRef(holder)
      emits('update:dayselectionandformat', holder.value as DaySelectionFormat)
    }
  )
  unwatchmultipleselectcount = watch(
    () => multipleselectcount.value,
    (x) => {
      if ((holder.value as DaySelectionFormat).format === 'MULTIPLE-OR-SINGLE') {
        if (x > 0) {
          emits('signal:readyforexclude', multipleselectcount.value)
        } else {
          emits('signal:readyforexclude', multipleselectcount.value)
        }
      } else {
        if (rangecount.value === 0) {
          emits('signal:readyforexclude', 0)
        }
      }
    }
  )
  unwatchrangecount = watch(
    () => rangecount.value,
    (x) => {
      if ((holder.value as DaySelectionFormat).format === 'RANGE') {
        if (x === 2) {
          emits('signal:readyforexclude', rangecount.value)
        } else {
          emits('signal:readyforexclude', 0)
        }
      } else {
        if (multipleselectcount.value === 0) {
          emits('signal:readyforexclude', 0)
        }
      }
    }
  )
  unwatchformat = watch(
    () => (holder.value as DaySelectionFormat).format,
    () => {
      deselectAll()
      unTrackDayBoxMouseMovement()
      rangefirstselection.value = { day: -1 }
      rangecount.value = 0
      multipleselectcount.value = 0
    }
  )
  window.addEventListener('resize', processDimensions, true)
  window.addEventListener('scroll', processDimensions, true)
})

onBeforeMount(() => {
  holder.value = JSON.parse(JSON.stringify(props.dayselectionandformat))
  ;(holder.value as DaySelectionFormat).format = props.dayselectionandformat.format
  triggerHolder()
  days.value = (
    fillDayArray(
      props.isoweek,
      (holder.value as DaySelectionFormat).format
    ) as ShallowRef<DaySelectionType>
  ).value as DaySelectionType
  rangefirstselection.value = { day: -1 }
  rangecount.value = 0
  multipleselectcount.value = 0
  triggerRef(days)
})
</script>

<template>
  <div class="d-block">
    <div
      class="shadow-sm flex-box flex-direction-row flex-nowrap justify-content-start align-items-center w-100"
    >
      <div class="flex-w-50">
        <button
          @keypress.enter="
            () => {
              ;(holder as DaySelectionFormat).format = 'RANGE'
              triggerHolder()
            }
          "
          @click="
            () => {
              ;(holder as DaySelectionFormat).format = 'RANGE'
              triggerHolder()
            }
          "
          :style="
            (holder as DaySelectionFormat).format === 'RANGE'
              ? 'background-color:green;'
              : 'background-color:gray;'
          "
          class="font-family letter-spacing cursor-pointer btn w-100"
          style="color: #fff; padding: 2px 0; border-right: 1px solid #fff"
        >
          Range
        </button>
      </div>
      <div class="flex-w-50">
        <button
          @keypress.enter="
            () => {
              ;(holder as DaySelectionFormat).format = 'MULTIPLE-OR-SINGLE'
              triggerHolder()
            }
          "
          @click="
            () => {
              ;(holder as DaySelectionFormat).format = 'MULTIPLE-OR-SINGLE'
              triggerHolder()
            }
          "
          :style="
            (holder as DaySelectionFormat).format === 'MULTIPLE-OR-SINGLE'
              ? 'background-color:green;'
              : 'background-color:gray;'
          "
          class="font-family letter-spacing cursor-pointer btn w-100"
          style="color: #fff; padding: 2px 0; border-left: 1px solid #fff"
        >
          Multiple or Single
        </button>
      </div>
    </div>
    <div class="d-block shadow-sm" style="height: 34px; padding-top: 2px" id="daybox">
      <div class="flex-box flex-direction-row flex-wrap justify-content-start align-items-center">
        <template v-for="(day, dindex) in days" :key="dindex + 'dd-aa'">
          <div
            class="flex-w-14-dot-285714 overflow-hidden"
            style="float: left; outline: 1px solid #fff"
          >
            <label
              :ref="(el) => (day.ref = el as HTMLLabelElement)"
              @keypress.enter="
                () => {
                  ;(holder as DaySelectionFormat).format === 'RANGE' ||
                  (holder as DaySelectionFormat).format === 'MULTIPLE-OR-SINGLE'
                    ? addDay(parseInt('' + dindex))
                    : ''
                }
              "
              @click="
                () => {
                  ;(holder as DaySelectionFormat).format === 'RANGE' ||
                  (holder as DaySelectionFormat).format === 'MULTIPLE-OR-SINGLE'
                    ? addDay(parseInt('' + dindex))
                    : ''
                }
              "
              class="w-100"
              style="float: left; line-height: 2em; height: 2em"
            >
              <input
                @click.stop=""
                @keypress.enter.stop=""
                type="checkbox"
                :value="day"
                class="position-absolute d-none"
                style="pointer-events: auto"
              />
              <span
                class="font-family text-center d-block letter-spacing"
                style="font-size: 1rem; line-height: 2em; height: 2em"
                :class="[
                  (holder as DaySelectionFormat).format === 'RANGE' ||
                  (holder as DaySelectionFormat).format === 'MULTIPLE-OR-SINGLE'
                    ? 'cursor-pointer'
                    : ''
                ]"
                :style="
                  day.selected === 'SELECTED'
                    ? 'background-color: green; color: #fff;'
                    : day.selected === 'DESELECTED'
                    ? 'background-color: #E8E8E8; color: black; text-shadow:none'
                    : 'background-color: gray; color: #fff;'
                "
              >
                {{ day.name }}
              </span>
            </label>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
label input + span {
  color: #fff;
}

/* This will declare how a selected input will look giving generic properties */
input:checked + span {
  color: #ffffff;
  text-shadow: 0 0 6px rgba(0, 0, 0, 0.8);
}
</style>
