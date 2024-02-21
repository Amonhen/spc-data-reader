import moment from "moment";
import type {Buffer} from "node:buffer";

export interface DataBaseRecord {
    data_index: number
    'time@timestamp': number
    data_format_0: Buffer
    data_format_1: number
    data_format_2: number
}

export interface DataBaseRecordMapped {
    time: number
    header: string
    valueMin: number
    valueMax: number
}

export interface MinAndMaxValue {
    min: number
    max: number
}

export interface MinAndMaxAverageValue {
    min: number
    max: number
    time: number
    average: number
}

export interface MeasureRecord {
    channel: string
    product: string
    operation: string
    control_limit: MinAndMaxValue
    specification_limit: MinAndMaxValue
    nominal: number
    data: { [key:string]: MinAndMaxAverageValue[] }
}

export interface TableData {
    time: moment.Moment
    channel: string
    machine: string
    average: number
    max_value: number
    min_value: number
    operation: string
}

export interface ChartData {
    title: string,
    data: { title: string, values: number[] }
    vData: { title: string, values: number[] }
    hData: { title: string, values: number[] }
    min_value: { title: string, value:number }
    max_value: { title: string, value:number }
}

export type Measurement = MeasureRecord[]