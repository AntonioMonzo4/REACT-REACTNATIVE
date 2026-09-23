import { atom } from 'jotai'

export const contadorAtom = atom(0)

export const dobleAtom = atom((get) => get(contadorAtom) * 2)
