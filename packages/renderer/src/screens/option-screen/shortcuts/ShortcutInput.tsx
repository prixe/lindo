import { IconButton, InputAdornment, TextField } from '@mui/material'
import React, { KeyboardEvent, memo } from 'react'
import { Close } from '@mui/icons-material'

const KEY_MAPPER = {
  ArrowRight: 'Right',
  ArrowLeft: 'Left',
  ArrowDown: 'Down',
  ArrowUp: 'Up'
}

export interface ShortcutInputProps {
  id: string
  label: string
  value: string
  onChange?: (shortcut: string) => void
}

export const capitalizeFirstLetter = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

// eslint-disable-next-line react/display-name
export const ShortcutInput = memo<ShortcutInputProps>(({ id, label, value, onChange }) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    event.stopPropagation()

    let key = ''
    let prefix = ''

    if (event.ctrlKey) {
      prefix += 'Ctrl+'
    }

    if (event.shiftKey) {
      prefix += 'Shift+'
    }

    if (event.altKey) {
      prefix += 'Alt+'
    }

    if (event.metaKey) {
      prefix += 'CmdOrCtrl+'
    }

    // prevent using modifier key as shortcut
    switch (event.key) {
      case 'Meta':
      case 'Shift':
      case 'Ctrl':
      case 'Alt':
        return
    }

    const normalizeKey = Object.hasOwn(KEY_MAPPER, event.key)
      ? KEY_MAPPER[event.key as never]
      : capitalizeFirstLetter(event.key)

    key = prefix + normalizeKey

    if (onChange) onChange(key)
  }

  const handleClear = () => {
    if (onChange) onChange('')
  }

  return (
    <TextField
      id={id}
      label={label}
      onKeyDown={handleKeyDown}
      value={value}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton aria-label='clear shortcut' onClick={handleClear} edge='end'>
              <Close />
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  )
})
