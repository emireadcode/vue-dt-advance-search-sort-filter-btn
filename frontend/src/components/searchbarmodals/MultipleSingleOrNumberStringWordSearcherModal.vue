<script setup lang="ts">
import { inject, type ShallowRef, ref } from 'vue'
import type {
  NumberStringType,
  SingleWordStringType,
  MultipleWordsStringType
} from '../types/SupportedDatatypesTypeDeclaration'
import TabPanelWithIncludeAndExclude from './TabPanelWithIncludeAndExclude.vue'
import TabPanelWithoutIncludeAndExclude from './TabPanelWithoutIncludeAndExclude.vue'
import SingleOrMultipleWordsStringAttributeInfoNameTabs from './SingleOrMultipleWordsStringAttributeInfoNameTabs.vue'

const cards = inject('cards') as ShallowRef<
    (NumberStringType | SingleWordStringType | MultipleWordsStringType)[]
  >,
  index = inject('index') as number,
  enableatnumbersearchwindowopenerbutton = ref(true),
  openatnumbersearchexcludenumberwindow = ref(false),
  showatnumbersearchexcludenumberwindowopenerbutton = ref(false)
</script>

<template>
  <transition name="modal">
    <div class="position-fixed h-100 w-100 overflow-auto user-select-none" style="z-index: 1800">
      <div class="modal-mask h-100 w-100 modal-mask-background">
        <div class="modal-wrapper text-center">
          <div class="modal-container" style="width: 550px">
            <div class="d-block" style="height: 36.855rem !important">
              <SingleOrMultipleWordsStringAttributeInfoNameTabs></SingleOrMultipleWordsStringAttributeInfoNameTabs>
              <div class="d-block m-0 overflow-hidden">
                <template v-if="!cards[index].concatenated">
                  <template
                    v-if="
                      cards[index].enableincludeandexcludesearch !== undefined &&
                      cards[index].enableincludeandexcludesearch === true
                    "
                  >
                    <TabPanelWithIncludeAndExclude
                      :openatnumbersearchexcludenumberwindow="openatnumbersearchexcludenumberwindow"
                      @close:atnumbersearchexcludenumberwindow="
                        ($val: boolean) => (openatnumbersearchexcludenumberwindow = $val)
                      "
                      @enable:atnumbersearchwindowopenerbutton="
                        ($val: boolean) => (enableatnumbersearchwindowopenerbutton = $val)
                      "
                      @show:atnumbersearchexcludenumberwindowopenerbutton="
                        ($val: boolean) =>
                          (showatnumbersearchexcludenumberwindowopenerbutton = $val)
                      "
                    ></TabPanelWithIncludeAndExclude>
                  </template>
                  <template v-else>
                    <TabPanelWithoutIncludeAndExclude
                      :openatnumbersearchexcludenumberwindow="openatnumbersearchexcludenumberwindow"
                      @close:atnumbersearchexcludenumberwindow="
                        ($val: boolean) => (openatnumbersearchexcludenumberwindow = $val)
                      "
                      @show:atnumbersearchexcludenumberwindowopenerbutton="
                        ($val: boolean) =>
                          (showatnumbersearchexcludenumberwindowopenerbutton = $val)
                      "
                      @enable:atnumbersearchwindowopenerbutton="
                        ($val: boolean) => (enableatnumbersearchwindowopenerbutton = $val)
                      "
                    ></TabPanelWithoutIncludeAndExclude>
                  </template>
                </template>
                <template v-else>
                  <div class="d-block">
                    <template
                      v-for="(concatenated, cindex) in cards[index].concatenated"
                      :key="cindex + 'zz-ds'"
                    >
                      <template
                        v-if="
                          concatenated.enableincludeandexcludesearch !== undefined &&
                          concatenated.enableincludeandexcludesearch === true
                        "
                      >
                        <template v-if="concatenated.search?.tabclicked">
                          <TabPanelWithIncludeAndExclude
                            :openatnumbersearchexcludenumberwindow="
                              openatnumbersearchexcludenumberwindow
                            "
                            @close:atnumbersearchexcludenumberwindow="
                              ($val: boolean) => (openatnumbersearchexcludenumberwindow = $val)
                            "
                            @show:atnumbersearchexcludenumberwindowopenerbutton="
                              ($val: boolean) =>
                                (showatnumbersearchexcludenumberwindowopenerbutton = $val)
                            "
                            @enable:atnumbersearchwindowopenerbutton="
                              ($val: boolean) => (enableatnumbersearchwindowopenerbutton = $val)
                            "
                            :concatfieldindex="parseInt('' + cindex) as number"
                          ></TabPanelWithIncludeAndExclude>
                        </template>
                      </template>
                      <template v-else>
                        <template v-if="concatenated.search?.tabclicked">
                          <TabPanelWithoutIncludeAndExclude
                            :concatfieldindex="parseInt('' + cindex) as number"
                            :openatnumbersearchexcludenumberwindow="
                              openatnumbersearchexcludenumberwindow
                            "
                            @close:atnumbersearchexcludenumberwindow="
                              ($val: boolean) => (openatnumbersearchexcludenumberwindow = $val)
                            "
                            @show:atnumbersearchexcludenumberwindowopenerbutton="
                              ($val: boolean) =>
                                (showatnumbersearchexcludenumberwindowopenerbutton = $val)
                            "
                            @enable:atnumbersearchwindowopenerbutton="
                              ($val: boolean) => (enableatnumbersearchwindowopenerbutton = $val)
                            "
                          ></TabPanelWithoutIncludeAndExclude>
                        </template>
                      </template>
                    </template>
                  </div>
                </template>
              </div>
            </div>
            <div
              style="padding: 10px 10px 12px 10px"
              class="flex-box flex-direction-row flex-wrap justify-content-center align-items-center"
            >
              <div
                :class="[
                  showatnumbersearchexcludenumberwindowopenerbutton
                    ? 'flex-w-100-over-3'
                    : 'flex-w-50'
                ]"
                class="align-self-stretch"
                style="padding-right: 7.5px"
              >
                <button
                  class="btn shadow-sm w-100 font-family"
                  style="padding: 6px; font-size: 1rem; color: #fff; background-color: gray"
                >
                  Search
                </button>
              </div>
              <template v-if="showatnumbersearchexcludenumberwindowopenerbutton">
                <div class="flex-w-100-over-3 align-self-stretch" style="padding-right: 2.5px">
                  <button
                    @click="openatnumbersearchexcludenumberwindow = true"
                    @keypress.enter="openatnumbersearchexcludenumberwindow = true"
                    :disabled="enableatnumbersearchwindowopenerbutton"
                    class="btn shadow-sm w-100 font-family"
                    style="padding: 6px; font-size: 1rem; color: #fff"
                    :style="
                      !enableatnumbersearchwindowopenerbutton
                        ? 'background-color: blue;color:#fff'
                        : 'background-color:#B8B8B8;color:#fff;'
                    "
                  >
                    @Number Exclude
                  </button>
                </div>
              </template>
              <div
                :class="[
                  showatnumbersearchexcludenumberwindowopenerbutton
                    ? 'flex-w-100-over-3'
                    : 'flex-w-50'
                ]"
                class="align-self-stretch"
                style="padding-left: 5px"
              >
                <button
                  class="btn shadow-sm w-100 font-family"
                  style="padding: 6px; font-size: 1rem; color: #fff; background-color: gray"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-mask-background {
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-mask {
  top: 0;
  left: 0;
  display: table;
  transition: opacity 0.3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-container {
  margin: 0px auto;
  background-color: #f8f8f8;
  border-radius: 2px;
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-enter,
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
