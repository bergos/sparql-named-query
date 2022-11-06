import rdf from 'rdf-ext'
import sparql from 'sparqljs'
import populate from './lib/populate.js'

async function executeQuery ({ client, onQuery, query }) {
  const processed = await processQuery({ client, onQuery, query })

  if (onQuery) {
    onQuery(null, processed)
  }

  return client.query.select(processed)
}

async function processQuery ({ client, onQuery, query }) {
  const parser = new sparql.Parser({ factory: rdf })
  const generator = new sparql.Generator()

  const parsed = parser.parse(query)
  const processed = await populate(parsed, { client, onQuery })

  return generator.stringify(processed)
}

export {
  executeQuery,
  processQuery
}
