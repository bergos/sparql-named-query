async function populateObject (node, next) {
  const object = {}

  for (const [key, child] of Object.entries(node)) {
    if (Array.isArray(child)) {
      object[key] = []

      for (const item of child) {
        const clone = await next(item)

        if (clone) {
          object[key].push(clone)
        }
      }
    } else {
      const clone = await next(child)

      if (clone) {
        object[key] = clone
      }
    }
  }

  return object
}

export default populateObject
