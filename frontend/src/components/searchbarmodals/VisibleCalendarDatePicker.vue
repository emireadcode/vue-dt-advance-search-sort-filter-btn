<script setup lang="ts">
import {type ShallowRef, computed, type WatchStopHandle, watch, provide, ref, nextTick, triggerRef, shallowRef, onMounted, onBeforeMount, onBeforeUnmount } from 'vue'
import type {
  DateType
} from "../types/SupportedDatatypesTypeDeclaration";
import type {
  VisibleCalendarType,
  RangeFirstAndLastSelectionType,
  RangeSelectionParamsType,
  YearMonthClickable,
  PositionTrackerType,
} from "../types/dd_mm_yy_types";
import {
  handleTyTm,
  weekHasHighlightedOrSelected,
  mouseMovement,
  clickBackward,
  clickForward,
  assignRef,
  findRangeSelectionMaxAndMinDate,
  getDimensions,
  handleDateSelectHighlightDeselect,
  weekHasEnable,
  selectOrDeselectDaysInWeekForMultipleSelection,
  highlightOrDeselectDaysInWeekForRangeSelection,
  fillVisibleCalendarArray,
  resetSelections,
  buildCalendar,
  determineMonthAndWeek,
} from "../utility/dd_mm_yy_utility_fns";
import JumpToWeek from "./JumpToWeek.vue";
import DropDownYearPicker from "./DropDownYearPicker.vue";
import DropDownMonthPicker from "./DropDownMonthPicker.vue";

const 
  props = defineProps<{
    resetcalendarsignal?: number | undefined;
    selections: VisibleCalendarType['selections'];
    excludedates?: boolean | undefined;
    isoweek: boolean;
    from: 'DAYS-MONTHS-YEARS' | 'DD-MM-YYYY';
    selectionformat: 'RANGE' | 'MULTIPLE-OR-SINGLE';
    mindate: string;
    maxdate: string;
  }>(),
  cc = props,
  emits = defineEmits<{
    (e: "enable:excludebutton", action: boolean): void;
    (e: "update:selections", selections: DateType['search']['dd_mm_yyyy']['dates']): void;
  }>(),
  months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  isodays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  visiblecalendar = shallowRef<VisibleCalendarType>(),
  rangeselectionparams = shallowRef<RangeSelectionParamsType>({
    rangefirstselection: {
      date: '',
      year: 0,
      month: 0,
      day: 0,
      week: 0,
    },
    rangelastselection: {
      date: '',
      year: 0,
      month: 0,
      day: 0,
      week: 0,
    },
    rangeselectcount: 0,
    inselectionmode: true,
    excludedates: cc.excludedates as boolean,
  }),
  jumptoweekclicked = ref(false),
  monthoryeardropdownclicked = ref(''),
  monthoryeardropdownclickcount = ref(0)
;

provide('jumptoweek', {
  selections: cc.selections,
  isoweek: cc.isoweek,
  from: cc.from,
  rangeselectionparams: rangeselectionparams.value,
  mindate: cc.mindate,
  maxdate: cc.maxdate
} as {
  selections: VisibleCalendarType['selections'];
  isoweek: boolean;
  rangeselectionparams: RangeSelectionParamsType;
  from: 'DAYS-MONTHS-YEARS' | 'DD-MM-YYYY';
  mindate: string;
  maxdate: string;
});

let
  unwatchselectionformat: WatchStopHandle,
  unwatchrangeselectcount: WatchStopHandle,
  unwatchexcludedates: WatchStopHandle,
  unwatchresetcalendarsignal: WatchStopHandle
;

function completelyDisableNewCalendarNotInSelection() {
  if((Object.keys(props.selections).length > 0 && !rangeselectionparams.value.excludedates) || rangeselectionparams.value.excludedates) {
    if(
      (
        (visiblecalendar.value as VisibleCalendarType).current.year in (visiblecalendar.value as VisibleCalendarType).selections
      )
    ) {
      if(
        !(
          (visiblecalendar.value as VisibleCalendarType).current.month in (
            visiblecalendar.value as VisibleCalendarType
          ).selections[
            (visiblecalendar.value as VisibleCalendarType).current.year
          ].months
        )
      ) {
        (visiblecalendar.value as VisibleCalendarType).current.calendar.tm = [
          {checked: false, status: 'DISABLE'},
          {checked: false, status: 'DISABLE'},
          {checked: false, status: 'DISABLE'},
          {checked: false, status: 'DISABLE'},
          {checked: false, status: 'DISABLE'},
          {checked: false, status: 'DISABLE'},
          {checked: false, status: 'DISABLE'}
        ];
        for(let w in ((visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']).weeks) {
          ((visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']).weeks[
            w
          ].checked = false;
          for(let d in ((visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']).weeks[
            w
          ].days) {
            ((visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']).weeks[
              w
            ].days[d].status = 'DISABLE';
            ((visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']).weeks[
              w
            ].days[d].readonlystatus = 'DISABLE';
            ((visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']).weeks[
              w
            ].days[d].selected = 'LOCKED'
          }
        }
        triggerRef(visiblecalendar);
      }
    }
    else {
      (visiblecalendar.value as VisibleCalendarType).current.ty[
        (visiblecalendar.value as VisibleCalendarType).current.year
      ] = [
        {checked: false, status: 'DISABLE'},
        {checked: false, status: 'DISABLE'},
        {checked: false, status: 'DISABLE'},
        {checked: false, status: 'DISABLE'},
        {checked: false, status: 'DISABLE'},
        {checked: false, status: 'DISABLE'},
        {checked: false, status: 'DISABLE'}
      ];
      (visiblecalendar.value as VisibleCalendarType).current.calendar.tm = [
        {checked: false, status: 'DISABLE'},
        {checked: false, status: 'DISABLE'},
        {checked: false, status: 'DISABLE'},
        {checked: false, status: 'DISABLE'},
        {checked: false, status: 'DISABLE'},
        {checked: false, status: 'DISABLE'},
        {checked: false, status: 'DISABLE'}
      ];
      for(let w in ((visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']).weeks) {
        ((visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']).weeks[
          w
        ].checked = false;
        for(let d in ((visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']).weeks[
          w
        ].days) {
          ((visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']).weeks[
            w
          ].days[d].status = 'DISABLE';
          ((visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']).weeks[
            w
          ].days[d].readonlystatus = 'DISABLE';
          ((visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']).weeks[
            w
          ].days[d].selected = 'DESELECTED'
        }
      }
      triggerRef(visiblecalendar);
    }
  }
}

function assignWeekRef($el: HTMLDivElement, weekindex: number, weektype: 'PREVIOUS' | 'CURRENT') {
  if(weektype === 'PREVIOUS') {
    if($el) {
      (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[weekindex].ref = $el as HTMLDivElement;
    }
  }
  else {
    if($el) {
      (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[weekindex].ref = $el as HTMLDivElement;
    }
  }
}

function determineMonthAndWeekAndShowWeekInCalendar(yearandweek: {year: number; week: number;}) {
  nextTick(() => {
    nextTick(() => {
      const {week, month} = determineMonthAndWeek(
        props.isoweek,
        yearandweek
      );
      let calendartoshowmonthandweek = '';

      if(
        yearandweek.year === (visiblecalendar.value as VisibleCalendarType).first.year
      ) {
        if(
          (visiblecalendar.value as VisibleCalendarType).current.year === (visiblecalendar.value as VisibleCalendarType).previous.year
        ) {
          if(yearandweek.year > (visiblecalendar.value as VisibleCalendarType).current.year) {
            (visiblecalendar.value as VisibleCalendarType).current.year = yearandweek.year;
            (visiblecalendar.value as VisibleCalendarType).current.month = month;
            (visiblecalendar.value as VisibleCalendarType).current.calendar = buildCalendar(
            (visiblecalendar.value as VisibleCalendarType).current.year,
            (visiblecalendar.value as VisibleCalendarType).current.month,
              'PREVIOUS-OR-CURRENT',
              props.isoweek,
              props.mindate,
              props.maxdate,
              visiblecalendar as ShallowRef<VisibleCalendarType>
            ) as YearMonthClickable<PositionTrackerType>['calendar'];
            triggerRef(visiblecalendar);
            completelyDisableNewCalendarNotInSelection();
            calendartoshowmonthandweek = 'CURRENT';
          }
          else {
            if(yearandweek.year <= (visiblecalendar.value as VisibleCalendarType).previous.year) {
              if(yearandweek.year < (visiblecalendar.value as VisibleCalendarType).previous.year) {
                (visiblecalendar.value as VisibleCalendarType).previous.year = yearandweek.year;
                (visiblecalendar.value as VisibleCalendarType).previous.month = month;
                (visiblecalendar.value as VisibleCalendarType).previous.calendar = buildCalendar(
                  (visiblecalendar.value as VisibleCalendarType).previous.year,
                  (visiblecalendar.value as VisibleCalendarType).previous.month,
                  'PREVIOUS-OR-CURRENT',
                  props.isoweek,
                  props.mindate,
                  props.maxdate,
                  visiblecalendar as ShallowRef<VisibleCalendarType>
                ) as YearMonthClickable<PositionTrackerType>['calendar'];
                triggerRef(visiblecalendar);
                calendartoshowmonthandweek = 'PREVIOUS';
              }
              else {
                if(
                  month === (visiblecalendar.value as VisibleCalendarType).previous.month
                  ||
                  month === (visiblecalendar.value as VisibleCalendarType).current.month
                ) {
                  if(month === (visiblecalendar.value as VisibleCalendarType).previous.month) {
                    calendartoshowmonthandweek = 'PREVIOUS';
                  }
                  else {
                    calendartoshowmonthandweek = 'CURRENT';
                  }
                }
                else {
                  if(
                    (
                      month > (visiblecalendar.value as VisibleCalendarType).current.month
                      ||
                      month > (visiblecalendar.value as VisibleCalendarType).previous.month
                    )
                    ||
                    month < (visiblecalendar.value as VisibleCalendarType).previous.month
                  ) {
                    if(
                      month > (visiblecalendar.value as VisibleCalendarType).current.month
                      ||
                      month > (visiblecalendar.value as VisibleCalendarType).previous.month
                    ) {
                      (visiblecalendar.value as VisibleCalendarType).current.year = yearandweek.year;
                      (visiblecalendar.value as VisibleCalendarType).current.month = month;
                      (visiblecalendar.value as VisibleCalendarType).current.calendar = buildCalendar(
                      (visiblecalendar.value as VisibleCalendarType).current.year,
                      (visiblecalendar.value as VisibleCalendarType).current.month,
                        'PREVIOUS-OR-CURRENT',
                        props.isoweek,
                        props.mindate,
                        props.maxdate,
                        visiblecalendar as ShallowRef<VisibleCalendarType>
                      ) as YearMonthClickable<PositionTrackerType>['calendar'];
                      triggerRef(visiblecalendar);
                      completelyDisableNewCalendarNotInSelection();
                      calendartoshowmonthandweek = 'CURRENT';
                    }
                    else {
                      (visiblecalendar.value as VisibleCalendarType).previous.year = yearandweek.year;
                      (visiblecalendar.value as VisibleCalendarType).previous.month = month;
                      (visiblecalendar.value as VisibleCalendarType).previous.calendar = buildCalendar(
                        (visiblecalendar.value as VisibleCalendarType).previous.year,
                        (visiblecalendar.value as VisibleCalendarType).previous.month,
                        'PREVIOUS-OR-CURRENT',
                        props.isoweek,
                        props.mindate,
                        props.maxdate,
                        visiblecalendar as ShallowRef<VisibleCalendarType>
                      ) as YearMonthClickable<PositionTrackerType>['calendar'];
                      triggerRef(visiblecalendar);
                      calendartoshowmonthandweek = 'PREVIOUS';
                    }
                  }
                }
              }
            }
          }
        }
        else {
          if(
            (
              yearandweek.year > (visiblecalendar.value as VisibleCalendarType).current.year
              ||
              yearandweek.year > (visiblecalendar.value as VisibleCalendarType).previous.year
            )
            ||
            yearandweek.year < (visiblecalendar.value as VisibleCalendarType).previous.year
          ) {
            if(
              yearandweek.year > (visiblecalendar.value as VisibleCalendarType).current.year
              ||
              yearandweek.year > (visiblecalendar.value as VisibleCalendarType).previous.year
            ) {
              (visiblecalendar.value as VisibleCalendarType).current.year = yearandweek.year;
              (visiblecalendar.value as VisibleCalendarType).current.month = month;
              (visiblecalendar.value as VisibleCalendarType).current.calendar = buildCalendar(
              (visiblecalendar.value as VisibleCalendarType).current.year,
              (visiblecalendar.value as VisibleCalendarType).current.month,
                'PREVIOUS-OR-CURRENT',
                props.isoweek,
                props.mindate,
                props.maxdate,
                visiblecalendar as ShallowRef<VisibleCalendarType>
              ) as YearMonthClickable<PositionTrackerType>['calendar'];
              triggerRef(visiblecalendar);
              completelyDisableNewCalendarNotInSelection();
              calendartoshowmonthandweek = 'CURRENT';
            }
            else {
              (visiblecalendar.value as VisibleCalendarType).previous.year = yearandweek.year;
              (visiblecalendar.value as VisibleCalendarType).previous.month = month;
              (visiblecalendar.value as VisibleCalendarType).previous.calendar = buildCalendar(
                (visiblecalendar.value as VisibleCalendarType).previous.year,
                (visiblecalendar.value as VisibleCalendarType).previous.month,
                'PREVIOUS-OR-CURRENT',
                props.isoweek,
                props.mindate,
                props.maxdate,
                visiblecalendar as ShallowRef<VisibleCalendarType>
              ) as YearMonthClickable<PositionTrackerType>['calendar'];
              triggerRef(visiblecalendar);
              calendartoshowmonthandweek = 'PREVIOUS';
            }
          }
          else {
            if(
              yearandweek.year === (visiblecalendar.value as VisibleCalendarType).previous.year
              ||
              yearandweek.year === (visiblecalendar.value as VisibleCalendarType).current.year
            ) {
              if(yearandweek.year === (visiblecalendar.value as VisibleCalendarType).current.year) {
                (visiblecalendar.value as VisibleCalendarType).current.year = yearandweek.year;
                (visiblecalendar.value as VisibleCalendarType).current.month = month;
                (visiblecalendar.value as VisibleCalendarType).current.calendar = buildCalendar(
                (visiblecalendar.value as VisibleCalendarType).current.year,
                (visiblecalendar.value as VisibleCalendarType).current.month,
                  'PREVIOUS-OR-CURRENT',
                  props.isoweek,
                  props.mindate,
                  props.maxdate,
                  visiblecalendar as ShallowRef<VisibleCalendarType>
                ) as YearMonthClickable<PositionTrackerType>['calendar'];
                triggerRef(visiblecalendar);
                completelyDisableNewCalendarNotInSelection();
                calendartoshowmonthandweek = 'CURRENT';
              }
              else {
                (visiblecalendar.value as VisibleCalendarType).previous.year = yearandweek.year;
                (visiblecalendar.value as VisibleCalendarType).previous.month = month;
                (visiblecalendar.value as VisibleCalendarType).previous.calendar = buildCalendar(
                  (visiblecalendar.value as VisibleCalendarType).previous.year,
                  (visiblecalendar.value as VisibleCalendarType).previous.month,
                  'PREVIOUS-OR-CURRENT',
                  props.isoweek,
                  props.mindate,
                  props.maxdate,
                  visiblecalendar as ShallowRef<VisibleCalendarType>
                ) as YearMonthClickable<PositionTrackerType>['calendar'];
                triggerRef(visiblecalendar);
                calendartoshowmonthandweek = 'PREVIOUS';
              }
            }
          }
        }

        if(calendartoshowmonthandweek === 'PREVIOUS') {
          if(
            week === (
              Object.keys(
                (
                  (visiblecalendar.value as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                ).weeks
              ).length - 1
            )
            &&
            (
              (visiblecalendar.value as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']
            ).weeks[
              week
            ].days[6].day in [1, 2, 3, 4, 5, 6, 7, 7]
          ) {
            if((month + 1) <= (visiblecalendar.value as VisibleCalendarType).first.month) {
              (visiblecalendar.value as VisibleCalendarType).current.year = yearandweek.year;
              (visiblecalendar.value as VisibleCalendarType).current.month = month+1;
              (visiblecalendar.value as VisibleCalendarType).current.calendar = buildCalendar(
              (visiblecalendar.value as VisibleCalendarType).current.year,
              (visiblecalendar.value as VisibleCalendarType).current.month,
                'PREVIOUS-OR-CURRENT',
                props.isoweek,
                props.mindate,
                props.maxdate,
                visiblecalendar as ShallowRef<VisibleCalendarType>
              ) as YearMonthClickable<PositionTrackerType>['calendar'];
              triggerRef(visiblecalendar);
              completelyDisableNewCalendarNotInSelection();
              
              nextTick(() => {
                if(
                  (
                    (
                      (visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                    ).weeks[0].ref as HTMLDivElement
                  )
                ) {
                  (
                    (
                      (visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                    ).weeks[0].ref as HTMLDivElement
                  ).style.backgroundColor = 'blue';
                  triggerRef(visiblecalendar);
                  
                  let time: ReturnType<typeof setTimeout>;
                  time = setTimeout(() => {
                    (
                      (
                        (visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                      ).weeks[0].ref as HTMLDivElement
                    ).style.backgroundColor = 'transparent';
                    triggerRef(visiblecalendar);
                    clearTimeout(time);
                  }, 1000);
                }
              });
            }

            nextTick(() => {
              if(
                (
                  (
                    (visiblecalendar.value as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                  ).weeks[week].ref as HTMLDivElement
                )
              ) {
                (
                  (
                    (visiblecalendar.value as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                  ).weeks[week].ref as HTMLDivElement
                ).style.backgroundColor = 'blue';
                triggerRef(visiblecalendar);
                            
                let time: ReturnType<typeof setTimeout>;
                time = setTimeout(() => {
                  (
                    (
                      (visiblecalendar.value as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                    ).weeks[week].ref as HTMLDivElement
                  ).style.backgroundColor = 'transparent';
                  triggerRef(visiblecalendar);
                  clearTimeout(time);
                }, 1000);
              }
            });
          }
          else {
            nextTick(() => {
              if(
                (
                  (
                    (visiblecalendar.value as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                  ).weeks[week].ref as HTMLDivElement
                )
              ) {
                (
                  (
                    (visiblecalendar.value as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                  ).weeks[week].ref as HTMLDivElement
                ).style.backgroundColor = 'blue';
                triggerRef(visiblecalendar);
                            
                let time: ReturnType<typeof setTimeout>;
                time = setTimeout(() => {
                  (
                    (
                      (visiblecalendar.value as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                    ).weeks[week].ref as HTMLDivElement
                  ).style.backgroundColor = 'transparent';
                  triggerRef(visiblecalendar);
                  clearTimeout(time);
                }, 1000);
              }
            });
          }
        }
        else {
          if(
            week === (
              Object.keys(
                (
                  (visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                ).weeks
              ).length - 1
            )
            &&
            (
              (visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']
            ).weeks[
              week
            ].days[6].day in [1, 2, 3, 4, 5, 6, 7, 7]
          ) {
            (visiblecalendar.value as VisibleCalendarType).previous.year = (visiblecalendar.value as VisibleCalendarType).current.year;
            (visiblecalendar.value as VisibleCalendarType).previous.month = (visiblecalendar.value as VisibleCalendarType).current.month;
            (visiblecalendar.value as VisibleCalendarType).previous.calendar = buildCalendar(
            (visiblecalendar.value as VisibleCalendarType).previous.year,
            (visiblecalendar.value as VisibleCalendarType).previous.month,
              'PREVIOUS-OR-CURRENT',
              props.isoweek,
              props.mindate,
              props.maxdate,
              visiblecalendar as ShallowRef<VisibleCalendarType>
            ) as YearMonthClickable<PositionTrackerType>['calendar'];
            triggerRef(visiblecalendar);

            nextTick(() => {
              if((month + 1) <= (visiblecalendar.value as VisibleCalendarType).first.month) {
                (visiblecalendar.value as VisibleCalendarType).current.year = yearandweek.year;
                (visiblecalendar.value as VisibleCalendarType).current.month = month+1;
                (visiblecalendar.value as VisibleCalendarType).current.calendar = buildCalendar(
                (visiblecalendar.value as VisibleCalendarType).current.year,
                (visiblecalendar.value as VisibleCalendarType).current.month,
                  'PREVIOUS-OR-CURRENT',
                  props.isoweek,
                  props.mindate,
                  props.maxdate,
                  visiblecalendar as ShallowRef<VisibleCalendarType>
                ) as YearMonthClickable<PositionTrackerType>['calendar'];
                triggerRef(visiblecalendar);
                completelyDisableNewCalendarNotInSelection();
                
                nextTick(() => {
                  if(
                    (
                      (
                        (visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                      ).weeks[0].ref as HTMLDivElement
                    )
                  ) {
                    (
                      (
                        (visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                      ).weeks[0].ref as HTMLDivElement
                    ).style.backgroundColor = 'blue';
                    triggerRef(visiblecalendar);
                              
                    let time: ReturnType<typeof setTimeout>;
                    time = setTimeout(() => {
                      (
                        (
                          (visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                        ).weeks[0].ref as HTMLDivElement
                      ).style.backgroundColor = 'transparent';
                      triggerRef(visiblecalendar);
                      clearTimeout(time);
                    }, 1000);
                  }
                });
              }

              nextTick(() => {
                if(
                  (
                    (
                      (visiblecalendar.value as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                    ).weeks[week].ref as HTMLDivElement
                  )
                ) {
                  (
                    (
                      (visiblecalendar.value as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                    ).weeks[week].ref as HTMLDivElement
                  ).style.backgroundColor = 'blue';
                  triggerRef(visiblecalendar);
                              
                  let time: ReturnType<typeof setTimeout>;
                  time = setTimeout(() => {
                    (
                      (
                        (visiblecalendar.value as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                      ).weeks[week].ref as HTMLDivElement
                    ).style.backgroundColor = 'transparent';
                    triggerRef(visiblecalendar);
                    clearTimeout(time);
                  }, 1000);
                }
              });
            });
          }
          else {
            nextTick(() => {
              if(
                (
                  (
                    (visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                  ).weeks[week].ref as HTMLDivElement
                )
              ) {
                (
                  (
                    (visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                  ).weeks[week].ref as HTMLDivElement
                ).style.backgroundColor = 'blue';
                triggerRef(visiblecalendar);
                            
                let time: ReturnType<typeof setTimeout>;
                time = setTimeout(() => {
                  (
                    (
                      (visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                    ).weeks[week].ref as HTMLDivElement
                  ).style.backgroundColor = 'transparent';
                  triggerRef(visiblecalendar);
                  clearTimeout(time);
                }, 1000);
              }
            });
          }
        }
      }
      else {
        if(
          (visiblecalendar.value as VisibleCalendarType).current.year === (visiblecalendar.value as VisibleCalendarType).previous.year
        ) {
          if(yearandweek.year > (visiblecalendar.value as VisibleCalendarType).current.year) {
            (visiblecalendar.value as VisibleCalendarType).current.year = yearandweek.year;
            (visiblecalendar.value as VisibleCalendarType).current.month = month;
            (visiblecalendar.value as VisibleCalendarType).current.calendar = buildCalendar(
            (visiblecalendar.value as VisibleCalendarType).current.year,
            (visiblecalendar.value as VisibleCalendarType).current.month,
              'PREVIOUS-OR-CURRENT',
              props.isoweek,
              props.mindate,
              props.maxdate,
              visiblecalendar as ShallowRef<VisibleCalendarType>
            ) as YearMonthClickable<PositionTrackerType>['calendar'];
            triggerRef(visiblecalendar);
            completelyDisableNewCalendarNotInSelection();
            calendartoshowmonthandweek = 'CURRENT';
          }
          else {
            if(yearandweek.year <= (visiblecalendar.value as VisibleCalendarType).previous.year) {
              if(yearandweek.year < (visiblecalendar.value as VisibleCalendarType).previous.year) {
                (visiblecalendar.value as VisibleCalendarType).previous.year = yearandweek.year;
                (visiblecalendar.value as VisibleCalendarType).previous.month = month;
                (visiblecalendar.value as VisibleCalendarType).previous.calendar = buildCalendar(
                  (visiblecalendar.value as VisibleCalendarType).previous.year,
                  (visiblecalendar.value as VisibleCalendarType).previous.month,
                  'PREVIOUS-OR-CURRENT',
                  props.isoweek,
                  props.mindate,
                  props.maxdate,
                  visiblecalendar as ShallowRef<VisibleCalendarType>
                ) as YearMonthClickable<PositionTrackerType>['calendar'];
                triggerRef(visiblecalendar);
                calendartoshowmonthandweek = 'PREVIOUS';
              }
              else {
                if(
                  month === (visiblecalendar.value as VisibleCalendarType).previous.month
                  ||
                  month === (visiblecalendar.value as VisibleCalendarType).current.month
                ) {
                  if(month === (visiblecalendar.value as VisibleCalendarType).previous.month) {
                    calendartoshowmonthandweek = 'PREVIOUS';
                  }
                  else {
                    calendartoshowmonthandweek = 'CURRENT';
                  }
                }
                else {
                  if(
                    (
                      month > (visiblecalendar.value as VisibleCalendarType).current.month
                      ||
                      month > (visiblecalendar.value as VisibleCalendarType).previous.month
                    )
                    ||
                    month < (visiblecalendar.value as VisibleCalendarType).previous.month
                  ) {
                    if(
                      month > (visiblecalendar.value as VisibleCalendarType).current.month
                      ||
                      month > (visiblecalendar.value as VisibleCalendarType).previous.month
                    ) {
                      (visiblecalendar.value as VisibleCalendarType).current.year = yearandweek.year;
                      (visiblecalendar.value as VisibleCalendarType).current.month = month;
                      (visiblecalendar.value as VisibleCalendarType).current.calendar = buildCalendar(
                      (visiblecalendar.value as VisibleCalendarType).current.year,
                      (visiblecalendar.value as VisibleCalendarType).current.month,
                        'PREVIOUS-OR-CURRENT',
                        props.isoweek,
                        props.mindate,
                        props.maxdate,
                        visiblecalendar as ShallowRef<VisibleCalendarType>
                      ) as YearMonthClickable<PositionTrackerType>['calendar'];
                      triggerRef(visiblecalendar);
                      completelyDisableNewCalendarNotInSelection();
                      calendartoshowmonthandweek = 'CURRENT';
                    }
                    else {
                      (visiblecalendar.value as VisibleCalendarType).previous.year = yearandweek.year;
                      (visiblecalendar.value as VisibleCalendarType).previous.month = month;
                      (visiblecalendar.value as VisibleCalendarType).previous.calendar = buildCalendar(
                        (visiblecalendar.value as VisibleCalendarType).previous.year,
                        (visiblecalendar.value as VisibleCalendarType).previous.month,
                        'PREVIOUS-OR-CURRENT',
                        props.isoweek,
                        props.mindate,
                        props.maxdate,
                        visiblecalendar as ShallowRef<VisibleCalendarType>
                      ) as YearMonthClickable<PositionTrackerType>['calendar'];
                      triggerRef(visiblecalendar);
                      calendartoshowmonthandweek = 'PREVIOUS';
                    }
                  }
                }
              }
            }
          }
        }
        else {
          if(
            (
              yearandweek.year > (visiblecalendar.value as VisibleCalendarType).current.year
              ||
              yearandweek.year > (visiblecalendar.value as VisibleCalendarType).previous.year
            )
            ||
            yearandweek.year < (visiblecalendar.value as VisibleCalendarType).previous.year
          ) {
            if(
              yearandweek.year > (visiblecalendar.value as VisibleCalendarType).current.year
              ||
              yearandweek.year > (visiblecalendar.value as VisibleCalendarType).previous.year
            ) {
              (visiblecalendar.value as VisibleCalendarType).current.year = yearandweek.year;
              (visiblecalendar.value as VisibleCalendarType).current.month = month;
              (visiblecalendar.value as VisibleCalendarType).current.calendar = buildCalendar(
              (visiblecalendar.value as VisibleCalendarType).current.year,
              (visiblecalendar.value as VisibleCalendarType).current.month,
                'PREVIOUS-OR-CURRENT',
                props.isoweek,
                props.mindate,
                props.maxdate,
                visiblecalendar as ShallowRef<VisibleCalendarType>
              ) as YearMonthClickable<PositionTrackerType>['calendar'];
              triggerRef(visiblecalendar);
              completelyDisableNewCalendarNotInSelection();
              calendartoshowmonthandweek = 'CURRENT';
            }
            else {
              (visiblecalendar.value as VisibleCalendarType).previous.year = yearandweek.year;
              (visiblecalendar.value as VisibleCalendarType).previous.month = month;
              (visiblecalendar.value as VisibleCalendarType).previous.calendar = buildCalendar(
                (visiblecalendar.value as VisibleCalendarType).previous.year,
                (visiblecalendar.value as VisibleCalendarType).previous.month,
                'PREVIOUS-OR-CURRENT',
                props.isoweek,
                props.mindate,
                props.maxdate,
                visiblecalendar as ShallowRef<VisibleCalendarType>
              ) as YearMonthClickable<PositionTrackerType>['calendar'];
              triggerRef(visiblecalendar);
              calendartoshowmonthandweek = 'PREVIOUS';
            }
          }
          else {
            if(
              yearandweek.year === (visiblecalendar.value as VisibleCalendarType).previous.year
              ||
              yearandweek.year === (visiblecalendar.value as VisibleCalendarType).current.year
            ) {
              if(yearandweek.year === (visiblecalendar.value as VisibleCalendarType).current.year) {
                (visiblecalendar.value as VisibleCalendarType).current.year = yearandweek.year;
                (visiblecalendar.value as VisibleCalendarType).current.month = month;
                (visiblecalendar.value as VisibleCalendarType).current.calendar = buildCalendar(
                (visiblecalendar.value as VisibleCalendarType).current.year,
                (visiblecalendar.value as VisibleCalendarType).current.month,
                  'PREVIOUS-OR-CURRENT',
                  props.isoweek,
                  props.mindate,
                  props.maxdate,
                  visiblecalendar as ShallowRef<VisibleCalendarType>
                ) as YearMonthClickable<PositionTrackerType>['calendar'];
                triggerRef(visiblecalendar);
                completelyDisableNewCalendarNotInSelection();
                calendartoshowmonthandweek = 'CURRENT';
              }
              else {
                (visiblecalendar.value as VisibleCalendarType).previous.year = yearandweek.year;
                (visiblecalendar.value as VisibleCalendarType).previous.month = month;
                (visiblecalendar.value as VisibleCalendarType).previous.calendar = buildCalendar(
                  (visiblecalendar.value as VisibleCalendarType).previous.year,
                  (visiblecalendar.value as VisibleCalendarType).previous.month,
                  'PREVIOUS-OR-CURRENT',
                  props.isoweek,
                  props.mindate,
                  props.maxdate,
                  visiblecalendar as ShallowRef<VisibleCalendarType>
                ) as YearMonthClickable<PositionTrackerType>['calendar'];
                triggerRef(visiblecalendar);
                calendartoshowmonthandweek = 'PREVIOUS';
              }
            }
          }
        }
        if(calendartoshowmonthandweek === 'PREVIOUS') {
          if(
            week === (
              Object.keys(
                (
                  (visiblecalendar.value as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                ).weeks
              ).length - 1
            )
            &&
            (
              (visiblecalendar.value as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']
            ).weeks[
              week
            ].days[6].day in [1, 2, 3, 4, 5, 6, 7, 7]
          ) {
            if((month + 1) <= 11) {
              (visiblecalendar.value as VisibleCalendarType).current.year = yearandweek.year;
              (visiblecalendar.value as VisibleCalendarType).current.month = month+1;
              (visiblecalendar.value as VisibleCalendarType).current.calendar = buildCalendar(
              (visiblecalendar.value as VisibleCalendarType).current.year,
              (visiblecalendar.value as VisibleCalendarType).current.month,
                'PREVIOUS-OR-CURRENT',
                props.isoweek,
                props.mindate,
                props.maxdate,
                visiblecalendar as ShallowRef<VisibleCalendarType>
              ) as YearMonthClickable<PositionTrackerType>['calendar'];
              triggerRef(visiblecalendar);
              completelyDisableNewCalendarNotInSelection();
            }
            else {
              (visiblecalendar.value as VisibleCalendarType).current.year = yearandweek.year+1;
              (visiblecalendar.value as VisibleCalendarType).current.month = 0;
              (visiblecalendar.value as VisibleCalendarType).current.calendar = buildCalendar(
              (visiblecalendar.value as VisibleCalendarType).current.year,
              (visiblecalendar.value as VisibleCalendarType).current.month,
                'PREVIOUS-OR-CURRENT',
                props.isoweek,
                props.mindate,
                props.maxdate,
                visiblecalendar as ShallowRef<VisibleCalendarType>
              ) as YearMonthClickable<PositionTrackerType>['calendar'];
              triggerRef(visiblecalendar);
              completelyDisableNewCalendarNotInSelection();
            }
            nextTick(() => {
              if(
                (
                  (
                    (visiblecalendar.value as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                  ).weeks[week].ref as HTMLDivElement
                )
              ) {
                (
                  (
                    (visiblecalendar.value as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                  ).weeks[week].ref as HTMLDivElement
                ).style.backgroundColor = 'blue';
                triggerRef(visiblecalendar);
                            
                let time: ReturnType<typeof setTimeout>;
                time = setTimeout(() => {
                  (
                    (
                      (visiblecalendar.value as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                    ).weeks[week].ref as HTMLDivElement
                  ).style.backgroundColor = 'transparent';
                  triggerRef(visiblecalendar);
                  clearTimeout(time);
                }, 1000);
              }

              if(
                (
                  (
                    (visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                  ).weeks[0].ref as HTMLDivElement
                )
              ) {
                (
                  (
                    (visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                  ).weeks[0].ref as HTMLDivElement
                ).style.backgroundColor = 'blue';
                triggerRef(visiblecalendar);
                let time: ReturnType<typeof setTimeout>;
                time = setTimeout(() => {
                  (
                    (
                      (visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                    ).weeks[0].ref as HTMLDivElement
                  ).style.backgroundColor = 'transparent';
                  triggerRef(visiblecalendar);
                  clearTimeout(time);
                }, 1000);
              }
            });
          }
          else {
            nextTick(() => {
              if(
                (
                  (
                    (visiblecalendar.value as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                  ).weeks[week].ref as HTMLDivElement
                )
              ) {
                (
                  (
                    (visiblecalendar.value as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                  ).weeks[week].ref as HTMLDivElement
                ).style.backgroundColor = 'blue';
                triggerRef(visiblecalendar);
                            
                let time: ReturnType<typeof setTimeout>;
                time = setTimeout(() => {
                  (
                    (
                      (visiblecalendar.value as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                    ).weeks[week].ref as HTMLDivElement
                  ).style.backgroundColor = 'transparent';
                  triggerRef(visiblecalendar);
                  clearTimeout(time);
                }, 1000);
              }
            });
          }
        }
        else {
          if(
            week === (
              Object.keys(
                (
                  (visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                ).weeks
              ).length - 1
            )
            &&
            (
              (visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']
            ).weeks[
              week
            ].days[6].day in [1, 2, 3, 4, 5, 6, 7, 7]
          ) {
            (visiblecalendar.value as VisibleCalendarType).previous.year = (visiblecalendar.value as VisibleCalendarType).current.year;
            (visiblecalendar.value as VisibleCalendarType).previous.month = (visiblecalendar.value as VisibleCalendarType).current.month;
            (visiblecalendar.value as VisibleCalendarType).previous.calendar = buildCalendar(
            (visiblecalendar.value as VisibleCalendarType).previous.year,
            (visiblecalendar.value as VisibleCalendarType).previous.month,
              'PREVIOUS-OR-CURRENT',
              props.isoweek,
              props.mindate,
              props.maxdate,
              visiblecalendar as ShallowRef<VisibleCalendarType>
            ) as YearMonthClickable<PositionTrackerType>['calendar'];
            triggerRef(visiblecalendar);
            
            nextTick(() => {
              if((month + 1) <= 11) {
                (visiblecalendar.value as VisibleCalendarType).current.year = yearandweek.year;
                (visiblecalendar.value as VisibleCalendarType).current.month = month+1;
                (visiblecalendar.value as VisibleCalendarType).current.calendar = buildCalendar(
                (visiblecalendar.value as VisibleCalendarType).current.year,
                (visiblecalendar.value as VisibleCalendarType).current.month,
                  'PREVIOUS-OR-CURRENT',
                  props.isoweek,
                  props.mindate,
                  props.maxdate,
                  visiblecalendar as ShallowRef<VisibleCalendarType>
                ) as YearMonthClickable<PositionTrackerType>['calendar'];
                triggerRef(visiblecalendar);
                completelyDisableNewCalendarNotInSelection();
              }
              else {
                (visiblecalendar.value as VisibleCalendarType).current.year = yearandweek.year+1;
                (visiblecalendar.value as VisibleCalendarType).current.month = 0;
                (visiblecalendar.value as VisibleCalendarType).current.calendar = buildCalendar(
                (visiblecalendar.value as VisibleCalendarType).current.year,
                (visiblecalendar.value as VisibleCalendarType).current.month,
                  'PREVIOUS-OR-CURRENT',
                  props.isoweek,
                  props.mindate,
                  props.maxdate,
                  visiblecalendar as ShallowRef<VisibleCalendarType>
                ) as YearMonthClickable<PositionTrackerType>['calendar'];
                triggerRef(visiblecalendar);
                completelyDisableNewCalendarNotInSelection();
              }
              nextTick(() => {
                if(
                  (
                    (
                      (visiblecalendar.value as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                    ).weeks[week].ref as HTMLDivElement
                  )
                ) {
                  (
                    (
                      (visiblecalendar.value as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                    ).weeks[week].ref as HTMLDivElement
                  ).style.backgroundColor = 'blue';
                  triggerRef(visiblecalendar);
                              
                  let time: ReturnType<typeof setTimeout>;
                  time = setTimeout(() => {
                    (
                      (
                        (visiblecalendar.value as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                      ).weeks[week].ref as HTMLDivElement
                    ).style.backgroundColor = 'transparent';
                    triggerRef(visiblecalendar);
                    clearTimeout(time);
                  }, 1000);
                }
              });

              nextTick(() => {
                if(
                  (
                    (
                      (visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                    ).weeks[0].ref as HTMLDivElement
                  )
                ) {
                  (
                    (
                      (visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                    ).weeks[0].ref as HTMLDivElement
                  ).style.backgroundColor = 'blue';
                  triggerRef(visiblecalendar);
                  let time: ReturnType<typeof setTimeout>;
                  time = setTimeout(() => {
                    (
                      (
                        (visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                      ).weeks[0].ref as HTMLDivElement
                    ).style.backgroundColor = 'transparent';
                    triggerRef(visiblecalendar);
                    clearTimeout(time);
                  }, 1000);
                }
              });
            });
          }
          else {
            nextTick(() => {
              if(
                (
                  (
                    (visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                  ).weeks[week].ref as HTMLDivElement
                )
              ) {
                (
                  (
                    (visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                  ).weeks[week].ref as HTMLDivElement
                ).style.backgroundColor = 'blue';
                triggerRef(visiblecalendar);
                            
                let time: ReturnType<typeof setTimeout>;
                time = setTimeout(() => {
                  (
                    (
                      (visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                    ).weeks[week].ref as HTMLDivElement
                  ).style.backgroundColor = 'transparent';
                  triggerRef(visiblecalendar);
                  clearTimeout(time);
                }, 1000);
              }
            });
          }
        }
      }
    });
  });
}

function handleTyTmClicked(
  tytmtype: 'TM-CURRENT-SELECTIONS' | 'TM-PREVIOUS-SELECTIONS' | 'TY' | 'TM-CURRENT' | 'TM-PREVIOUS',
  tytmindex: number, 
  checkedornot: boolean,
  year: number,
  month?: number | undefined
) {
  handleTyTm(
    visiblecalendar as ShallowRef<VisibleCalendarType>,
    props.from,
    props.selectionformat,
    props.isoweek,
    props.mindate,
    props.maxdate,
    tytmtype,
    tytmindex,
    checkedornot,
    year,
    month,
    rangeselectionparams
  );
}

function weekCheckboxClicked(checked: boolean, weekindex: string, vcalendartype: 'PREVIOUS' | 'CURRENT') {
  let 
    year = vcalendartype === 'PREVIOUS'?
      ((visiblecalendar.value as VisibleCalendarType).previous as YearMonthClickable<PositionTrackerType>).year
      :
      ((visiblecalendar.value as VisibleCalendarType).current as YearMonthClickable<PositionTrackerType>).year,
    month = vcalendartype === 'PREVIOUS'?
      ((visiblecalendar.value as VisibleCalendarType).previous as YearMonthClickable<PositionTrackerType>).month
      :
      ((visiblecalendar.value as VisibleCalendarType).current as YearMonthClickable<PositionTrackerType>).month,
    week = parseInt(weekindex)
  ;
  if(
    props.selectionformat === 'RANGE'
    &&
    year in (visiblecalendar.value as VisibleCalendarType).selections
    &&
    month in (visiblecalendar.value as VisibleCalendarType).selections[year].months
  ) {
    nextTick(() => {
      highlightOrDeselectDaysInWeekForRangeSelection(
        checked as boolean,
        year,
        month,
        week,
        rangeselectionparams.value.rangefirstselection as RangeFirstAndLastSelectionType,
        rangeselectionparams.value.rangelastselection as RangeFirstAndLastSelectionType,
        visiblecalendar as ShallowRef<VisibleCalendarType>,
        'WEEK-BOX'
      );
    });
  }
  else {
    selectOrDeselectDaysInWeekForMultipleSelection(
      props.from,
      checked as boolean,
      year,
      month,
      week,
      visiblecalendar as ShallowRef<VisibleCalendarType>,
      'WEEK-BOX',
      props.isoweek,
      props.mindate,
      props.maxdate
    );
  }
}

function handleDateClick(day: YearMonthClickable<PositionTrackerType>['calendar']['weeks'][number]['days'][number]) {
  if(day.status === 'ENABLE') {
    if(!(rangeselectionparams.value as RangeSelectionParamsType).inselectionmode) {
      (rangeselectionparams.value as RangeSelectionParamsType).inselectionmode = true;
      triggerRef(rangeselectionparams);
    }
    nextTick(() => {
      if(props.selectionformat === 'RANGE') {
        handleDateSelectHighlightDeselect(
          props.from,
          props.isoweek,
          props.selectionformat,
          day.date,
          true,
          props.mindate,
          props.maxdate,
          visiblecalendar as ShallowRef<VisibleCalendarType>,
          rangeselectionparams as ShallowRef<RangeSelectionParamsType>
        );
      }
      else {
        handleDateSelectHighlightDeselect(
          props.from,
          props.isoweek,
          props.selectionformat,
          day.date,
          true,
          props.mindate,
          props.maxdate,
          visiblecalendar as ShallowRef<VisibleCalendarType>
        );
      }
    });
  }
}

function clickNext() {
  monthoryeardropdownclickcount.value = 0;
  monthoryeardropdownclicked.value = '';
  clickForward(
    props.isoweek, 
    props.maxdate, 
    props.mindate, 
    visiblecalendar as ShallowRef<VisibleCalendarType>
  );
  if(props.excludedates) {
    if((rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.date && (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.date) {
      let {max, min} = findRangeSelectionMaxAndMinDate(rangeselectionparams);
      (visiblecalendar.value as VisibleCalendarType).selections = resetSelections(
        'SELECTIONS', 
        (visiblecalendar.value as VisibleCalendarType).selections as VisibleCalendarType['selections'], 
        max as string, 
        min as string, 
        props.isoweek
      ) as VisibleCalendarType['selections'];
    }
    if((rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.date && (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.date) {
      let {max, min} = findRangeSelectionMaxAndMinDate(rangeselectionparams);
      (visiblecalendar.value as VisibleCalendarType).previous.calendar = resetSelections(
        'CALENDAR', 
        (visiblecalendar.value as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar'], 
        max as string, 
        min as string, 
        props.isoweek
      ) as YearMonthClickable<PositionTrackerType>['calendar'];
    }
    if((rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.date && (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.date) {
      let {max, min} = findRangeSelectionMaxAndMinDate(rangeselectionparams);
      (visiblecalendar.value as VisibleCalendarType).current.calendar = resetSelections(
        'CALENDAR', 
        (visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar'], 
        max as string, 
        min as string, 
        props.isoweek
      ) as YearMonthClickable<PositionTrackerType>['calendar'];
    }
    triggerRef(visiblecalendar);
  }
  if(props.from === 'DAYS-MONTHS-YEARS') {
    if((visiblecalendar.value as VisibleCalendarType).current.year in (visiblecalendar.value as VisibleCalendarType).selections) {
      if(!((visiblecalendar.value as VisibleCalendarType).current.month in (visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).current.year].months)) {
        for(let week in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks) {
          for(let day in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days) {
            (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].readonlystatus = 'DISABLE';
            (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].status = 'DISABLE';
            (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].selected = 'LOCKED';
            (visiblecalendar.value as VisibleCalendarType).current.calendar.tm[day].checked = false;
            (visiblecalendar.value as VisibleCalendarType).current.calendar.tm[day].status = 'DISABLE';
          }
        }
      }
    }
    else {
      for(let week in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks) {
        for(let day in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days) {
          (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].readonlystatus = 'DISABLE';
          (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].status = 'DISABLE';
          (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].selected = 'LOCKED';
          (visiblecalendar.value as VisibleCalendarType).current.calendar.tm[day].checked = false;
          (visiblecalendar.value as VisibleCalendarType).current.calendar.tm[day].status = 'DISABLE';
        }
      }
    }
    if((visiblecalendar.value as VisibleCalendarType).previous.year in (visiblecalendar.value as VisibleCalendarType).selections) {
      if(!((visiblecalendar.value as VisibleCalendarType).previous.month in (visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).previous.year].months)) {
        for(let week in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks) {
          for(let day in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days) {
            (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].readonlystatus = 'DISABLE';
            (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].status = 'DISABLE';
            (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].selected = 'LOCKED';
            (visiblecalendar.value as VisibleCalendarType).previous.calendar.tm[day].checked = false;
            (visiblecalendar.value as VisibleCalendarType).previous.calendar.tm[day].status = 'DISABLE';
          }
        }
      }
    }
    else {
      for(let week in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks) {
        for(let day in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days) {
          (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].readonlystatus = 'DISABLE';
          (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].status = 'DISABLE';
          (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].selected = 'LOCKED';
          (visiblecalendar.value as VisibleCalendarType).previous.calendar.tm[day].checked = false;
          (visiblecalendar.value as VisibleCalendarType).previous.calendar.tm[day].status = 'DISABLE';
        }
      }
    }
    triggerRef(visiblecalendar);
  }
}

function clickPrevious() {
  monthoryeardropdownclickcount.value = 0;
  monthoryeardropdownclicked.value = '';
  clickBackward(
    props.isoweek, 
    props.maxdate, 
    props.mindate, 
    visiblecalendar as ShallowRef<VisibleCalendarType>
  );
  if(props.excludedates) {
    if((rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.date && (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.date) {
      let {max, min} = findRangeSelectionMaxAndMinDate(rangeselectionparams);
      (visiblecalendar.value as VisibleCalendarType).selections = resetSelections(
        'SELECTIONS', 
        (visiblecalendar.value as VisibleCalendarType).selections as VisibleCalendarType['selections'], 
        max as string, 
        min as string, 
        props.isoweek
      ) as VisibleCalendarType['selections'];
    }
    if((rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.date && (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.date) {
      let {max, min} = findRangeSelectionMaxAndMinDate(rangeselectionparams);
      (visiblecalendar.value as VisibleCalendarType).previous.calendar = resetSelections(
        'CALENDAR', 
        (visiblecalendar.value as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar'], 
        max as string, 
        min as string, 
        props.isoweek
      ) as YearMonthClickable<PositionTrackerType>['calendar'];
    }
    if((rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.date && (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.date) {
      let {max, min} = findRangeSelectionMaxAndMinDate(rangeselectionparams);
      (visiblecalendar.value as VisibleCalendarType).current.calendar = resetSelections(
        'CALENDAR', 
        (visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar'], 
        max as string, 
        min as string, 
        props.isoweek
      ) as YearMonthClickable<PositionTrackerType>['calendar'];
    }
    triggerRef(visiblecalendar);
  }
  if(props.from === 'DAYS-MONTHS-YEARS') {
    if((visiblecalendar.value as VisibleCalendarType).current.year in (visiblecalendar.value as VisibleCalendarType).selections) {
      if(!((visiblecalendar.value as VisibleCalendarType).current.month in (visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).current.year].months)) {
        for(let week in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks) {
          for(let day in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days) {
            (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].readonlystatus = 'DISABLE';
            (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].status = 'DISABLE';
            (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].selected = 'LOCKED';
            (visiblecalendar.value as VisibleCalendarType).current.calendar.tm[day].checked = false;
            (visiblecalendar.value as VisibleCalendarType).current.calendar.tm[day].status = 'DISABLE';
          }
        }
      }
    }
    else {
      for(let week in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks) {
        for(let day in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days) {
          (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].readonlystatus = 'DISABLE';
          (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].status = 'DISABLE';
          (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].selected = 'LOCKED';
          (visiblecalendar.value as VisibleCalendarType).current.calendar.tm[day].checked = false;
          (visiblecalendar.value as VisibleCalendarType).current.calendar.tm[day].status = 'DISABLE';
        }
      }
    }
    if((visiblecalendar.value as VisibleCalendarType).previous.year in (visiblecalendar.value as VisibleCalendarType).selections) {
      if(!((visiblecalendar.value as VisibleCalendarType).previous.month in (visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).previous.year].months)) {
        for(let week in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks) {
          for(let day in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days) {
            (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].readonlystatus = 'DISABLE';
            (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].status = 'DISABLE';
            (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].selected = 'LOCKED';
            (visiblecalendar.value as VisibleCalendarType).previous.calendar.tm[day].checked = false;
            (visiblecalendar.value as VisibleCalendarType).previous.calendar.tm[day].status = 'DISABLE';
          }
        }
      }
    }
    else {
      for(let week in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks) {
        for(let day in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days) {
          (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].readonlystatus = 'DISABLE';
          (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].status = 'DISABLE';
          (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].selected = 'LOCKED';
          (visiblecalendar.value as VisibleCalendarType).previous.calendar.tm[day].checked = false;
          (visiblecalendar.value as VisibleCalendarType).previous.calendar.tm[day].status = 'DISABLE';
        }
      }
    }
    triggerRef(visiblecalendar);
  }
}

function processDimensions() {
  getDimensions(
    visiblecalendar as ShallowRef<VisibleCalendarType>
  );
}

function trackMouseMovement(event: { pageX: number; pageY: number; }) {
  let loadingMovement = ref(false);
  if((rangeselectionparams.value as RangeSelectionParamsType).inselectionmode) {
    (rangeselectionparams.value as RangeSelectionParamsType).inselectionmode = false;
    triggerRef(rangeselectionparams);
  }
  mouseMovement(
    props.from,
    rangeselectionparams as ShallowRef<RangeSelectionParamsType>,
    event,
    props.isoweek, 
    props.mindate, 
    props.maxdate, 
    props.selectionformat as 'RANGE',
    visiblecalendar as ShallowRef<VisibleCalendarType>,
    loadingMovement
  );
}

function unTrackVisibleCalendarMouseMovement() {
  if (document.getElementById("currentvisiblecalendarbox")) {
    (document.getElementById("currentvisiblecalendarbox") as HTMLDivElement).removeEventListener("mousemove", trackMouseMovement, true);
  }
  if (document.getElementById("previousvisiblecalendarbox")) {
    (document.getElementById("previousvisiblecalendarbox") as HTMLDivElement).removeEventListener("mousemove", trackMouseMovement, true);
  }
}

function trackVisibleCalendarMouseMovement() {
  if (document.getElementById("currentvisiblecalendarbox")) {
    (document
      .getElementById("currentvisiblecalendarbox") as HTMLDivElement)
      .addEventListener("mousemove", trackMouseMovement, true);
  }
  if (document.getElementById("previousvisiblecalendarbox")) {
    (document
      .getElementById("previousvisiblecalendarbox") as HTMLDivElement)
      .addEventListener("mousemove", trackMouseMovement, true);
  }
}

const previousyearandmonthinselections = computed(() => {
  if (!((visiblecalendar.value as VisibleCalendarType).previous.year in (visiblecalendar.value as VisibleCalendarType).selections)) {
    return false;
  } else {
    if (
      !(
        (visiblecalendar.value as VisibleCalendarType).previous.month in
        (visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).previous.year].months
      )
    ) {
      return false;
    } else {
      return true;
    }
  }
});

const currentyearandmonthinselections = computed(() => {
  if (!((visiblecalendar.value as VisibleCalendarType).current.year in (visiblecalendar.value as VisibleCalendarType).selections)) {
    return false;
  } else {
    if (
      !(
        (visiblecalendar.value as VisibleCalendarType).current.month in
        (visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).current.year].months
      )
    ) {
      return false;
    } else {
      return true;
    }
  }
});

onBeforeMount(() => {
  ((rangeselectionparams.value as RangeSelectionParamsType).excludedates as boolean) = props.excludedates as boolean;
  triggerRef(rangeselectionparams);
  visiblecalendar.value = fillVisibleCalendarArray(
    props.maxdate,
    props.mindate,
    props.isoweek
  );
  (visiblecalendar.value as VisibleCalendarType).selections = props.selections as VisibleCalendarType['selections'];
  if(props.from === 'DAYS-MONTHS-YEARS') {
    if((visiblecalendar.value as VisibleCalendarType).current.year in (visiblecalendar.value as VisibleCalendarType).selections) {
      if(!((visiblecalendar.value as VisibleCalendarType).current.month in (visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).current.year].months)) {
        for(let week in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks) {
          for(let day in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days) {
            (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].readonlystatus = 'DISABLE';
            (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].status = 'DISABLE';
            (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].selected = 'LOCKED';
            (visiblecalendar.value as VisibleCalendarType).current.calendar.tm[day].checked = false;
            (visiblecalendar.value as VisibleCalendarType).current.calendar.tm[day].status = 'DISABLE';
          }
        }
      }
    }
    else {
      for(let week in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks) {
        for(let day in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days) {
          (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].readonlystatus = 'DISABLE';
          (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].status = 'DISABLE';
          (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[week].days[day].selected = 'LOCKED';
          (visiblecalendar.value as VisibleCalendarType).current.calendar.tm[day].checked = false;
          (visiblecalendar.value as VisibleCalendarType).current.calendar.tm[day].status = 'DISABLE';
        }
      }
    }
    if((visiblecalendar.value as VisibleCalendarType).previous.year in (visiblecalendar.value as VisibleCalendarType).selections) {
      if(!((visiblecalendar.value as VisibleCalendarType).previous.month in (visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).previous.year].months)) {
        for(let week in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks) {
          for(let day in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days) {
            (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].readonlystatus = 'DISABLE';
            (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].status = 'DISABLE';
            (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].selected = 'LOCKED';
            (visiblecalendar.value as VisibleCalendarType).previous.calendar.tm[day].checked = false;
            (visiblecalendar.value as VisibleCalendarType).previous.calendar.tm[day].status = 'DISABLE';
          }
        }
      }
    }
    else {
      for(let week in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks) {
        for(let day in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days) {
          (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].readonlystatus = 'DISABLE';
          (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].status = 'DISABLE';
          (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[week].days[day].selected = 'LOCKED';
          (visiblecalendar.value as VisibleCalendarType).previous.calendar.tm[day].checked = false;
          (visiblecalendar.value as VisibleCalendarType).previous.calendar.tm[day].status = 'DISABLE';
        }
      }
    }
  }
  triggerRef(visiblecalendar);
});

onMounted(() => {
  unwatchexcludedates = watch(
    () => (props.excludedates as boolean),
    (x) => {
      (rangeselectionparams.value as RangeSelectionParamsType).excludedates = x;
      triggerRef(rangeselectionparams);
      if(x) {
        if((rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year === (rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.year) {
          if((rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.month === (rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.month) {
            let tm = [false, false, false, false, false, false, false];
            for(let week in (
                (visiblecalendar.value as VisibleCalendarType).selections[
                  (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                ].months[
                  (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.month
                ] as YearMonthClickable<{}>['calendar']
              ).weeks
            ) {
              if(weekHasHighlightedOrSelected(
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                  ].months[
                    (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week]
              )) {
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                  ].months[
                    (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].checked = true;
              }
              for(let day in 
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                  ].months[
                    (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.month
                  ] as YearMonthClickable<{}>['calendar']
                ).weeks[week].days
              ) {
                if(
                  (
                    (visiblecalendar.value as VisibleCalendarType).selections[
                      (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                    ].months[
                      (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.month
                    ] as YearMonthClickable<{}>['calendar']
                  ).weeks[week].days[day].status === 'ENABLE'
                  &&
                  (
                    (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                      ].months[
                        (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.month
                      ] as YearMonthClickable<{}>['calendar']
                    ).weeks[week].days[day].selected === 'HIGHLIGHTED'
                    ||
                    (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                      ].months[
                        (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.month
                      ] as YearMonthClickable<{}>['calendar']
                    ).weeks[week].days[day].selected === 'SELECTED'
                  )
                ) {
                  tm[day] = true;
                }
              }
            }
            for(let i=0; i<7; i++) {
              (visiblecalendar.value as VisibleCalendarType).selections[
                (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
              ].ty[i].checked = false;
              (visiblecalendar.value as VisibleCalendarType).selections[
                (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
              ].ty[i].status = 'DISABLE';
              if(tm[i] === false) {
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                  ].months[
                    (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.month
                  ] as YearMonthClickable<{}>['calendar']
                ).tm[i].checked = false;
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                  ].months[
                    (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.month
                  ] as YearMonthClickable<{}>['calendar']
                ).tm[i].status = 'DISABLE';
              }
              else {
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                  ].months[
                    (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.month
                  ] as YearMonthClickable<{}>['calendar']
                ).tm[i].checked = true;
                (
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                  ].months[
                    (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.month
                  ] as YearMonthClickable<{}>['calendar']
                ).tm[i].status = 'ENABLE';
              }
            }
          }
          else {
            if((rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.month > (rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.month) {
              let ty = [false, false, false, false, false, false, false];
              for(
                let i = (rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.month;
                i<=(rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.month;
                i++
              ){
                let tm = [false, false, false, false, false, false, false];
                for(let week in (
                    (visiblecalendar.value as VisibleCalendarType).selections[
                      (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                    ].months[i] as YearMonthClickable<{}>['calendar']
                  ).weeks
                ) {
                  if(weekHasHighlightedOrSelected(
                    (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                      ].months[i] as YearMonthClickable<{}>['calendar']
                    ).weeks[week]
                  )) {
                    (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                      ].months[i] as YearMonthClickable<{}>['calendar']
                    ).weeks[week].checked = true;
                  }
                  for(let day in 
                    (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                      ].months[i] as YearMonthClickable<{}>['calendar']
                    ).weeks[week].days
                  ) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                        ].months[
                          i
                        ] as YearMonthClickable<{}>['calendar']
                      ).weeks[week].days[day].status === 'ENABLE'
                      &&
                      (
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                          ].months[
                            i
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[week].days[day].selected === 'HIGHLIGHTED'
                        ||
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                          ].months[
                            i
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[week].days[day].selected === 'SELECTED'
                      )
                    ) {
                      tm[day] = true;
                      ty[day] = true;
                    }
                  }
                }
                for(let k=0; k<7; k++) {
                  if(tm[k] === false) {
                    (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                      ].months[
                        i
                      ] as YearMonthClickable<{}>['calendar']
                    ).tm[k].checked = false;
                    (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                      ].months[
                        i
                      ] as YearMonthClickable<{}>['calendar']
                    ).tm[k].status = 'DISABLE';
                  }
                  else {
                    (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                      ].months[
                        i
                      ] as YearMonthClickable<{}>['calendar']
                    ).tm[k].checked = true;
                    (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                      ].months[
                        i
                      ] as YearMonthClickable<{}>['calendar']
                    ).tm[k].status = 'ENABLE';
                  }
                }
              }
              for(let k=0; k<7; k++) {
                if(ty[k] === false) {
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                  ].ty[k].checked = false;
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                  ].ty[k].status = 'DISABLE';
                }
                else {
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                  ].ty[k].checked = true;
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                  ].ty[k].status = 'ENABLE';
                }
              }
            }
            else {
              let ty = [false, false, false, false, false, false, false];
              for(
                let i = (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.month;
                i<=(rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.month;
                i++
              ){
                let tm = [false, false, false, false, false, false, false];
                for(let week in ((visiblecalendar.value as VisibleCalendarType).selections[
                  (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year].months[i] as YearMonthClickable<{}>['calendar']).weeks
                ) {
                  if(weekHasHighlightedOrSelected(
                      ((visiblecalendar.value as VisibleCalendarType).selections[
                        (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                      ].months[i] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)]
                  )) {
                    ((visiblecalendar.value as VisibleCalendarType).selections[
                      (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                    ].months[i] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].checked = true;
                  }
                  for(let day in 
                    (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                      ].months[i] as YearMonthClickable<{}>['calendar']
                    ).weeks[week].days
                  ) {
                    if(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                        ].months[
                          i
                        ] as YearMonthClickable<{}>['calendar']
                      ).weeks[week].days[day].status === 'ENABLE'
                      &&
                      (
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                          ].months[
                            i
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[week].days[day].selected === 'HIGHLIGHTED'
                        ||
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                          ].months[
                            i
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[week].days[day].selected === 'SELECTED'
                      )
                    ) {
                      tm[day] = true;
                      ty[day] = true;
                    }
                  }
                }
                for(let k=0; k<7; k++) {
                  if(tm[k] === false) {
                    (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                      ].months[
                        i
                      ] as YearMonthClickable<{}>['calendar']
                    ).tm[k].checked = false;
                    (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                      ].months[
                        i
                      ] as YearMonthClickable<{}>['calendar']
                    ).tm[k].status = 'DISABLE';
                  }
                  else {
                    (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                      ].months[
                        i
                      ] as YearMonthClickable<{}>['calendar']
                    ).tm[k].checked = true;
                    (
                      (visiblecalendar.value as VisibleCalendarType).selections[
                        (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                      ].months[
                        i
                      ] as YearMonthClickable<{}>['calendar']
                    ).tm[k].status = 'ENABLE';
                  }
                }
              }
              for(let k=0; k<7; k++) {
                if(ty[k] === false) {
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                  ].ty[k].checked = false;
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                  ].ty[k].status = 'DISABLE';
                }
                else {
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                  ].ty[k].checked = true;
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year
                  ].ty[k].status = 'ENABLE';
                }
              }
            }
          }
        }
        else {
          if((rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year > (rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.year) {
            for(
              let year = (rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.year;
              year <= (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year;
              year++
            ) {
              let ty = [false, false, false, false, false, false, false];
              if(
                (rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.year === year
                ||
                (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year === year
              ) {
                if(
                  (rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.year === year
                ) {
                  for(
                    let month = (rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.month;
                    month < 12;
                    month++
                  ) {
                    let tm = [false, false, false, false, false, false, false];
                    for(let week in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks) {
                      if(weekHasHighlightedOrSelected(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[year].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[parseInt(week)]
                      )) {
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[year].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[parseInt(week)].checked = true;
                      }
                      for(let day in 
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[week].days
                      ) {
                        if(
                          (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year
                            ].months[
                              parseInt(''+month)
                            ] as YearMonthClickable<{}>['calendar']
                          ).weeks[week].days[day].status === 'ENABLE'
                          &&
                          (
                            (
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year
                              ].months[
                                parseInt(''+month)
                              ] as YearMonthClickable<{}>['calendar']
                            ).weeks[week].days[day].selected === 'HIGHLIGHTED'
                            ||
                            (
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year
                              ].months[
                                parseInt(''+month)
                              ] as YearMonthClickable<{}>['calendar']
                            ).weeks[week].days[day].selected === 'SELECTED'
                          )
                        ) {
                          tm[day] = true;
                          ty[day] = true;
                        }
                      }
                    }
                    for(let k=0; k<7; k++) {
                      if(tm[k] === false) {
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).tm[k].checked = false;
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).tm[k].status = 'DISABLE';
                      }
                      else {
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).tm[k].checked = true;
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).tm[k].status = 'ENABLE';
                      }
                    }
                  }
                }
                else {
                  for(
                    let month = 0;
                    month <= (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.month;
                    month++
                  ) {
                    let tm = [false, false, false, false, false, false, false];
                    for(let week in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks) {
                      if(weekHasHighlightedOrSelected(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[year].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[parseInt(week)]
                      )) {
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[year].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[parseInt(week)].checked = true;
                      }
                      for(let day in 
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[week].days
                      ) {
                        if(
                          (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year
                            ].months[
                              parseInt(''+month)
                            ] as YearMonthClickable<{}>['calendar']
                          ).weeks[week].days[day].status === 'ENABLE'
                          &&
                          (
                            (
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year
                              ].months[
                                parseInt(''+month)
                              ] as YearMonthClickable<{}>['calendar']
                            ).weeks[week].days[day].selected === 'HIGHLIGHTED'
                            ||
                            (
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year
                              ].months[
                                parseInt(''+month)
                              ] as YearMonthClickable<{}>['calendar']
                            ).weeks[week].days[day].selected === 'SELECTED'
                          )
                        ) {
                          tm[day] = true;
                          ty[day] = true;
                        }
                      }
                    }
                    for(let k=0; k<7; k++) {
                      if(tm[k] === false) {
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).tm[k].checked = false;
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).tm[k].status = 'DISABLE';
                      }
                      else {
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).tm[k].checked = true;
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).tm[k].status = 'ENABLE';
                      }
                    }
                  }
                }
              }
              else {
                for(let month = 0; month < 12; month++) {
                  let tm = [false, false, false, false, false, false, false];
                  for(let week in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks) {
                    if(weekHasHighlightedOrSelected(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[year].months[
                          parseInt(''+month)
                        ] as YearMonthClickable<{}>['calendar']
                      ).weeks[parseInt(week)]
                    )) {
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[year].months[
                          parseInt(''+month)
                        ] as YearMonthClickable<{}>['calendar']
                      ).weeks[parseInt(week)].checked = true;
                    }
                    for(let day in 
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ].months[
                          parseInt(''+month)
                        ] as YearMonthClickable<{}>['calendar']
                      ).weeks[week].days
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[week].days[day].status === 'ENABLE'
                        &&
                        (
                          (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year
                            ].months[
                              parseInt(''+month)
                            ] as YearMonthClickable<{}>['calendar']
                          ).weeks[week].days[day].selected === 'HIGHLIGHTED'
                          ||
                          (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year
                            ].months[
                              parseInt(''+month)
                            ] as YearMonthClickable<{}>['calendar']
                          ).weeks[week].days[day].selected === 'SELECTED'
                        )
                      ) {
                        tm[day] = true;
                        ty[day] = true;
                      }
                    }
                  }
                  for(let k=0; k<7; k++) {
                    if(tm[k] === false) {
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ].months[
                          parseInt(''+month)
                        ] as YearMonthClickable<{}>['calendar']
                      ).tm[k].checked = false;
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ].months[
                          parseInt(''+month)
                        ] as YearMonthClickable<{}>['calendar']
                      ).tm[k].status = 'DISABLE';
                    }
                    else {
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ].months[
                          parseInt(''+month)
                        ] as YearMonthClickable<{}>['calendar']
                      ).tm[k].checked = true;
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ].months[
                          parseInt(''+month)
                        ] as YearMonthClickable<{}>['calendar']
                      ).tm[k].status = 'ENABLE';
                    }
                  }
                }
              }
              for(let k=0; k<7; k++) {
                if(ty[k] === false) {
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].ty[k].checked = false;
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].ty[k].status = 'DISABLE';
                }
                else {
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].ty[k].checked = true;
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].ty[k].status = 'ENABLE';
                }
              }
            }
          }
          else {
            for(
              let year = (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year;
              year <= (rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.year;
              year++
            ) {
              let ty = [false, false, false, false, false, false, false];
              if(
                (rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.year === year
                ||
                (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.year === year
              ) {
                if(
                  (rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.year === year
                ) {
                  for(
                    let month = 0;
                    month <= (rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.month;
                    month++
                  ) {
                    let tm = [false, false, false, false, false, false, false];
                    for(let week in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks) {
                      if(weekHasHighlightedOrSelected(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[year].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[parseInt(week)]
                      )) {
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[year].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[parseInt(week)].checked = true;
                      }
                      for(let day in 
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[week].days
                      ) {
                        if(
                          (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year
                            ].months[
                              parseInt(''+month)
                            ] as YearMonthClickable<{}>['calendar']
                          ).weeks[week].days[day].status === 'ENABLE'
                          &&
                          (
                            (
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year
                              ].months[
                                parseInt(''+month)
                              ] as YearMonthClickable<{}>['calendar']
                            ).weeks[week].days[day].selected === 'HIGHLIGHTED'
                            ||
                            (
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year
                              ].months[
                                parseInt(''+month)
                              ] as YearMonthClickable<{}>['calendar']
                            ).weeks[week].days[day].selected === 'SELECTED'
                          )
                        ) {
                          tm[day] = true;
                          ty[day] = true;
                        }
                      }
                    }
                    for(let k=0; k<7; k++) {
                      if(tm[k] === false) {
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).tm[k].checked = false;
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).tm[k].status = 'DISABLE';
                      }
                      else {
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).tm[k].checked = true;
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).tm[k].status = 'ENABLE';
                      }
                    }
                  }
                }
                else {
                  for(
                    let month = (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.month;
                    month < 12;
                    month++
                  ) {
                    let tm = [false, false, false, false, false, false, false];
                    for(let week in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks) {
                      if(weekHasHighlightedOrSelected(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[year].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[parseInt(week)]
                      )) {
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[year].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[parseInt(week)].checked = true;
                      }
                      for(let day in 
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[week].days
                      ) {
                        if(
                          (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year
                            ].months[
                              parseInt(''+month)
                            ] as YearMonthClickable<{}>['calendar']
                          ).weeks[week].days[day].status === 'ENABLE'
                          &&
                          (
                            (
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year
                              ].months[
                                parseInt(''+month)
                              ] as YearMonthClickable<{}>['calendar']
                            ).weeks[week].days[day].selected === 'HIGHLIGHTED'
                            ||
                            (
                              (visiblecalendar.value as VisibleCalendarType).selections[
                                year
                              ].months[
                                parseInt(''+month)
                              ] as YearMonthClickable<{}>['calendar']
                            ).weeks[week].days[day].selected === 'SELECTED'
                          )
                        ) {
                          tm[day] = true;
                          ty[day] = true;
                        }
                      }
                    }
                    for(let k=0; k<7; k++) {
                      if(tm[k] === false) {
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).tm[k].checked = false;
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).tm[k].status = 'DISABLE';
                      }
                      else {
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).tm[k].checked = true;
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).tm[k].status = 'ENABLE';
                      }
                    }
                  }
                }
              }
              else {
                for(let month = 0; month < 12; month++) {
                  let tm = [false, false, false, false, false, false, false];
                  for(let week in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks) {
                    if(weekHasHighlightedOrSelected(
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[year].months[
                          parseInt(''+month)
                        ] as YearMonthClickable<{}>['calendar']
                      ).weeks[parseInt(week)]
                    )) {
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[year].months[
                          parseInt(''+month)
                        ] as YearMonthClickable<{}>['calendar']
                      ).weeks[parseInt(week)].checked = true;
                    }
                    for(let day in 
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ].months[
                          parseInt(''+month)
                        ] as YearMonthClickable<{}>['calendar']
                      ).weeks[week].days
                    ) {
                      if(
                        (
                          (visiblecalendar.value as VisibleCalendarType).selections[
                            year
                          ].months[
                            parseInt(''+month)
                          ] as YearMonthClickable<{}>['calendar']
                        ).weeks[week].days[day].status === 'ENABLE'
                        &&
                        (
                          (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year
                            ].months[
                              parseInt(''+month)
                            ] as YearMonthClickable<{}>['calendar']
                          ).weeks[week].days[day].selected === 'HIGHLIGHTED'
                          ||
                          (
                            (visiblecalendar.value as VisibleCalendarType).selections[
                              year
                            ].months[
                              parseInt(''+month)
                            ] as YearMonthClickable<{}>['calendar']
                          ).weeks[week].days[day].selected === 'SELECTED'
                        )
                      ) {
                        tm[day] = true;
                        ty[day] = true;
                      }
                    }
                  }
                  for(let k=0; k<7; k++) {
                    if(tm[k] === false) {
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ].months[
                          parseInt(''+month)
                        ] as YearMonthClickable<{}>['calendar']
                      ).tm[k].checked = false;
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ].months[
                          parseInt(''+month)
                        ] as YearMonthClickable<{}>['calendar']
                      ).tm[k].status = 'DISABLE';
                    }
                    else {
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ].months[
                          parseInt(''+month)
                        ] as YearMonthClickable<{}>['calendar']
                      ).tm[k].checked = true;
                      (
                        (visiblecalendar.value as VisibleCalendarType).selections[
                          year
                        ].months[
                          parseInt(''+month)
                        ] as YearMonthClickable<{}>['calendar']
                      ).tm[k].status = 'ENABLE';
                    }
                  }
                }
              }
              for(let k=0; k<7; k++) {
                if(ty[k] === false) {
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].ty[k].checked = false;
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].ty[k].status = 'DISABLE';
                }
                else {
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].ty[k].checked = true;
                  (visiblecalendar.value as VisibleCalendarType).selections[
                    year
                  ].ty[k].status = 'ENABLE';
                }
              }
            }
          }
        }
        if((rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.date && (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.date) {
          let {max, min} = findRangeSelectionMaxAndMinDate(rangeselectionparams);
          (visiblecalendar.value as VisibleCalendarType).selections = resetSelections(
            'SELECTIONS', 
            (visiblecalendar.value as VisibleCalendarType).selections as VisibleCalendarType['selections'], 
            max as string, 
            min as string, 
            props.isoweek
          ) as VisibleCalendarType['selections'];
        }
        if((rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.date && (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.date) {
          let {max, min} = findRangeSelectionMaxAndMinDate(rangeselectionparams);
          (visiblecalendar.value as VisibleCalendarType).previous.calendar = resetSelections(
            'CALENDAR', 
            (visiblecalendar.value as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar'], 
            max as string, 
            min as string, 
            props.isoweek
          ) as YearMonthClickable<PositionTrackerType>['calendar'];
        }
        if((rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection.date && (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection.date) {
          let {max, min} = findRangeSelectionMaxAndMinDate(rangeselectionparams);
          (visiblecalendar.value as VisibleCalendarType).current.calendar = resetSelections(
            'CALENDAR', 
            (visiblecalendar.value as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar'], 
            max as string, 
            min as string, 
            props.isoweek
          ) as YearMonthClickable<PositionTrackerType>['calendar'];
        }
      }
      else {
        (rangeselectionparams.value as RangeSelectionParamsType).inselectionmode = false;
        (rangeselectionparams.value as RangeSelectionParamsType).rangeselectcount = 0;
        (rangeselectionparams.value as RangeSelectionParamsType).rangefirstselection = {year: 0, month: 0, day: 0, date: "", week: 0};
        (rangeselectionparams.value as RangeSelectionParamsType).rangelastselection = {year: 0, month: 0, day: 0, date: "", week: 0};
      }
      processDimensions();
      triggerRef(visiblecalendar);
    }
  );
  unwatchresetcalendarsignal = watch(
    () => (props.resetcalendarsignal as number),
    () => {
      for(let week in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks) {
        for(let day in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(''+week)].days) {
          if((visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(''+week)].days[day].readonlystatus === "ENABLE") {
            (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(''+week)].days[day].status = "ENABLE";
          }
        }
        (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(''+week)].checked = false;
        (visiblecalendar.value as VisibleCalendarType).previous.ty[
          (visiblecalendar.value as VisibleCalendarType).previous.year
        ] = [
          {checked: false, status: 'ENABLE'},
          {checked: false, status: 'ENABLE'},
          {checked: false, status: 'ENABLE'},
          {checked: false, status: 'ENABLE'},
          {checked: false, status: 'ENABLE'},
          {checked: false, status: 'ENABLE'},
          {checked: false, status: 'ENABLE'}
        ];
      }
      for(let week in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks) {
        for(let day in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(''+week)].days) {
          if((visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(''+week)].days[day].readonlystatus === "ENABLE") {
            (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(''+week)].days[day].status = "ENABLE";
          }
        }
        (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(''+week)].checked = false;
        (visiblecalendar.value as VisibleCalendarType).current.ty[
          (visiblecalendar.value as VisibleCalendarType).current.year
        ] = [
          {checked: false, status: 'ENABLE'},
          {checked: false, status: 'ENABLE'},
          {checked: false, status: 'ENABLE'},
          {checked: false, status: 'ENABLE'},
          {checked: false, status: 'ENABLE'},
          {checked: false, status: 'ENABLE'},
          {checked: false, status: 'ENABLE'}
        ];
      }
      for (let year in (visiblecalendar.value as VisibleCalendarType).selections) {
        for (let month in (visiblecalendar.value as VisibleCalendarType).selections[year].months) {
          for (let week in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks) {
            ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].checked = false;
          }
        }
      }
      rangeselectionparams.value.rangeselectcount = 0;
      rangeselectionparams.value.excludedates = false;
      rangeselectionparams.value.inselectionmode = false;
      rangeselectionparams.value.rangefirstselection = {year: 0, month: 0, day: 0, date: "", week: 0};
      rangeselectionparams.value.rangelastselection = {year: 0, month: 0, day: 0, date: "", week: 0};
      (visiblecalendar.value as VisibleCalendarType).selections = {};
      triggerRef(rangeselectionparams);
      triggerRef(visiblecalendar);
      processDimensions();
    }
  );
  unwatchselectionformat = watch(
    () => props.selectionformat,
    () => {
      monthoryeardropdownclickcount.value = 0;
      monthoryeardropdownclicked.value = '';
      rangeselectionparams.value.rangeselectcount = 0;
      rangeselectionparams.value.excludedates = false;
      rangeselectionparams.value.inselectionmode = false;
      rangeselectionparams.value.rangefirstselection = {year: 0, month: 0, day: 0, date: "", week: 0};
      rangeselectionparams.value.rangelastselection = {year: 0, month: 0, day: 0, date: "", week: 0};
      (visiblecalendar.value as VisibleCalendarType).selections = {};

      triggerRef(rangeselectionparams);
      triggerRef(visiblecalendar);

      processDimensions();

      unTrackVisibleCalendarMouseMovement();
    }
  );
  unwatchrangeselectcount = watch(
    () => (rangeselectionparams.value as RangeSelectionParamsType).rangeselectcount,
    (x) => {
      if (props.selectionformat === "RANGE") {
        if (x === 1) {
          emits('enable:excludebutton', true);
          trackVisibleCalendarMouseMovement();
          for(let week in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks) {
            for(let day in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(''+week)].days) {
              if((visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(''+week)].days[day].readonlystatus === "ENABLE") {
                (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(''+week)].days[day].status = "ENABLE";
              }
            }
          }
          for(let week in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks) {
            for(let day in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(''+week)].days) {
              if((visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(''+week)].days[day].readonlystatus === "ENABLE") {
                (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(''+week)].days[day].status = "ENABLE";
              }
            }
          }
          for (let year in (visiblecalendar.value as VisibleCalendarType).selections) {
            for (let month in (visiblecalendar.value as VisibleCalendarType).selections[year].months) {
              for (let week in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks) {
                for (let day in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days) {
                  if(((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].readonlystatus === "ENABLE") {
                    ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].status = "ENABLE";
                  }
                }
              }
            }
          }
        } else {
          unTrackVisibleCalendarMouseMovement();
          if(x === 2) {
            emits('enable:excludebutton', false);
          }
          else {
            if(x === 0) {
              emits('enable:excludebutton', true);
              for(let week in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks) {
                for(let day in (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(''+week)].days) {
                  if((visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(''+week)].days[day].readonlystatus === "ENABLE") {
                    (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[parseInt(''+week)].days[day].status = "ENABLE";
                  }
                }
              }
              for(let week in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks) {
                for(let day in (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(''+week)].days) {
                  if((visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(''+week)].days[day].readonlystatus === "ENABLE") {
                    (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[parseInt(''+week)].days[day].status = "ENABLE";
                  }
                }
              }
              for (let year in (visiblecalendar.value as VisibleCalendarType).selections) {
                for (let month in (visiblecalendar.value as VisibleCalendarType).selections[year].months) {
                  for (let week in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks) {
                    for (let day in ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days) {
                      if(((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].readonlystatus === "ENABLE") {
                        ((visiblecalendar.value as VisibleCalendarType).selections[year].months[parseInt(''+month)] as YearMonthClickable<{}>['calendar']).weeks[parseInt(week)].days[day].status = "ENABLE";
                      }
                    }
                  }
                }
              }
            }
          }
        }
        triggerRef(visiblecalendar);
      }
    }
  );
  window.addEventListener('resize', processDimensions, true);
  window.addEventListener('scroll', processDimensions, true);
});

onBeforeUnmount(() => {
  unwatchexcludedates();
  unwatchrangeselectcount();
  unwatchselectionformat();
  unTrackVisibleCalendarMouseMovement();
  unwatchresetcalendarsignal();
  window.removeEventListener('resize', processDimensions, true);
  window.removeEventListener('scroll', processDimensions, true);
});

const rightstyle = computed(() => {
  return (dayindex: number, weekindex: number, day: VisibleCalendarType['selections'][number]['months'][number]['weeks'][number]['days'][number]) => {
    if(
      (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[weekindex].ref
      &&
      (visiblecalendar.value as VisibleCalendarType).current.calendar.weeks[weekindex].ref?.style.backgroundColor === 'blue'
    ) {
      return 'background-color: blue; color: #fff;';
    }
    else {
      if(
        day.day ===
        ((visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).current.year].months[
          (visiblecalendar.value as VisibleCalendarType).current.month
        ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].day 
        &&
        ((visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).current.year].months[
          (visiblecalendar.value as VisibleCalendarType).current.month
        ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].selected === 'SELECTED' 
        &&
        ((visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).current.year].months[
          (visiblecalendar.value as VisibleCalendarType).current.month
        ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].status === 'ENABLE'
      ) {
        return 'background-color:green;color: #fff !important';
      }
      else {
        if(
          day.day ===
          ((visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).current.year].months[
            (visiblecalendar.value as VisibleCalendarType).current.month
          ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].day 
          &&
          ((visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).current.year].months[
            (visiblecalendar.value as VisibleCalendarType).current.month
          ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].selected === 'DESELECTED' 
          &&
          ((visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).current.year].months[
            (visiblecalendar.value as VisibleCalendarType).current.month
          ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].status === 'ENABLE'
        ) {
          return 'color: black !important;text-shadow:none';
        }
        else {
          if(
            day.day ===
            ((visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).current.year].months[
              (visiblecalendar.value as VisibleCalendarType).current.month
            ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].day 
            &&
            ((visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).current.year].months[
              (visiblecalendar.value as VisibleCalendarType).current.month
            ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].selected === 'HIGHLIGHTED' 
            &&
            ((visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).current.year].months[
              (visiblecalendar.value as VisibleCalendarType).current.month
            ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].status === 'ENABLE'
          ) {
            return 'background-color:grey;color: #fff !important';
          }
          else {
            return 'color: gray !important;text-shadow:none';
          }
        }
      }
    }
  }
});

const leftstyle = computed(() => {
  return (dayindex: number, weekindex: number, day: VisibleCalendarType['selections'][number]['months'][number]['weeks'][number]['days'][number]) => {
    if(
      (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[weekindex].ref
      &&
      (visiblecalendar.value as VisibleCalendarType).previous.calendar.weeks[weekindex].ref?.style.backgroundColor === 'blue'
    ) {
      return 'background-color: blue; color: #fff;';
    }
    else {
      if(
        day.day ===
        ((visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).previous.year].months[
          (visiblecalendar.value as VisibleCalendarType).previous.month
        ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].day 
        &&
        ((visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).previous.year].months[
          (visiblecalendar.value as VisibleCalendarType).previous.month
        ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].selected === 'SELECTED' 
        &&
        ((visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).previous.year].months[
          (visiblecalendar.value as VisibleCalendarType).previous.month
        ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].status === 'ENABLE'
      ) {
        return 'background-color:green;color: #fff !important';
      }
      else {
        if(
          day.day ===
          ((visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).previous.year].months[
            (visiblecalendar.value as VisibleCalendarType).previous.month
          ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].day 
          &&
          ((visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).previous.year].months[
            (visiblecalendar.value as VisibleCalendarType).previous.month
          ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].selected === 'DESELECTED' 
          &&
          ((visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).previous.year].months[
            (visiblecalendar.value as VisibleCalendarType).previous.month
          ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].status === 'ENABLE'
        ) {
          return 'color: black !important;text-shadow:none';
        }
        else {
          if(
            day.day ===
            ((visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).previous.year].months[
              (visiblecalendar.value as VisibleCalendarType).previous.month
            ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].day 
            &&
            ((visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).previous.year].months[
              (visiblecalendar.value as VisibleCalendarType).previous.month
            ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].selected === 'HIGHLIGHTED' 
            &&
            ((visiblecalendar.value as VisibleCalendarType).selections[(visiblecalendar.value as VisibleCalendarType).previous.year].months[
              (visiblecalendar.value as VisibleCalendarType).previous.month
            ] as YearMonthClickable<{}>['calendar']).weeks[weekindex].days[dayindex].status === 'ENABLE'
          ) {
            return 'background-color:grey;color: #fff !important';
          }
          else {
            return 'color: gray !important;text-shadow:none';
          }
        }
      }
    }
  }
})
</script>

<template>
  <div 
    :style="from==='DD-MM-YYYY'? 'height: 381.2px;' : 'height: 429.84px;'"
    class="d-block shadow-sm"
  >
    <div class="d-block" style="padding: 7px 2px;">
      <button 
        @keypress.enter="() => { jumptoweekclicked=!jumptoweekclicked; monthoryeardropdownclickcount = 0; monthoryeardropdownclicked = ''; }"
        @click="() => { jumptoweekclicked=!jumptoweekclicked; monthoryeardropdownclickcount = 0; monthoryeardropdownclicked = ''; }"
        class="btn w-100" 
        style="padding:2px;"
        :style="from==='DD-MM-YYYY'? 'background-color: #E8E8E8;' : 'background-color: #f0e68c;'"
      >
        <span class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100">
          <span style="padding-left:5px;">
            <img src="http://localhost:5175/src/components/icons/calendar.png" style="width:1rem;height:1rem;" />
          </span>
          <span class="flex-fill text-center">Jump to week</span>
          <span style="padding-right:5px;">
            <img :src="jumptoweekclicked? 'http://localhost:5175/src/components/icons/up-arrow.png' : 'http://localhost:5175/src/components/icons/down-arrow.png'" style="width:1rem;height:1rem;" />
          </span>
        </span>
      </button>
    </div>
    <div class="d-block position-relative">
      <template v-if="jumptoweekclicked">
        <div 
          class="position-absolute t-0 w-100 p-0 m-0"
          :style="from==='DD-MM-YYYY'? 'height:339px;' : 'height:385.84px;'"
        >
          <JumpToWeek
            @receive:yearandweek="($val) => { jumptoweekclicked = false; determineMonthAndWeekAndShowWeekInCalendar($val); }"
          ></JumpToWeek>
        </div>
      </template>
      <div
        class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
      >
        <div class="flex-w-50 align-self-stretch" style="padding: 0 2px">
          <div class="d-block">
            <div
              style="padding: 7.5px 0"
              class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
            >
              <div class="flex-grow-0 flex-shrink-0 align-self-stretch">
                <a
                  @keypress.enter="clickPrevious()"
                  @click="clickPrevious()"
                  :class="[
                    (
                      (visiblecalendar as VisibleCalendarType).current.year === (visiblecalendar as VisibleCalendarType).previous.year
                      &&
                      (visiblecalendar as VisibleCalendarType).previous.year === (visiblecalendar as VisibleCalendarType).last.year
                      &&
                      (visiblecalendar as VisibleCalendarType).previous.month === (visiblecalendar as VisibleCalendarType).last.month
                    )?
                    '' : 'cursor-pointer'
                  ]"
                  style="height: 30px; width: 30px; border-radius: 50%;color: #fff;"
                  :style="
                    (
                      (visiblecalendar as VisibleCalendarType).current.year === (visiblecalendar as VisibleCalendarType).previous.year
                      &&
                      (visiblecalendar as VisibleCalendarType).previous.year === (visiblecalendar as VisibleCalendarType).last.year
                      &&
                      (visiblecalendar as VisibleCalendarType).previous.month === (visiblecalendar as VisibleCalendarType).last.month
                    )?
                    'background-color: #E8E8E8;'
                    :
                    'background-color: green;'
                  "
                  class="flex-box align-items-center justify-content-center underline-none text-center"
                >
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    style="height: 20px;width: 20px;color: currentcolor;stroke: currentcolor;fill: currentcolor;"
                  >
                    <path
                      d="M20.943 23.057l-7.057-7.057c0 0 7.057-7.057 7.057-7.057 0.52-0.52 0.52-1.365 0-1.885s-1.365-0.52-1.885 0l-8 8c-0.521 0.521-0.521 1.365 0 1.885l8 8c0.52 0.52 1.365 0.52 1.885 0s0.52-1.365 0-1.885z"
                    ></path>
                  </svg>
                </a>
              </div>
              <div class="flex-fill align-self-stretch">
                <div
                  class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
                >
                  <div class="flex-w-50 align-self-stretch" style="padding-left: 5px;padding-right:5px;">
                    <button 
                      @keypress.enter="() => { monthoryeardropdownclickcount = (monthoryeardropdownclicked !== 'MONTH-PREVIOUS' && monthoryeardropdownclickcount === 1)? 0 : monthoryeardropdownclickcount; monthoryeardropdownclicked = 'MONTH-PREVIOUS'; monthoryeardropdownclickcount++; monthoryeardropdownclickcount = (monthoryeardropdownclickcount === 2)? 0 : monthoryeardropdownclickcount; }"
                      @click="() => { monthoryeardropdownclickcount = (monthoryeardropdownclicked !== 'MONTH-PREVIOUS' && monthoryeardropdownclickcount === 1)? 0 : monthoryeardropdownclickcount; monthoryeardropdownclicked = 'MONTH-PREVIOUS'; monthoryeardropdownclickcount++; monthoryeardropdownclickcount = (monthoryeardropdownclickcount === 2)? 0 : monthoryeardropdownclickcount; }"
                      class="w-100 month-or-year-link btn cursor-pointer"
                      style="padding: 2px 0"
                    >
                      <span class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100">
                        <span class="flex-fill text-center font-family">
                          {{ months[(visiblecalendar as VisibleCalendarType).previous.month] }}
                        </span>
                        <span style="padding-right: 10px;">
                          <img 
                            :src="(monthoryeardropdownclicked === 'MONTH-PREVIOUS')? (monthoryeardropdownclickcount === 0? 'http://localhost:5175/src/components/icons/down-arrow.png' : 'http://localhost:5175/src/components/icons/up-arrow.png') : 'http://localhost:5175/src/components/icons/down-arrow.png'" 
                            style="width:10px; height:10px;"
                          />
                        </span>
                      </span>
                    </button>
                  </div>
                  <div class="flex-w-50 align-self-stretch">
                    <button 
                      @keypress.enter="() => { monthoryeardropdownclickcount = (monthoryeardropdownclicked !== 'YEAR-PREVIOUS' && monthoryeardropdownclickcount === 1)? 0 : monthoryeardropdownclickcount; monthoryeardropdownclicked = 'YEAR-PREVIOUS'; monthoryeardropdownclickcount++; monthoryeardropdownclickcount = (monthoryeardropdownclickcount === 2)? 0 : monthoryeardropdownclickcount; }"
                      @click="() => { monthoryeardropdownclickcount = (monthoryeardropdownclicked !== 'YEAR-PREVIOUS' && monthoryeardropdownclickcount === 1)? 0 : monthoryeardropdownclickcount; monthoryeardropdownclicked = 'YEAR-PREVIOUS'; monthoryeardropdownclickcount++; monthoryeardropdownclickcount = (monthoryeardropdownclickcount === 2)? 0 : monthoryeardropdownclickcount; }"
                      class="w-100 month-or-year-link btn cursor-pointer"
                      style="padding: 2px 0"
                    >
                      <span class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100">
                        <span class="flex-fill text-center font-family">
                          {{ (visiblecalendar as VisibleCalendarType).previous.year }}
                        </span>
                        <span style="padding-right: 10px;">
                          <img 
                            :src="(monthoryeardropdownclicked === 'YEAR-PREVIOUS')? (monthoryeardropdownclickcount === 0? 'http://localhost:5175/src/components/icons/down-arrow.png' : 'http://localhost:5175/src/components/icons/up-arrow.png') : 'http://localhost:5175/src/components/icons/down-arrow.png'" 
                            style="width:10px;height:10px;" 
                          />
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="d-block position-relative">
              <template v-if="monthoryeardropdownclicked === 'MONTH-PREVIOUS' || monthoryeardropdownclicked === 'YEAR-PREVIOUS'">
                <template v-if="monthoryeardropdownclicked === 'MONTH-PREVIOUS'">
                  <template v-if="monthoryeardropdownclickcount === 1">
                    <div 
                      style="background-color: #fff;" 
                      class="w-100 position-absolute l-0 t-0"
                      :style="from === 'DD-MM-YYYY'? 'height: 293px;' : 'height: 340.9px;'"
                    >
                      <DropDownMonthPicker
                        :month="(visiblecalendar as VisibleCalendarType).previous.month" 
                        :year="(visiblecalendar as VisibleCalendarType).previous.year"
                        :counterpartmonth="(visiblecalendar as VisibleCalendarType).current.month"
                        :counterpartyear="(visiblecalendar as VisibleCalendarType).current.year"
                        iam="PREVIOUS"
                      ></DropDownMonthPicker>
                    </div>
                  </template>
                </template>
                <template v-else>
                  <template v-if="monthoryeardropdownclickcount === 1">
                    <div 
                      style="background-color: #fff;" 
                      class="w-100 position-absolute l-0 t-0"
                      :style="from === 'DD-MM-YYYY'? 'height: 293px;' : 'height: 340.9px;'"
                    >
                      <DropDownYearPicker
                        from="YEAR-PREVIOUS"
                        :currentyear="(visiblecalendar as VisibleCalendarType).previous.year"
                        :rowlimit="4"
                        :collimit="3" 
                        @receive:year="($val: number) => {}"
                      ></DropDownYearPicker>
                    </div>
                  </template>
                </template>
              </template>
            </div>
          </div>
          <template v-if="((from === 'DD-MM-YYYY' && selectionformat === 'RANGE' && (excludedates !== undefined && excludedates)) || (from === 'DD-MM-YYYY' && selectionformat === 'MULTIPLE-OR-SINGLE') || (from === 'DAYS-MONTHS-YEARS' && selectionformat === 'MULTIPLE-OR-SINGLE'))">
            <div
              class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center w-100"
            >
              <div
                class="flex-w-12-dot-5 align-self-stretch"
              ></div>
              <div class="flex-fill align-self-stretch">
                <div
                  class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center w-100"
                >
                  <template v-if="previousyearandmonthinselections">
                    <div
                      class="flex-w-14-dot-285714"
                      v-for="(ty, tyindex) in (visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).previous.year].ty"
                      :key="'ty-'+(visiblecalendar as VisibleCalendarType).previous.month +'-'+(visiblecalendar as VisibleCalendarType).previous.year+'-'+tyindex"
                    >
                      <div class="d-block m-0" style="padding: 3px 0;">
                        <div class="d-block m-0 p-0" style="font-size:0.8rem;">
                          TY
                        </div>
                        <div class="d-block p-0 m-0">
                          <input
                            v-model="(visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).previous.year].ty[tyindex].checked"
                            class="m-0 p-0 border-black  w-100"
                            :disabled="(visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).previous.year].ty[tyindex].status === 'ENABLE'? false : true"
                            type="checkbox"
                            style="float: left; line-height: 1.2rem; height: 1.2rem;"
                            @change="handleTyTmClicked(
                              'TY', 
                              tyindex, 
                              (visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).previous.year].ty[tyindex].checked,
                              (visiblecalendar as VisibleCalendarType).previous.year
                            )"
                          />
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div
                      class="flex-w-14-dot-285714"
                      v-for="(ty, tyindex) in (visiblecalendar as VisibleCalendarType).previous.ty[(visiblecalendar as VisibleCalendarType).previous.year]"
                      :key="'ty-'+(visiblecalendar as VisibleCalendarType).previous.month +'-'+(visiblecalendar as VisibleCalendarType).previous.year+'-'+tyindex"
                    >
                      <div class="d-block m-0" style="padding: 3px 0;">
                        <div class="d-block m-0 p-0" style="font-size:0.8rem;">
                          TY
                        </div>
                        <div class="d-block p-0 m-0">
                          <input
                            v-model="(visiblecalendar as VisibleCalendarType).previous.ty[(visiblecalendar as VisibleCalendarType).previous.year][tyindex].checked"
                            class="m-0 p-0 border-black w-100"
                            :disabled="((selectionformat==='RANGE' && excludedates) || (from === 'DAYS-MONTHS-YEARS' && selectionformat === 'MULTIPLE-OR-SINGLE'))? true : (visiblecalendar as VisibleCalendarType).previous.ty[(visiblecalendar as VisibleCalendarType).previous.year][tyindex].status === 'ENABLE'? false : true"
                            type="checkbox"
                            style="float: left; line-height: 1.2rem; height: 1.2rem;"
                            @change="handleTyTmClicked(
                              'TY',
                              tyindex, 
                              (visiblecalendar as VisibleCalendarType).previous.ty[(visiblecalendar as VisibleCalendarType).previous.year][tyindex].checked,
                              (visiblecalendar as VisibleCalendarType).previous.year
                            )"
                          />
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
                <div
                  class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center w-100"
                >
                  <div
                    class="flex-w-14-dot-285714"
                    v-for="(tm, tmindex) in ((visiblecalendar as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']).tm"
                    :key="'tm-'+(visiblecalendar as VisibleCalendarType).previous.month +'-'+(visiblecalendar as VisibleCalendarType).previous.year+'-'+tmindex"
                  >
                    <div class="d-block" style="padding: 5px 0 8px 0;">
                      <div class="d-block m-0 p-0" style="font-size:0.8rem;">
                        TM
                      </div>
                      <div class="d-block p-0 m-0">
                        <template v-if="previousyearandmonthinselections">
                          <input
                            v-model="((visiblecalendar as VisibleCalendarType).selections[
                              (visiblecalendar as VisibleCalendarType).previous.year
                            ].months[
                              (visiblecalendar as VisibleCalendarType).previous.month
                            ] as YearMonthClickable<{}>['calendar']).tm[tmindex].checked
                            "
                            :disabled="((visiblecalendar as VisibleCalendarType).selections[
                              (visiblecalendar as VisibleCalendarType).previous.year
                            ].months[
                              (visiblecalendar as VisibleCalendarType).previous.month
                            ] as YearMonthClickable<{}>['calendar']).tm[tmindex].status === 'ENABLE'? false : true"
                            class="m-0 p-0 border-black  w-100"
                            type="checkbox"
                            style="float: left; line-height: 1.2rem; height: 1.2rem;"
                            @change="handleTyTmClicked(
                              'TM-PREVIOUS-SELECTIONS', 
                              tmindex, 
                              ((visiblecalendar as VisibleCalendarType).selections[
                                (visiblecalendar as VisibleCalendarType).previous.year
                              ].months[
                                (visiblecalendar as VisibleCalendarType).previous.month
                              ] as YearMonthClickable<{}>['calendar']).tm[tmindex].checked,
                              (visiblecalendar as VisibleCalendarType).previous.year,
                              (visiblecalendar as VisibleCalendarType).previous.month
                            )"
                          />
                        </template>
                        <template v-else>
                          <input
                            v-model="((visiblecalendar as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']).tm[tmindex].checked"
                            class="m-0 p-0 border-black  w-100"
                            :disabled="((selectionformat==='RANGE' && excludedates) || (from === 'DAYS-MONTHS-YEARS' && selectionformat === 'MULTIPLE-OR-SINGLE'))? true : ((visiblecalendar as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']).tm[tmindex].status === 'ENABLE'? false : true"
                            type="checkbox"
                            style="float: left; line-height: 1.2rem; height: 1.2rem;"
                            @change="handleTyTmClicked(
                              'TM-PREVIOUS',
                              tmindex, 
                              ((visiblecalendar as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']).tm[tmindex].checked,
                              (visiblecalendar as VisibleCalendarType).previous.year,
                              (visiblecalendar as VisibleCalendarType).previous.month
                            )"
                          />
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div
            style="padding: 5px 0 0 0;"
            class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center w-100"
          >
            <template v-if="((props.excludedates!==undefined && props.excludedates) || props.selectionformat === 'MULTIPLE-OR-SINGLE')">
              <div
                class="flex-w-12-dot-5 overflow-hidden"
              ></div>
            </template>
            <div
              :class="((props.excludedates!==undefined && props.excludedates) || props.selectionformat === 'MULTIPLE-OR-SINGLE')? 'flex-w-12-dot-5' : 'flex-w-14-dot-285714'"
              class="overflow-hidden"
              v-for="(_day, dayindex) in props.isoweek? isodays : days"
              :key="'dayname' + dayindex"
            >
              {{ props.isoweek? isodays[dayindex] : days[dayindex] }}
            </div>
          </div>
          <div
            style="background-color: #E8E8E8;"
            id="previousvisiblecalendarbox"
            class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center w-100"
          >
            <template v-for="(week, weekindex) in (visiblecalendar as VisibleCalendarType).previous.calendar.weeks" :key="weekindex+'xss'">
              <div class="flex-w-100">
                <div
                  :ref="($el) => assignWeekRef($el as HTMLDivElement, weekindex, 'PREVIOUS')"
                  style="background-color: transparent;"
                  class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center"
                >
                  <template v-if="((props.excludedates !== undefined && props.excludedates) || props.selectionformat === 'MULTIPLE-OR-SINGLE')">
                    <div
                      class="flex-w-12-dot-5 m-0 align-self-stretch" style="padding:0 2px 0 0;"
                    >
                      <div
                        class="m-0 w-100 flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
                        style="float: left;"
                        :style="
                          (from === 'DD-MM-YYYY' && selectionformat === 'MULTIPLE-OR-SINGLE')?
                          'padding:0.068rem 0;line-height: 1.836em; height: 1.836em;'
                          : (
                            (from === 'DD-MM-YYYY')?
                            (
                              (props.excludedates!==undefined && props.excludedates && selectionformat === 'RANGE')?
                              'padding:0.068rem 0;line-height: 1.836em; height: 1.836em;'
                              :
                              'padding:0;line-height: 2.73em; height: 2.73em;'
                            )
                            :
                            'padding:0;line-height: 2.3rem; height: 2.3rem;'
                          )
                        "
                      >
                        <template v-if="previousyearandmonthinselections">
                          <input v-model="(
                              (visiblecalendar as VisibleCalendarType).selections[
                                (visiblecalendar as VisibleCalendarType).previous.year
                              ].months[
                                (visiblecalendar as VisibleCalendarType).previous.month
                              ] as YearMonthClickable<{}>['calendar']
                            ).weeks[weekindex].checked"
                            class="m-0 p-0 border-black flex-w-100 h-100"
                            :key="(visiblecalendar as VisibleCalendarType).previous.year+'_'+(visiblecalendar as VisibleCalendarType).previous.month+'_'+weekindex"
                            @change="weekCheckboxClicked((
                              (visiblecalendar as VisibleCalendarType).selections[
                                (visiblecalendar as VisibleCalendarType).previous.year
                              ].months[
                                (visiblecalendar as VisibleCalendarType).previous.month
                              ] as YearMonthClickable<{}>['calendar']
                            ).weeks[weekindex].checked, ''+weekindex, 'PREVIOUS')"
                            :disabled="weekHasEnable((
                              (visiblecalendar as VisibleCalendarType).selections[
                                (visiblecalendar as VisibleCalendarType).previous.year
                              ].months[
                                (visiblecalendar as VisibleCalendarType).previous.month
                              ] as YearMonthClickable<{}>['calendar']
                            ).weeks[weekindex])"
                            type="checkbox"
                            style="float: left;"
                          />
                        </template>
                        <template v-else>
                          <input v-model="(
                              (visiblecalendar as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                            ).weeks[weekindex].checked"
                            class="m-0 p-0 border-black  flex-w-100 h-100"
                            :key="(visiblecalendar as VisibleCalendarType).previous.year+'_'+(visiblecalendar as VisibleCalendarType).previous.month+'_'+weekindex"
                            @change="weekCheckboxClicked((
                              (visiblecalendar as VisibleCalendarType).previous.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                            ).weeks[weekindex].checked, ''+weekindex,'PREVIOUS')"
                            :disabled="weekHasEnable(week)"
                            type="checkbox"
                            style="float: left;"
                          />
                        </template>
                      </div>
                    </div>
                  </template>
                  <div
                    :class="((props.excludedates!==undefined && props.excludedates) || props.selectionformat === 'MULTIPLE-OR-SINGLE')? 'flex-w-12-dot-5' : 'flex-w-14-dot-285714'"
                    class="align-self-stretch"
                    v-for="(day, dayindex) in week.days"
                    :key="
                      'dayprev' +
                      dayindex +
                      'weekprev' +
                      weekindex +
                      'monthprev' +
                      (visiblecalendar as VisibleCalendarType).previous.month +
                      'yearprev' +
                      (visiblecalendar as VisibleCalendarType).previous.year
                    "
                    style="float: left;"
                    :style="
                      (from === 'DD-MM-YYYY' && selectionformat === 'MULTIPLE-OR-SINGLE')?
                      'line-height: 1.836em; height: 1.836em;'
                      : (
                        (from === 'DD-MM-YYYY')?
                        (
                          (props.excludedates!==undefined && props.excludedates && selectionformat === 'RANGE')?
                          'line-height: 1.836em; height: 1.836em;'
                          :
                          'line-height: 2.73em; height: 2.73em;'
                        )
                        :
                        'line-height: 2.34rem; height: 2.34rem;'
                      )
                    "
                  >
                    <label
                      :ref="
                        (el) => assignRef((visiblecalendar as VisibleCalendarType).previous, el as HTMLLabelElement, weekindex as number, dayindex as number)
                      "
                      @keypress.enter="handleDateClick(day)"
                      @click="handleDateClick(day)"
                      :disabled="day.status === 'DISABLE'? true : false"
                      :class="[day.status === 'DISABLE'?'':'cursor-pointer']"
                      class="w-100"
                      style="float: left;outline: 1px solid #fff;"
                      :style="
                        (from === 'DD-MM-YYYY' && selectionformat === 'MULTIPLE-OR-SINGLE')?
                        'line-height: 1.836em; height: 1.836em;'
                        : (
                          (from === 'DD-MM-YYYY')?
                          (
                            (props.excludedates!==undefined && props.excludedates && selectionformat === 'RANGE')?
                            'line-height: 1.836em; height: 1.836em;'
                            :
                            'line-height: 2.73em; height: 2.73em;'
                          )
                          :
                          'line-height: 2.34rem; height: 2.34rem;'
                        )
                      "
                    >
                      <input
                        @keypress.enter.stop=""
                        @click.stop=""
                        :disabled="day.status === 'DISABLE'? true : false"
                        type="checkbox"
                        class="position-absolute d-none"
                        style="pointer-events: auto;"
                      />
                      <template v-if="previousyearandmonthinselections">
                        <div
                          :style="
                            (from === 'DD-MM-YYYY' && selectionformat === 'MULTIPLE-OR-SINGLE')?
                            'line-height: 1.836em; height: 1.836em;'
                            : (
                              (from === 'DD-MM-YYYY')?
                              (
                                (props.excludedates!==undefined && props.excludedates && selectionformat === 'RANGE')?
                                'line-height: 1.836em; height: 1.836em;'
                                :
                                'line-height: 2.73em; height: 2.73em;'
                              )
                              :
                              'line-height: 2.34rem; height: 2.34rem;'
                            )
                          "
                        >
                          <span
                            class="h-100 font-family text-center d-block letter-spacing"
                            style="font-size: 1rem;"
                            :style="leftstyle(dayindex, weekindex, day)"
                          >
                            {{ day.day }}
                          </span>
                        </div>
                      </template>
                      <template v-else>
                        <div
                          :style="
                            (from === 'DD-MM-YYYY' && selectionformat === 'MULTIPLE-OR-SINGLE')?
                            'line-height: 1.836em; height: 1.836em;'
                            : (
                              (from === 'DD-MM-YYYY')?
                              (
                                (props.excludedates!==undefined && props.excludedates && selectionformat === 'RANGE')?
                                'line-height: 1.836em; height: 1.836em;'
                                :
                                'line-height: 2.73em; height: 2.73em;'
                              )
                              :
                              'line-height: 2.34rem; height: 2.34rem;'
                            )
                          "
                        >
                          <span
                            class="h-100 font-family text-center d-block letter-spacing"
                            style="font-size: 1rem;"
                            :style="
                              ((visiblecalendar as VisibleCalendarType).previous.calendar.weeks[weekindex].ref?.style.backgroundColor === 'blue')?
                              'background-color: blue; color: #fff;'
                              : (
                                day.status === 'DISABLE'? 
                                'color: gray !important;text-shadow:none'
                                : 'color: black !important;text-shadow:none'
                              )
                            "
                          >
                            {{ day.day }}
                          </span>
                        </div>
                      </template>
                    </label>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="flex-w-50 align-self-stretch" style="padding: 0 2px">
          <div class="d-block">
            <div
              style="padding: 7.5px 0"
              class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
            >
              <div class="flex-fill align-self-stretch">
                <div
                  class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
                >
                  <div class="flex-w-50 align-self-stretch">
                    <button 
                      @keypress.enter="() => { monthoryeardropdownclickcount = (monthoryeardropdownclicked !== 'MONTH-CURRENT' && monthoryeardropdownclickcount === 1)? 0 : monthoryeardropdownclickcount; monthoryeardropdownclicked = 'MONTH-CURRENT'; monthoryeardropdownclickcount++; monthoryeardropdownclickcount = (monthoryeardropdownclickcount === 2)? 0 : monthoryeardropdownclickcount; }"
                      @click="() => { monthoryeardropdownclickcount = (monthoryeardropdownclicked !== 'MONTH-CURRENT' && monthoryeardropdownclickcount === 1)? 0 : monthoryeardropdownclickcount; monthoryeardropdownclicked = 'MONTH-CURRENT'; monthoryeardropdownclickcount++; monthoryeardropdownclickcount = (monthoryeardropdownclickcount === 2)? 0 : monthoryeardropdownclickcount; }"
                      class="w-100 month-or-year-link btn cursor-pointer"
                      style="padding: 2px 0"
                    >
                      <span class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100">
                        <span class="flex-fill text-center font-family">
                          {{ months[(visiblecalendar as VisibleCalendarType).current.month] }}
                        </span>
                        <span style="padding-right: 10px;">
                          <img 
                            :src="(monthoryeardropdownclicked === 'MONTH-CURRENT')? (monthoryeardropdownclickcount === 0? 'http://localhost:5175/src/components/icons/down-arrow.png' : 'http://localhost:5175/src/components/icons/up-arrow.png') : 'http://localhost:5175/src/components/icons/down-arrow.png'" 
                            style="width:10px;height:10px;"
                          />
                        </span>
                      </span>
                    </button>
                  </div>
                  <div class="flex-w-50 align-self-stretch" style="padding-left:5px;padding-right: 5px;">
                    <button 
                      @keypress.enter="() => { monthoryeardropdownclickcount = (monthoryeardropdownclicked !== 'YEAR-CURRENT' && monthoryeardropdownclickcount === 1)? 0 : monthoryeardropdownclickcount; monthoryeardropdownclicked = 'YEAR-CURRENT'; monthoryeardropdownclickcount++; monthoryeardropdownclickcount = (monthoryeardropdownclickcount === 2)? 0 : monthoryeardropdownclickcount; }"
                      @click="() => { monthoryeardropdownclickcount = (monthoryeardropdownclicked !== 'YEAR-CURRENT' && monthoryeardropdownclickcount === 1)? 0 : monthoryeardropdownclickcount; monthoryeardropdownclicked = 'YEAR-CURRENT'; monthoryeardropdownclickcount++; monthoryeardropdownclickcount = (monthoryeardropdownclickcount === 2)? 0 : monthoryeardropdownclickcount; }"
                      class="w-100 month-or-year-link btn cursor-pointer"
                      style="padding: 2px 0"
                    >
                      <span class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100">
                        <span class="flex-fill text-center font-family">
                          {{ (visiblecalendar as VisibleCalendarType).current.year }}
                        </span>
                        <span style="padding-right: 10px;">
                          <img 
                            :src="(monthoryeardropdownclicked === 'YEAR-CURRENT')? (monthoryeardropdownclickcount === 0? 'http://localhost:5175/src/components/icons/down-arrow.png' : 'http://localhost:5175/src/components/icons/up-arrow.png') : 'http://localhost:5175/src/components/icons/down-arrow.png'" 
                            style="width:10px;height:10px;"
                          />
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div class="flex-grow-0 flex-shrink-0 align-self-stretch">
                <a
                  @keypress.enter="clickNext()"
                  @click="clickNext()"
                  :class="[
                    (
                      (visiblecalendar as VisibleCalendarType).current.year === (visiblecalendar as VisibleCalendarType).previous.year
                      &&
                      (visiblecalendar as VisibleCalendarType).current.year === (visiblecalendar as VisibleCalendarType).first.year
                      &&
                      (visiblecalendar as VisibleCalendarType).current.month === (visiblecalendar as VisibleCalendarType).first.month
                    )? 
                    '' : 'cursor-pointer'
                  ]"
                  style="height: 30px; width: 30px; border-radius: 50%;color: #fff;"
                  :style="
                    (
                      (visiblecalendar as VisibleCalendarType).current.year === (visiblecalendar as VisibleCalendarType).previous.year
                      &&
                      (visiblecalendar as VisibleCalendarType).current.year === (visiblecalendar as VisibleCalendarType).first.year
                      &&
                      (visiblecalendar as VisibleCalendarType).current.month === (visiblecalendar as VisibleCalendarType).first.month
                    )?
                    'background-color: #E8E8E8;'
                    :
                    'background-color: green;'
                  "
                  class="flex-box align-items-center justify-content-center underline-none text-center"
                >
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    style="height: 20px;width: 20px;color: currentcolor;stroke: currentcolor;fill: currentcolor;"
                  >
                    <path
                      d="M12.943 24.943l8-8c0.521-0.521 0.521-1.365 0-1.885l-8-8c-0.52-0.52-1.365-0.52-1.885 0s-0.52 1.365 0 1.885l7.057 7.057c0 0-7.057 7.057-7.057 7.057-0.52 0.52-0.52 1.365 0 1.885s1.365 0.52 1.885 0z"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
            <div class="d-block position-relative">
              <template v-if="monthoryeardropdownclicked === 'MONTH-CURRENT' || monthoryeardropdownclicked === 'YEAR-CURRENT'">
                <template v-if="monthoryeardropdownclicked === 'MONTH-CURRENT'">
                  <template v-if="monthoryeardropdownclickcount === 1">
                    <div
                      style="background-color: #fff;"
                      class="w-100 position-absolute l-0 t-0"
                      :style="from === 'DD-MM-YYYY'? 'height: 293px;' : 'height: 340.9px;'"
                    >
                      <DropDownMonthPicker 
                        :month="(visiblecalendar as VisibleCalendarType).current.month" 
                        :year="(visiblecalendar as VisibleCalendarType).current.year"
                        :counterpartmonth="(visiblecalendar as VisibleCalendarType).previous.month"
                        :counterpartyear="(visiblecalendar as VisibleCalendarType).previous.year"
                        iam="CURRENT"
                      ></DropDownMonthPicker>
                    </div>
                  </template>
                </template>
                <template v-else>
                  <template v-if="monthoryeardropdownclickcount === 1">
                    <div
                      style="background-color: #fff;"
                      class="w-100 position-absolute l-0 t-0"
                      :style="from === 'DD-MM-YYYY'? 'height: 293px;' : 'height: 340.9px;'"
                    >
                      <DropDownYearPicker
                        from="YEAR-CURRENT"
                        :currentyear="(visiblecalendar as VisibleCalendarType).current.year"
                        :rowlimit="4" 
                        :collimit="3" 
                        @receive:year="($val: number) => { 
                        }"
                      ></DropDownYearPicker>
                    </div>
                  </template>
                </template>
              </template>
            </div>
          </div>
          <template v-if="((from === 'DD-MM-YYYY' && selectionformat === 'RANGE' && (excludedates !== undefined && excludedates)) || (from === 'DD-MM-YYYY' && selectionformat === 'MULTIPLE-OR-SINGLE') || (from === 'DAYS-MONTHS-YEARS' && selectionformat === 'MULTIPLE-OR-SINGLE'))">
            <div
              class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center w-100"
            >
              <div
                class="flex-w-12-dot-5 align-self-stretch"
              ></div>
              <div class="flex-fill align-self-stretch">
                <div
                  class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center w-100"
                >
                  <template v-if="currentyearandmonthinselections">
                    <div
                      class="flex-w-14-dot-285714"
                      v-for="(ty, tyindex) in (visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).current.year].ty"
                      :key="'ty-'+(visiblecalendar as VisibleCalendarType).current.month +'-'+(visiblecalendar as VisibleCalendarType).current.year+'-'+tyindex"
                    >
                      <div class="d-block m-0" style="padding: 3px 0;">
                        <div class="d-block m-0 p-0" style="font-size:0.8rem;">
                          TY
                        </div>
                        <div class="d-block p-0 m-0">
                          <input
                            v-model="(visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).current.year].ty[tyindex].checked"
                            class="m-0 p-0 border-black  w-100"
                            :disabled="(visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).current.year].ty[tyindex].status === 'ENABLE'? false : true"
                            type="checkbox"
                            style="float: left; line-height: 1.2rem; height: 1.2rem;"
                            @change="handleTyTmClicked(
                              'TY', 
                              tyindex, 
                              (visiblecalendar as VisibleCalendarType).selections[(visiblecalendar as VisibleCalendarType).current.year].ty[tyindex].checked,
                              (visiblecalendar as VisibleCalendarType).current.year
                            )"
                          />
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div
                      class="flex-w-14-dot-285714"
                      v-for="(ty, tyindex) in (visiblecalendar as VisibleCalendarType).current.ty[(visiblecalendar as VisibleCalendarType).current.year]"
                      :key="'ty-'+(visiblecalendar as VisibleCalendarType).current.month +'-'+(visiblecalendar as VisibleCalendarType).current.year+'-'+tyindex"
                    >
                      <div class="d-block m-0" style="padding: 3px 0;">
                        <div class="d-block m-0 p-0" style="font-size:0.8rem;">
                          TY
                        </div>
                        <div class="d-block p-0 m-0">
                          <input
                            v-model="(visiblecalendar as VisibleCalendarType).current.ty[(visiblecalendar as VisibleCalendarType).current.year][tyindex].checked"
                            class="m-0 p-0 border-black  w-100"
                            :disabled="((selectionformat==='RANGE' && excludedates) || (from === 'DAYS-MONTHS-YEARS' && selectionformat === 'MULTIPLE-OR-SINGLE'))? true : (visiblecalendar as VisibleCalendarType).current.ty[(visiblecalendar as VisibleCalendarType).current.year][tyindex].status === 'ENABLE'? false : true"
                            type="checkbox"
                            style="float: left; line-height: 1.2rem; height: 1.2rem;"
                            @change="handleTyTmClicked(
                              'TY', 
                              tyindex, 
                              (visiblecalendar as VisibleCalendarType).current.ty[(visiblecalendar as VisibleCalendarType).current.year][tyindex].checked,
                              (visiblecalendar as VisibleCalendarType).current.year
                            )"
                          />
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
                <div
                  class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center w-100"
                >
                  <div
                    class="flex-w-14-dot-285714"
                    v-for="(tm, tmindex) in ((visiblecalendar as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']).tm"
                    :key="'tm-'+(visiblecalendar as VisibleCalendarType).current.month +'-'+(visiblecalendar as VisibleCalendarType).current.year+'-'+tmindex"
                  >
                    <div class="d-block" style="padding: 5px 0 8px 0;">
                      <div class="d-block m-0 p-0" style="font-size:0.8rem;">
                        TM
                      </div>
                      <div class="d-block p-0 m-0">
                        <template v-if="currentyearandmonthinselections">
                          <input
                            v-model="((visiblecalendar as VisibleCalendarType).selections[
                              (visiblecalendar as VisibleCalendarType).current.year
                            ].months[
                              (visiblecalendar as VisibleCalendarType).current.month
                            ] as YearMonthClickable<{}>['calendar']).tm[tmindex].checked
                            "
                            :disabled="((visiblecalendar as VisibleCalendarType).selections[
                              (visiblecalendar as VisibleCalendarType).current.year
                            ].months[
                              (visiblecalendar as VisibleCalendarType).current.month
                            ] as YearMonthClickable<{}>['calendar']).tm[tmindex].status === 'ENABLE'? false : true"
                            class="m-0 p-0 border-black  w-100"
                            type="checkbox"
                            style="float: left; line-height: 1.2rem; height: 1.2rem;"
                            @change="handleTyTmClicked(
                              'TM-CURRENT-SELECTIONS', 
                              tmindex, 
                              ((visiblecalendar as VisibleCalendarType).selections[
                                (visiblecalendar as VisibleCalendarType).current.year
                              ].months[
                                (visiblecalendar as VisibleCalendarType).current.month
                              ] as YearMonthClickable<{}>['calendar']).tm[tmindex].checked,
                              (visiblecalendar as VisibleCalendarType).current.year,
                              (visiblecalendar as VisibleCalendarType).current.month
                            )"
                          />
                        </template>
                        <template v-else>
                          <input
                            v-model="((visiblecalendar as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']).tm[tmindex].checked"
                            class="m-0 p-0 border-black  w-100"
                            :disabled="((selectionformat==='RANGE' && excludedates) || (from === 'DAYS-MONTHS-YEARS' && selectionformat === 'MULTIPLE-OR-SINGLE'))? true : ((visiblecalendar as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']).tm[tmindex].status === 'ENABLE'? false : true"
                            type="checkbox"
                            style="float: left; line-height: 1.2rem; height: 1.2rem;"
                            @change="handleTyTmClicked(
                              'TM-CURRENT',
                              tmindex, 
                              ((visiblecalendar as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']).tm[tmindex].checked,
                              (visiblecalendar as VisibleCalendarType).current.year,
                              (visiblecalendar as VisibleCalendarType).current.month
                            )"
                          />
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div
            style="padding: 5px 0 0 0;"
            class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center w-100"
          >
            <template v-if="((props.excludedates!==undefined && props.excludedates) || props.selectionformat === 'MULTIPLE-OR-SINGLE')">
              <div
                class="flex-w-12-dot-5 overflow-hidden"
              ></div>
            </template>
            <div
              :class="((props.excludedates!==undefined && props.excludedates) || props.selectionformat === 'MULTIPLE-OR-SINGLE')? 'flex-w-12-dot-5' : 'flex-w-14-dot-285714'"
              class="overflow-hidden"
              v-for="(_day, dayindex) in props.isoweek? isodays : days"
              :key="'dayname-' + dayindex"
              style="border-radius: 4px"
            >
              {{ props.isoweek? isodays[dayindex] : days[dayindex] }}
            </div>
          </div>
          <div
            style="background-color: #E8E8E8;"
            id="currentvisiblecalendarbox"
            class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center w-100"
          >
            <template v-for="(week, weekindex) in (visiblecalendar as VisibleCalendarType).current.calendar.weeks" :key="weekindex+'daa'">
              <div class="flex-w-100">
                <div
                  :ref="($el) => assignWeekRef($el as HTMLDivElement, weekindex, 'CURRENT')"
                  style="background-color: transparent;"
                  class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center"
                >
                  <template v-if="((props.excludedates!==undefined && props.excludedates) || props.selectionformat === 'MULTIPLE-OR-SINGLE')">
                    <div
                      class="flex-w-12-dot-5 m-0 align-self-stretch" style="padding:0 2px 0 0;"
                    >
                      <div
                        class="m-0 w-100 flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
                        style="float: left;"
                        :style="
                          (from === 'DD-MM-YYYY' && selectionformat === 'MULTIPLE-OR-SINGLE')?
                          'padding:0.068rem 0;line-height: 1.836em; height: 1.836em;'
                          : (
                            (from === 'DD-MM-YYYY')?
                            (
                              (props.excludedates!==undefined && props.excludedates && selectionformat === 'RANGE')?
                              'padding:0.068rem 0;line-height: 1.836em; height: 1.836em;'
                              :
                              'padding:0;line-height: 2.73em; height: 2.73em;'
                            )
                            :
                            'padding:0;line-height: 2.3rem; height: 2.3rem;'
                          )
                        "
                      >
                        <template v-if="currentyearandmonthinselections">
                          <input v-model="(
                              (visiblecalendar as VisibleCalendarType).selections[
                                (visiblecalendar as VisibleCalendarType).current.year
                              ].months[
                                (visiblecalendar as VisibleCalendarType).current.month
                              ] as YearMonthClickable<PositionTrackerType>['calendar']
                            ).weeks[weekindex].checked"
                            class="m-0 p-0 border-black  flex-w-100 h-100"
                            :key="(visiblecalendar as VisibleCalendarType).current.year+'_'+(visiblecalendar as VisibleCalendarType).current.month+'_'+weekindex"
                            @change="weekCheckboxClicked((
                              (visiblecalendar as VisibleCalendarType).selections[
                                (visiblecalendar as VisibleCalendarType).current.year
                              ].months[
                                (visiblecalendar as VisibleCalendarType).current.month
                              ] as YearMonthClickable<{}>['calendar']
                            ).weeks[weekindex].checked, ''+weekindex, 'CURRENT')"
                            :disabled="weekHasEnable((
                              (visiblecalendar as VisibleCalendarType).selections[
                                (visiblecalendar as VisibleCalendarType).current.year
                              ].months[
                                (visiblecalendar as VisibleCalendarType).current.month
                              ] as YearMonthClickable<PositionTrackerType>['calendar']
                            ).weeks[weekindex])"
                            type="checkbox"
                            style="float: left;"
                          />
                        </template>
                        <template v-else>
                          <input v-model="(
                              (visiblecalendar as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                            ).weeks[weekindex].checked"
                            class="m-0 p-0 border-black  flex-w-100 h-100" 
                            :key="(visiblecalendar as VisibleCalendarType).current.year+'_'+(visiblecalendar as VisibleCalendarType).current.month+'_'+weekindex"
                            @change="weekCheckboxClicked((
                                (visiblecalendar as VisibleCalendarType).current.calendar as YearMonthClickable<PositionTrackerType>['calendar']
                              ).weeks[weekindex].checked, ''+weekindex, 'CURRENT')
                            "
                            :disabled="weekHasEnable(week)"
                            type="checkbox"
                            style="float: left;"
                          />
                        </template>
                      </div>
                    </div>
                  </template>
                  <div
                    :class="((props.excludedates!==undefined && props.excludedates) || props.selectionformat === 'MULTIPLE-OR-SINGLE')? 'flex-w-12-dot-5' : 'flex-w-14-dot-285714'"
                    class="align-self-stretch"
                    v-for="(day, dayindex) in week.days"
                    :key="
                      'daycur' +
                      dayindex +
                      'weekcur' +
                      weekindex +
                      'monthcur' +
                      (visiblecalendar as VisibleCalendarType).current.month +
                      'yearcur' +
                      (visiblecalendar as VisibleCalendarType).current.year
                    "
                    style="float: left;"
                    :style="
                      (from === 'DD-MM-YYYY' && selectionformat === 'MULTIPLE-OR-SINGLE')?
                      'line-height: 1.836em; height: 1.836em;'
                      : (
                        (from === 'DD-MM-YYYY')?
                        (
                          (props.excludedates!==undefined && props.excludedates && selectionformat === 'RANGE')?
                          'line-height: 1.836em; height: 1.836em;'
                          :
                          'line-height: 2.73em; height: 2.73em;'
                        )
                        :
                        'line-height: 2.34rem; height: 2.34rem;'
                      )
                    "
                  >
                    <label
                      :ref="
                        (el) => assignRef((visiblecalendar as VisibleCalendarType).current, el as HTMLLabelElement, weekindex as number, dayindex as number)
                      "
                      @keypress.enter="handleDateClick(day)"
                      @click="handleDateClick(day)"
                      :disabled="day.status === 'DISABLE'? true : false"
                      class="w-100"
                      :class="[day.status === 'DISABLE'?'':'cursor-pointer']"
                      style="float: left;outline: 1px solid #fff;"
                      :style="
                        (from === 'DD-MM-YYYY' && selectionformat === 'MULTIPLE-OR-SINGLE')?
                        'line-height: 1.836em; height: 1.836em;'
                        : (
                          (from === 'DD-MM-YYYY')?
                          (
                            (props.excludedates!==undefined && props.excludedates && selectionformat === 'RANGE')?
                            'line-height: 1.836em; height: 1.836em;'
                            :
                            'line-height: 2.73em; height: 2.73em;'
                          )
                          :
                          'line-height: 2.34rem; height: 2.34rem;'
                        )
                      "
                    >
                      <input
                        @keypress.enter.stop=""
                        @click.stop=""
                        :disabled="day.status === 'DISABLE'? true : false"
                        type="checkbox"
                        class="position-absolute d-none"
                        style="pointer-events: auto;"
                      />
                      <template v-if="currentyearandmonthinselections">
                        <div
                          :style="
                            (from === 'DD-MM-YYYY' && selectionformat === 'MULTIPLE-OR-SINGLE')?
                            'line-height: 1.836em; height: 1.836em;'
                            : (
                              (from === 'DD-MM-YYYY')?
                              (
                                (props.excludedates!==undefined && props.excludedates && selectionformat === 'RANGE')?
                                'line-height: 1.836em; height: 1.836em;'
                                :
                                'line-height: 2.73em; height: 2.73em;'
                              )
                              :
                              'line-height: 2.34rem; height: 2.34rem;'
                            )
                          "
                        >
                          <span
                            class="h-100 font-family text-center d-block letter-spacing"
                            style="font-size: 1rem;"
                            :style="rightstyle(dayindex, weekindex, day)"
                          >
                            {{ day.day }}
                          </span>
                        </div>
                      </template>
                      <template v-else>
                        <div
                          :style="
                            (from === 'DD-MM-YYYY' && selectionformat === 'MULTIPLE-OR-SINGLE')?
                            'line-height: 1.836em; height: 1.836em;'
                            : (
                              (from === 'DD-MM-YYYY')?
                              (
                                (props.excludedates!==undefined && props.excludedates && selectionformat === 'RANGE')?
                                'line-height: 1.836em; height: 1.836em;'
                                :
                                'line-height: 2.73em; height: 2.73em;'
                              )
                              :
                              'line-height: 2.34rem; height: 2.34rem;'
                            )
                          "
                        >
                          <span
                            class="h-100 font-family text-center d-block letter-spacing"
                            style="font-size: 1rem;"
                            :style="
                              ((visiblecalendar as VisibleCalendarType).current.calendar.weeks[weekindex].ref?.style.backgroundColor === 'blue')?
                              'background-color: blue; color: #fff;'
                              : (
                                day.status === 'DISABLE'?
                                  'color: gray !important;text-shadow:none'
                                  : 'color: black !important;text-shadow:none'
                              )
                            "
                          >
                            {{ day.day }}
                          </span>
                        </div>
                      </template>
                    </label>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
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
.month-or-year-link:hover {
  background-color: #E8E8E8;
}
</style>