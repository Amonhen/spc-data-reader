<script lang="ts" setup>
import {ref} from 'vue'
import moment from "moment";
import DBProcess from "~/types/DBProcess";
import type {UploadFileInfo, UploadInst} from 'naive-ui'
import {NDatePicker, NSelect, NUpload} from 'naive-ui'
import type {ChartData, TableData} from "~/types/interfaces"

const uploadElement = ref<UploadInst | null>(null)
const tabItems = ref<{label:string,content:string}[]>([
  { label: "Table", content: "" },
  { label: "Chart", content: "" }
])
let columns = ref<{ field: string, label: string, format?: (value:any) => string  }[]>([
  { field: "time", label: "Date", format: (value:moment.Moment) => value.format('DD.MM.YYYY HH:MM:SS') },
  { field: "channel", label: "Channel" },
  { field: "machine", label: "Machine" },
  { field: "average", label: "Average" },
])

let tableData = ref<TableData[]>([])
let selection = reactive({
  machine: "",
  channel: "",
  operation: "",
  product: "",
  date: [1183135260000, Date.now()] as [number,number],
})

function removeDuplicates(array:string[]): string[] {
  return array.reduce(function (acc: string[], curr: string) {
    let str = curr.toUpperCase()
    if (!acc.includes(str))
      acc.push(str);
    return acc;
  }, []);
}

let chartData = computed<ChartData>(() => {
  console.log(selection)
  let selectedMachineAverages = tableData.value.filter((data) => {
    return (data.machine === selection.machine) && (data.product === selection.product) && (data.time as moment.Moment).isBetween(selection.date[0],selection.date[1])
  }).map(data=>data.average)
  let maxValue = tableData.value.filter((data) => {
    return (data.machine === selection.machine) && (data.product === selection.product)
  }).map(data=>data.max_value)
  let minValue = tableData.value.filter((data) => {
    return (data.machine === selection.machine) && (data.product === selection.product)
  }).map(data=>data.min_value)
  console.log(selectedMachineAverages,maxValue,minValue)
  return {
    title: selection.machine + " measurement data",
    data: {
      title: selection.machine,
      values: selectedMachineAverages
    },
    vData: { title: 'Average', values: [40,50,60] },
    hData: { title: 'Records', values: selectedMachineAverages.map((_,index)=>index+1) },
    min_value: { title: "Minimal", value: minValue[0] },
    max_value: { title: "Maximum", value: maxValue[0] }
  }
})

async function onFileChanged(fileEvent: { fileList: UploadFileInfo[] }) {
  console.log(fileEvent)
  if (fileEvent.fileList.length) {
    let data = await DBProcess.process(fileEvent.fileList[0].file!)
    if (data) {
      data.forEach((record,recordIndex:number) => {
        recordIndex === 0 && (selection.channel = record.channel)
        recordIndex === 0 && (selection.operation= record.operation)
        Object.keys(record.data).forEach((machineName:string,machineIndex:number) => {
          machineIndex === 0 && recordIndex === 0 && (selection.machine = machineName)
          record.data[machineName].forEach((machineRecord,machineRecordIndex) => {
            let time = moment(machineRecord.time)
            if (recordIndex === 0 && machineIndex === 0 && machineRecordIndex === 0) {
              selection.date[0] = machineRecord.time
              selection.product = record.product
            }
            tableData.value.push({
              time: time,
              product: record.product,
              channel: record.channel,
              machine: machineName,
              average: machineRecord.average,
              max_value: machineRecord.max,
              min_value: machineRecord.min,
              operation: record.operation
            })
          })
        })
      })
    }
  } else {
    tableData.value = []
  }
}
</script>

<template>
  <div id="banner">
    <img src="/skf-banner-logo.svg" alt="SKF" />
  </div>
  <div id="index-page">
    <FButton @click="uploadElement?.openOpenFileDialog()">Select File</FButton>
    <NUpload ref="uploadElement" accept=".db" :default-upload="false" @change="onFileChanged" :max="1" />
    <FTabs v-if="tableData.length" :items="tabItems" style="margin: 20px 0">
      <template #item="{item}">
        <DetailsList v-if="tableData.length && item['label'] ==='Table'" :rows="tableData" :columns="columns" />
        <div style="display: flex;justify-content: space-between;margin: 20px 0">
          <NSelect style="width: 24%;display: inline-block" v-if="tableData.length && item['label'] ==='Chart'" v-model:value="selection.machine" :options="removeDuplicates(tableData.map(d=>d.machine)).map(s=>{return{label:s,value:s}})" />
          <NSelect style="width: 24%;display: inline-block" v-if="tableData.length && item['label'] ==='Chart'" v-model:value="selection.product" :options="removeDuplicates(tableData.map(d=>d.product)).map(s=>{return{label:s,value:s}})" />
          <NSelect style="width: 24%;display: inline-block" v-if="tableData.length && item['label'] ==='Chart'" v-model:value="selection.operation" :options="removeDuplicates(tableData.map(d=>d.operation)).map(s=>{return{label:s,value:s}})" />
          <NDatePicker style="width: 24%;display: inline-block" v-if="tableData.length && item['label'] ==='Chart'" v-model:value="selection.date" type="daterange"  />
        </div>
        <ProcessChart
            v-if="tableData.length && item['label'] === 'Chart'"
            :data="[chartData.data]"
            :title="chartData.title"
            :h-data="chartData.hData"
            :v-data="chartData.vData"
            :max-value="chartData.max_value"
            :min-value="chartData.min_value"
        />
      </template>
    </FTabs>
  </div>
</template>

<style scoped lang="scss">
#banner {
  width: 100wv;
  display: flex;
  justify-content: flex-end;
  padding: 0;
  margin: 0;
  height: 5vh;
  background: #0066CC;
}
#index-page {
  padding: 20px;
}
</style>