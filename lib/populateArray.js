async function populateArray (node, next) {
  const result = []

  for (const child of node) {
    const clone = await next(child)

    if (clone) {
      result.push(clone)
    }
  }

  return result
}

export default populateArray
