<script setup lang="ts">
const props = defineProps<{
  items: {label:string,content:string}[]
}>()
const state = reactive({
  activeTab: 0
})
onMounted(() => {

})
</script>

<template>
  <div class="f-tabs">
    <div class="f-tabs-selection">
      <button
          :key="itemIndex"
          class="f-tabs-pivot"
          @click="state.activeTab=itemIndex"
          v-for="(item,itemIndex) of items"
          :class="{'active': state.activeTab === itemIndex}"
      >
        {{item.label}}
        <span class="f-tabs-pivot-border-bottom" />
      </button>
    </div>
    <div class="f-tabs-list">
      <template v-for="(tabItem,tabItemIndex) of items">
          <Transition>
            <FTab v-if="state.activeTab === tabItemIndex">
              <slot name="item" :item="tabItem" :index="tabItemIndex">
                {{tabItem.content}}
              </slot>
            </FTab>
          </Transition>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.f-tabs-pivot.active {
  position: relative;
  .f-tabs-pivot-border-bottom {
    border-bottom: 2px solid #0078D4;
    position: absolute;
    bottom: 0;
    height: 2px;
    width: 65%;
    left: 17.5%;
    transition: all 0.1s linear;
    border-bottom: 2px solid #0078D4;
  }
}
.f-tabs-pivot {
  border: none;
  color: #201F1E;
  display: inline-block;
  background-color: white;
  padding: 12px 8px;
  &:hover {
    background-color: #F3F2F1;
    .f-tabs-pivot-border-bottom {
      width: 100%;
      left: 0;
    }
  }
  &:active {
    background-color: #EDEBE9;
  }
  //&:focus {
  //  border: 1px solid #201F1E;
  //  .f-tabs-pivot-border-bottom {
  //    width: 100%;
  //    left: 0;
  //  }
  //}
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>