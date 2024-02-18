<script setup lang="ts">
import {Root,Tooltip,color,Color,p0,p100,Circle,Bullet,Scrollbar} from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import {ValueAxis,XYChart,AxisRendererY,AxisRendererX,LineSeries,XYCursor} from "@amcharts/amcharts5/xy";
import {ref} from "vue";
import {ChartIndicator} from "@amcharts/amcharts5/stock";
import ChartController from "~/types/ChartController";

export interface Data {
  x:number
  value:number
}

const props = defineProps<{
  data: Data[]
}>()

watch(props.data,(newValue) => {
  console.log(123)
}, {  immediate: true })

let main = ref<Root|null>(null)
// let chart = ref<Chart|null>(null)
// let cursor = ref<XYCursor|null>(null)
// let series = ref<LineSeries|null>(null)
// let yAxis = ref<ValueAxis<AxisRenderer>|null>(null)
// let xAxis = ref<ValueAxis<AxisRenderer>|null>(null)

// let chartController = reactive<ChartController>(new ChartController)
//let chartController = new ChartController

let processControlChart = ref<HTMLElement|null>(null)
// let processControlChart2 = ref<HTMLElement|null>(null)

let chartController

onMounted(() => {
  if (processControlChart.value !== null) {
     //  chartController = new ChartController
     // chartController.setRootElement(processControlChart2.value!)
     // chartController.addData(props.data)
     // console.log(chartController)

    //let root = chartController.root!
   let root = Root.new(processControlChart.value!);
    // Set themes
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    let chart = root.container.children.push(
        // @ts-ignore
        XYChart.new(root, {
          panX: true,
          panY: true,
          wheelX: "panX",
          wheelY: "zoomX"
        })
    )
    // Create axes
    let xAxis = chart.xAxes.push(
        ValueAxis.new(root, {
          renderer: AxisRendererX.new(root, {
            minGridDistance: 50
          }),
          tooltip: Tooltip.new(root, {})
        })
    )
    let yAxis = chart.yAxes.push(
        ValueAxis.new(root, {
          renderer: AxisRendererY.new(root, {})
        })
    )
   //  // Add series
    let series = chart.series.push(
        LineSeries.new(root, {
          minBulletDistance: 10,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value",
          valueXField: "x",
          tooltip: Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "{valueY}"
          })
        })
    )
    series.strokes.template.setAll({
      strokeWidth: 1
    })
    series.data.setAll(props.data);


    series.bullets.push(function () {
      return Bullet.new(root, {
        sprite: Circle.new(root, {
          radius: 6,
          fill: series.get("fill"),
          stroke: root.interfaceColors.get("background"),
          strokeWidth: 2
        })
      })
    })
   // Add cursor
    let cursor = chart.set("cursor", XYCursor.new(root, {
      xAxis: xAxis
    }))
    cursor.lineY.set("visible", false);
    // add scrollbar
    chart.set("scrollbarX", Scrollbar.new(root, {
      orientation: "horizontal"
    }))
    // Make stuff animate on load
    series.appear(1000, 100);
    chart.appear(1000, 100);
    function createRange(value:number, endValue:number|undefined, label:string|undefined, color: Color, dashed: boolean = false) {
      let rangeDataItem = yAxis.makeDataItem({
        value: value,
        endValue: endValue
      } as any);

      let range = yAxis.createAxisRange(rangeDataItem);

      if (endValue) {
        range.get("axisFill")?.setAll({
          fill: color,
          fillOpacity: 0.2,
          visible: true
        });
      }
      else {
        range.get("grid")?.setAll({
          stroke: color,
          strokeOpacity: 1,
          strokeWidth: 2,
          location: 1
        });

        if (dashed) {
          range.get("grid")?.set("strokeDasharray", [5, 3]);
        }
      }

      if (label) {
        range.get("label")?.setAll({
          text: label,
          location: 1,
          fontSize: 19,
          inside: true,
          centerX: p0,
          centerY: p100
        });
      }
    }
    // Function to add process control ranges
    function addLimits(lower:number,upper:number) {
      // Add range fill
      createRange(lower, upper, undefined, color(0xffce00));
      // Add upper/average/lower lines
      createRange(lower, undefined, "Lower control limit", color(0x4d00ff));
      createRange(upper, undefined, "Upper control limit", color(0x4d00ff));
      createRange(lower + (upper - lower) / 2, undefined, "Process average", color(0x4d00ff), true);
    }
    addLimits(10, 20)
    main.value = root
  } else {
    //alert('111')
  }
})
</script>

<template>
  <div class="chart" ref="processControlChart" />
<!--  <div class="chart" id="test" ref="processControlChart2" />-->
</template>

<style scoped lang="scss">
  .chart {
    width: 100%;
    height: 800px;
  }
</style>