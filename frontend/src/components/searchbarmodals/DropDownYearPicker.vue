<script lang="ts" setup>
import { inject, onBeforeMount, shallowRef, type ShallowRef, ref, computed, triggerRef } from 'vue'
import type { RangeSelectionParamsType, VisibleCalendarType } from '../types/dd_mm_yy_types'
import { calculateRemainder } from '../utility/days_months_years_utility_fns'

type DropdownYearPickerType = {
  [page: number]: {
    [row: number]: {
      [col: number]: {
        year: number
        ref: HTMLLabelElement | null
        status: 'ENABLE' | 'DISABLE' | 'LOCKED'
        selected: 'SELECTED' | 'DESELECTED'
      }
    }
  }
}

const jumptoweek = inject('jumptoweek') as {
    selections: VisibleCalendarType['selections']
    from: 'DAYS-MONTHS-YEARS' | 'DD-MM-YYYY'
    rangeselectionparams: RangeSelectionParamsType
    maxdate: string
    mindate: string
  },
  props = defineProps<{
    from?: 'YEAR-PREVIOUS' | 'YEAR-CURRENT' | undefined
    currentyear?: number | undefined
    rowlimit: number
    collimit: number
  }>(),
  emits = defineEmits<{
    (e: 'receive:year', action: number): void
  }>(),
  justayearpickerarray = shallowRef<DropdownYearPickerType>(),
  page = ref(0),
  maxyear = parseInt(jumptoweek.maxdate.split('-')[0]),
  minyear = parseInt(jumptoweek.mindate.split('-')[0])
let previous = { r: -1, c: -1, p: -1 }

function fillJustAYearPickerArray(
  mxyear: number,
  mnyear: number,
  rowlimit: number,
  collimit: number
) {
  let index = 0,
    row = 0,
    col = 0,
    counter = 0,
    years = shallowRef<DropdownYearPickerType>()

  //let remainder = calculateRemainder(2022, 1945, 27), maxyear = 2022 + remainder;
  //for(let year=1945; year<=maxyear; year++) {
  let remainder = calculateRemainder(mxyear, mnyear, rowlimit * collimit),
    maxyear = mxyear + remainder,
    minyear = mnyear
  for (let year = minyear; year <= maxyear; year++) {
    if (years.value) {
      if (index in years.value) {
        if (row in years.value[index]) {
          years.value[index][row] = {
            ...years.value[index][row],
            [col]: {
              year: year,
              ref: null,
              selected: 'DESELECTED',
              status:
                jumptoweek.from === 'DAYS-MONTHS-YEARS'
                  ? year in jumptoweek.selections
                    ? 'ENABLE'
                    : year <= mxyear && year >= mnyear
                    ? 'LOCKED'
                    : 'DISABLE'
                  : jumptoweek.rangeselectionparams.excludedates
                  ? jumptoweek.rangeselectionparams.rangefirstselection.date === '' &&
                    jumptoweek.rangeselectionparams.rangelastselection.date === ''
                    ? year <= mxyear && year >= mnyear
                      ? 'ENABLE'
                      : 'DISABLE'
                    : jumptoweek.rangeselectionparams.rangefirstselection.year ===
                      jumptoweek.rangeselectionparams.rangelastselection.year
                    ? year === jumptoweek.rangeselectionparams.rangefirstselection.year
                      ? 'ENABLE'
                      : year <= mxyear && year >= mnyear
                      ? 'LOCKED'
                      : 'DISABLE'
                    : jumptoweek.rangeselectionparams.rangefirstselection.year >
                      jumptoweek.rangeselectionparams.rangelastselection.year
                    ? year >= jumptoweek.rangeselectionparams.rangelastselection.year &&
                      year <= jumptoweek.rangeselectionparams.rangefirstselection.year
                      ? 'ENABLE'
                      : year <= mxyear && year >= mnyear
                      ? 'LOCKED'
                      : 'DISABLE'
                    : year <= jumptoweek.rangeselectionparams.rangelastselection.year &&
                      year >= jumptoweek.rangeselectionparams.rangefirstselection.year
                    ? 'ENABLE'
                    : year <= mxyear && year >= mnyear
                    ? 'LOCKED'
                    : 'DISABLE'
                  : year <= mxyear && year >= mnyear
                  ? 'ENABLE'
                  : 'DISABLE'
            }
          } as DropdownYearPickerType[number][number]
        } else {
          years.value[index] = {
            ...years.value[index],
            [row]: {
              [col]: {
                year: year,
                ref: null,
                selected: 'DESELECTED',
                status:
                  jumptoweek.from === 'DAYS-MONTHS-YEARS'
                    ? year in jumptoweek.selections
                      ? 'ENABLE'
                      : year <= mxyear && year >= mnyear
                      ? 'LOCKED'
                      : 'DISABLE'
                    : jumptoweek.rangeselectionparams.excludedates
                    ? jumptoweek.rangeselectionparams.rangefirstselection.date === '' &&
                      jumptoweek.rangeselectionparams.rangelastselection.date === ''
                      ? year <= mxyear && year >= mnyear
                        ? 'ENABLE'
                        : 'DISABLE'
                      : jumptoweek.rangeselectionparams.rangefirstselection.year ===
                        jumptoweek.rangeselectionparams.rangelastselection.year
                      ? year === jumptoweek.rangeselectionparams.rangefirstselection.year
                        ? 'ENABLE'
                        : year <= mxyear && year >= mnyear
                        ? 'LOCKED'
                        : 'DISABLE'
                      : jumptoweek.rangeselectionparams.rangefirstselection.year >
                        jumptoweek.rangeselectionparams.rangelastselection.year
                      ? year >= jumptoweek.rangeselectionparams.rangelastselection.year &&
                        year <= jumptoweek.rangeselectionparams.rangefirstselection.year
                        ? 'ENABLE'
                        : year <= mxyear && year >= mnyear
                        ? 'LOCKED'
                        : 'DISABLE'
                      : year <= jumptoweek.rangeselectionparams.rangelastselection.year &&
                        year >= jumptoweek.rangeselectionparams.rangefirstselection.year
                      ? 'ENABLE'
                      : year <= mxyear && year >= mnyear
                      ? 'LOCKED'
                      : 'DISABLE'
                    : year <= mxyear && year >= mnyear
                    ? 'ENABLE'
                    : 'DISABLE'
              }
            }
          } as DropdownYearPickerType[number]
        }
        col++
      } else {
        years.value = {
          ...years.value,
          [index]: {
            [row]: {
              [col]: {
                year: year,
                ref: null,
                selected: 'DESELECTED',
                status:
                  jumptoweek.from === 'DAYS-MONTHS-YEARS'
                    ? year in jumptoweek.selections
                      ? 'ENABLE'
                      : year <= mxyear && year >= mnyear
                      ? 'LOCKED'
                      : 'DISABLE'
                    : jumptoweek.rangeselectionparams.excludedates
                    ? jumptoweek.rangeselectionparams.rangefirstselection.date === '' &&
                      jumptoweek.rangeselectionparams.rangelastselection.date === ''
                      ? year <= mxyear && year >= mnyear
                        ? 'ENABLE'
                        : 'DISABLE'
                      : jumptoweek.rangeselectionparams.rangefirstselection.year ===
                        jumptoweek.rangeselectionparams.rangelastselection.year
                      ? year === jumptoweek.rangeselectionparams.rangefirstselection.year
                        ? 'ENABLE'
                        : year <= mxyear && year >= mnyear
                        ? 'LOCKED'
                        : 'DISABLE'
                      : jumptoweek.rangeselectionparams.rangefirstselection.year >
                        jumptoweek.rangeselectionparams.rangelastselection.year
                      ? year >= jumptoweek.rangeselectionparams.rangelastselection.year &&
                        year <= jumptoweek.rangeselectionparams.rangefirstselection.year
                        ? 'ENABLE'
                        : year <= mxyear && year >= mnyear
                        ? 'LOCKED'
                        : 'DISABLE'
                      : year <= jumptoweek.rangeselectionparams.rangelastselection.year &&
                        year >= jumptoweek.rangeselectionparams.rangefirstselection.year
                      ? 'ENABLE'
                      : year <= mxyear && year >= mnyear
                      ? 'LOCKED'
                      : 'DISABLE'
                    : year <= mxyear && year >= mnyear
                    ? 'ENABLE'
                    : 'DISABLE'
              }
            }
          }
        } as DropdownYearPickerType
        col++
      }
    } else {
      years.value = {
        [index]: {
          [row]: {
            [col]: {
              year: year,
              ref: null,
              selected: 'DESELECTED',
              status:
                jumptoweek.from === 'DAYS-MONTHS-YEARS'
                  ? year in jumptoweek.selections
                    ? 'ENABLE'
                    : year <= mxyear && year >= mnyear
                    ? 'LOCKED'
                    : 'DISABLE'
                  : jumptoweek.rangeselectionparams.excludedates
                  ? jumptoweek.rangeselectionparams.rangefirstselection.date === '' &&
                    jumptoweek.rangeselectionparams.rangelastselection.date === ''
                    ? year <= mxyear && year >= mnyear
                      ? 'ENABLE'
                      : 'DISABLE'
                    : jumptoweek.rangeselectionparams.rangefirstselection.year ===
                      jumptoweek.rangeselectionparams.rangelastselection.year
                    ? year === jumptoweek.rangeselectionparams.rangefirstselection.year
                      ? 'ENABLE'
                      : year <= mxyear && year >= mnyear
                      ? 'LOCKED'
                      : 'DISABLE'
                    : jumptoweek.rangeselectionparams.rangefirstselection.year >
                      jumptoweek.rangeselectionparams.rangelastselection.year
                    ? year >= jumptoweek.rangeselectionparams.rangelastselection.year &&
                      year <= jumptoweek.rangeselectionparams.rangefirstselection.year
                      ? 'ENABLE'
                      : year <= mxyear && year >= mnyear
                      ? 'LOCKED'
                      : 'DISABLE'
                    : year <= jumptoweek.rangeselectionparams.rangelastselection.year &&
                      year >= jumptoweek.rangeselectionparams.rangefirstselection.year
                    ? 'ENABLE'
                    : year <= mxyear && year >= mnyear
                    ? 'LOCKED'
                    : 'DISABLE'
                  : year <= mxyear && year >= mnyear
                  ? 'ENABLE'
                  : 'DISABLE'
            }
          }
        }
      } as DropdownYearPickerType
      col++
    }
    if (col === collimit) {
      row++
      col = 0
      counter++
    }
    if (counter === rowlimit) {
      index++
      counter = 0
      row = 0
    }
  }

  return years
}

function selectYearAndEmitSignal(rindex: number, cindex: number) {
  if (
    props.currentyear !==
      (justayearpickerarray.value as DropdownYearPickerType)[page.value][rindex][cindex].year &&
    (justayearpickerarray.value as DropdownYearPickerType)[page.value][rindex][cindex].status ===
      'ENABLE'
  ) {
    if (previous.r !== -1 && previous.c !== -1 && previous.p !== -1) {
      ;(justayearpickerarray.value as DropdownYearPickerType)[previous.p][previous.r][
        previous.c
      ].selected = 'DESELECTED'
    }
    emits(
      'receive:year',
      (justayearpickerarray.value as DropdownYearPickerType)[page.value][rindex][cindex].year
    )
    ;(justayearpickerarray.value as DropdownYearPickerType)[page.value][rindex][cindex].selected =
      (justayearpickerarray.value as DropdownYearPickerType)[page.value][rindex][cindex]
        .selected === 'DESELECTED'
        ? 'SELECTED'
        : 'DESELECTED'
    triggerRef(justayearpickerarray)
    previous = {
      r: rindex,
      c: cindex,
      p: page.value
    }
  }
}

onBeforeMount(() => {
  justayearpickerarray.value = (
    fillJustAYearPickerArray(
      maxyear,
      minyear,
      props.rowlimit,
      props.collimit
    ) as ShallowRef<DropdownYearPickerType>
  ).value as DropdownYearPickerType
  triggerRef(justayearpickerarray)
  page.value = Object.keys(justayearpickerarray.value).length - 1
})

const compYearsLength = computed(() => {
  return Object.keys(justayearpickerarray.value as DropdownYearPickerType).length
})
</script>

<template>
  <div class="d-block">
    <div
      class="shadow-sm flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
      style="background-color: lightgray; padding: 10px"
    >
      <div class="text-left">
        <a
          :class="[compYearsLength > 1 && page > 0 ? 'cursor-pointer' : '']"
          style="border-radius: 50%"
          :style="
            compYearsLength > 1 && page > 0 ? 'background-color: green;' : 'background-color:gray;'
          "
          class="flex-box align-items-center justify-content-center text-center"
          @keypress.enter="
            () => {
              page = page - 1 < 0 ? 0 : page - 1
            }
          "
          @click="
            () => {
              page = page - 1 < 0 ? 0 : page - 1
            }
          "
        >
          <svg
            class="shadow"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            style="
              border-radius: 50%;
              height: 20px;
              width: 20px;
              color: #fff;
              stroke: currentcolor;
              fill: currentcolor;
            "
          >
            <path
              d="M20.943 23.057l-7.057-7.057c0 0 7.057-7.057 7.057-7.057 0.52-0.52 0.52-1.365 0-1.885s-1.365-0.52-1.885 0l-8 8c-0.521 0.521-0.521 1.365 0 1.885l8 8c0.52 0.52 1.365 0.52 1.885 0s0.52-1.365 0-1.885z"
            ></path>
          </svg>
        </a>
      </div>
      <div class="flex-fill text-center">Choose a year</div>
      <div class="text-right">
        <a
          :class="[compYearsLength > 1 && page !== compYearsLength - 1 ? 'cursor-pointer' : '']"
          style="border-radius: 50%"
          :style="
            compYearsLength > 1 && page !== compYearsLength - 1
              ? 'background-color: green;'
              : 'background-color:gray;'
          "
          class="flex-box align-items-center justify-content-center text-center"
          @keypress.enter="
            () => {
              page = page + 1 > compYearsLength - 1 ? compYearsLength - 1 : page + 1
            }
          "
          @click="
            () => {
              page = page + 1 > compYearsLength - 1 ? compYearsLength - 1 : page + 1
            }
          "
        >
          <svg
            class="shadow"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            style="
              border-radius: 50%;
              height: 20px;
              width: 20px;
              color: #fff;
              stroke: currentcolor;
              fill: currentcolor;
            "
          >
            <path
              d="M12.943 24.943l8-8c0.521-0.521 0.521-1.365 0-1.885l-8-8c-0.52-0.52-1.365-0.52-1.885 0s-0.52 1.365 0 1.885l7.057 7.057c0 0-7.057 7.057-7.057 7.057-0.52 0.52-0.52 1.365 0 1.885s1.365 0.52 1.885 0z"
            ></path>
          </svg>
        </a>
      </div>
    </div>
    <div
      style="padding: 2px 0"
      class="flex-box flex-direction-row flex-wrap justify-content-start align-items-center"
    >
      <template
        v-for="(row, rindex) in (justayearpickerarray as DropdownYearPickerType)[page]"
        :key="rindex + 'rr-cc'"
      >
        <template v-for="(col, cindex) in row" :key="cindex + 'cc-ss'">
          <div
            class="flex-w-100-over-3 overflow-hidden"
            style="float: left; outline: 1px solid #fff"
          >
            <label
              :ref="(el) => (col.ref = el as HTMLLabelElement)"
              @keypress.enter="selectYearAndEmitSignal(rindex, cindex)"
              @click="selectYearAndEmitSignal(rindex, cindex)"
              class="w-100"
              style="float: left"
              :style="
                props.from !== undefined &&
                (props.from === 'YEAR-PREVIOUS' || props.from === 'YEAR-CURRENT')
                  ? jumptoweek.from === 'DAYS-MONTHS-YEARS'
                    ? 'line-height: 4.565em; height: 4.565em;'
                    : 'line-height: 3.8em; height: 3.8em;'
                  : jumptoweek.from === 'DAYS-MONTHS-YEARS'
                  ? 'line-height: 2.32em; height: 2.32em;'
                  : 'line-height: 2em; height: 2em;'
              "
            >
              <input
                @keypress.enter.stop=""
                @click.stop=""
                type="checkbox"
                :value="col.year"
                class="position-absolute d-none"
                style="pointer-events: auto"
              />
              <span
                :class="[
                  props.currentyear !== undefined && col.year === props.currentyear
                    ? ''
                    : col.status === 'ENABLE'
                    ? 'cursor-pointer'
                    : ''
                ]"
                class="font-family text-center d-block letter-spacing h-100"
                style="font-size: 1rem"
                :style="
                  props.currentyear !== undefined && col.year === props.currentyear
                    ? 'text-shadow: none; background-color: yellow; color: #fff;'
                    : col.status === 'ENABLE'
                    ? col.selected === 'SELECTED'
                      ? 'background-color: green; color: #fff;'
                      : 'background-color: #E8E8E8; color: black; text-shadow:none;'
                    : col.status === 'LOCKED'
                    ? 'text-shadow: none; background-color: yellow; color: #fff;'
                    : 'background-color: #fff; color: #fff; text-shadow:none;'
                "
              >
                {{ col.year }}
              </span>
            </label>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
label input + span {
  color: #fff;
}
input:checked + span {
  color: #ffffff;
  text-shadow: 0 0 6px rgba(0, 0, 0, 0.8);
}
</style>
