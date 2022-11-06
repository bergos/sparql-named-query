#!/usr/bin/env node

import { readFile } from 'fs/promises'
import { Command } from 'commander'
import SparqlClient from 'sparql-http-client/ParsingClient.js'
import { executeQuery } from '../index.js'

const program = new Command()

program
  .argument('<endpointUrl>', 'SPARQL endpoint URL')
  .argument('<queryFile>', 'SPARQL query file')
  .option('-v, --verbose', 'verbose output')
  .action(async (endpointUrl, queryFile, { verbose }) => {
    let onQuery = () => {}

    if (verbose) {
      onQuery = (query, sparql) => {
        console.error(`process query ${(query && query.node.name.value) || 'root'}:\n${sparql}`)
      }
    }

    const client = new SparqlClient({ endpointUrl })
    const query = (await readFile(queryFile)).toString()
    const result = await executeQuery({ client, onQuery, query })

    console.log(JSON.stringify(result, null, 2))
  })
  .parse(process.argv)
