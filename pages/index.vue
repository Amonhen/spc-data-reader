<script lang="ts" setup>
import {ref} from 'vue'
import moment from "moment";
import {NUpload,NSelect,NDatePicker} from 'naive-ui'
import type {UploadInst,UploadFileInfo} from 'naive-ui'
import type {ChartData, Measurement, TableData} from "~/types/interfaces"
import DBProcess from "~/types/DBProcess";


let tableData = ref<TableData[]>([])
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

let selection = reactive({
  machine: "",
  channel: "",
  date: [1183135260000, Date.now()] as [number,number],
  operation: ""
})

function removeDuplicates(arr): string[] {
  let unique = arr.reduce(function (acc, curr) {
    if (!acc.includes(curr))
      acc.push(curr);
    return acc;
  }, []);
  return unique;
}

let chartData = computed<ChartData>(() => {
    let selectedMachineAverages = tableData.value.filter(data=>data.machine===selection.machine).map(data=>data.average)
    let maxValue = tableData.value.filter(data=>data.machine===selection.machine).map(data=>data.max_value)
    let minValue = tableData.value.filter(data=>data.machine===selection.machine).map(data=>data.min_value)
    // console.log(selectedMachineAverages.map((_,index)=>index))
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
  if (fileEvent.fileList.length) {
    let data = await DBProcess.process(fileEvent.fileList[0].file!)
    console.log(data)
    //let formData = new FormData
    //formData.set('file', fileEvent.fileList[0].file!)
    //formData.set('fileName', fileEvent.fileList[0].file!.name)
    //const { data } = await useFetch<Measurement>('/api/sql', { method: "POST", body: formData })
    // if (data.value) {
    //   data.value!.forEach((record,recordIndex:number) => {
    //     recordIndex === 0 && (selection.channel = record.channel)
    //     recordIndex === 0 && (selection.operation= record.operation)
    //     Object.keys(record.data).forEach((machineName:string,machineIndex:number) => {
    //       machineIndex === 0 && recordIndex === 0 && (selection.machine = machineName)
    //       record.data[machineName].forEach((machineRecord,machineRecordIndex) => {
    //         let time = moment(machineRecord.time)
    //         if (recordIndex === 0 && machineIndex === 0 && machineRecordIndex === 0) {
    //           selection.date[0] = machineRecord.time
    //         }
    //         tableData.value.push({
    //           time: time,
    //           channel: record.channel,
    //           machine: machineName,
    //           average: machineRecord.average,
    //           max_value: machineRecord.max,
    //           min_value: machineRecord.min,
    //           operation: record.operation
    //         })
    //       })
    //     })
    //   })
    // }
  } else {
    tableData.value = []
  }
}
</script>

<template>
  <div id="index-page">
    <FButton @click="uploadElement?.openOpenFileDialog()">Select File</FButton>
    <NUpload ref="uploadElement" accept=".db" :default-upload="false" @change="onFileChanged" :max="1" />
    <FTabs :items="tabItems">
      <template #item="{item}">
        <DetailsList v-if="tableData.length && item['label'] ==='Table'" :rows="tableData" :columns="columns" />
        <div style="display: flex;justify-content: space-between">
          <NSelect style="width: 24%;display: inline-block" v-if="tableData.length && item['label'] ==='Chart'" v-model:value="selection.machine" :options="removeDuplicates(tableData.map(d=>d.machine)).map(s=>{return{label:s,value:s}})" />
          <NSelect style="width: 24%;display: inline-block" v-if="tableData.length && item['label'] ==='Chart'" v-model:value="selection.channel" :options="removeDuplicates(tableData.map(d=>d.channel)).map(s=>{return{label:s,value:s}})" />
          <NSelect style="width: 24%;display: inline-block" v-if="tableData.length && item['label'] ==='Chart'" v-model:value="selection.operation" :options="removeDuplicates(tableData.map(d=>d.operation)).map(s=>{return{label:s,value:s}})" />
          <NDatePicker style="width: 24%;display: inline-block" v-if="tableData.length && item['label'] ==='Chart'" v-model:value="selection.date" type="daterange" clearable />
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
#index-page {
  padding: 20px;
}
</style>