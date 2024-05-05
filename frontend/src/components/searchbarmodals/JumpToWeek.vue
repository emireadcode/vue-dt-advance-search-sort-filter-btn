<script lang="ts" setup>
import { triggerRef, shallowRef, ref, inject } from 'vue'
import {
  buildCalendar,
  calculateWeeksInAYear,
  determineMonthAndWeek,
  weekHasEnable
} from '../utility/dd_mm_yy_utility_fns'
import DropDownYearPicker from './DropDownYearPicker.vue'
import type { RangeSelectionParamsType, VisibleCalendarType } from '../types/dd_mm_yy_types'

type DropDownYearPickerType = {
  [row: number]: {
    [col: number]: {
      week: number
      ref: HTMLLabelElement | null
      status: 'ENABLE' | 'DISABLE' | 'LOCKED'
      selected: 'SELECTED' | 'DESELECTED'
    }
  }
}

const props = inject('jumptoweek') as {
    selections: VisibleCalendarType['selections']
    isoweek: boolean
    from: 'DAYS-MONTHS-YEARS' | 'DD-MM-YYYY'
    rangeselectionparams: RangeSelectionParamsType
    mindate: string
    maxdate: string
  },
  emits = defineEmits<{
    (e: 'receive:yearandweek', action: { week: number; year: number }): void
  }>(),
  numberofweeksinayear = shallowRef<DropDownYearPickerType>(),
  year = ref(0)
function formWeeksRowColArrayInAYear(weeks: number, collimit: number) {
  let row = 0,
    col = 0,
    weeksinayear = shallowRef<DropDownYearPickerType>(),
    vc: VisibleCalendarType['selections'] = {},
    size = weeks + (54 - weeks)
  if (
    (props.rangeselectionparams.excludedates &&
      props.rangeselectionparams.rangefirstselection.date &&
      props.rangeselectionparams.rangelastselection.date) ||
    (props.from === 'DD-MM-YYYY' &&
      !(
        props.rangeselectionparams.excludedates &&
        props.rangeselectionparams.rangefirstselection.date &&
        props.rangeselectionparams.rangelastselection.date
      ))
  ) {
    for (let i = 0; i < weeks; i++) {
      const { month } = determineMonthAndWeek(props.isoweek, { year: year.value, week: i + 1 })
      if (year.value in (vc as VisibleCalendarType['selections'])) {
        if (!(month in (vc as VisibleCalendarType['selections'])[year.value].months)) {
          ;(vc as VisibleCalendarType['selections'])[year.value].months = {
            ...(vc as VisibleCalendarType['selections'])[year.value].months,
            [month]: buildCalendar(
              year.value,
              month,
              'SELECTIONS',
              props.isoweek,
              props.mindate,
              props.maxdate
            )
          }
        }
      } else {
        ;(vc as VisibleCalendarType['selections']) = {
          ...(vc as VisibleCalendarType['selections']),
          [year.value]: {
            months: {
              [month]: buildCalendar(
                year.value,
                month,
                'SELECTIONS',
                props.isoweek,
                props.mindate,
                props.maxdate
              )
            }
          }
        } as VisibleCalendarType['selections']
      }
    }
    if (
      props.rangeselectionparams.excludedates &&
      props.rangeselectionparams.rangefirstselection.date &&
      props.rangeselectionparams.rangelastselection.date
    ) {
      if (
        new Date(props.rangeselectionparams.rangefirstselection.date) <
        new Date(props.rangeselectionparams.rangelastselection.date)
      ) {
        for (let m in (vc as VisibleCalendarType['selections'])[year.value].months) {
          for (let w in (vc as VisibleCalendarType['selections'])[year.value].months[m].weeks) {
            for (let d in (vc as VisibleCalendarType['selections'])[year.value].months[m].weeks[w]
              .days) {
              if (
                new Date(
                  (vc as VisibleCalendarType['selections'])[year.value].months[m].weeks[w].days[
                    d
                  ].date
                ) < new Date(props.rangeselectionparams.rangefirstselection.date) ||
                new Date(
                  (vc as VisibleCalendarType['selections'])[year.value].months[m].weeks[w].days[
                    d
                  ].date
                ) > new Date(props.rangeselectionparams.rangelastselection.date)
              ) {
                ;(vc as VisibleCalendarType['selections'])[year.value].months[m].weeks[w].days[
                  d
                ].status = 'DISABLE'
                ;(vc as VisibleCalendarType['selections'])[year.value].months[m].weeks[w].days[
                  d
                ].readonlystatus = 'DISABLE'
              }
            }
          }
        }
      } else {
        for (let m in (vc as VisibleCalendarType['selections'])[year.value].months) {
          for (let w in (vc as VisibleCalendarType['selections'])[year.value].months[m].weeks) {
            for (let d in (vc as VisibleCalendarType['selections'])[year.value].months[m].weeks[w]
              .days) {
              if (
                new Date(
                  (vc as VisibleCalendarType['selections'])[year.value].months[m].weeks[w].days[
                    d
                  ].date
                ) > new Date(props.rangeselectionparams.rangefirstselection.date) ||
                new Date(
                  (vc as VisibleCalendarType['selections'])[year.value].months[m].weeks[w].days[
                    d
                  ].date
                ) < new Date(props.rangeselectionparams.rangelastselection.date)
              ) {
                ;(vc as VisibleCalendarType['selections'])[year.value].months[m].weeks[w].days[
                  d
                ].status = 'DISABLE'
                ;(vc as VisibleCalendarType['selections'])[year.value].months[m].weeks[w].days[
                  d
                ].readonlystatus = 'DISABLE'
              }
            }
          }
        }
      }
    }
  }

  for (let i = 0; i < size; i++) {
    const { week, month } = determineMonthAndWeek(props.isoweek, { year: year.value, week: i + 1 })
    if (weeksinayear.value) {
      if (row in weeksinayear.value) {
        weeksinayear.value[row] = {
          ...weeksinayear.value[row],
          [col]: {
            week: i + 1,
            ref: null,
            status:
              i > weeks - 1
                ? 'LOCKED'
                : props.from === 'DAYS-MONTHS-YEARS'
                ? year.value in (props.selections as VisibleCalendarType['selections']) &&
                  month in
                    (props.selections as VisibleCalendarType['selections'])[year.value].months &&
                  month >= 0 &&
                  week >= 0 &&
                  !weekHasEnable(
                    (props.selections as VisibleCalendarType['selections'])[year.value].months[
                      month
                    ].weeks[week]
                  )
                  ? 'ENABLE'
                  : month in
                      (props.selections as VisibleCalendarType['selections'])[year.value].months &&
                    month === 11 &&
                    week ===
                      Object.keys(
                        (props.selections as VisibleCalendarType['selections'])[year.value].months[
                          month
                        ].weeks
                      ).length -
                        1 &&
                    (props.selections as VisibleCalendarType['selections'])[year.value].months[
                      month
                    ].weeks[week].days[6].day in [1, 2, 3, 4, 5, 6, 7, 7]
                  ? year.value + 1 in (props.selections as VisibleCalendarType['selections']) &&
                    0 in
                      (props.selections as VisibleCalendarType['selections'])[year.value + 1]
                        .months &&
                    !weekHasEnable(
                      (props.selections as VisibleCalendarType['selections'])[year.value + 1]
                        .months[0].weeks[0]
                    )
                    ? 'ENABLE'
                    : 'DISABLE'
                  : month in
                      (props.selections as VisibleCalendarType['selections'])[year.value].months &&
                    week ===
                      Object.keys(
                        (props.selections as VisibleCalendarType['selections'])[year.value].months[
                          month
                        ].weeks
                      ).length -
                        1 &&
                    (props.selections as VisibleCalendarType['selections'])[year.value].months[
                      month
                    ].weeks[week].days[6].day in [1, 2, 3, 4, 5, 6, 7, 7]
                  ? month + 1 in
                      (props.selections as VisibleCalendarType['selections'])[year.value].months &&
                    !weekHasEnable(
                      (props.selections as VisibleCalendarType['selections'])[year.value].months[
                        month + 1
                      ].weeks[0]
                    )
                    ? 'ENABLE'
                    : 'DISABLE'
                  : 'DISABLE'
                : year.value in (vc as VisibleCalendarType['selections']) &&
                  month in (vc as VisibleCalendarType['selections'])[year.value].months &&
                  month >= 0 &&
                  week >= 0 &&
                  !weekHasEnable(
                    (vc as VisibleCalendarType['selections'])[year.value].months[month].weeks[week]
                  )
                ? 'ENABLE'
                : 'DISABLE',
            selected: 'DESELECTED'
          }
        } as DropDownYearPickerType[number]
      } else {
        weeksinayear.value = {
          ...weeksinayear.value,
          [row]: {
            [col]: {
              week: i + 1,
              ref: null,
              status:
                i > weeks - 1
                  ? 'LOCKED'
                  : props.from === 'DAYS-MONTHS-YEARS'
                  ? year.value in (props.selections as VisibleCalendarType['selections']) &&
                    month in
                      (props.selections as VisibleCalendarType['selections'])[year.value].months &&
                    month >= 0 &&
                    week >= 0 &&
                    !weekHasEnable(
                      (props.selections as VisibleCalendarType['selections'])[year.value].months[
                        month
                      ].weeks[week]
                    )
                    ? 'ENABLE'
                    : month in
                        (props.selections as VisibleCalendarType['selections'])[year.value]
                          .months &&
                      month === 11 &&
                      week ===
                        Object.keys(
                          (props.selections as VisibleCalendarType['selections'])[year.value]
                            .months[month].weeks
                        ).length -
                          1 &&
                      (props.selections as VisibleCalendarType['selections'])[year.value].months[
                        month
                      ].weeks[week].days[6].day in [1, 2, 3, 4, 5, 6, 7, 7]
                    ? year.value + 1 in (props.selections as VisibleCalendarType['selections']) &&
                      0 in
                        (props.selections as VisibleCalendarType['selections'])[year.value + 1]
                          .months &&
                      !weekHasEnable(
                        (props.selections as VisibleCalendarType['selections'])[year.value + 1]
                          .months[0].weeks[0]
                      )
                      ? 'ENABLE'
                      : 'DISABLE'
                    : month in
                        (props.selections as VisibleCalendarType['selections'])[year.value]
                          .months &&
                      week ===
                        Object.keys(
                          (props.selections as VisibleCalendarType['selections'])[year.value]
                            .months[month].weeks
                        ).length -
                          1 &&
                      (props.selections as VisibleCalendarType['selections'])[year.value].months[
                        month
                      ].weeks[week].days[6].day in [1, 2, 3, 4, 5, 6, 7, 7]
                    ? month + 1 in
                        (props.selections as VisibleCalendarType['selections'])[year.value]
                          .months &&
                      !weekHasEnable(
                        (props.selections as VisibleCalendarType['selections'])[year.value].months[
                          month + 1
                        ].weeks[0]
                      )
                      ? 'ENABLE'
                      : 'DISABLE'
                    : 'DISABLE'
                  : year.value in (vc as VisibleCalendarType['selections']) &&
                    month in (vc as VisibleCalendarType['selections'])[year.value].months &&
                    month >= 0 &&
                    week >= 0 &&
                    !weekHasEnable(
                      (vc as VisibleCalendarType['selections'])[year.value].months[month].weeks[
                        week
                      ]
                    )
                  ? 'ENABLE'
                  : 'DISABLE',
              selected: 'DESELECTED'
            }
          }
        } as DropDownYearPickerType
      }
      col++
    } else {
      weeksinayear.value = {
        [row]: {
          [col]: {
            week: i + 1,
            ref: null,
            status:
              i > weeks - 1
                ? 'LOCKED'
                : props.from === 'DAYS-MONTHS-YEARS'
                ? year.value in (props.selections as VisibleCalendarType['selections']) &&
                  month in
                    (props.selections as VisibleCalendarType['selections'])[year.value].months &&
                  month >= 0 &&
                  week >= 0 &&
                  !weekHasEnable(
                    (props.selections as VisibleCalendarType['selections'])[year.value].months[
                      month
                    ].weeks[week]
                  )
                  ? 'ENABLE'
                  : month in
                      (props.selections as VisibleCalendarType['selections'])[year.value].months &&
                    month === 11 &&
                    week ===
                      Object.keys(
                        (props.selections as VisibleCalendarType['selections'])[year.value].months[
                          month
                        ].weeks
                      ).length -
                        1 &&
                    (props.selections as VisibleCalendarType['selections'])[year.value].months[
                      month
                    ].weeks[week].days[6].day in [1, 2, 3, 4, 5, 6, 7, 7]
                  ? year.value + 1 in (props.selections as VisibleCalendarType['selections']) &&
                    0 in
                      (props.selections as VisibleCalendarType['selections'])[year.value + 1]
                        .months &&
                    !weekHasEnable(
                      (props.selections as VisibleCalendarType['selections'])[year.value + 1]
                        .months[0].weeks[0]
                    )
                    ? 'ENABLE'
                    : 'DISABLE'
                  : month in
                      (props.selections as VisibleCalendarType['selections'])[year.value].months &&
                    week ===
                      Object.keys(
                        (props.selections as VisibleCalendarType['selections'])[year.value].months[
                          month
                        ].weeks
                      ).length -
                        1 &&
                    (props.selections as VisibleCalendarType['selections'])[year.value].months[
                      month
                    ].weeks[week].days[6].day in [1, 2, 3, 4, 5, 6, 7, 7]
                  ? month + 1 in
                      (props.selections as VisibleCalendarType['selections'])[year.value].months &&
                    !weekHasEnable(
                      (props.selections as VisibleCalendarType['selections'])[year.value].months[
                        month + 1
                      ].weeks[0]
                    )
                    ? 'ENABLE'
                    : 'DISABLE'
                  : 'DISABLE'
                : year.value in (vc as VisibleCalendarType['selections']) &&
                  month in (vc as VisibleCalendarType['selections'])[year.value].months &&
                  month >= 0 &&
                  week >= 0 &&
                  !weekHasEnable(
                    (vc as VisibleCalendarType['selections'])[year.value].months[month].weeks[week]
                  )
                ? 'ENABLE'
                : 'DISABLE',
            selected: 'DESELECTED'
          }
        }
      } as DropDownYearPickerType
      col++
    }
    if (col === collimit) {
      row++
      col = 0
    }
  }

  return weeksinayear.value
}

function selectJustAWeek(rindex: number, cindex: number) {
  if ((numberofweeksinayear.value as DropDownYearPickerType)[rindex][cindex].status === 'ENABLE') {
    ;(numberofweeksinayear.value as DropDownYearPickerType)[rindex][cindex].selected = 'SELECTED'
    triggerRef(numberofweeksinayear)
    const time: ReturnType<typeof setTimeout> = setTimeout(() => {
      emits('receive:yearandweek', {
        year: year.value as number,
        week: (numberofweeksinayear.value as DropDownYearPickerType)[rindex][cindex].week
      })
      clearTimeout(time)
    }, 200)
  }
}
</script>

<template>
  <div
    style="background-color: #e8e8e8"
    class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100 h-100"
  >
    <div class="flex-w-50 align-self-stretch shadow-sm" style="padding: 0.126rem">
      <DropDownYearPicker
        :rowlimit="9"
        :collimit="3"
        @receive:year="
          ($val: number) => {
            year = $val
            numberofweeksinayear = formWeeksRowColArrayInAYear(
              calculateWeeksInAYear($val, props.isoweek),
              6
            )
          }
        "
      ></DropDownYearPicker>
    </div>
    <div class="flex-w-50 align-self-stretch shadow-sm" style="padding: 0.126rem">
      <div class="d-block text-center shadow-sm" style="background-color: lightgray; padding: 10px">
        Then choose a week
      </div>
      <div
        style="padding: 2px 0"
        class="flex-box flex-direction-row flex-wrap justify-content-start align-items-center"
      >
        <template v-for="(row, rindex) in numberofweeksinayear" :key="rindex + 'bbv-xx'">
          <template v-for="(col, cindex) in row" :key="cindex + 'nmz-ss'">
            <div
              class="flex-w-100-over-6 overflow-hidden"
              style="float: left"
              :style="
                col.status === 'LOCKED' ? 'outline: 1px solid #fff;' : 'outline: 1px solid #fff'
              "
            >
              <label
                :ref="(el) => (col.ref = el as HTMLLabelElement)"
                @keypress.enter="selectJustAWeek(rindex, cindex)"
                @click="selectJustAWeek(rindex, cindex)"
                class="w-100"
                style="float: left; outline-"
                :style="
                  props.from === 'DAYS-MONTHS-YEARS'
                    ? ' line-height: 2.32em; height: 2.32em'
                    : ' line-height: 2em; height: 2em'
                "
              >
                <input
                  @keypress.enter.stop=""
                  @click.stop=""
                  type="checkbox"
                  :value="col.week"
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
                      : col.status === 'DISABLE'
                      ? 'background-color: yellow; color: #fff; text-shadow:none;'
                      : 'background-color: #E8E8E8; text-shadow:none;'
                  "
                >
                  {{ col.status === 'LOCKED' ? '' : col.week }}
                </span>
              </label>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>
