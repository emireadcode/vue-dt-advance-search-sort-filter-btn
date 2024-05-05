<script setup lang="ts">
import {
  type ShallowRef,
  type WatchStopHandle,
  onBeforeMount,
  inject,
  computed,
  ref,
  watch,
  onBeforeUnmount,
  triggerRef,
  nextTick
} from 'vue';
import type { VisibleCalendarType } from '../types/dd_mm_yy_types';
import { buildCalendar, weekHasHighlightedOrSelected } from '../utility/dd_mm_yy_utility_fns';
import type {
  YearSelectionType,
  MonthSelectionType,
  DaySelectionType,
  YearSelectionFormat,
  MonthSelectionFormat,
  DaySelectionFormat
} from '../types/days_months_years_types';
import YearPicker from './YearPicker.vue';
import type { DateType } from '../types/SupportedDatatypesTypeDeclaration';
import DayPicker from './DayPicker.vue';
import MonthPicker from './MonthPicker.vue';
import VisibleCalendarDatePicker from './VisibleCalendarDatePicker.vue';

const openexcludewindow = ref(false),
  cards = inject('cards') as ShallowRef<DateType[]>,
  index = inject('index') as number,
  emits = defineEmits<{
    (e: 'enable:excludebutton', action: boolean): void
  }>(),
  props = defineProps<{
    excludedatesignal: number
  }>(),
  cmaxyear = computed(() => {
    return ((cards.value[index] as DateType).result.max as string).split('-')[0]
  }),
  cminyear = computed(() => {
    return ((cards.value[index] as DateType).result.min as string).split('-')[0]
  }),
  isdayready = ref(0),
  ismonthready = ref(0),
  isyearready = ref(0),
  notifytosendsignal = ref(0)

let unwatchexclude: WatchStopHandle, unwatchexcludedatesignal: WatchStopHandle

function triggerCard() {
  triggerRef(cards)
}

onBeforeMount(() => {
  unwatchexcludedatesignal = watch(
    () => props.excludedatesignal,
    () => {
      openexcludewindow.value = true
      notifytosendsignal.value++
    }
  )
  unwatchexclude = watch(
    [() => isdayready.value, () => ismonthready.value, () => isyearready.value],
    ([x, y, z]) => {
      if (x > 0 && y > 0 && z > 0) {
        emits('enable:excludebutton', false)
        notifytosendsignal.value++
        cards.value[index].search.days_months_years.dates = {}
        triggerRef(cards)
        nextTick(() => {
          for (let row in cards.value[index].search.days_months_years.years.years) {
            for (let col in (
              cards.value[index].search.days_months_years.years.years as YearSelectionType
            )[row]) {
              for (let yearindex in (
                cards.value[index].search.days_months_years.years.years as YearSelectionType
              )[row][col]) {
                if (
                  (cards.value[index].search.days_months_years.years.years as YearSelectionType)[
                    row
                  ][col][yearindex].selected === 'HIGHLIGHTED' ||
                  (cards.value[index].search.days_months_years.years.years as YearSelectionType)[
                    row
                  ][col][yearindex].selected === 'SELECTED'
                ) {
                  cards.value[index].search.days_months_years.dates = {
                    ...cards.value[index].search.days_months_years.dates,
                    [(cards.value[index].search.days_months_years.years.years as YearSelectionType)[
                      row
                    ][col][yearindex].year]: {
                      months: {},
                      ty: [
                        { checked: false, status: 'ENABLE' },
                        { checked: false, status: 'ENABLE' },
                        { checked: false, status: 'ENABLE' },
                        { checked: false, status: 'ENABLE' },
                        { checked: false, status: 'ENABLE' },
                        { checked: false, status: 'ENABLE' },
                        { checked: false, status: 'ENABLE' }
                      ]
                    }
                  }
                  for (let mrow in cards.value[index].search.days_months_years.months.months) {
                    for (let mcol in (
                      cards.value[index].search.days_months_years.months
                        .months as MonthSelectionType
                    )[parseInt(mrow)]) {
                      if (
                        !(
                          (
                            cards.value[index].search.days_months_years.months
                              .months as MonthSelectionType
                          )[parseInt(mrow)][parseInt(mcol)].monthnumber in
                          (
                            cards.value[index].search.days_months_years
                              .dates as VisibleCalendarType['selections']
                          )[
                            (
                              cards.value[index].search.days_months_years.years
                                .years as YearSelectionType
                            )[row][col][yearindex].year
                          ].months
                        ) &&
                        ((
                          cards.value[index].search.days_months_years.months
                            .months as MonthSelectionType
                        )[parseInt(mrow)][parseInt(mcol)].selected === 'SELECTED' ||
                          (
                            cards.value[index].search.days_months_years.months
                              .months as MonthSelectionType
                          )[parseInt(mrow)][parseInt(mcol)].selected === 'HIGHLIGHTED')
                      ) {
                        ;(
                          cards.value[index].search.days_months_years
                            .dates as VisibleCalendarType['selections']
                        )[
                          (
                            cards.value[index].search.days_months_years.years
                              .years as YearSelectionType
                          )[row][col][yearindex].year
                        ].months = {
                          ...(
                            cards.value[index].search.days_months_years
                              .dates as VisibleCalendarType['selections']
                          )[
                            (
                              cards.value[index].search.days_months_years.years
                                .years as YearSelectionType
                            )[row][col][yearindex].year
                          ].months,
                          [(
                            cards.value[index].search.days_months_years.months
                              .months as MonthSelectionType
                          )[parseInt(mrow)][parseInt(mcol)].monthnumber]: buildCalendar(
                            (
                              cards.value[index].search.days_months_years.years
                                .years as YearSelectionType
                            )[row][col][yearindex].year,
                            (
                              cards.value[index].search.days_months_years.months
                                .months as MonthSelectionType
                            )[parseInt(mrow)][parseInt(mcol)].monthnumber,
                            'SELECTIONS',
                            cards.value[index].isoweek,
                            cards.value[index].result.min,
                            cards.value[index].result.max,
                            undefined
                          )
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          for (let year in cards.value[index].search.days_months_years
            .dates as VisibleCalendarType['selections']) {
            for (let month in (
              cards.value[index].search.days_months_years.dates as VisibleCalendarType['selections']
            )[year].months) {
              for (let week in (
                cards.value[index].search.days_months_years
                  .dates as VisibleCalendarType['selections']
              )[year].months[month].weeks) {
                for (let day in (
                  cards.value[index].search.days_months_years
                    .dates as VisibleCalendarType['selections']
                )[year].months[month].weeks[week].days) {
                  if (
                    (
                      cards.value[index].search.days_months_years
                        .dates as VisibleCalendarType['selections']
                    )[year].months[month].weeks[week].days[day].readonlystatus === 'ENABLE'
                  ) {
                    ;(
                      cards.value[index].search.days_months_years
                        .dates as VisibleCalendarType['selections']
                    )[year].months[month].weeks[week].days[day].selected =
                      (cards.value[index].search.days_months_years.days.days as DaySelectionType)[
                        day
                      ].selected === 'HIGHLIGHTED' ||
                      (cards.value[index].search.days_months_years.days.days as DaySelectionType)[
                        day
                      ].selected === 'SELECTED'
                        ? 'SELECTED'
                        : 'DESELECTED'
                    ;(
                      cards.value[index].search.days_months_years
                        .dates as VisibleCalendarType['selections']
                    )[year].months[month].weeks[week].days[day].status =
                      (cards.value[index].search.days_months_years.days.days as DaySelectionType)[
                        day
                      ].selected === 'HIGHLIGHTED' ||
                      (cards.value[index].search.days_months_years.days.days as DaySelectionType)[
                        day
                      ].selected === 'SELECTED'
                        ? 'ENABLE'
                        : 'DISABLE'
                    ;(
                      cards.value[index].search.days_months_years
                        .dates as VisibleCalendarType['selections']
                    )[year].months[month].weeks[week].days[day].readonlystatus =
                      (cards.value[index].search.days_months_years.days.days as DaySelectionType)[
                        day
                      ].selected === 'HIGHLIGHTED' ||
                      (cards.value[index].search.days_months_years.days.days as DaySelectionType)[
                        day
                      ].selected === 'SELECTED'
                        ? 'ENABLE'
                        : 'DISABLE'
                    ;(
                      cards.value[index].search.days_months_years
                        .dates as VisibleCalendarType['selections']
                    )[year].months[month].tm[day].checked =
                      (cards.value[index].search.days_months_years.days.days as DaySelectionType)[
                        day
                      ].selected === 'HIGHLIGHTED' ||
                      (cards.value[index].search.days_months_years.days.days as DaySelectionType)[
                        day
                      ].selected === 'SELECTED'
                        ? true
                        : false
                    ;(
                      cards.value[index].search.days_months_years
                        .dates as VisibleCalendarType['selections']
                    )[year].months[month].tm[day].status =
                      (cards.value[index].search.days_months_years.days.days as DaySelectionType)[
                        day
                      ].selected === 'HIGHLIGHTED' ||
                      (cards.value[index].search.days_months_years.days.days as DaySelectionType)[
                        day
                      ].selected === 'SELECTED'
                        ? 'ENABLE'
                        : 'DISABLE'
                  }
                }
              }
            }
            for (let d = 0; d < 7; d++) {
              ;(
                cards.value[index].search.days_months_years
                  .dates as VisibleCalendarType['selections']
              )[year].ty[d].checked =
                (cards.value[index].search.days_months_years.days.days as DaySelectionType)[d]
                  .selected === 'HIGHLIGHTED' ||
                (cards.value[index].search.days_months_years.days.days as DaySelectionType)[d]
                  .selected === 'SELECTED'
                  ? true
                  : false
              ;(
                cards.value[index].search.days_months_years
                  .dates as VisibleCalendarType['selections']
              )[year].ty[d].status =
                (cards.value[index].search.days_months_years.days.days as DaySelectionType)[d]
                  .selected === 'HIGHLIGHTED' ||
                (cards.value[index].search.days_months_years.days.days as DaySelectionType)[d]
                  .selected === 'SELECTED'
                  ? 'ENABLE'
                  : 'DISABLE'
            }
          }
          for (let year in cards.value[index].search.days_months_years
            .dates as VisibleCalendarType['selections']) {
            for (let month in (
              cards.value[index].search.days_months_years.dates as VisibleCalendarType['selections']
            )[year].months) {
              for (let week in (
                cards.value[index].search.days_months_years
                  .dates as VisibleCalendarType['selections']
              )[year].months[month].weeks) {
                if (
                  weekHasHighlightedOrSelected(
                    (
                      cards.value[index].search.days_months_years
                        .dates as VisibleCalendarType['selections']
                    )[year].months[month].weeks[parseInt(week)]
                  )
                ) {
                  ;(
                    cards.value[index].search.days_months_years
                      .dates as VisibleCalendarType['selections']
                  )[year].months[month].weeks[parseInt(week)].checked = true
                }
              }
            }
          }
          triggerRef(cards)
        })
      } else {
        cards.value[index].search.days_months_years.dates = {}
        triggerRef(cards)
        emits('enable:excludebutton', true)
      }
    }
  )
})

onBeforeUnmount(() => {
  unwatchexclude()
  unwatchexcludedatesignal()
})
</script>

<template>
  <div class="d-block position-relative" style="padding: 0 10px; z-index: 1000">
    <div class="d-block" style="padding: 7px 0px 3.5px 0">
      <DayPicker
        :notifytosendsignal="notifytosendsignal"
        @update:dayselectionandformat="
          ($val: DaySelectionFormat) => {
            cards[index].search.days_months_years.days = $val
            triggerCard()
          }
        "
        :dayselectionandformat="
          (cards[index] as DateType).search.days_months_years.days as DaySelectionFormat
        "
        :isoweek="(cards[index] as DateType).isoweek"
        @signal:readyforexclude="($val: number) => (isdayready = $val)"
      ></DayPicker>
    </div>
    <div class="d-block" style="padding: 3.5px 0px">
      <MonthPicker
        :notifytosendsignal="notifytosendsignal"
        @update:monthselectionandformat="
          ($val: MonthSelectionFormat) => {
            cards[index].search.days_months_years.months = $val
            triggerCard()
          }
        "
        @signal:readyforexclude="($val: number) => (ismonthready = $val)"
        :monthselectionandformat="
          (cards[index] as DateType).search.days_months_years?.months as MonthSelectionFormat
        "
      ></MonthPicker>
    </div>
    <div class="d-block" style="padding: 3.5px 0px 7px 0">
      <YearPicker
        :title="'year'"
        :notifytosendsignal="notifytosendsignal"
        @update:yearselectionandformat="
          ($val: YearSelectionFormat) => {
            cards[index].search.days_months_years.years = $val
            triggerCard()
          }
        "
        @signal:readyforexclude="($val: number) => (isyearready = $val)"
        :maxyear="parseInt(cmaxyear) as number"
        :minyear="parseInt(cminyear) as number"
        :yearselectionandformat="
          (cards[index] as DateType).search.days_months_years.years as YearSelectionFormat
        "
      ></YearPicker>
    </div>
    <template v-if="openexcludewindow">
      <div class="w-100 h-100 position-absolute t-0 l-0" style="z-index: 1400; padding: 2px 9px">
        <div class="d-block h-100" style="background-color: #fff">
          <div class="d-block" style="padding: 0 0 3px 0">
            <div class="d-block shadow-sm" style="background-color: blue; border-radius: 0.25rem">
              <a
                class="underline-none cursor-pointer align-middle"
                @click="openexcludewindow = false"
                @keypress.enter="openexcludewindow = false"
              >
                <img
                  src="http://localhost:5175/src/components/icons/close.png"
                  class="align-middle"
                  style="width: 2.205rem; height: 2.205rem"
                />
              </a>
            </div>
          </div>
          <div class="d-block" style="background-color: #fff">
            <VisibleCalendarDatePicker
              :from="'DAYS-MONTHS-YEARS'"
              :selectionformat="'MULTIPLE-OR-SINGLE'"
              :isoweek="cards[index].isoweek"
              :selections="cards[index].search.days_months_years.dates"
              :maxdate="cards[index].result.max as string"
              :mindate="cards[index].result.min as string"
              @update:selections="
                ($val: DateType['search']['days_months_years']['dates']) => {
                  cards[index].search.days_months_years.dates = $val
                  triggerCard()
                }
              "
            ></VisibleCalendarDatePicker>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
