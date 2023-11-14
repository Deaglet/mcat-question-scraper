<script setup lang="ts">
import { RouterView, useRouter} from 'vue-router'
import { ref, reactive } from 'vue'

type navBarObject = {text: string, icon: string, url: string}
interface navBarArray {
  [index: number]: navBarObject
}
const items = reactive<navBarArray>([
  {
    text: 'Home',
    icon: 'home',
    url: 'home'
  },
  {
    text: 'Calendar',
    icon: 'calendar_month',
    url: 'calendar'
  }
])
const active = ref(0)
const router = useRouter()

function navigateToActiveTab(active : number){
  router.push({
    name: items[active].url
  })
}
</script>

<template>
  <header>
    <div class="wrapper">
      <ui-navigation-bar content-selector=".wrapper" stacked>
        <ui-tabs
          v-model="active"
          type="textWithIcon"
          :items="items"
          stacked
          @update:model-value="navigateToActiveTab">
        </ui-tabs>
      </ui-navigation-bar>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}
</style>
