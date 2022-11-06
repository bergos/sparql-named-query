import NodeStack from './NodeStack.js'
import populateArray from './populateArray.js'
import populateObject from './populateObject.js'
import populateValues from './populateValues.js'

async function populate (node, { client, onQuery = () => {}, stack = new NodeStack() } = {}) {
  if (typeof node === 'number' || typeof node === 'string') {
    return node
  }

  if (node.termType) {
    return node
  }

  if (node.type === 'namedQuery') {
    return null
  }

  const next = nextNode => {
    return populate(nextNode, { client, onQuery, stack: stack.next(node) })
  }

  if (node.type === 'values' && node.from) {
    const query = stack.query(node)

    if (!query) {
      throw new Error(`could not find named query ${node.from.value}`)
    }

    return await populateValues({ client, onQuery, query, next })
  }

  if (Array.isArray(node)) {
    return populateArray(node, next)
  }

  return populateObject(node, next)
}

export default populate
