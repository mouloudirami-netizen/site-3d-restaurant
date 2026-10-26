import { createContext, useContext } from 'react'

type Ctx = { openOrder: () => void }

export const OrderContext = createContext<Ctx>({ openOrder: () => {} })

export const useOrder = () => useContext(OrderContext)
