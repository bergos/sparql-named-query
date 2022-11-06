import NodeContext from './NodeContext.js'

class NodeStack {
  constructor ({ stack = [] } = {}) {
    this.stack = [...stack]
  }

  next (node) {
    return new NodeStack({
      stack: [new NodeContext(node), ...this.stack]
    })
  }

  query (values) {
    for (const context of this.stack) {
      const query = context.query(values)

      if (query) {
        return query
      }
    }
  }
}

export default NodeStack
