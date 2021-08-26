// returns last element of array
// any[] => any
export const lastElement = arr => arr[arr.length - 1]
export const firstElement = arr => arr[0]

// returns next or first element of array
// (any[], number) => any
export const nextElement = (arr, i) =>
	i === arr.length - 1 ? arr[0] : arr[i + 1]

// returns previous or last element of array
// (any[], number) => any
export const prevElement = (arr, i) =>
	i === 0 ? arr[arr.length - 1] : arr[i - 1]

// returns next or first index of array
// (any[], number) => number
export const nextIndex = (arr, i) => (i === arr.length - 1 ? 0 : i + 1)

// returns previous of last index of array
// (any[], number) => number
export const prevIndex = (arr, i) => (i === 0 ? arr.length - 1 : i - 1)

export const firstIndex = () => 0
export const lastIndex = arr => arr.length - 1

export const isLastIndex = (arr, i) => i === arr.length - 1
export const isFirstIndex = i => i === 0

/**
 * to be used with map, filter etc.
 */
export const has = key => x => x[key]
