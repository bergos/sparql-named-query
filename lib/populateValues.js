import sparql from 'sparqljs'

const generator = new sparql.Generator()

async function populateValues ({ client, onQuery, query, next }) {
  if (query.values) {
    return query.values
  }

  const filledNode = await next(query.node.patterns[0])

  const sparql = generator.stringify(filledNode)

  onQuery(query, sparql)

  const result = await client.query.select(sparql)

  query.values = {
    type: 'values',
    values: result.map(row => Object.fromEntries(
      Object.entries(row).map(([key, value]) => [`?${key}`, value])
    )
    )
  }

  return query.values
}

export default populateValues
