<script setup lang="ts">
import {Root,Chart,Tooltip,color,Color,p0,p100,Circle,Bullet,Scrollbar} from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import {ValueAxis,AxisRenderer,XYChart,AxisRendererY,AxisRendererX,LineSeries,XYCursor} from "@amcharts/amcharts5/xy";
import {ref} from "vue";

export interface Data {
  x:number
  value:number
}

const props = defineProps<{
  data: Data[]
}>()

let root = ref<Root|null>(null)
let chart = ref<Chart|null>(null)
let cursor = ref<XYCursor|null>(null)
let series = ref<LineSeries|null>(null)
let yAxis = ref<ValueAxis<AxisRenderer>|null>(null)
let xAxis = ref<ValueAxis<AxisRenderer>|null>(null)
let processControlChart = ref<HTMLElement|null>(null)

let chartData = ref<Data[]>([
  { x: 1, value: 14 },
  { x: 2, value: 11 },
  { x: 3, value: 12 },
  { x: 4, value: 14 },
  { x: 5, value: 11 },
  { x: 6, value: 11 },
  { x: 7, value: 12 },
  { x: 8, value: 12 },
  { x: 9, value: 13 },
  { x: 10, value: 15 },
  { x: 11, value: 19 },
  { x: 12, value: 21 },
  { x: 13, value: 22 },
  { x: 14, value: 20 },
  { x: 15, value: 18 },
  { x: 16, value: 14 },
  { x: 17, value: 16 },
  { x: 18, value: 18 },
  { x: 19, value: 17 },
  { x: 20, value: 15 },
  { x: 21, value: 12 },
  { x: 22, value: 8 },
  { x: 23, value: 11 }
])

onMounted(() => {
  if (processControlChart.value !== null) {
    root.value = Root.new(processControlChart.value!);
    // // Set themes
    // root.value!.setThemes([
    //   am5themes_Animated.new(root.value!)
    // ]);
    chart.value = root.value!.container.children.push(
        // @ts-ignore
        XYChart.new(root.value!, {
          panX: true,
          panY: true,
          wheelX: "panX",
          wheelY: "zoomX"
        })
    )
    // Create axes
    xAxis.value = chart.value!.xAxes.push(
        ValueAxis.new(root.value!, {
          renderer: AxisRendererX.new(root.value!, {
            minGridDistance: 50
          }),
          tooltip: Tooltip.new(root.value!, {})
        })
    )
    yAxis.value = chart.value!.yAxes.push(
        ValueAxis.new(root.value!, {
          renderer: AxisRendererY.new(root.value!, {})
        })
    )
    // Add series
    series.value = chart.value!.series.push(
        LineSeries.new(root.value!, {
          minBulletDistance: 10,
          xAxis: xAxis.value!,
          yAxis: yAxis.value!,
          valueYField: "value",
          valueXField: "x",
          tooltip: Tooltip.new(root.value!, {
            pointerOrientation: "horizontal",
            labelText: "{valueY}"
          })
        })
    )
    series.value!.strokes.template.setAll({
      strokeWidth: 1
    })
    series.value!.data.setAll(chartData.value);
    series.value!.bullets.push(function () {
      return Bullet.new(root.value!, {
        sprite: Circle.new(root.value!, {
          radius: 6,
          fill: series.value!.get("fill"),
          stroke: root.value!.interfaceColors.get("background"),
          strokeWidth: 2
        })
      })
    })
    // Add cursor
    cursor.value = chart.value!.set("cursor", XYCursor.new(root.value!, {
      xAxis: xAxis.value!
    }))
    cursor.value!.lineY.set("visible", false);
    // add scrollbar
    chart.value!.set("scrollbarX", Scrollbar.new(root.value!, {
      orientation: "horizontal"
    }))
    // Make stuff animate on load
    series.value!.appear(1000, 100);
    chart.value!.appear(1000, 100);
    addLimits(10, 20)
  } else {
    //alert('111')
  }
})

function createRange(value:number, endValue:number|undefined, label:string|undefined, color: Color, dashed: boolean = false) {
  let rangeDataItem = yAxis.value!.makeDataItem({
    value: value,
    endValue: endValue
  } as any);

  let range = yAxis.value!.createAxisRange(rangeDataItem);

  if (endValue) {
    range.get("axisFill").setAll({
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
</script>

<template>
  <div class="chart" ref="processControlChart" />
</template>

<style scoped lang="scss">
.chart {
  width: 100%;
  height: 800px;
  background: darkred;
}
</style>