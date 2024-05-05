<script lang="ts" setup>
import { inject, shallowRef, onBeforeMount, triggerRef } from 'vue'
import type { VisibleCalendarType, RangeSelectionParamsType } from '../types/dd_mm_yy_types'

type DropdownMonthPickerType = {
  [row: number]: {
    [col: number]: {
      month: number
      ref: HTMLLabelElement | null
      status: 'ENABLE' | 'DISABLE' | 'LOCKED'
      selected: 'SELECTED' | 'DESELECTED'
    }
  }
}

const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ],
  jumptoweek = inject('jumptoweek') as {
    selections: VisibleCalendarType['selections']
    from: 'DAYS-MONTHS-YEARS' | 'DD-MM-YYYY'
    rangeselectionparams: RangeSelectionParamsType
    mindate: string
    maxdate: string
  },
  props = defineProps<{
    month: number
    year: number
    iam: 'PREVIOUS' | 'CURRENT'
    counterpartmonth: number
    counterpartyear: number
  }>()
let monthpickerarray = shallowRef<DropdownMonthPickerType>(),
  previous = { r: -1, c: -1 }
function selectMonthAndEmitSignal(rindex: number, cindex: number) {
  if ((monthpickerarray.value as DropdownMonthPickerType)[rindex][cindex].status === 'ENABLE') {
    if (previous.r !== -1 && previous.c !== -1) {
      ;(monthpickerarray.value as DropdownMonthPickerType)[previous.r][previous.c].selected =
        'DESELECTED'
    }
    //emits('receive:month', (monthpickerarray.value as DropdownMonthPickerType)[rindex][cindex].month);
    ;(monthpickerarray.value as DropdownMonthPickerType)[rindex][cindex].selected =
      (monthpickerarray.value as DropdownMonthPickerType)[rindex][cindex].selected === 'DESELECTED'
        ? 'SELECTED'
        : 'DESELECTED'
    triggerRef(monthpickerarray)
    previous = {
      r: rindex,
      c: cindex
    }
  }
}

function fillMonthPickerArray() {
  let col = 0,
    row = 0,
    vc: VisibleCalendarType['selections'] = {},
    maxyear = parseInt(jumptoweek.maxdate.split('-')[0]),
    minyear = parseInt(jumptoweek.mindate.split('-')[0]),
    maxmonth = parseInt(jumptoweek.maxdate.split('-')[1]) - 1,
    minmonth = parseInt(jumptoweek.mindate.split('-')[1]) - 1
  if (
    jumptoweek.rangeselectionparams.excludedates &&
    jumptoweek.rangeselectionparams.rangefirstselection.date &&
    jumptoweek.rangeselectionparams.rangelastselection.date
  ) {
    if (
      jumptoweek.rangeselectionparams.rangefirstselection.year ===
      jumptoweek.rangeselectionparams.rangelastselection.year
    ) {
      if (
        jumptoweek.rangeselectionparams.rangefirstselection.month ===
        jumptoweek.rangeselectionparams.rangelastselection.month
      ) {
        ;(vc as VisibleCalendarType['selections']) = {
          [jumptoweek.rangeselectionparams.rangefirstselection.year]: {
            months: {
              [jumptoweek.rangeselectionparams.rangefirstselection.month]: ''
            }
          }
        } as unknown as VisibleCalendarType['selections']
      } else {
        ;(vc as VisibleCalendarType['selections']) = {
          [jumptoweek.rangeselectionparams.rangefirstselection.year]: {
            months: {}
          }
        } as unknown as VisibleCalendarType['selections']
        if (
          jumptoweek.rangeselectionparams.rangefirstselection.month >
          jumptoweek.rangeselectionparams.rangelastselection.month
        ) {
          for (
            let m = jumptoweek.rangeselectionparams.rangelastselection.month;
            m <= jumptoweek.rangeselectionparams.rangefirstselection.month;
            m++
          ) {
            ;(vc as VisibleCalendarType['selections'])[
              jumptoweek.rangeselectionparams.rangefirstselection.year
            ].months = {
              ...(vc as VisibleCalendarType['selections'])[
                jumptoweek.rangeselectionparams.rangefirstselection.year
              ].months,
              [m]: ''
            } as unknown as VisibleCalendarType['selections'][number]['months']
          }
        } else {
          for (
            let m = jumptoweek.rangeselectionparams.rangefirstselection.month;
            m <= jumptoweek.rangeselectionparams.rangelastselection.month;
            m++
          ) {
            ;(vc as VisibleCalendarType['selections'])[
              jumptoweek.rangeselectionparams.rangefirstselection.year
            ].months = {
              ...(vc as VisibleCalendarType['selections'])[
                jumptoweek.rangeselectionparams.rangefirstselection.year
              ].months,
              [m]: ''
            } as unknown as VisibleCalendarType['selections'][number]['months']
          }
        }
      }
    } else {
      if (
        jumptoweek.rangeselectionparams.rangefirstselection.year >
        jumptoweek.rangeselectionparams.rangelastselection.year
      ) {
        for (
          let y = jumptoweek.rangeselectionparams.rangelastselection.year;
          y <= jumptoweek.rangeselectionparams.rangefirstselection.year;
          y++
        ) {
          if (vc as VisibleCalendarType['selections']) {
            if (!(y in (vc as VisibleCalendarType['selections']))) {
              ;(vc as VisibleCalendarType['selections']) = {
                ...(vc as VisibleCalendarType['selections']),
                [y]: {
                  months: {}
                }
              } as unknown as VisibleCalendarType['selections']
            }
          } else {
            ;(vc as VisibleCalendarType['selections']) = {
              [y]: {
                months: {}
              }
            } as unknown as VisibleCalendarType['selections']
          }
          if (
            y === jumptoweek.rangeselectionparams.rangelastselection.year ||
            y === jumptoweek.rangeselectionparams.rangefirstselection.year
          ) {
            if (y === jumptoweek.rangeselectionparams.rangelastselection.year) {
              for (let m = jumptoweek.rangeselectionparams.rangelastselection.month; m < 12; m++) {
                if (!(m in (vc as VisibleCalendarType['selections'])[y].months)) {
                  ;(vc as VisibleCalendarType['selections'])[y].months = {
                    ...(vc as VisibleCalendarType['selections'])[y].months,
                    [m]: ''
                  } as unknown as VisibleCalendarType['selections'][number]['months']
                }
              }
            } else {
              for (let m = 0; m <= jumptoweek.rangeselectionparams.rangefirstselection.month; m++) {
                if (!(m in (vc as VisibleCalendarType['selections'])[y].months)) {
                  ;(vc as VisibleCalendarType['selections'])[y].months = {
                    ...(vc as VisibleCalendarType['selections'])[y].months,
                    [m]: ''
                  } as unknown as VisibleCalendarType['selections'][number]['months']
                }
              }
            }
          } else {
            for (let m = 0; m < 12; m++) {
              if (!(m in (vc as VisibleCalendarType['selections'])[y].months)) {
                ;(vc as VisibleCalendarType['selections'])[y].months = {
                  ...(vc as VisibleCalendarType['selections'])[y].months,
                  [m]: ''
                } as unknown as VisibleCalendarType['selections'][number]['months']
              }
            }
          }
        }
      } else {
        for (
          let y = jumptoweek.rangeselectionparams.rangefirstselection.year;
          y <= jumptoweek.rangeselectionparams.rangelastselection.year;
          y++
        ) {
          if (vc as VisibleCalendarType['selections']) {
            if (!(y in (vc as VisibleCalendarType['selections']))) {
              ;(vc as VisibleCalendarType['selections']) = {
                ...(vc as VisibleCalendarType['selections']),
                [y]: {
                  months: {}
                }
              } as unknown as VisibleCalendarType['selections']
            }
          } else {
            ;(vc as VisibleCalendarType['selections']) = {
              [y]: {
                months: {}
              }
            } as unknown as VisibleCalendarType['selections']
          }
          if (
            y === jumptoweek.rangeselectionparams.rangelastselection.year ||
            y === jumptoweek.rangeselectionparams.rangefirstselection.year
          ) {
            if (y === jumptoweek.rangeselectionparams.rangefirstselection.year) {
              for (let m = jumptoweek.rangeselectionparams.rangefirstselection.month; m < 12; m++) {
                if (!(m in (vc as VisibleCalendarType['selections'])[y].months)) {
                  ;(vc as VisibleCalendarType['selections'])[y].months = {
                    ...(vc as VisibleCalendarType['selections'])[y].months,
                    [m]: ''
                  } as unknown as VisibleCalendarType['selections'][number]['months']
                }
              }
            } else {
              for (let m = 0; m <= jumptoweek.rangeselectionparams.rangelastselection.month; m++) {
                if (!(m in (vc as VisibleCalendarType['selections'])[y].months)) {
                  ;(vc as VisibleCalendarType['selections'])[y].months = {
                    ...(vc as VisibleCalendarType['selections'])[y].months,
                    [m]: ''
                  } as unknown as VisibleCalendarType['selections'][number]['months']
                }
              }
            }
          } else {
            for (let m = 0; m < 12; m++) {
              if (!(m in (vc as VisibleCalendarType['selections'])[y].months)) {
                ;(vc as VisibleCalendarType['selections'])[y].months = {
                  ...(vc as VisibleCalendarType['selections'])[y].months,
                  [m]: ''
                } as unknown as VisibleCalendarType['selections'][number]['months']
              }
            }
          }
        }
      }
    }
  }

  for (let i = 0; i < 12; i++) {
    if (monthpickerarray.value) {
      if (row in monthpickerarray.value) {
        ;(monthpickerarray.value as DropdownMonthPickerType)[row] = {
          ...(monthpickerarray.value as DropdownMonthPickerType)[row],
          [col]: {
            month: i,
            ref: null,
            status:
              jumptoweek.from === 'DAYS-MONTHS-YEARS'
                ? props.year in (jumptoweek.selections as VisibleCalendarType['selections']) &&
                  i in
                    (jumptoweek.selections as VisibleCalendarType['selections'])[props.year]
                      .months &&
                  i !== props.month
                  ? 'ENABLE'
                  : 'LOCKED'
                : jumptoweek.rangeselectionparams.excludedates &&
                  jumptoweek.rangeselectionparams.rangefirstselection.date &&
                  jumptoweek.rangeselectionparams.rangelastselection.date
                ? props.year in (vc as VisibleCalendarType['selections']) &&
                  'months' in (vc as VisibleCalendarType['selections'])[props.year] &&
                  i in (vc as VisibleCalendarType['selections'])[props.year].months &&
                  i !== props.month
                  ? 'ENABLE'
                  : 'LOCKED'
                : (props.iam === 'PREVIOUS' &&
                    props.year === maxyear &&
                    i < maxmonth &&
                    i !== props.month) ||
                  (props.iam === 'PREVIOUS' &&
                    props.year === minyear &&
                    i >= minmonth &&
                    i !== props.month) ||
                  (props.iam === 'CURRENT' &&
                    props.year === maxyear &&
                    i <= maxmonth &&
                    i !== props.month) ||
                  (props.iam === 'CURRENT' &&
                    props.year === minyear &&
                    i > minmonth &&
                    i !== props.month) ||
                  ((props.iam === 'CURRENT' || props.iam === 'PREVIOUS') &&
                    props.year !== minyear &&
                    props.year !== maxyear &&
                    i !== props.month)
                ? 'ENABLE'
                : 'LOCKED',
            selected: 'DESELECTED'
          }
        } as DropdownMonthPickerType[number]
      } else {
        monthpickerarray.value = {
          ...monthpickerarray.value,
          [row]: {
            [col]: {
              month: i,
              ref: null,
              status:
                jumptoweek.from === 'DAYS-MONTHS-YEARS'
                  ? props.year in (jumptoweek.selections as VisibleCalendarType['selections']) &&
                    i in
                      (jumptoweek.selections as VisibleCalendarType['selections'])[props.year]
                        .months &&
                    i !== props.month
                    ? 'ENABLE'
                    : 'LOCKED'
                  : jumptoweek.rangeselectionparams.excludedates &&
                    jumptoweek.rangeselectionparams.rangefirstselection.date &&
                    jumptoweek.rangeselectionparams.rangelastselection.date
                  ? props.year in (vc as VisibleCalendarType['selections']) &&
                    'months' in (vc as VisibleCalendarType['selections'])[props.year] &&
                    i in (vc as VisibleCalendarType['selections'])[props.year].months &&
                    i !== props.month
                    ? 'ENABLE'
                    : 'LOCKED'
                  : (props.iam === 'PREVIOUS' &&
                      props.year === maxyear &&
                      i < maxmonth &&
                      i !== props.month) ||
                    (props.iam === 'PREVIOUS' &&
                      props.year === minyear &&
                      i >= minmonth &&
                      i !== props.month) ||
                    (props.iam === 'CURRENT' &&
                      props.year === maxyear &&
                      i <= maxmonth &&
                      i !== props.month) ||
                    (props.iam === 'CURRENT' &&
                      props.year === minyear &&
                      i > minmonth &&
                      i !== props.month) ||
                    ((props.iam === 'CURRENT' || props.iam === 'PREVIOUS') &&
                      props.year !== minyear &&
                      props.year !== maxyear &&
                      i !== props.month)
                  ? 'ENABLE'
                  : 'LOCKED',
              selected: 'DESELECTED'
            }
          }
        } as DropdownMonthPickerType
      }
    } else {
      monthpickerarray.value = {
        [row]: {
          [col]: {
            month: i,
            ref: null,
            status:
              jumptoweek.from === 'DAYS-MONTHS-YEARS'
                ? props.year in (jumptoweek.selections as VisibleCalendarType['selections']) &&
                  i in
                    (jumptoweek.selections as VisibleCalendarType['selections'])[props.year]
                      .months &&
                  i !== props.month
                  ? 'ENABLE'
                  : 'LOCKED'
                : jumptoweek.rangeselectionparams.excludedates &&
                  jumptoweek.rangeselectionparams.rangefirstselection.date &&
                  jumptoweek.rangeselectionparams.rangelastselection.date
                ? props.year in (vc as VisibleCalendarType['selections']) &&
                  'months' in (vc as VisibleCalendarType['selections'])[props.year] &&
                  i in (vc as VisibleCalendarType['selections'])[props.year].months &&
                  i !== props.month
                  ? 'ENABLE'
                  : 'LOCKED'
                : (props.iam === 'PREVIOUS' &&
                    props.year === maxyear &&
                    i < maxmonth &&
                    i !== props.month) ||
                  (props.iam === 'PREVIOUS' &&
                    props.year === minyear &&
                    i >= minmonth &&
                    i !== props.month) ||
                  (props.iam === 'CURRENT' &&
                    props.year === maxyear &&
                    i <= maxmonth &&
                    i !== props.month) ||
                  (props.iam === 'CURRENT' &&
                    props.year === minyear &&
                    i > minmonth &&
                    i !== props.month) ||
                  ((props.iam === 'CURRENT' || props.iam === 'PREVIOUS') &&
                    props.year !== minyear &&
                    props.year !== maxyear &&
                    i !== props.month)
                ? 'ENABLE'
                : 'LOCKED',
            selected: 'DESELECTED'
          }
        }
      } as DropdownMonthPickerType
    }
    col++
    if (col === 3) {
      row++
      col = 0
    }
  }
  triggerRef(monthpickerarray)
}

onBeforeMount(() => {
  fillMonthPickerArray()
})
</script>

<template>
  <div class="d-block h-100">
    <div
      class="shadow-sm flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
      style="background-color: lightgray; padding: 10px"
    >
      <div class="flex-fill text-center">Choose a month</div>
    </div>
    <div
      style="padding: 2px 0"
      class="flex-box flex-direction-row flex-wrap justify-content-start align-items-center"
    >
      <template
        v-for="(row, rindex) in monthpickerarray as DropdownMonthPickerType"
        :key="rindex + 'rr-i'"
      >
        <template v-for="(col, cindex) in row" :key="cindex + 'cc-i'">
          <div
            class="flex-w-100-over-3 overflow-hidden"
            style="float: left; outline: 1px solid #fff"
          >
            <label
              :ref="(el) => (col.ref = el as HTMLLabelElement)"
              @keypress.enter="selectMonthAndEmitSignal(rindex, cindex)"
              @click="selectMonthAndEmitSignal(rindex, cindex)"
              class="w-100"
              style="float: left"
              :style="
                jumptoweek.from === 'DD-MM-YYYY'
                  ? 'line-height: 3.8em; height: 3.8em;'
                  : 'line-height: 4.565em; height: 4.565em;'
              "
            >
              <input
                @keypress.enter.stop=""
                @click.stop=""
                type="checkbox"
                :value="col.month"
                class="position-absolute d-none"
                style="pointer-events: auto"
              />
              <span
                :class="[col.status === 'ENABLE' ? 'cursor-pointer' : '']"
                class="font-family text-center d-block letter-spacing h-100"
                style="font-size: 1rem"
                :style="
                  col.status === 'ENABLE'
                    ? col.selected === 'SELECTED'
                      ? 'background-color: green; color: #fff;'
                      : 'background-color: #E8E8E8; color: black; text-shadow:none;'
                    : col.status === 'LOCKED'
                    ? 'text-shadow: none; background-color: yellow; color: #fff;'
                    : 'background-color: #fff; color: #fff; text-shadow:none;'
                "
              >
                {{ monthNames[col.month] }}
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
