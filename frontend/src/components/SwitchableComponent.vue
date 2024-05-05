<script setup lang="ts">
import { shallowRef, inject, type ShallowRef, triggerRef, nextTick, } from "vue";
import type { PrimitiveType } from "./types/SupportedDatatypesTypeDeclaration";
import {
  disableOtherCardsChildrenTabIndex
} from "./helperfunctions/accessibility";
import type { AccessibilityType } from "./types/accessibility";

type SwitchableType = {
  done: boolean;
  sliderRef: HTMLDivElement | null;
  trueLabelRef: HTMLAnchorElement | null;
  falseLabelRef: HTMLAnchorElement | null;
  focusStatus: boolean;
  shiftTabStatus: boolean;
  trueorfalse: boolean;
  handleShiftTab: (e: KeyboardEvent) => void;
  updateTrueOrFalse: (e: KeyboardEvent | MouseEvent) => void;
  updateSwitchableObject: () => void;
};

const
  accessibility = inject("accessibility") as ShallowRef<AccessibilityType>,
  props = defineProps<{
    truelabel: string;
    falselabel: string;
  }>(),
  index = inject("index") as number,
  cards = inject("cards") as ShallowRef<PrimitiveType[]>,
  switchableobject = shallowRef<SwitchableType>({
    done: false,
    sliderRef: null,
    trueLabelRef: null,
    falseLabelRef: null,
    focusStatus: false,
    shiftTabStatus: false,
    trueorfalse: false,
    handleShiftTab: () => {},
    updateTrueOrFalse: () => {},
    updateSwitchableObject: () => {},
  })
;

switchableobject.value.handleShiftTab = (e: KeyboardEvent) => {
  switchableobject.value.shiftTabStatus = true;
  switchableobject.value.updateSwitchableObject();
  nextTick(() => {
    if (e.shiftKey) {
      switchableobject.value.sliderRef?.blur();
      switchableobject.value.updateSwitchableObject();
      switchableobject.value.trueLabelRef?.focus();
      switchableobject.value.updateSwitchableObject();
      if(switchableobject.value.focusStatus) {
        (switchableobject.value.sliderRef as HTMLDivElement).blur();
        switchableobject.value.updateSwitchableObject();
        nextTick(() => {
          document.getElementById('mix-btn-'+cards.value[index].info.attribute)?.focus();
        });
      }
      e.preventDefault();
      e.stopPropagation();
    }
  });
};

switchableobject.value.updateTrueOrFalse = (e: KeyboardEvent | MouseEvent) => {
  if(switchableobject.value.done === false) {
    switchableobject.value.done = true;
    switchableobject.value.updateSwitchableObject();
    let time: ReturnType<typeof setTimeout>;
    time = setTimeout(() => {
      if(switchableobject.value.trueorfalse) {
        cards.value[index].search.trueorfalse = false;
      }
      else {
        cards.value[index].search.trueorfalse = true;
      }

      triggerRef(cards);
        
      (accessibility.value.cardschildrentabindex as boolean[])[index] = true;
      disableOtherCardsChildrenTabIndex(index, accessibility);
        
      (switchableobject.value.sliderRef as HTMLDivElement).focus();
      switchableobject.value.updateSwitchableObject();

      if(e instanceof KeyboardEvent) {
        document.getElementById(cards.value[index].scroll.areaid + '-switch')?.click();
        e.preventDefault();
      }
      
      switchableobject.value.done = false;
      switchableobject.value.updateSwitchableObject();

      clearTimeout(time);
      
    }, 50);
  }
};

switchableobject.value.updateSwitchableObject = () => {
  triggerRef(switchableobject);
};

switchableobject.value.trueorfalse = cards.value[index].search.trueorfalse;
triggerRef(switchableobject);

</script>

<template>
  <label
    role="switch"
    :aria-checked="(switchableobject.trueorfalse as boolean)"
    :for="cards[index].scroll.areaid + '-switch'"
    @click.stop="switchableobject.updateTrueOrFalse($event)"
    @keypress.enter.stop="switchableobject.updateTrueOrFalse($event)"
    class="d-inline-block w-100 h-100 position-relative"
    style="background-color: #eee;"
  >
    <div
      class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center h-100"
      style="outline: 1.4px solid rgba(0, 0, 0, 0.2);"
    >
      <div class="flex-w-50 bold align-self-stretch h-100">
        <a
          :ref="(el) => switchableobject.trueLabelRef = el as HTMLAnchorElement"
          class="d-block underline-none text-center cursor-pointer switch-btn h-100"
          :tabindex="(accessibility.cardschildrentabindex as boolean[])[index]? 0 : -1"
          aria-pressed="true"
          aria-label="relatively"
          @focus="() => { (switchableobject.trueorfalse? switchableobject.focusStatus=true : switchableobject.focusStatus=false); switchableobject.focusStatus? (switchableobject.sliderRef as HTMLDivElement).focus() : (switchableobject.sliderRef as HTMLDivElement).blur(); switchableobject.shiftTabStatus = false; switchableobject.updateSwitchableObject(); }"
        >
          {{ props.truelabel }}
        </a>
      </div>
      <div class="flex-w-50 bold align-self-stretch h-100">
        <a
          :ref="(el) => { switchableobject.falseLabelRef = el as HTMLAnchorElement; }"
          class="d-block underline-none text-center cursor-pointer switch-btn h-100"
          :tabindex="(accessibility.cardschildrentabindex as boolean[])[index]? 0 : -1"
          aria-pressed="true"
          aria-label="unrelatively"
          @focus="() => { (switchableobject.trueorfalse? switchableobject.focusStatus=false : switchableobject.focusStatus=true); switchableobject.focusStatus? (switchableobject.sliderRef as HTMLDivElement).focus() : (switchableobject.sliderRef as HTMLDivElement).blur(); switchableobject.shiftTabStatus = false; switchableobject.updateSwitchableObject(); }"
        >
          {{ props.falselabel }}
        </a>
      </div>
    </div>
    <input
      :id="cards[index].scroll.areaid + '-switch'"
      class="d-none"
      @click.stop=""
      @keypress.enter.stop=""
      type="checkbox"
      @input="() => { switchableobject.trueorfalse = !switchableobject.trueorfalse; switchableobject.updateSwitchableObject(); }"
      :value="(switchableobject.trueorfalse as boolean)"
    />
    <div
      @keydown.tab="switchableobject.handleShiftTab($event)"
      :ref="el => { switchableobject.sliderRef = el as HTMLDivElement; }"
      :tabindex="(accessibility.cardschildrentabindex as boolean[])[index] && switchableobject.focusStatus? 0 : -1"
      class="d-block align-middle position-absolute m-0 t-0 h-100 slider"
      @blur="() => { switchableobject.trueorfalse && switchableobject.shiftTabStatus? (switchableobject.falseLabelRef as HTMLAnchorElement).focus() : (switchableobject.falseLabelRef as HTMLAnchorElement).blur(); switchableobject.updateSwitchableObject(); }"
    >
      <a 
        class="d-block underline-none text-center cursor-pointer h-100 switch-btn"
        tabindex="-1"
        :aria-label="switchableobject.trueorfalse ? 'Selected relatively ' : 'Selected unrelatively '"
      >{{
        switchableobject.trueorfalse ? truelabel : falselabel
      }}</a>
    </div>
  </label>
</template>

<style scoped>
.slider {
  width: 1.75rem;
  background-color: #f0e68c;
  -webkit-transition: 0.6s;
  transition: 0.6s;
  -webkit-transform: translateX(1.75rem);
  -ms-transform: translateX(1.75rem);
  transform: translateX(1.75rem);
}
input:focus + .slider {
  box-shadow: 0 0 1px white;
}
input:checked + .slider {
  box-shadow: 0 0 1px white;
  -webkit-transform: translateX(0rem);
  -ms-transform: translateX(0rem);
  transform: translateX(0rem);
}
.switch-btn {
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 2px 0;
}
.slider:focus,
.switch-btn:hover,
.switch-btn:focus,
.switch-btn:active {
  background-color: grey;
}
</style>