import { readFile } from 'fs/promises'
import SparqlClient from 'sparql-http-client/ParsingClient.js'
import { executeQuery } from '../index.js'

async function main () {
  const client = new SparqlClient({ endpointUrl: 'https://query.wikidata.org/sparql' })
  const query = (await readFile(new URL('pathway.sparql', import.meta.url))).toString()
  const onQuery = (query, sparql) => {
    console.error(`process query ${query.node.name.value}:\n${sparql}`)
  }
  const result = await executeQuery({ client, onQuery, query })

  console.log(JSON.stringify(result, null, 2))
}

main()
