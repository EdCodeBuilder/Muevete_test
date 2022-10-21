/**
 * Mixin for generate XLSX report from JSON
 */

import XLSX from 'xlsx/xlsx'
const ExcelMixin = {
  install(Vue) {
    Vue.mixin({
      methods: {
        /**
         * Receive filename as string
         * Excel Headers os object with text/label value/field keys
         * Data as object
         * Sheet Name as string
         *
         * @param fileName
         * @param excelHeaders
         * @param data
         * @param sheetName
         */
        createExcelFile(
          fileName = 'EXCEL_DATA',
          excelHeaders = [],
          data = [],
          sheetName = 'SHEET_1'
        ) {
          const createXLSLFormatObj = []
          let newXlsHeader = []
          const vm = this
          if (excelHeaders.length === 0) {
            vm.$snackbar({ message: 'Add Columns' })
            return
          }
          if (data.length === 0) {
            vm.$snackbar({ message: 'Add Data' })
            return
          }
          newXlsHeader = excelHeaders.map((value) => {
            return (value.label || value.text || '').toUpperCase()
          })
          createXLSLFormatObj.push(newXlsHeader)
          data.map((value) => {
            let innerRowData = []
            innerRowData = excelHeaders.map((val) => {
              if (val.dataFormat && typeof val.dataFormat === 'function') {
                return val.dataFormat(value[val.field || val.value])
              } else {
                return `${value[val.field || val.value]}`
              }
            })
            return createXLSLFormatObj.push(innerRowData)
          })
          const name = (fileName || 'EXCEL_DATA').toUpperCase() + '.xlsx'
          const wsName = (sheetName || 'SHEET_1').toUpperCase()
          const wb = XLSX.utils.book_new()
          const ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj)
          XLSX.utils.book_append_sheet(wb, ws, wsName)
          XLSX.writeFile(wb, name)
        },
      },
    })
  },
}

export default ExcelMixin
