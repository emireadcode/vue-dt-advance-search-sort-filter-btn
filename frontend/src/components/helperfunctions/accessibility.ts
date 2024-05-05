import type { AccessibilityType } from './../types/accessibility'
import type { ShallowRef } from 'vue'

export function enableAllCardsTabIndex(accessibility: ShallowRef<AccessibilityType>) {
  ;(accessibility.value.cardstabindex as boolean[]).forEach((_item, index) => {
    ;(accessibility.value.cardstabindex as boolean[])[index] = true
  })
  accessibility.value.updateAccessibility()
}

export function disableAllCardsChildrenTabIndex(accessibility: ShallowRef<AccessibilityType>) {
  ;(accessibility.value.cardschildrentabindex as boolean[]).forEach((_item, index) => {
    ;(accessibility.value.cardschildrentabindex as boolean[])[index] = false
  })
  accessibility.value.updateAccessibility()
}

export function disableAllCardsFilterItemTabIndex(accessibility: ShallowRef<AccessibilityType>) {
  ;(accessibility.value.cardsfilteritemtabindex as boolean[]).forEach((_item, index) => {
    ;(accessibility.value.cardsfilteritemtabindex as boolean[])[index] = false
  })
  accessibility.value.updateAccessibility()
}

export function disableOtherCardsChildrenTabIndex(
  curindex: number,
  accessibility: ShallowRef<AccessibilityType>
) {
  ;(accessibility.value.cardschildrentabindex as boolean[]).forEach((_item, index) => {
    if (curindex !== index) {
      ;(accessibility.value.cardschildrentabindex as boolean[])[index] = false
    }
  })
  accessibility.value.updateAccessibility()
}
