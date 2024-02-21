import {
    type MeasureRecord as MeasureRecordInterface,
    type MinAndMaxAverageValue,
    type MinAndMaxValue
} from "~/types/interfaces";

export class MeasureRecord implements MeasureRecordInterface {
    channel: string = ""
    nominal: number = 0;
    operation: string = ""
    product: string = ""
    specification_limit: MinAndMaxValue = {
        min: 0,
        max: 0
    }
    control_limit: MinAndMaxValue = {
        min: 0,
        max: 0
    }
    data: { [key:string]: MinAndMaxAverageValue[] } = {};
}