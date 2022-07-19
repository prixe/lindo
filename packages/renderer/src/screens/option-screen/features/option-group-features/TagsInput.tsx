import React from 'react'
import { Autocomplete, Chip, TextField } from '@mui/material'

export interface TagsInputProps {
  id?: string
  label: string
  placeholder?: string
  defaultValue?: Array<string>
  onChange?: (value: Array<string>) => void
}

export const TagsInput = ({ label, placeholder, id, defaultValue, onChange }: TagsInputProps) => {
  return (
    <Autocomplete
      multiple
      id={id}
      options={[] as string[]}
      defaultValue={defaultValue}
      onChange={(_, value) => {
        if (onChange) {
          onChange(value)
        }
      }}
      freeSolo
      renderTags={(value, getTagProps) =>
        value.map((option: string, index: number) => (
          // eslint-disable-next-line react/jsx-key
          <Chip variant='outlined' label={option} {...getTagProps({ index })} />
        ))
      }
      renderInput={(params) => <TextField {...params} label={label} placeholder={placeholder} />}
    />
  )
}
