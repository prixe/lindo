import { useState } from 'react'

export const useDialog = (initialMode = false): [boolean, (value: boolean) => void, () => void] => {
  const [modalOpen, setModalOpen] = useState(initialMode)
  const toggle = () => setModalOpen(!modalOpen)
  return [modalOpen, setModalOpen, toggle]
}
