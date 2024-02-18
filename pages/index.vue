<script lang="ts" setup>
import {ref} from 'vue'
let dbData = ref([])
import {NUpload,NButton} from 'naive-ui'
import FButton from "~/components/FButton.vue"
import type {UploadInst,UploadFileInfo} from 'naive-ui'
import ProccessControlChart from "~/components/ProccessControlChart.vue";
import { type Data as ChartData} from "~/components/ProccessControlChart.vue"
import ProccessChart from "~/components/ProccessChart.vue";
let columns = ref<{ field: string, label: string }[]>([
  { field: "time", label: "Date" },
  { field: "header", label: "Header" },
  { field: "valueMin", label: "Min" },
  { field: "valueMax", label: "Max" }
])
const uploadElement = ref<UploadInst | null>(null)
async function handleChange (fileEvent: { fileList: UploadFileInfo[] }) {
   if (fileEvent.fileList.length) {
     let formData = new FormData
     formData.set('file', fileEvent.fileList[0].file!)
     formData.set('fileName', fileEvent.fileList[0].file!.name)
     const {data} = await useFetch('/api/sql', { method: "POST", body: formData })
     let ttt: { time: number|Date|string }[] = data.value as any[]
     ttt = ttt.map((dt) => {
       dt.time = new Date((dt.time as number) * 1000)
       dt.time = (dt.time as Date).toLocaleString()
       return dt
     })
     // @ts-ignore
     dbData.value = ttt
   } else {
     dbData.value = []
   }
}
const tabItems = ref<{label:string,content:string}[]>([
  { label: "Table", content: "" },
  { label: "Chart", content: "2" }
])
// let chartData = ref<ChartData[]>([
//   { x: 1, value: 14 },
//   { x: 2, value: 11 },
//   { x: 3, value: 12 },
//   { x: 4, value: 14 },
//   { x: 5, value: 11 },
//   { x: 6, value: 11 },
//   { x: 7, value: 12 },
//   { x: 8, value: 12 },
//   { x: 9, value: 13 },
//   { x: 10, value: 15 },
//   { x: 11, value: 19 },
//   { x: 12, value: 21 },
//   { x: 13, value: 22 },
//   { x: 14, value: 20 },
//   { x: 15, value: 18 },
//   { x: 16, value: 14 },
//   { x: 17, value: 16 },
//   { x: 18, value: 18 },
//   { x: 19, value: 17 },
//   { x: 20, value: 15 },
//   { x: 21, value: 12 },
//   { x: 22, value: 8 },
//   { x: 23, value: 11 }
// ])
</script>

<template>
  <div id="index-page">
    <FButton @click="uploadElement?.openOpenFileDialog()">Select File</FButton>
    <NUpload ref="uploadElement" accept=".db" :default-upload="false" @change="handleChange" :max="1" />
        <FTabs :items="tabItems">
          <template #item="{item}">
        <DetailsList v-if="dbData.length && item['label'] ==='Table'" :rows="dbData" :columns="columns" />
            <ProccessChart
                v-if="item['label'] === 'Chart'"
                :data="[
                    {title: '111', values: [110,120,200,300,150]},
                    //{title: '222', values: [120,200,100,300]}
                    ]"
                :title="'Test'"
                :curved-lines="true"
                :h-data="{title: 'H', values: ['100','100','100','100','100']}"
                :v-data="{title: 'V', values: ['200','200','200','200','200']}"
                :max-value="{title: 'Max V', value: 500}"
                :min-value="{title: 'Min V', value: 50}"
            />
      </template>
    </FTabs>
  </div>
</template>

<style scoped lang="scss">
  #index-page {
    padding: 20px;
  }
</style>