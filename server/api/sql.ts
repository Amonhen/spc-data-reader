import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { Buffer } from "node:buffer";
import { writeFile } from 'node:fs/promises';

interface Record {
   data_index: number
   'time@timestamp': string
   data_format_0: Buffer
   data_format_1: number
   data_format_2: number
}

interface MinAndMaxValue {
   min: number
   max: number
   average?: number
}

interface MeasureRecord {
   channel: string
   product: string
   operation: string
   control_limit: MinAndMaxValue
   specification_limit: MinAndMaxValue
   nominal: number
   data: { [key:string]: MinAndMaxValue }
}

type Measurement = MeasureRecord[]

export default defineEventHandler(async (event) => {
   const formData = await readFormData(event)
   let data = null
   if (formData.has('file')) {
      const file = new Uint8Array(Buffer.from(await (formData.get('file') as File).arrayBuffer()));
      const fileName = formData.get('fileName') as string
      await writeFile(`uploads/${fileName}`,file)
         const db = await open({
            filename: `uploads/${fileName}`,
            driver: sqlite3.Database
         })
      let fdata: Record[] = await db.all('SELECT * FROM data')
      let dddd = fdata.map(d=> {
        return {
           time: d["time@timestamp"],
           header: d.data_format_0.toString(),
           valueMin: d.data_format_1,
           valueMax: d.data_format_2,
        }
      })

      let measurement: Measurement = []
      let currentRecord: MeasureRecord = {
         channel: "",
         product: "",
         operation: "",
         control_limit: { min: 0, max: 0 },
         specification_limit: { min: 0, max: 0 },
         nominal: 0,
         data: {}
      }
      let headerData: boolean = false
      dddd.forEach((item) => {
         if (item.header.includes('Ch:')) {
            measurement.push(currentRecord)
            headerData = true
            currentRecord.channel = item.header.split(' ')[1].replaceAll('\x00', '')
         }
         else if (item.header.includes('Prod:')) {
            currentRecord.product = item.header.split(' ')[1].replaceAll('\x00', '')
         }
         else if (item.header.includes('Oper:')) {
            currentRecord.operation = item.header.split(' ')[1].replaceAll('\x00', '')
         }
         else if (item.header.includes('Oper:')) {
            currentRecord.operation = item.header.split(' ')[1].replaceAll('\x00', '')
         }
         else if (item.header.includes('Control')) {
            currentRecord.control_limit.min = item.valueMin
            currentRecord.control_limit.max = item.valueMax
         }
         else if (item.header.includes('Spec')) {
            currentRecord.specification_limit.min = item.valueMin
            currentRecord.specification_limit.max = item.valueMax
         }
         else if (item.header.includes('Nominal:')) {
            currentRecord.nominal = item.valueMin
            headerData = false
         }
         else {
            currentRecord.data[item.header] = {
               min: item.valueMin,
               max: item.valueMax,
               average: 0
            }
         }
      })
      return dddd
   }
})