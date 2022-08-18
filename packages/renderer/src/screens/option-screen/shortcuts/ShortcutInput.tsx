import { IconButton, InputAdornment, TextField } from '@mui/material'
import React, { KeyboardEvent, memo } from 'react'
import { Close } from '@mui/icons-material'

const KEY_MAPPER = {
  ArrowRight: 'Right',
  ArrowLeft: 'Left',
  ArrowDown: 'Down',
  ArrowUp: 'Up',
  ' ': 'Space'
}

const MODIFIERS = /^(Meta|CommandOrControl|CmdOrCtrl|Command|Cmd|Control|Ctrl|AltGr|Option|Alt|Shift|Super)$/i
const KEY_CODES =
  /^(Num[0-9]|Plus|Space|Tab|Backspace|Delete|Insert|Return|Enter|Up|Down|Left|Right|Home|End|PageUp|PageDown|Escape|Esc|VolumeUp|VolumeDown|VolumeMute|MediaNextTrack|MediaPreviousTrack|MediaStop|MediaPlayPause|PrintScreen|F24|F23|F22|F21|F20|F19|F18|F17|F16|F15|F14|F13|F12|F11|F10|F9|F8|F7|F6|F5|F4|F3|F2|F1|[0-9A-Z)!@#$%^&*(:<_>?~{|}";=,\-./`[\\\]'])$/i

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
    if (MODIFIERS.test(event.key)) return
    // prevent using invalid electron accelerator for tab switching
    if (id === 'new-window' || id.includes('tab')) if (!KEY_CODES.test(event.key)) return

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
