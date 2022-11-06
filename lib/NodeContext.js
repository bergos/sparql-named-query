class NodeContext {
  constructor (node) {
    this.node = node
    this.queries = null
  }

  query (values) {
    if (!this.queries) {
      this.search()
    }

    return this.queries.get(values.from.value)
  }

  search () {
    this.queries = new Map()

    for (const child of Object.values(this.node)) {
      if (Array.isArray(child)) {
        for (const item of child) {
          if (item.type === 'namedQuery') {
            this.queries.set(item.name.value, {
              node: item,
              values: null,
              stack: this.stack
            })
          }
        }
      } else {
        if (child.type === 'namedQuery') {
          this.queries.set(child.name.value, {
            node: child,
            values: null,
            stack: this.stack
          })
        }
      }
    }
  }
}

export default NodeContext
