<script setup lang="ts">
import { 
  type WatchStopHandle,
  type ShallowRef,
  type Ref,
  computed,
  onMounted,
  nextTick,
  ref,
  shallowRef,
  onBeforeMount,
  watch,
  triggerRef,
  onBeforeUnmount,
} from "vue";
import type {  YearSelectionType, YearRangeFirstSelectionType, YearSelectionFormat } from "../types/days_months_years_types";
import { 
  addYear,
  getYearDimensions,
  unTrackYearBoxMouseMovement,
  deselectAll,
  fillYearArray,
} from "../utility/days_months_years_utility_fns";
import PasteCopied from "./PasteCopied.vue";

let 
  unwatchrangecount: WatchStopHandle,
  unwatchmultipleselectcount: WatchStopHandle,
  unwatchformat: WatchStopHandle,
  unwatchgreaterthan: WatchStopHandle,
  unwatchlessthan: WatchStopHandle,
  unwatchnotifytosendsignal: WatchStopHandle
;

const 
  props = defineProps<{
    notifytosendsignal?: number | undefined;
    maxyear: number;
    minyear: number;
    yearselectionandformat: YearSelectionFormat;
    title: string;
  }>(),
  emits = defineEmits<{
    (e: "update:yearselectionandformat", action: YearSelectionFormat): void;
    (e: "signal:readyforexclude", action: number): void;
  }>(),
  holder = shallowRef<YearSelectionFormat>(),
  years = shallowRef<YearSelectionType>(),
  page = ref(0),
  rangecount = ref(0),
  multipleselectcount = ref(0),
  rangefirstselection = ref<YearRangeFirstSelectionType>(),
  loadingMovement = ref(false),
  lessthan = ref(""),
  greaterthan = ref(""),
  lessthanref = ref(),
  greaterthanref = ref(),
  previousFormat = ref<'RANGE' | 'MULTIPLE-OR-SINGLE' | 'GREATER-THAN' | 'LESS-THAN' | ''>()
;

const compYearsLength = computed(() => {
  return Object.keys(years.value as YearSelectionType).length;
});

function triggerHolder() {
  triggerRef(holder);
}

function processDimensions() {
  getYearDimensions(years as ShallowRef<YearSelectionType>, page as Ref<number>);
}

function addYearByClick(year: number, clickedorpasted: boolean) {
  addYear(page, rangefirstselection as Ref<YearRangeFirstSelectionType>, loadingMovement, rangecount, multipleselectcount, year, clickedorpasted, years as ShallowRef<YearSelectionType>, (holder.value as YearSelectionFormat).format as "RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN");
}

onBeforeMount(() => {
  holder.value = JSON.parse(JSON.stringify(props.yearselectionandformat)) as YearSelectionFormat;
  holder.value.format = props.yearselectionandformat.format;
  triggerRef(holder);
  previousFormat.value = holder.value.format;
  rangefirstselection.value = { page: -1, year: -1 };
  rangecount.value = 0;
  multipleselectcount.value = 0;
  (years.value as YearSelectionType)= (fillYearArray(
    props.maxyear,
    props.minyear,
    props.yearselectionandformat.format,
    page
  ) as ShallowRef<YearSelectionType>).value;
  triggerRef(years);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', processDimensions, true);
  window.removeEventListener('scroll', processDimensions, true);
  unTrackYearBoxMouseMovement(page, years as ShallowRef<YearSelectionType>, rangefirstselection as Ref<YearRangeFirstSelectionType>, loadingMovement, (holder.value as YearSelectionFormat).format as "RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN");
  unwatchformat();
  unwatchgreaterthan();
  unwatchlessthan();
  unwatchmultipleselectcount();
  unwatchrangecount();
  unwatchnotifytosendsignal();
});

onMounted(() => {
  unwatchnotifytosendsignal = watch(
    () => (props.notifytosendsignal as number),
    () => {
      (holder.value as YearSelectionFormat).years = years.value as YearSelectionType;
      triggerHolder();
      emits('update:yearselectionandformat', holder.value as YearSelectionFormat);
    }
  );
  unwatchmultipleselectcount = watch(
    () => multipleselectcount.value,
    (x) => {
      if((holder.value as YearSelectionFormat).format !== "RANGE") {
        if(x > 0) {
          emits('signal:readyforexclude', multipleselectcount.value);
        }
        else {
          emits('signal:readyforexclude', multipleselectcount.value);
        }
      }
      else {
        if(rangecount.value === 0) {
          emits('signal:readyforexclude', 0);
        }
      }
    }
  );
  unwatchrangecount = watch(
    () => rangecount.value,
    (x) => {
      if ((holder.value as YearSelectionFormat).format === "RANGE") {
        if(x === 2) {
          emits('signal:readyforexclude', rangecount.value);
        }
        else {
          emits('signal:readyforexclude', 0);
        }
      }
      else {
        if(multipleselectcount.value === 0) {
          emits('signal:readyforexclude', 0);
        }
      }
    }
  );
  unwatchformat = watch(
    () => (holder.value as YearSelectionFormat).format,
    (x) => {
      if(x !== previousFormat.value) {
        deselectAll(years as ShallowRef<YearSelectionType>);
        unTrackYearBoxMouseMovement(page, years as ShallowRef<YearSelectionType>, rangefirstselection as Ref<YearRangeFirstSelectionType>, loadingMovement, (holder.value as YearSelectionFormat).format as "RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN");
        rangefirstselection.value = { page: -1, year: -1 };
        rangecount.value = 0;
        multipleselectcount.value = 0;
      }
    }
  );
  unwatchgreaterthan = watch(
    () => greaterthan.value,
    (x) => {
      lessthanref.value.style.backgroundColor = '#fff';
      lessthanref.value.style.color = 'black';
      deselectAll(years as ShallowRef<YearSelectionType>);
      rangefirstselection.value = { page: -1, year: -1 };
      rangecount.value = 0;
      multipleselectcount.value = 0;
      let found = false, isnumber = false;
      nextTick(() => {
        if(x) {
          try {
            if(/^\d+$/g.test(x)) {
              isnumber = true;
              greaterthanref.value.style.backgroundColor = '#fff';
              greaterthanref.value.style.color = 'black';
              for(let p in years.value) {
                for(let row in years.value[parseInt(p)]) {
                  for(let col in years.value[parseInt(p)][row]) {
                    if((years.value[parseInt(p)][row][col] as YearSelectionType[number][number][number]).year === parseInt(x) && (years.value[parseInt(p)][row][col] as YearSelectionType[number][number][number]).status === 'ENABLE') {
                      found = true;
                      break;
                    }
                  }
                  if(found) break;
                }
                if(found) break;
              }
              if(found) {
                for(let p in years.value) {
                  for(let row in years.value[parseInt(p)]) {
                    for(let col in years.value[parseInt(p)][row]) {
                      if((years.value[parseInt(p)][row][col] as YearSelectionType[number][number][number]).year > parseInt(x) && (years.value[parseInt(p)][row][col] as YearSelectionType[number][number][number]).status === 'ENABLE') {
                        (years.value[parseInt(p)][row][col] as YearSelectionType[number][number][number]).selected = 'SELECTED';
                        page.value = parseInt(p);
                        multipleselectcount.value++;
                      }
                    }
                  }
                }
                previousFormat.value = 'GREATER-THAN';
                (holder.value as YearSelectionFormat).format = 'GREATER-THAN';
                triggerRef(holder);
                triggerRef(years);
              }
            }
            else {
              isnumber = false;
              greaterthanref.value.style.backgroundColor = 'red';
              greaterthanref.value.style.color = '#fff';
            }
          }
          catch(ex) {
            isnumber = false;
            greaterthanref.value.style.backgroundColor = 'red';
            greaterthanref.value.style.color = '#fff';
          }
          if(found === false && isnumber) {
            deselectAll(years as ShallowRef<YearSelectionType>);
            greaterthanref.value.style.backgroundColor = '#E8E8E8';
            greaterthanref.value.style.color = 'black';
          }
        }
        else {
          greaterthanref.value.style.backgroundColor = '#fff';
          greaterthanref.value.style.color = 'black';
        }
      });
    }
  );
  unwatchlessthan = watch(
    () => lessthan.value,
    (x) => {
      greaterthanref.value.style.backgroundColor = '#fff';
      greaterthanref.value.style.color = 'black';
      deselectAll(years as ShallowRef<YearSelectionType>);
      rangefirstselection.value = { page: -1, year: -1 };
      rangecount.value = 0;
      let found = false, isnumber = false;
      multipleselectcount.value = 0;

      nextTick(() => {
        if(x) {
          try {
            if(/^\d+$/g.test(x)) {
              isnumber = true;
              lessthanref.value.style.backgroundColor = '#fff';
              lessthanref.value.style.color = 'black';
              for(let p in years.value) {
                for(let row in years.value[parseInt(p)]) {
                  for(let col in years.value[parseInt(p)][row]) {
                    if((years.value[parseInt(p)][row][col] as YearSelectionType[number][number][number]).year === parseInt(x) && (years.value[parseInt(p)][row][col] as YearSelectionType[number][number][number]).status === 'ENABLE') {
                      found = true;
                      break;
                    }
                  }
                  if(found) break;
                }
                if(found) break;
              }
              if(found) {
                for(let p in years.value) {
                  for(let row in years.value[parseInt(p)]) {
                    for(let col in years.value[parseInt(p)][row]) {
                      if((years.value[parseInt(p)][row][parseInt(col)] as YearSelectionType[number][number][number]).year < parseInt(x) && (years.value[parseInt(p)][row][col] as YearSelectionType[number][number][number]).status === 'ENABLE') {
                        (years.value[parseInt(p)][row][col] as YearSelectionType[number][number][number]).selected = 'SELECTED';
                        page.value = parseInt(p);
                        multipleselectcount.value++;
                      }
                    }
                  }
                }
                previousFormat.value = 'LESS-THAN';
                (holder.value as YearSelectionFormat).format = 'LESS-THAN';
                triggerRef(holder);
                triggerRef(years);
              }
            }
            else {
              lessthanref.value.style.backgroundColor = 'red';
              lessthanref.value.style.color = '#fff';
              isnumber = false;
            }
          }
          catch(ex) {
            lessthanref.value.style.backgroundColor = 'red';
            lessthanref.value.style.color = '#fff';
            isnumber = false;
          }
          if(found == false && isnumber) {
            deselectAll(years as ShallowRef<YearSelectionType>);
            lessthanref.value.style.backgroundColor = '#E8E8E8';
            lessthanref.value.style.color = 'black';
          }
        }
        else {
          lessthanref.value.style.backgroundColor = '#fff';
          lessthanref.value.style.color = 'black';
        }
      });
    }
  );
  window.addEventListener('resize', processDimensions, true);
  window.addEventListener('scroll', processDimensions, true);
});
</script>


<template>
  <div class="d-block position-relative">
    <div
      class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
    >
      <div class="flex-w-50 align-self-stretch">
        <button
          @keypress.enter="() => {
            (holder as YearSelectionFormat).format = 'RANGE'; 
            greaterthan = ''; 
            lessthan = ''; 
            triggerHolder(); 
          }"
          @click="() => {
            (holder as YearSelectionFormat).format = 'RANGE'; 
            greaterthan = ''; 
            lessthan = ''; 
            triggerHolder(); 
          }"
          :style="(holder as YearSelectionFormat).format === 'RANGE'? 'background-color:green;' : 'background-color:gray;'"
          class="font-family letter-spacing cursor-pointer btn w-100"
          style="color: #fff; padding: 2px 0; border-right: 1px solid #fff"
        >
          Range
        </button>
      </div>
      <div class="flex-w-50 align-self-stretch">
        <button
          @keypress.enter="() => {
            (holder as YearSelectionFormat).format = 'MULTIPLE-OR-SINGLE';
            greaterthan = '';
            lessthan = '';
            triggerHolder();
          }"
          @click="() => {
            (holder as YearSelectionFormat).format = 'MULTIPLE-OR-SINGLE';
            greaterthan = '';
            lessthan = '';
            triggerHolder();
          }"
          :style="(holder as YearSelectionFormat).format === 'MULTIPLE-OR-SINGLE'? 'background-color:green;' : 'background-color:gray;'"
          class="font-family letter-spacing cursor-pointer btn w-100"
          style="color: #fff; padding: 2px 0; border-left: 1px solid #fff"
        >
          Multiple or Single
        </button>
      </div>
    </div>
    <PasteCopied
      pastearea="YEAR-AREA"
      :title="props.title"
      :datatype="'Year'"
      :max="''+props.maxyear"
      :min="''+props.minyear"
      :text-area-height="'height:184px;'"
    >
      <template #outcomeidentifier>
        <div
          class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
        >
          <div class="flex-fill text-center">
            <div
              class="d-inline-block align-middle"
              style="background-color: #fff; width: 15px; height: 15px"
            ></div>
            Accepted Lines
          </div>
          <div class="flex-fill text-center">
            <div
              class="d-inline-block align-middle"
              style="background-color:red;width:15px;height:15px"
            ></div>
            Invalid Year
          </div>
          <div class="flex-fill text-center">
            <div
              class="d-inline-block align-middle"
              style="background-color: yellow;width: 15px;height: 15px;"
            ></div>Out of Range
          </div>
        </div>
      </template>
    </PasteCopied>
    <div
      class="p-0 m-0 flex-box flex-direction-row flex-nowrap justify-content-start align-items-center w-100"
    >
      <div class="flex-w-50 align-self-stretch" style="padding-right: 3px">
        <div 
          class="d-block"
          :style="(holder as YearSelectionFormat).format === 'LESS-THAN'? 'background-color: green;' : 'background-color: #fff;'"
        >
          <div class="d-block text-center" style="padding-bottom: 1.5px;">
            <img
              src="http://localhost:5175/src/components/icons/less-than.png"
              style="width: 20px; height: 20px;"
              class="align-middle"
            />
          </div>
          <div class="d-block">
            <input
              @keydown.space.prevent
              :ref="(el) => {
                lessthanref = el;
              }"
              @focus="() => {
                greaterthan=''; 
                previousFormat = 'LESS-THAN'; 
                (holder as YearSelectionFormat).format = 'LESS-THAN'; 
                triggerHolder(); 
              }"
              type="text"
              v-model.trim="lessthan"
              class="text-center w-100 align-middle"
              style="height: 30px"
            />
          </div>
        </div>
      </div>
      <div class="flex-w-50 align-self-stretch">
        <div 
          class="d-block"
          :style="(holder as YearSelectionFormat).format === 'GREATER-THAN'? 'background-color: green;' : 'background-color: #fff;'"
        >
          <div class="d-block text-center" style="padding-bottom: 1.5px">
            <img
              src="http://localhost:5175/src/components/icons/greater-than.png"
              style="width: 20px; height: 20px"
              class="align-middle"
            />
          </div>
          <div class="d-block">
            <input
              @keydown.space.prevent
              :ref="(el) => {
                greaterthanref = el;
              }"
              @focus="() => {
                lessthan='';
                previousFormat = 'GREATER-THAN';
                (holder as YearSelectionFormat).format = 'GREATER-THAN';
                triggerHolder();
              }"
              type="text"
              v-model.trim="greaterthan"
              class="text-center w-100 align-middle"
              style="height: 30px"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      class="shadow-sm flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
      style="background-color: lightgray; padding: 0 10px"
    >
      <div class="flex-w-50 align-self-stretch text-left">
        <div
          class="d-inline-block"
          style="border-radius: 50%; padding: 5px 0; background-color: transparent"
        >
          <a
            :class="[(compYearsLength > 1 && page > 0)? 'cursor-pointer' : '']"
            style="border-radius: 50%"
            :style="(compYearsLength > 1 && page > 0)? 'background-color: green;' : 'background-color:gray;'"
            class="flex-box align-items-center justify-content-center text-center"
            @keypress.enter="() => {
              page = ((page - 1) < 0)? 0 : (page - 1);
              processDimensions();
            }"
            @click="() => {
              page = ((page - 1) < 0)? 0 : (page - 1);
              processDimensions();
            }"
          >
            <svg class="shadow"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              style="border-radius: 50%;height: 20px;width: 20px;color: #fff;stroke: currentcolor;fill: currentcolor;"
            >
              <path
                d="M20.943 23.057l-7.057-7.057c0 0 7.057-7.057 7.057-7.057 0.52-0.52 0.52-1.365 0-1.885s-1.365-0.52-1.885 0l-8 8c-0.521 0.521-0.521 1.365 0 1.885l8 8c0.52 0.52 1.365 0.52 1.885 0s0.52-1.365 0-1.885z"
              ></path>
            </svg>
          </a>
        </div>
      </div>
      <div class="flex-w-50 align-self-stretch text-right">
        <div
          class="d-inline-block"
          style="border-radius: 50%; padding: 5px 0; background-color: transparent"
        >
          <a
            :class="[(compYearsLength > 1 && page !== (compYearsLength - 1))? 'cursor-pointer' : '']"
            style="border-radius: 50%"
            :style="(compYearsLength > 1 && page !== (compYearsLength - 1))? 'background-color: green;' : 'background-color:gray;'"
            class="flex-box align-items-center justify-content-center text-center"
            @keypress.enter="() => {
              page = ((page + 1) > (compYearsLength - 1))? (compYearsLength - 1) : (page + 1);
              processDimensions();
            }"
            @click="() => {
              page = ((page + 1) > (compYearsLength - 1))? (compYearsLength - 1) : (page + 1);
              processDimensions();
            }"
          >
            <svg
              class="shadow"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              style="border-radius: 50%;height: 20px;width: 20px;color: #fff;stroke: currentcolor;fill: currentcolor;"
            >
              <path
                d="M12.943 24.943l8-8c0.521-0.521 0.521-1.365 0-1.885l-8-8c-0.52-0.52-1.365-0.52-1.885 0s-0.52 1.365 0 1.885l7.057 7.057c0 0-7.057 7.057-7.057 7.057-0.52 0.52-0.52 1.365 0 1.885s1.365 0.52 1.885 0z"
              ></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
    <div class="d-block shadow-sm" style="height: 98px" id="yearbox">
      <div
        class="flex-box flex-direction-row flex-wrap justify-content-start align-items-center"
      >
        <template v-for="(row, rindex) in (years as YearSelectionType)[page]" :key="rindex+'aa'">
          <template v-for="(col, cindex) in row" :key="cindex+'aa-aa'">
            <div
              class="flex-w-20 overflow-hidden"
              style="float: left; outline: 1px solid #fff"
            >
              <label
                :ref="(el) => ((years as YearSelectionType)[page][rindex][cindex] as YearSelectionType[number][number][number]).ref = el as HTMLLabelElement"
                @keypress.enter="() => {
                  (
                    (
                      (holder as YearSelectionFormat).format==='RANGE' || (holder as YearSelectionFormat).format==='MULTIPLE-OR-SINGLE'
                    ) && (col as YearSelectionType[number][number][number]).status === 'ENABLE'
                  )? 
                  addYearByClick(
                    ((years as YearSelectionType)[page][rindex][cindex] as YearSelectionType[number][number][number]).year, 
                    true
                  ) 
                  : 
                  ''; 
                }"
                @click="() => {
                  (
                    (
                      (holder as YearSelectionFormat).format==='RANGE' || (holder as YearSelectionFormat).format==='MULTIPLE-OR-SINGLE'
                    ) && (col as YearSelectionType[number][number][number]).status === 'ENABLE'
                  )? 
                  addYearByClick(
                    ((years as YearSelectionType)[page][rindex][cindex] as YearSelectionType[number][number][number]).year, 
                    true
                  ) 
                  : 
                  '';
                }"
                class="w-100"
                style="float: left; line-height: 2em; height: 2em"
              >
                <input
                  @keypress.enter.stop=""
                  @click.stop=""
                  type="checkbox"
                  :value="((years as YearSelectionType)[page][rindex][cindex] as YearSelectionType[number][number][number]).year"
                  class="position-absolute d-none"
                  style="pointer-events: auto"
                />
                <span
                  class="font-family text-center d-block letter-spacing"
                  style="font-size: 1rem; line-height: 2em; height: 2em"
                  :class="[(((holder as YearSelectionFormat).format==='RANGE' || (holder as YearSelectionFormat).format==='MULTIPLE-OR-SINGLE') && ((years as YearSelectionType)[page][rindex][cindex] as YearSelectionType[number][number][number]).status === 'ENABLE')? 'cursor-pointer' : '']"
                  :style="((years as YearSelectionType)[page][rindex][cindex] as YearSelectionType[number][number][number]).status === 'ENABLE'? (
                    ((years as YearSelectionType)[page][rindex][cindex] as YearSelectionType[number][number][number]).selected === 'SELECTED'?
                      'background-color: green; color: #fff;'
                      : (
                        ((years as YearSelectionType)[page][rindex][cindex] as YearSelectionType[number][number][number]).selected === 'DESELECTED'?
                        'background-color: #E8E8E8; color: black; text-shadow: none;'
                        : 
                        'background-color: gray; color: #fff;'
                      )
                    ) 
                    : 
                    'background-color: #fff; color: #fff; text-shadow: none;'
                  "
                >
                  {{ ((years as YearSelectionType)[page][rindex][cindex] as YearSelectionType[number][number][number]).status === 'ENABLE'? ((years as YearSelectionType)[page][rindex][cindex] as YearSelectionType[number][number][number]).year : '' }}
                </span>
              </label>
            </div>
          </template>
        </template>
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
</style>