import { useGameContext } from '@/providers'
import { useStores } from '@/store'
import { useI18nContext } from '@lindo/i18n'
import { GameCharacter, GameCharacterSnapshot } from '@lindo/shared'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, CardActions, CardHeader, CardMedia, IconButton, Typography } from '@mui/material'
import { Observer } from 'mobx-react-lite'
import React from 'react'
import { CharacterGenericCard, CharacterGenericSize } from './CharacterGenericCard'

export interface CharacterCardProps {
  character: GameCharacter | GameCharacterSnapshot
  onSelect?: (character: GameCharacter) => void
  onRemove?: () => void
  display?: 'preview' | 'action'
  size?: CharacterGenericSize
}

export const CharacterCard = ({
  character,
  onSelect,
  onRemove,
  display = 'action',
  size = 'large'
}: CharacterCardProps) => {
  const { optionStore } = useStores()
  const [displayImage, setDisplayImage] = React.useState(true)
  const gameContext = useGameContext()
  const { LL } = useI18nContext()

  const handleDeleteCharacter = (character: GameCharacter) => {
    optionStore.gameMultiAccount.removeCharacter(character)
  }

  return (
    <Observer>
      {() => (
        <>
          <CharacterGenericCard key={character.id} size={size}>
            <CardHeader
              sx={{
                p: 1,
                paddingX: 1,
                alignSelf: 'stretch',
                display: 'flex',
                overflow: 'hidden',
                '& .MuiCardHeader-content': {
                  overflow: 'hidden'
                }
              }}
              action={
                onRemove ? (
                  <IconButton onClick={onRemove} aria-label='remove-character'>
                    <CloseIcon fontSize='small' />
                  </IconButton>
                ) : null
              }
              titleTypographyProps={{
                variant: size === 'small' ? 'caption' : 'body1',
                noWrap: true
              }}
              title={character.name}
            />
            <div
              style={{
                width: '80%',
                flex: 1,
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {displayImage ? (
                <CardMedia
                  style={{
                    position: 'absolute',
                    height: 'auto',
                    width: '100%',
                    bottom: size !== 'large' ? '10px' : '0px'
                  }}
                  component='img'
                  image={gameContext.characterImagesSrc + character.name + '.png'}
                  onError={() => {
                    setDisplayImage(false)
                  }}
                  alt='green iguana'
                />
              ) : (
                <Box sx={{ display: 'flex', p: 1, height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                  {size !== 'small' && (
                    <Typography variant='caption'>
                      {LL.option.multiAccount.characterCard.characterImageNotLoaded()}
                    </Typography>
                  )}
                </Box>
              )}
            </div>
            {display === 'action' && (
              <CardActions>
                {onSelect ? (
                  <Button size='small' onClick={() => onSelect(character)}>
                    {LL.option.multiAccount.characterCard.buttons.select()}
                  </Button>
                ) : (
                  <>
                    <Button color='error' onClick={() => handleDeleteCharacter(character)} size='small'>
                      {LL.option.multiAccount.characterCard.buttons.delete()}
                    </Button>
                    <Button size='small' disabled={true}>
                      {LL.option.multiAccount.characterCard.buttons.edit()}
                    </Button>
                  </>
                )}
              </CardActions>
            )}
          </CharacterGenericCard>
        </>
      )}
    </Observer>
  )
}
