import SparqlClient from 'sparql-http-client/ParsingClient.js'
import { executeQuery } from '../index.js'

const endpointUrlElement = document.getElementById('endpointUrl')
const queryElement = document.getElementById('query')
const submitElement = document.getElementById('submit')
const tableContainerElement = document.getElementById('tableContainer')
const queriesContainerElement = document.getElementById('queriesContainer')

window.addEventListener('load', () => {
  endpointUrlElement.value = 'https://query.wikidata.org/sparql'
  queryElement.value = `PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wp: <http://vocabularies.wikipathways.org/wp#>

SELECT DISTINCT ?item ?pw_annotation ?annotation_label WHERE {
  QUERY ?query {
    SELECT ?item ?source_pathway WHERE {
      ?item wdt:P2410 ?wpid;
        wdt:P2888 ?source_pathway;
        rdfs:label ?label.

      FILTER(CONTAINS(LCASE(?label), "vitamin"))
    }
  }

  SERVICE <http://sparql.wikipathways.org/sparql> {
     VALUES (?item ?source_pathway) FROM ?query

     ?wp_pathway dc:identifier ?source_pathway .
     ?wp_pathway wp:ontologyTag ?pw_annotation .
     ?pw_annotation rdfs:label ?annotation_label .
   }
} LIMIT 100
  `
})

submitElement.addEventListener('click', async event => {
  event.preventDefault()

  const client = new SparqlClient({ endpointUrl: endpointUrlElement.value })
  const query = queryElement.value
  const queries = []
  const onQuery = (query, sparql) => {
    queries.push({
      name: (query && query.node.name.value) || 'root',
      sparql
    })
  }
  const result = await executeQuery({ client, onQuery, query })

  console.log(JSON.stringify(result, null, 2))

  const columns = Object.keys(result[0] || {})
  const thead = `<thead><tr>${columns.map(column => `<th>${column}</th>`).join('')}</tr></thead>`
  const mapItem = item => {
    if (item.value.startsWith('http://') || item.value.startsWith('https://')) {
      return `<a href="${item.value}">${item.value}</a>`
    }

    return item.value
  }
  const tbody = `<tbody>${result.map(row => {
    return `<tr>${columns.map(column => `<td>${mapItem(row[column])}</td>`).join('')}</tr>`
  }).join('')}</tbody>`
  const tableHtml = `<table class="table">${thead}${tbody}</table>`

  tableContainerElement.innerHTML = tableHtml

  const queriesHtml = queries.map(({ name, sparql }) => {
    return `
      <label class="form-label">${name}</label>
      <textarea class="form-control" readonly rows="10">${sparql}</textarea>
    `
  }).join('')

  queriesContainerElement.innerHTML = queriesHtml
})
