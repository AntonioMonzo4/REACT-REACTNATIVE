import { createSlice, nanoid } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    add(state, action) {
      const existente = state.items.find((i) => i.id === action.payload.id)
      if (existente) {
        existente.cantidad += 1
      } else {
        state.items.push({ ...action.payload, cantidad: 1, lineId: nanoid() })
      }
    },
    remove(state, action) {
      state.items = state.items.filter((i) => i.lineId !== action.payload)
    },
    clear(state) {
      state.items = []
    },
  },
})

export const { add, remove, clear } = cartSlice.actions
export default cartSlice.reducer
