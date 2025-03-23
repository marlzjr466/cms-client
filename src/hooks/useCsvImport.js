import Papa from "papaparse"
import _ from "lodash"
import swal from '@utilities/swal'

const useCsvImport = () => {
  return {
    importData: async () => {
      return new Promise(resolve => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.csv'
        input.onchange = event => {
          const file = event.target.files[0]

          swal.prompt({
            title: 'Import File',
            text: `Are you sure to import ${file.name}?`,
            async onConfirm () {
              Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: result => {
                  const formattedFields = result.meta.fields.map(item => _.snakeCase(item))
                  const formattedData = result.data?.map(row => {
                    return _.mapKeys(row, (value, key) => _.snakeCase(key))
                  })
    
                  resolve({
                    list: (formattedData && formattedData.length) ? formattedData : [],
                    meta: {
                    ...result.meta,
                    fields: formattedFields
                    } 
                  })
                }
              })
            }
          })
        }
    
        input.click()
      })
    }
  }
}

export default useCsvImport