<script setup lang="ts">
const props = defineProps<{
  rows: object[],
  columns: {field:string,label:string, format?: (value:any) => string}[]
}>()
</script>

<template>
  <table>
    <thead>
      <tr>
        <th v-for="(header,headerIndex) of columns" :key="headerIndex">{{header.label}}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row,rowIndex) of rows" :key="rowIndex">
        <td v-for="(column,colIndex) of columns" :key="colIndex">
          <template v-if="column.format">
            {{column.format(row[column.field])}}
          </template>
          <template v-else>
            {{row[column.field]}}
          </template>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped lang="scss">
  table {
    width: 100%;
    tbody {
      tr {
        height: 43px;
        td {
          border-bottom: 1px solid #EDEBE9;
        }
      }
    }
  }
</style>