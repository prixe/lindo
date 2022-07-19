import { Card, lighten, useTheme } from '@mui/material'
import React from 'react'

export interface CharacterGenericCardProps {
  children?: React.ReactNode | React.ReactNode[]
  size?: CharacterGenericSize
}

export type CharacterGenericSize = 'small' | 'medium' | 'large'

export const CHARACTER_SIZE_RATIO = {
  small: 1,
  medium: 1.5,
  large: 2
}

export const CharacterGenericCard = ({ children, size = 'large' }: CharacterGenericCardProps) => {
  const theme = useTheme()
  const width = 75 * CHARACTER_SIZE_RATIO[size]
  const height = 95 * CHARACTER_SIZE_RATIO[size]
  const cardStyle: React.CSSProperties = {
    flexShrink: 0,
    height: height + 'px',
    width: width + 'px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
  }
  return <Card style={cardStyle}>{children}</Card>
}
