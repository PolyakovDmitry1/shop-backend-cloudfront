export const isUuid = (uuid) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid)
}

export const removeEmptyKeys = (obj) => {
  Object.keys(obj).forEach(key => {
    if (obj[key] === undefined) {
      delete obj[key]
    }
  })

  return obj
}

export const isObject = (obj) => {
    return obj !== undefined && obj !== null && obj.constructor == Object
}
