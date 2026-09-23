export type ContadorState = { count: number }

export type ContadorAction =
  | { type: 'inc' }
  | { type: 'dec' }
  | { type: 'add'; payload: number }
  | { type: 'reset' }

export function contadorReducer(state: ContadorState, action: ContadorAction): ContadorState {
  switch (action.type) {
    case 'inc':
      return { count: state.count + 1 }
    case 'dec':
      return { count: state.count - 1 }
    case 'add':
      return { count: state.count + action.payload }
    case 'reset':
      return { count: 0 }
    default: {
      const _exhaustive: never = action
      return _exhaustive
    }
  }
}
