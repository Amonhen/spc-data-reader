import {Buffer} from "node:buffer";
import {writeFile} from "node:fs/promises";
import {open} from "sqlite";
import sqlite3 from "sqlite3";
import type {DataBaseRecord, DataBaseRecordMapped, Measurement, MeasureRecord} from "~/types/interfaces";
import moment from "moment/moment";
import {MeasureRecord as MeasureRecordObject} from "~/types/MeasureRecord";

export default class DBProcess {
    public static async process(file: File): Promise<Measurement> {
            const fileData: Uint8Array = new Uint8Array(Buffer.from(await file.arrayBuffer()));
            const fileName: string = file.name
            await writeFile(`uploads/${fileName}`, fileData)
            const db = await open({
                filename: `uploads/${fileName}`,
                driver: sqlite3.Database
            })
            let dataBaseRecords: DataBaseRecord[] = await db.all('SELECT * FROM data')
            let dataBaseRecordsMapped: DataBaseRecordMapped[] = dataBaseRecords.map<DataBaseRecordMapped>((record: DataBaseRecord) => {
                let date: moment.Moment = moment(record["time@timestamp"] * 1000)
                return {
                    time: record["time@timestamp"] * 1000,
                    // time: date.format('DD.MM.YYYY HH:mm:ss'),
                    header: record.data_format_0.toString(),
                    valueMin: record.data_format_1,
                    valueMax: record.data_format_2,
                }
            })
            let measurement: Measurement = []
            let currentRecord: MeasureRecord = new MeasureRecordObject
            dataBaseRecordsMapped.forEach((item: DataBaseRecordMapped, currentIndex: number) => {
                if (item.header.includes('Ch:')) {
                    if (currentRecord.channel.length) {
                        measurement.push(currentRecord)
                        currentRecord = new MeasureRecordObject
                    }
                    currentRecord.channel = item.header.split(' ')[1].replaceAll('\x00', '')
                } else if (item.header.includes('Prod:')) {
                    currentRecord.product = item.header.split(' ')[1].replaceAll('\x00', '')
                } else if (item.header.includes('Oper:')) {
                    currentRecord.operation = item.header.split(' ')[1].replaceAll('\x00', '')
                } else if (item.header.includes('Oper:')) {
                    currentRecord.operation = item.header.split(' ')[1].replaceAll('\x00', '')
                } else if (item.header.includes('Control')) {
                    currentRecord.control_limit.min = item.valueMin
                    currentRecord.control_limit.max = item.valueMax
                } else if (item.header.includes('Spec')) {
                    currentRecord.specification_limit.min = item.valueMin
                    currentRecord.specification_limit.max = item.valueMax
                } else if (item.header.includes('Nominal:')) {
                    currentRecord.nominal = item.valueMin
                } else {
                    let machineName: string = item.header.replaceAll('\x00', '')
                    !currentRecord.data[machineName] && (currentRecord.data[machineName] = [])
                    currentRecord.data[machineName].push({
                        time: item.time,
                        min: currentRecord.specification_limit.min + currentRecord.nominal,
                        max: currentRecord.specification_limit.max + currentRecord.nominal,
                        average: currentRecord.nominal + ((item.valueMin + item.valueMax) / 2),
                    })
                }
                if (currentIndex === (dataBaseRecordsMapped.length - 1)) {
                    measurement.push(currentRecord)
                }
            })
            return measurement
    }
}