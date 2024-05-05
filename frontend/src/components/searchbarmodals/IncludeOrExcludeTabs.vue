<script setup lang="ts">
import { inject, type ShallowRef, triggerRef } from 'vue'
import type {
  MultipleWordsStringType,
  NumberStringType,
  SingleWordStringType,
  MultipleWordsStringConcatenatedFieldType,
  SingleWordStringConcatenatedFieldType
} from '../types/SupportedDatatypesTypeDeclaration'

const emits = defineEmits<{
    (e: 'disable:searchphraseinputbox', action: boolean): void
    (e: 'show:atnumbersearchexcludenumberwindowopenerbutton', action: boolean): void
  }>(),
  cards = inject('cards') as ShallowRef<
    (MultipleWordsStringType | SingleWordStringType | NumberStringType)[]
  >,
  index = inject('index') as number,
  concatfieldindex = inject('concatfieldindex') as number | undefined
function updateFormat(
  cardtype: 'CONCATENATED' | 'NOT-CONCATENATED',
  format: 'INCLUDE' | 'EXCLUDE' | '@NUMBER'
) {
  if (cardtype === 'CONCATENATED') {
    ;(
      (
        cards.value[index].concatenated as
          | MultipleWordsStringConcatenatedFieldType
          | SingleWordStringConcatenatedFieldType
      )[concatfieldindex as number].search as {
        includeorexcludeformat: '@NUMBER' | 'INCLUDE' | 'EXCLUDE'
      }
    ).includeorexcludeformat = format
    if (format !== '@NUMBER') {
      ;(
        (
          cards.value[index].concatenated as
            | MultipleWordsStringConcatenatedFieldType
            | SingleWordStringConcatenatedFieldType
        )[concatfieldindex as number].search as {
          includeorexcludestartswithcontainsendswithequaltoformat:
            | 'STARTS-WITH'
            | 'CONTAINS'
            | 'ENDS-WITH'
            | 'EQUAL-TO'
        }
      ).includeorexcludestartswithcontainsendswithequaltoformat = 'STARTS-WITH'
    }
  } else {
    ;(
      cards.value[index].search.multiple as {
        includeorexcludeformat: '@NUMBER' | 'INCLUDE' | 'EXCLUDE'
      }
    ).includeorexcludeformat = format
    if (format !== '@NUMBER') {
      ;(
        cards.value[index].search.multiple as {
          includeorexcludestartswithcontainsendswithequaltoformat:
            | 'STARTS-WITH'
            | 'CONTAINS'
            | 'ENDS-WITH'
            | 'EQUAL-TO'
        }
      ).includeorexcludestartswithcontainsendswithequaltoformat = 'STARTS-WITH'
    }
  }
  triggerRef(cards)

  emits('disable:searchphraseinputbox', true)
  emits('show:atnumbersearchexcludenumberwindowopenerbutton', format !== '@NUMBER' ? false : true)
}
</script>

<template>
  <div class="d-block" style="padding: 10px 0.5rem 0 0.5rem">
    <ul
      class="list-style-none flex-box flex-direction-row w-100 p-0 m-0 flex-nowrap justify-content-start align-items-center"
    >
      <li
        class="align-self-stretch"
        :class="[
          concatfieldindex !== undefined
            ? (
                cards[index].concatenated as
                  | MultipleWordsStringConcatenatedFieldType
                  | SingleWordStringConcatenatedFieldType
              )[concatfieldindex].enableatnumbersearch !== undefined &&
              (
                cards[index].concatenated as
                  | MultipleWordsStringConcatenatedFieldType
                  | SingleWordStringConcatenatedFieldType
              )[concatfieldindex].enableatnumbersearch === true
              ? 'flex-w-100-over-3'
              : 'flex-w-50'
            : (cards[index] as MultipleWordsStringType | SingleWordStringType)
                .enableatnumbersearch !== undefined &&
              (cards[index] as MultipleWordsStringType | SingleWordStringType)
                .enableatnumbersearch == true
            ? 'flex-w-100-over-3'
            : 'flex-w-50'
        ]"
      >
        <template v-if="concatfieldindex === undefined">
          <button
            @keypress.enter="
              () => {
                updateFormat('NOT-CONCATENATED', 'INCLUDE')
              }
            "
            @click="
              () => {
                updateFormat('NOT-CONCATENATED', 'INCLUDE')
              }
            "
            class="text-lowercase tab w-100"
            :style="
              (cards[index] as SingleWordStringType).search.multiple?.includeorexcludeformat ===
              'INCLUDE'
                ? 'background-color:#F0E68C;'
                : 'background-color:lightgray;'
            "
            style="padding: 5px 0; font-size: 0.9em"
          >
            include
          </button>
        </template>
        <template v-else>
          <button
            @keypress.enter="
              () => {
                updateFormat('CONCATENATED', 'INCLUDE')
              }
            "
            @click="
              () => {
                updateFormat('CONCATENATED', 'INCLUDE')
              }
            "
            class="text-lowercase tab w-100"
            :style="
              (
                cards[index].concatenated as
                  | MultipleWordsStringConcatenatedFieldType
                  | SingleWordStringConcatenatedFieldType
              )[concatfieldindex as number].search?.includeorexcludeformat === 'INCLUDE'
                ? 'background-color:#F0E68C;'
                : 'background-color:lightgray;'
            "
            style="padding: 5px 0; font-size: 0.9em"
          >
            include
          </button>
        </template>
      </li>
      <li
        class="align-self-stretch"
        :class="[
          concatfieldindex !== undefined
            ? (
                cards[index].concatenated as
                  | MultipleWordsStringConcatenatedFieldType
                  | SingleWordStringConcatenatedFieldType
              )[concatfieldindex].enableatnumbersearch !== undefined &&
              (
                cards[index].concatenated as
                  | MultipleWordsStringConcatenatedFieldType
                  | SingleWordStringConcatenatedFieldType
              )[concatfieldindex].enableatnumbersearch === true
              ? 'flex-w-100-over-3'
              : 'flex-w-50'
            : (cards[index] as MultipleWordsStringType | NumberStringType | SingleWordStringType)
                .enableatnumbersearch !== undefined &&
              (cards[index] as MultipleWordsStringType | NumberStringType | SingleWordStringType)
                .enableatnumbersearch === true
            ? 'flex-w-100-over-3'
            : 'flex-w-50'
        ]"
      >
        <template v-if="concatfieldindex === undefined">
          <button
            @keypress.enter="
              () => {
                updateFormat('NOT-CONCATENATED', 'EXCLUDE')
              }
            "
            @click="
              () => {
                updateFormat('NOT-CONCATENATED', 'EXCLUDE')
              }
            "
            class="text-lowercase tab w-100"
            :style="
              cards[index].search.multiple?.includeorexcludeformat === 'EXCLUDE'
                ? 'background-color:#F0E68C;'
                : 'background-color:lightgray;'
            "
            style="padding: 5px 0; font-size: 0.9em"
          >
            exclude
          </button>
        </template>
        <template v-else>
          <button
            @keypress.enter="
              () => {
                updateFormat('CONCATENATED', 'EXCLUDE')
              }
            "
            @click="
              () => {
                updateFormat('CONCATENATED', 'EXCLUDE')
              }
            "
            class="text-lowercase tab w-100"
            :style="
              (
                cards[index].concatenated as
                  | MultipleWordsStringConcatenatedFieldType
                  | SingleWordStringConcatenatedFieldType
              )[concatfieldindex as number].search?.includeorexcludeformat === 'EXCLUDE'
                ? 'background-color:#F0E68C;'
                : 'background-color:lightgray;'
            "
            style="padding: 5px 0; font-size: 0.9em"
          >
            exclude
          </button>
        </template>
      </li>
      <template v-if="concatfieldindex !== undefined">
        <template
          v-if="
            (
              cards[index].concatenated as
                | MultipleWordsStringConcatenatedFieldType
                | SingleWordStringConcatenatedFieldType
            )[concatfieldindex].enableatnumbersearch !== undefined &&
            (
              cards[index].concatenated as
                | MultipleWordsStringConcatenatedFieldType
                | SingleWordStringConcatenatedFieldType
            )[concatfieldindex].enableatnumbersearch === true
          "
        >
          <li class="align-self-stretch flex-w-100-over-3">
            <button
              :style="
                (
                  cards[index].concatenated as
                    | MultipleWordsStringConcatenatedFieldType
                    | SingleWordStringConcatenatedFieldType
                )[concatfieldindex as number].search?.includeorexcludeformat === '@NUMBER'
                  ? 'background-color:#F0E68C;'
                  : 'background-color:lightgray;'
              "
              @click="
                () => {
                  updateFormat('CONCATENATED', '@NUMBER')
                }
              "
              @keypress.enter="
                () => {
                  updateFormat('CONCATENATED', '@NUMBER')
                }
              "
              class="text-lowercase tab w-100"
              style="padding: 5px 0; font-size: 0.9em"
            >
              @number
            </button>
          </li>
        </template>
      </template>
      <template v-else>
        <template
          v-if="
            (cards[index] as MultipleWordsStringType | NumberStringType | SingleWordStringType)
              .enableatnumbersearch !== undefined &&
            (cards[index] as MultipleWordsStringType | NumberStringType | SingleWordStringType)
              .enableatnumbersearch === true
          "
        >
          <li class="align-self-stretch flex-w-100-over-3">
            <button
              :style="
                (cards[index] as SingleWordStringType).search.multiple?.includeorexcludeformat ===
                '@NUMBER'
                  ? 'background-color:#F0E68C;'
                  : 'background-color:lightgray;'
              "
              @click="
                () => {
                  updateFormat('NOT-CONCATENATED', '@NUMBER')
                }
              "
              @keypress.enter="
                () => {
                  updateFormat('NOT-CONCATENATED', '@NUMBER')
                }
              "
              class="text-lowercase tab w-100"
              style="padding: 5px 0; font-size: 0.9em"
            >
              @number
            </button>
          </li>
        </template>
      </template>
    </ul>
  </div>
</template>

<style scoped>
.tab {
  border: none;
  outline: 1px solid gray;
}
</style>
