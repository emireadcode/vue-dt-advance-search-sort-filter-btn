import { nextTick, triggerRef, } from "vue";
import type { YearRangeFirstSelectionType, YearSelectionType, MonthSelectionType, DaySelectionType, } from '../types/days_months_years_types';
import { type ShallowRef, type Ref, shallowRef, ref, } from "vue";

const 
  monthNames = [
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
  dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  isodayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  xpoint = ref(),
  ypoint = ref(),
  pagepoint = ref(0)
;

export function getOffset(el: HTMLLabelElement) {
  if (el) {
    const rect = el.getBoundingClientRect();
    return {
      x1: rect.left + window.scrollX,
      y1: rect.top + window.scrollY,
      x2: rect.left + window.scrollX + rect.width,
      y2: rect.top + window.scrollY + rect.height,
    };
  }
}

export function getMonthDimensions(months: ShallowRef<MonthSelectionType>) {
  nextTick(() => {
    for(const row in months.value) {
      for(const col in months.value[row]) {
        if((months.value[row][col] as MonthSelectionType[number][number]).ref) {
          const offset = getOffset((months.value[row][col] as MonthSelectionType[number][number]).ref);
          if (offset) {
            (months.value[row][col] as MonthSelectionType[number][number]).x1 = offset.x1;
            (months.value[row][col] as MonthSelectionType[number][number]).y1 = offset.y1;
            (months.value[row][col] as MonthSelectionType[number][number]).x2 = offset.x2;
            (months.value[row][col] as MonthSelectionType[number][number]).y2 = offset.y2;
          }
        }
      }
    }
    triggerRef(months);
  });
}

export function getDayDimensions(days: ShallowRef<DaySelectionType>) {
  nextTick(() => {
    for(const day in days.value) {
      if((days.value[day] as unknown as DaySelectionType[number]).ref) {
        const offset = getOffset((days.value[day] as unknown as DaySelectionType[number]).ref);
        if (offset) {
          (days.value[day] as unknown as DaySelectionType[number]).x1 = offset.x1;
          (days.value[day] as unknown as DaySelectionType[number]).y1 = offset.y1;
          (days.value[day] as unknown as DaySelectionType[number]).x2 = offset.x2;
          (days.value[day] as unknown as DaySelectionType[number]).y2 = offset.y2;
        }
      }
    }
    triggerRef(days);
  });
}

export function getYearDimensions(years: ShallowRef<YearSelectionType>, page: Ref<number>) {
  nextTick(() => {
    for(const row in years.value[page.value]) {
      for(const col in years.value[page.value][row]) {
        if((years.value[page.value][row][col] as YearSelectionType[number][number][number]).ref) {
          const offset = getOffset((years.value[page.value][row][col] as YearSelectionType[number][number][number]).ref);
          if (offset) {
            (years.value[page.value][row][col] as YearSelectionType[number][number][number]).x1 = offset.x1;
            (years.value[page.value][row][col] as YearSelectionType[number][number][number]).y1 = offset.y1;
            (years.value[page.value][row][col] as YearSelectionType[number][number][number]).x2 = offset.x2;
            (years.value[page.value][row][col] as YearSelectionType[number][number][number]).y2 = offset.y2;
          }
        }
      }
    }
    triggerRef(years);
  });
}

export function calculateRemainder(max: number, min: number, div: number) {
  const diff = max - min, quotient = parseInt(""+(diff/div));
  return (((quotient + 1)*div) - diff) - 1;
}

export function whereisMouse(pointx: number, pointy: number, page: Ref<number>, years: ShallowRef<YearSelectionType>) {
  let result = {page: -1, year: -1, status: "DISABLE"}, found = false;
  for(const row in years.value[page.value]) {
    for(const col in years.value[page.value][row]) {
      if(
        (
          parseInt(row) === 0
          && (
            pointy <= (years.value[page.value][row][col] as YearSelectionType[number][number][number]).y1
            &&
            pointx >= (years.value[page.value][row][col] as YearSelectionType[number][number][number]).x1
            &&
            pointx <= (years.value[page.value][row][col] as YearSelectionType[number][number][number]).x2
          )
        )
        ||
        (
          parseInt(row) === Object.keys(years.value[page.value]).length - 1
          &&
          pointx >= (years.value[page.value][row][col] as YearSelectionType[number][number][number]).x1
          &&
          pointx <= (years.value[page.value][row][col] as YearSelectionType[number][number][number]).x2
        )
        ||
        (
          parseInt(row) !== Object.keys(years.value[page.value]).length - 1
          && (
            pointx >= (years.value[page.value][row][col] as YearSelectionType[number][number][number]).x1
            &&
            pointx <= (years.value[page.value][row][col] as YearSelectionType[number][number][number]).x2
            &&
            pointy >= (years.value[page.value][row][col] as YearSelectionType[number][number][number]).y1
            &&
            pointy <= (years.value[page.value][row][col] as YearSelectionType[number][number][number]).y2
          )
        )
      ) {
        result = {
          page: page.value,
          year: (years.value[page.value][row][col] as YearSelectionType[number][number][number]).year,
          status: (years.value[page.value][row][col] as YearSelectionType[number][number][number]).status,
        };
        found = true;
        break;
      }
    }
    if(found) break;
  }
  return result;
}

export function mouseMovement(page: Ref<number>, years: ShallowRef<YearSelectionType>, rangefirstselection: Ref<YearRangeFirstSelectionType>, event: { pageX: any; pageY: any; }, loadingMovement: Ref<boolean>, format: "RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN") {
  nextTick(() => {
    if(loadingMovement.value === false) {
      loadingMovement.value = true;
      if (format === "RANGE") {
        if (rangefirstselection.value.year > -1) {
          const mousePointed = whereisMouse(event.pageX, event.pageY, page, years);
          xpoint.value = event.pageX;
          ypoint.value = event.pageY;
          pagepoint.value = mousePointed.page;
          if(mousePointed.status === "ENABLE" && mousePointed.year > -1 && mousePointed.page > -1) {
            for(const p in years.value) {
              for(const row in years.value[p]) {
                for(const col in years.value[p][row]) {
                  if((years.value[p][row][col] as YearSelectionType[number][number][number]).year > rangefirstselection.value.year) {
                    if((years.value[p][row][col] as YearSelectionType[number][number][number]).year <= mousePointed.year) {
                      (years.value[p][row][col] as YearSelectionType[number][number][number]).selected = 'HIGHLIGHTED';
                    }
                    else {
                      if((years.value[p][row][col] as YearSelectionType[number][number][number]).selected === 'HIGHLIGHTED') {
                        (years.value[p][row][col] as YearSelectionType[number][number][number]).selected = 'DESELECTED';
                      }
                    }
                  }
                  else {
                    if((years.value[p][row][col] as YearSelectionType[number][number][number]).year < rangefirstselection.value.year) {
                      if((years.value[p][row][col] as YearSelectionType[number][number][number]).year >= mousePointed.year) {
                        (years.value[p][row][col] as YearSelectionType[number][number][number]).selected = 'HIGHLIGHTED';
                      }
                      else {
                        if((years.value[p][row][col] as YearSelectionType[number][number][number]).selected === 'HIGHLIGHTED') {
                          (years.value[p][row][col] as YearSelectionType[number][number][number]).selected = 'DESELECTED';
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      loadingMovement.value = false;
    }
    triggerRef(years);
  });
}

export function unTrackYearBoxMouseMovement(page: Ref<number>, years: ShallowRef<YearSelectionType>, rangefirstselection: Ref<YearRangeFirstSelectionType>, loadingMovement: Ref<boolean>, format: "RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN") {
  if (document.getElementById("yearbox")) {
    (document
      .getElementById("yearbox") as HTMLDivElement)
      .removeEventListener("mousemove", (event) => { mouseMovement(page, years, rangefirstselection, event, loadingMovement, format); }, true);
  }
}

export function trackYearBoxMouseMovement(page: Ref<number>, years: ShallowRef<YearSelectionType>, rangefirstselection: Ref<YearRangeFirstSelectionType>, loadingMovement: Ref<boolean>, format: "RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN") {
  if (document.getElementById("yearbox")) {
    (document.getElementById("yearbox") as HTMLDivElement).addEventListener("mousemove", (event) => { mouseMovement(page, years, rangefirstselection, event, loadingMovement, format); }, true);
  }
}

export function deselectAll(years: ShallowRef<YearSelectionType>) {
  for(const p in years.value) {
    for(const row in years.value[p]) {
      for(const col in years.value[p][row]) {
        (years.value[p][row][col] as YearSelectionType[number][number][number]).selected = 'DESELECTED';
      }
    }
  }
  triggerRef(years);
}

export function addYear(page: Ref<number>, rangefirstselection: Ref<YearRangeFirstSelectionType> | undefined, loadingMovement: Ref<boolean> | undefined, rangecount: Ref<number> | undefined, multipleselectcount: Ref<number> | undefined, year: number, clickedorpasted: boolean, years: ShallowRef<YearSelectionType>, format: "RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN" | "FROM-TO") {
  let found = false;
  for(const p in years.value) {
    for(const row in years.value[p]) {
      for(const col in years.value[p][row]) {
        if(year === (years.value[p][row][col] as YearSelectionType[number][number][number]).year) {
          if(format === 'RANGE') {
            if(rangecount && rangefirstselection && loadingMovement) {
              if(rangecount.value < 2) {
                if((years.value[p][row][col] as YearSelectionType[number][number][number]).selected === 'DESELECTED' || (years.value[page.value][row][col] as YearSelectionType[number][number][number]).selected === 'HIGHLIGHTED') {
                  rangecount.value++;
                  if(rangecount.value === 1) {
                    (years.value[p][row][col] as YearSelectionType[number][number][number]).selected = 'SELECTED';
                    rangefirstselection.value = { page: parseInt(p), year };
                    trackYearBoxMouseMovement(page, years, rangefirstselection, loadingMovement, format);
                  }
                  else {
                    const avoidedgecases = whereisMouse(xpoint.value, ypoint.value, pagepoint, years);
                    if(avoidedgecases.year === (years.value[p][row][col] as YearSelectionType[number][number][number]).year) {
                      (years.value[p][row][col] as YearSelectionType[number][number][number]).selected = 'SELECTED';
                      rangefirstselection.value = { page: -1, year: -1 };
                    }
                    else {
                      let 
                        bothsideisnothighlighted = false, 
                        onesideishighlighted = false,
                        highlightstoppedyearandpage = {year: 0, page: 0, row: 0, col: 0};
                      ;
                      for(const k in years.value) {
                        for(const r in years.value[k]) {
                          for(const c in years.value[k][r]) {
                            if((years.value[k][r][c] as YearSelectionType[number][number][number]).year === rangefirstselection.value.year) {
                              if(parseInt(c) === 0) {
                                if(parseInt(r) === 0) {
                                  if(
                                    (
                                      years.value[k][r][
                                        parseInt(c)+1
                                      ] as YearSelectionType[number][number][number]
                                    ).status === 'ENABLE'
                                  ) {
                                    if(
                                      (
                                        years.value[k][r][
                                          parseInt(c)+1
                                        ] as YearSelectionType[number][number][number]
                                      ).selected === 'HIGHLIGHTED'
                                    ) {
                                      onesideishighlighted = true;
                                      highlightstoppedyearandpage = handleForwardEdgeCase(
                                        years, 
                                        parseInt(k), 
                                        parseInt(r), 
                                        parseInt(c)+1
                                      );
                                    }
                                    else {
                                      if(
                                        (Object.keys(years.value as YearSelectionType).length > 1)
                                        &&
                                        (
                                          years.value[parseInt(k) - 1][2][
                                            4
                                          ] as YearSelectionType[number][number][number]
                                        ).status === 'ENABLE'
                                        &&
                                        (
                                          years.value[parseInt(k) - 1][2][
                                            4
                                          ] as YearSelectionType[number][number][number]
                                        ).selected === 'HIGHLIGHTED'
                                      ) {
                                        onesideishighlighted = true;
                                        highlightstoppedyearandpage = handleBackwardEdgeCase(
                                          years, 
                                          parseInt(k) - 1,
                                          2,
                                          4
                                        );
                                      }
                                    }
                                  }
                                  else {
                                    if(
                                      (Object.keys(years.value as YearSelectionType).length > 1)
                                      &&
                                      (
                                        years.value[parseInt(k) - 1][2][
                                          4
                                        ] as YearSelectionType[number][number][number]
                                      ).status === 'ENABLE'
                                      &&
                                      (
                                        years.value[parseInt(k) - 1][2][
                                          4
                                        ] as YearSelectionType[number][number][number]
                                      ).selected === 'HIGHLIGHTED'
                                    ) {
                                      onesideishighlighted = true;
                                      highlightstoppedyearandpage = handleBackwardEdgeCase(
                                        years, 
                                        parseInt(k) - 1,
                                        2,
                                        4
                                      );
                                    }
                                  }
                                  if(!onesideishighlighted) bothsideisnothighlighted = true;
                                  break;
                                }
                                else {
                                  if(
                                    (
                                      years.value[k][r][
                                        parseInt(c)+1
                                      ] as YearSelectionType[number][number][number]
                                    ).status === 'ENABLE'
                                  ) {
                                    if(
                                      (
                                        years.value[k][r][
                                          parseInt(c)+1
                                        ] as YearSelectionType[number][number][number]
                                      ).selected === 'HIGHLIGHTED'
                                    ) {
                                      onesideishighlighted = true;
                                      highlightstoppedyearandpage = handleForwardEdgeCase(
                                        years, 
                                        parseInt(k),
                                        parseInt(r),
                                        parseInt(c)+1
                                      );
                                    }
                                    else {
                                      if(
                                        (
                                          years.value[k][parseInt(r) - 1][
                                            4
                                          ] as YearSelectionType[number][number][number]
                                        ).status === 'ENABLE'
                                        &&
                                        (
                                          years.value[k][parseInt(r) - 1][
                                            4
                                          ] as YearSelectionType[number][number][number]
                                        ).selected === 'HIGHLIGHTED'
                                      ) {
                                        onesideishighlighted = true;
                                        highlightstoppedyearandpage = handleBackwardEdgeCase(
                                          years, 
                                          parseInt(k),
                                          parseInt(r) - 1,
                                          4
                                        );
                                      }
                                    }
                                  }
                                  else {
                                    if(
                                      (
                                        years.value[k][parseInt(r) - 1][
                                          4
                                        ] as YearSelectionType[number][number][number]
                                      ).status === 'ENABLE'
                                      &&
                                      (
                                        years.value[k][parseInt(r) - 1][
                                          4
                                        ] as YearSelectionType[number][number][number]
                                      ).selected === 'HIGHLIGHTED'
                                    ) {
                                      onesideishighlighted = true;
                                      highlightstoppedyearandpage = handleBackwardEdgeCase(
                                        years, 
                                        parseInt(k),
                                        parseInt(r) - 1,
                                        4
                                      );
                                    }
                                  }
                                  if(!onesideishighlighted) bothsideisnothighlighted = true;
                                  break;
                                }
                              }
                              else if(parseInt(c) === 4) {
                                if(parseInt(r) === 2) {
                                  if(
                                    ((Object.keys(years.value as YearSelectionType).length - 1) > parseInt(k))
                                    &&
                                    (
                                      years.value[parseInt(k) + 1][0][
                                        0
                                      ] as YearSelectionType[number][number][number]
                                    ).status === 'ENABLE'
                                  ) {
                                    if(
                                      (
                                        years.value[parseInt(k) + 1][0][
                                          0
                                        ] as YearSelectionType[number][number][number]
                                      ).selected === 'HIGHLIGHTED'
                                    ) {
                                      onesideishighlighted = true;
                                      highlightstoppedyearandpage = handleForwardEdgeCase(
                                        years, 
                                        parseInt(k) + 1,
                                        0,
                                        0
                                      );
                                    }
                                    else {
                                      if(
                                        (
                                          years.value[k][r][
                                            parseInt(c) - 1
                                          ] as YearSelectionType[number][number][number]
                                        ).status === 'ENABLE'
                                        &&
                                        (
                                          years.value[k][r][
                                            parseInt(c) - 1
                                          ] as YearSelectionType[number][number][number]
                                        ).selected === 'HIGHLIGHTED'
                                      ) {
                                        onesideishighlighted = true;
                                        highlightstoppedyearandpage = handleBackwardEdgeCase(
                                          years, 
                                          parseInt(k),
                                          parseInt(r),
                                          parseInt(c) - 1
                                        );
                                      }
                                    }
                                  }
                                  else {
                                    if(
                                      (
                                        years.value[k][r][
                                          parseInt(c) - 1
                                        ] as YearSelectionType[number][number][number]
                                      ).status === 'ENABLE'
                                      &&
                                      (
                                        years.value[k][r][
                                          parseInt(c) - 1
                                        ] as YearSelectionType[number][number][number]
                                      ).selected === 'HIGHLIGHTED'
                                    ) {
                                      onesideishighlighted = true;
                                      highlightstoppedyearandpage = handleBackwardEdgeCase(
                                        years, 
                                        parseInt(k),
                                        parseInt(r),
                                        parseInt(c) - 1
                                      );
                                    }
                                  }
                                  if(!onesideishighlighted) bothsideisnothighlighted = true;
                                  break;
                                }
                                else {
                                  if(
                                    (
                                      years.value[k][parseInt(r) + 1][
                                        0
                                      ] as YearSelectionType[number][number][number]
                                    ).status === 'ENABLE'
                                  ) {
                                    if(
                                      (
                                        years.value[k][parseInt(r) + 1][
                                          0
                                        ] as YearSelectionType[number][number][number]
                                      ).selected === 'HIGHLIGHTED'
                                    ) {
                                      onesideishighlighted = true;
                                      highlightstoppedyearandpage = handleForwardEdgeCase(
                                        years, 
                                        parseInt(k),
                                        parseInt(r) + 1,
                                        0
                                      );
                                    }
                                    else {
                                      if(
                                        (
                                          years.value[k][r][
                                            parseInt(c) - 1
                                          ] as YearSelectionType[number][number][number]
                                        ).status === 'ENABLE'
                                        &&
                                        (
                                          years.value[k][r][
                                            parseInt(c) - 1
                                          ] as YearSelectionType[number][number][number]
                                        ).selected === 'HIGHLIGHTED'
                                      ) {
                                        onesideishighlighted = true;
                                        highlightstoppedyearandpage = handleBackwardEdgeCase(
                                          years, 
                                          parseInt(k),
                                          parseInt(r),
                                          parseInt(c) - 1
                                        );
                                      }
                                    }
                                  }
                                  else {
                                    if(
                                      (
                                        years.value[k][r][
                                          parseInt(c) - 1
                                        ] as YearSelectionType[number][number][number]
                                      ).status === 'ENABLE'
                                      &&
                                      (
                                        years.value[k][r][
                                          parseInt(c) - 1
                                        ] as YearSelectionType[number][number][number]
                                      ).selected === 'HIGHLIGHTED'
                                    ) {
                                      onesideishighlighted = true;
                                      highlightstoppedyearandpage = handleBackwardEdgeCase(
                                        years, 
                                        parseInt(k),
                                        parseInt(r),
                                        parseInt(c) - 1
                                      );
                                    }
                                  }
                                  if(!onesideishighlighted) bothsideisnothighlighted = true;
                                  break;
                                }
                              }
                              else {
                                if(
                                  (
                                    years.value[k][r][
                                      parseInt(c)+1
                                    ] as YearSelectionType[number][number][number]
                                  ).status === 'ENABLE'
                                ) {
                                  if(
                                    (
                                      years.value[k][r][
                                        parseInt(c)+1
                                      ] as YearSelectionType[number][number][number]
                                    ).selected === 'HIGHLIGHTED'
                                  ) {
                                    onesideishighlighted = true;
                                    highlightstoppedyearandpage = handleForwardEdgeCase(
                                      years, 
                                      parseInt(k),
                                      parseInt(r),
                                      parseInt(c)+1
                                    );
                                  }
                                  else {
                                    if(
                                      (
                                        years.value[k][r][
                                          parseInt(c)-1
                                        ] as YearSelectionType[number][number][number]
                                      ).status === 'ENABLE'
                                      &&
                                      (
                                        years.value[k][r][
                                          parseInt(c)-1
                                        ] as YearSelectionType[number][number][number]
                                      ).selected === 'HIGHLIGHTED'
                                    ) {
                                      onesideishighlighted = true;
                                      highlightstoppedyearandpage = handleBackwardEdgeCase(
                                        years, 
                                        parseInt(k),
                                        parseInt(r),
                                        parseInt(c)-1
                                      );
                                    }
                                  }
                                }
                                else {
                                  if(
                                    (
                                      years.value[k][r][
                                        parseInt(c)-1
                                      ] as YearSelectionType[number][number][number]
                                    ).status === 'ENABLE'
                                    &&
                                    (
                                      years.value[k][r][
                                        parseInt(c)-1
                                      ] as YearSelectionType[number][number][number]
                                    ).selected === 'HIGHLIGHTED'
                                  ) {
                                    onesideishighlighted = true;
                                    highlightstoppedyearandpage = handleBackwardEdgeCase(
                                      years, 
                                      parseInt(k),
                                      parseInt(r),
                                      parseInt(c)-1
                                    );
                                  }
                                }
                                if(!onesideishighlighted) bothsideisnothighlighted = true;
                                break;
                              }
                            }
                          }
                          if(onesideishighlighted || bothsideisnothighlighted) break;
                        }
                        if(onesideishighlighted || bothsideisnothighlighted) break;
                      }
                      if(bothsideisnothighlighted) {
                        (years.value[p][row][col] as YearSelectionType[number][number][number]).selected = 'DESELECTED';
                        (
                          years.value[
                            highlightstoppedyearandpage.page
                          ][
                            highlightstoppedyearandpage.row
                          ][
                            highlightstoppedyearandpage.col
                          ] as YearSelectionType[number][number][number]
                        ).selected = 'DESELECTED';
                        deselectAll(years);
                        rangefirstselection.value = { page: -1, year: -1 };
                        rangecount.value = 0;
                      }
                      else {
                        (
                          years.value[
                            highlightstoppedyearandpage.page
                          ][
                            highlightstoppedyearandpage.row
                          ][
                            highlightstoppedyearandpage.col
                          ] as YearSelectionType[number][number][number]
                        ).selected = 'SELECTED';
                        rangefirstselection.value = { page: -1, year: -1 };
                      }
                    }
                    unTrackYearBoxMouseMovement(page, years, rangefirstselection, loadingMovement, format);
                  }
                }
                else {
                  (years.value[p][row][col] as YearSelectionType[number][number][number]).selected = 'DESELECTED';
                  rangefirstselection.value = { page: -1, year: -1 };
                  rangecount.value = 0;
                  unTrackYearBoxMouseMovement(page, years, rangefirstselection, loadingMovement, format);
                }
              }
              else {
                deselectAll(years);
                rangecount.value = 1;
                (years.value[p][row][col] as YearSelectionType[number][number][number]).selected = 'SELECTED';
                rangefirstselection.value = { page: parseInt(p), year };
                trackYearBoxMouseMovement(page, years, rangefirstselection, loadingMovement, format);
              }
            }
          }
          else {
            if(clickedorpasted) {
              if((years.value[p][row][col] as YearSelectionType[number][number][number]).selected === 'DESELECTED') {
                (years.value[p][row][col] as YearSelectionType[number][number][number]).selected = 'SELECTED';
                if(multipleselectcount) {
                  multipleselectcount.value++;
                }
              }
              else {
                (years.value[p][row][col] as YearSelectionType[number][number][number]).selected = 'DESELECTED';
                if(multipleselectcount) {
                  multipleselectcount.value--;
                }
              }
            }
            else {
              (years.value[p][row][col] as YearSelectionType[number][number][number]).selected = 'SELECTED';
              page.value = parseInt(p);
            }
          }
          found = true;
          break;
        }
      }
      if(found) break;
    }
    if(found) break;
  }
  
  triggerRef(years);
}

function handleForwardEdgeCase(
  years: ShallowRef<YearSelectionType>, 
  page: number,
  row: number,
  col: number, 
) {
  let 
    startlookingforwherehighlightstop = false,
    highlightstoppositionfound = false,
    highlightstoppedyearpagerowandcol = {year: 0, page: 0, row: 0, col: 0}
  ;
  for(let p=page; p<Object.keys(years.value).length; p++) {
    for(let r=0; r<3; r++) {
      for(let c=0; c<5; c++) {
        if(startlookingforwherehighlightstop) {
          if(
            (
              years.value as YearSelectionType
            )[p][r][c].selected !== 'HIGHLIGHTED'
          ) {
            highlightstoppositionfound = true;
            let sr = 0, sc = 0, sp = 0;
            if(r===0) {
              if(c===0) {
                sp = p - 1;
                sr = 2;
                sc = 4;
              }
              else {
                sp = p;
                sr = r;
                sc = c - 1;
              }
            }
            else {
              if(c===0) {
                sp = p;
                sr = r - 1;
                sc = 4;
              }
              else {
                sp = p;
                sr = r;
                sc = c - 1;
              }
            }
            highlightstoppedyearpagerowandcol = {
              year: (
                years.value as YearSelectionType
              )[p][r][c].year,
              page: sp,
              row: sr,
              col: sc
            };
            break;
          }
        }
        if(p === page && r===row && c==col) {
          startlookingforwherehighlightstop = true;
        }
      }
      if(highlightstoppositionfound) break;
    }
    if(highlightstoppositionfound) break;
  }

  return highlightstoppedyearpagerowandcol;
}

function handleBackwardEdgeCase(
  years: ShallowRef<YearSelectionType>, 
  page: number,
  row: number,
  col: number, 
) {
  let 
    startlookingforwherehighlightstop = false,
    highlightstoppositionfound = false,
    highlightstoppedyearpagerowandcol = {year: 0, page: 0, row: 0, col: 0}
  ;
  for(let p=page; p>=0; p--) {
    for(let r=2; r>=0; r--) {
      for(let c=4; c>=0; c--) {
        if(startlookingforwherehighlightstop) {
          if(
            (
              years.value as YearSelectionType
            )[p][r][c].selected !== 'HIGHLIGHTED'
          ) {
            highlightstoppositionfound = true;
            let sr = 0, sc = 0, sp = 0;
            if(r===2) {
              if(c===4) {
                sp = p + 1;
                sr = 0;
                sc = 0;
              }
              else {
                sp = p;
                sr = r;
                sc = c + 1;
              }
            }
            else {
              if(c===4) {
                sp = p;
                sr = r + 1;
                sc = 0;
              }
              else {
                sp = p;
                sr = r;
                sc = c + 1;
              }
            }
            highlightstoppedyearpagerowandcol = {
              year: (
                years.value as YearSelectionType
              )[p][r][c].year,
              page: sp,
              row: sr,
              col: sc
            };
            break;
          }
        }
        if(p === page && r===row && c==col) {
          startlookingforwherehighlightstop = true;
        }
      }
      if(highlightstoppositionfound) break;
    }
    if(highlightstoppositionfound) break;
  }

  return highlightstoppedyearpagerowandcol;
}

export function fillYearArray(
  _maxyear: number, 
  minyear: number, 
  yearselectionformat: "RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN",
  page: Ref<number>
) {
  let index = 0, row = 0, col = 0, counter = 0;
  const years = shallowRef<YearSelectionType>();

  //let remainder = calculateRemainder(2022, 1945, 15), maxyear = 2022 + remainder;
  //for(let year=1945; year<=maxyear; year++) {

  const 
    remainder = calculateRemainder(
      _maxyear, 
      minyear,
      15
    ), 
    maxyear = _maxyear + remainder
  ;
  
  for(let year=minyear; year<=maxyear; year++) {
    if(years.value) {
      if(index in years.value) {
        if(row in years.value[index]) {
          years.value[index][row] = {
            ...years.value[index][row],
            [col]: {
              ref: null,
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 0,
              year: year,
              status: (maxyear - year) >= remainder ? 'ENABLE' : 'DISABLE',
              selected: "DESELECTED",
            }
          } as YearSelectionType[number][number];
        }
        else {
          years.value[index] = {
            ...years.value[index],
            [row]: {
              [col]: {
                ref: null,
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0,
                year: year,
                status: (maxyear - year) >= remainder ? 'ENABLE' : 'DISABLE',
                selected: "DESELECTED",
              }
            }
          } as YearSelectionType[number];
        }
        col++;
      }
      else {
        years.value = {
          ...years.value,
          [index]: {
            [row]: {
              [col]: {
                ref: null,
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0,
                year: year,
                status: (maxyear - year) >= remainder ? 'ENABLE' : 'DISABLE',
                selected: "DESELECTED",
              }
            }
          }
        } as YearSelectionType;
        col++;
      }
    }
    else {
      years.value = {
        [index]: {
          [row]: {
            [col]: {
              ref: null,
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 0,
              year: year,
              status: (maxyear - year) >= remainder ? 'ENABLE' : 'DISABLE',
              selected: "DESELECTED",
            }
          }
        }
      } as unknown as YearSelectionType;
      col++;
    }
    if(col === 5) {
      row++;
      col = 0;
      counter++;
    }
    if(counter === 3) {
      index++;
      counter = 0;
      row = 0;
    }
  }

  page.value = Object.keys(years.value as YearSelectionType).length-1;

  if(yearselectionformat === 'RANGE') {
    nextTick(() => {
      getYearDimensions(years as ShallowRef<YearSelectionType>, page as Ref<number>);
    });
  }
  
  triggerRef(years);

  return years;
}

export function fillMonthArray(monthselectionformat: "RANGE" | "MULTIPLE-OR-SINGLE") {
  let row = 0, col = 0; 
  const months = shallowRef<MonthSelectionType>();
  for(let index=0; index<monthNames.length; index++) {
    if(months.value) {
      if(row in months.value) {
        (months as ShallowRef<MonthSelectionType>).value[row] = {
          ...months.value[row],
          [col]: {
            monthnumber: index,
            monthname: monthNames[index],
            selected: "DESELECTED",
            ref: null,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
          },
        } as MonthSelectionType[number];
        col++;
      }
      else {
        months.value = {
          ...months.value,
          [row]: {
            [col]: {
              ref: null,
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 0,
              monthname: monthNames[index],
              monthnumber: index,
              selected: "DESELECTED",
            }
          },
        } as MonthSelectionType;
        col++;
      }
    }
    else {
      months.value = {
        [row]: {
          [col]: {
            ref: null,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            monthname: monthNames[index],
            monthnumber: index,
            selected: "DESELECTED",
          }
        },
      } as unknown as MonthSelectionType;
      col++
    }
    if(col === 4) {
      row++;
      col = 0;
    }
  }
  if(monthselectionformat === "RANGE") {
    nextTick(() => {
      getMonthDimensions(months as ShallowRef<MonthSelectionType>);
    });
  }
  triggerRef(months);

  return months;
}

export function fillDayArray(isoweek: boolean, dayselectionformat: "RANGE" | "MULTIPLE-OR-SINGLE") {
  const days = shallowRef<DaySelectionType>();
  for(let index=0; index< ((isoweek)? isodayNames.length: dayNames.length); index++) {
    days.value = {
      ...days.value,
      [index]: {
        ref: null,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        daynumber: index,
        name: (isoweek)? isodayNames[index] : dayNames[index],
        selected: "DESELECTED",
      },
    } as DaySelectionType;
  }

  if(dayselectionformat === "RANGE") {
    nextTick(() => getDayDimensions(days as ShallowRef<DaySelectionType>));
  }
  triggerRef(days);

  return days;
}