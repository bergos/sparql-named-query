import { strictEqual } from 'assert'
import { readFile } from 'fs/promises'
import { describe, it } from 'mocha'
import SparqlClient from 'sparql-http-client/ParsingClient.js'
import { processQuery } from '../index.js'

async function testQueryProcessing ({ inputFile, outputFile }) {
  const client = new SparqlClient({ endpointUrl: 'https://lindas.admin.ch/query' })

  const query = (await readFile(inputFile)).toString()
  const processed = await processQuery({ client, query })
  const expected = (await readFile(outputFile)).toString()

  strictEqual(processed, expected)
}

describe('sparql-named-query', () => {
  describe('processQuery', () => {
    it('should be a function', () => {
      strictEqual(typeof processQuery, 'function')
    })

    it('should process the given example query 1', async () => {
      const inputFile = 'test/assets/query1.sparql'
      const outputFile = 'test/assets/query1.processed.sparql'

      await testQueryProcessing({ inputFile, outputFile })
    })

    it('should process the given example query 2', async () => {
      const inputFile = 'test/assets/query2.sparql'
      const outputFile = 'test/assets/query2.processed.sparql'

      await testQueryProcessing({ inputFile, outputFile })
    })

    it('should process the given example query 3', async () => {
      const inputFile = 'test/assets/query3.sparql'
      const outputFile = 'test/assets/query3.processed.sparql'

      await testQueryProcessing({ inputFile, outputFile })
    })
  })
})
