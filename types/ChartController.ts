import {Root, Tooltip} from "@amcharts/amcharts5";
import {AxisRendererX, AxisRendererY, LineSeries, ValueAxis, XYChart, XYCursor} from "@amcharts/amcharts5/xy";

export default class ChartController {
    public root: Root|undefined
    public chart:XYChart|undefined
    public cursor: XYCursor|undefined
    public series: LineSeries|undefined
    public yAxis: ValueAxis<any>|undefined
    public xAxis: ValueAxis<any>|undefined

    data = [
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
    ]

    public setRootElement(element: HTMLElement) {
       // console.log(element)
        let ddd = document.getElementById('test')
        this.root = Root.new('test')
        this.setChart()
    }
    public setChart() {
        this.chart = XYChart.new(this.root!, {
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX"
        })
        this.root!.container.children.push(this.chart!)
        this.addXAxis()
        this.addYAxis()
        this.addSeries()
        this.addData([])
    }
    public addXAxis() {
        this.xAxis = ValueAxis.new(this.root!, {
            renderer: AxisRendererX.new(this.root!, {
                minGridDistance: 50
            }),
            tooltip: Tooltip.new(this.root!, {})
        })
        this.chart!.xAxes.push(this.xAxis!)
    }
    public addYAxis() {
        this.yAxis =  ValueAxis.new(this.root!, {
            renderer: AxisRendererY.new(this.root!, {})
        })
        this.chart!.yAxes.push(this.yAxis!)
    }
    public addSeries() {
        this.series = LineSeries.new(this.root!, {
            minBulletDistance: 10,
            xAxis: this.xAxis!,
            yAxis: this.yAxis!,
            valueYField: "value",
            valueXField: "x",
            tooltip: Tooltip.new(this.root!, {
                pointerOrientation: "horizontal",
                labelText: "{valueY}"
            })
        })
        this.chart!.series.push(this.series!)
        this.series!.strokes.template.setAll({
            strokeWidth: 1
        })
    }
    public addData(data:any) {
        this.series!.data.push(this.data)
       // this.series!.data.setAll(data)
       // alert('123123')
       // console.log(this.series!.data)
    }
}