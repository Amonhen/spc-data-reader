<script setup lang="ts">
import { GChart } from 'vue-google-charts'
interface ProcessData {
  title: string,
  values: number[]
}

const type = "LineChart";

const props = defineProps<{
  title: string
  data: ProcessData[]
  hData: ProcessData,
  vData: ProcessData,
  maxValue?: { title: string, value: number }
  minValue?: { title: string, value: number },
  curvedLines?: boolean
}>()

const columnLength = computed(() => {
  return props.data.map(data=>data.values.length).reduce((previous:number,current:number) => {
    return current > previous ? current : previous
  },0)
})

const chartData = computed(() => {
  let _data = []
  let titles: string[] = []
  titles.push(props.hData.title)
  props.minValue && titles.push(props.minValue.title)
  props.data.forEach((data)=>titles.push(data.title))
  props.maxValue && titles.push(props.maxValue.title)
  _data.push(titles)
  for (let index = 1; index <= columnLength.value; index++) {
    let column = []
    column.push(props.hData.values[index-1])
    props.minValue && column.push(props.minValue.value)
    props.data.forEach(d=>column.push(d.values[index-1]??undefined))
    props.maxValue && column.push(props.maxValue.value)
    _data.push(column)
  }
  return _data
})

const options = computed(()=>{
  return {
    title: props.title,
    curveType: props.curvedLines ? "function" : undefined,
    legend: { position: "bottom" },
    width: "100vw",
    height: "750",
    vAxis: {
      viewWindow: {
        min: (props.minValue ? props.minValue.value - 0.2 : undefined) ?? 0,
        max: (props.maxValue ? props.maxValue.value + 0.2 : undefined) ?? 1000,
      },
    },
    hAxis: {
      viewWindow: {
        min: 1,
        max: columnLength.value,
      },
    },
  }
})
</script>

<template>
  <GChart
      :type="type"
      :data="chartData"
      :options="options"
  />
</template>

<style scoped lang="scss">

</style>