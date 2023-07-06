import React from 'react'
import { styled } from '@mui/system'
import { Settings, VolumeOff, VolumeUp } from '@mui/icons-material'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'

import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers'
import { Observer } from 'mobx-react-lite'
import { Game, useStores } from '@/store'
import { TabAdd, TabGame } from './tab'
import { Box, IconButton } from '@mui/material'

const SortableItem = ({ game }: { game: Game }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: game.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TabGame game={game} />
    </div>
  )
}
export const SideBar = () => {
  const { gameStore, optionStore } = useStores()
  const SideBarContainer = styled('div')(({ theme }) => (
    optionStore.window.minimalInterface ?
      {
        backgroundColor: "#ffffff00",
        overflowX: 'hidden',
        overflowY: 'hidden',
        width: 'auto',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        position: 'fixed',
        left: '50%',
        transform: "translateX(-50%)",
        top: '32px',
        zIndex: '2',
      } :
      {
        backgroundColor: theme.palette.background.paper,
        overflowX: 'hidden',
        overflowY: 'auto',
        width: '71px',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
      }
  ))
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
        tolerance: 10
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleOpenOption = () => {
    window.lindoAPI.openOptionWindow()
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      gameStore.moveGame(active.id as string, over!.id as string)
    }
  }

  const handleToggleVolume = () => {
    gameStore.toggleMute()
  }

  return (
    <SideBarContainer sx={optionStore.window.minimalInterface ? { 'margin-top': "16px" } : {  }}>
      <Observer>
        {() => (
          <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
            collisionDetection={closestCenter}
          >
            <SortableContext items={gameStore.gamesOrder.map((g) => g.id)} strategy={verticalListSortingStrategy}>
              {gameStore.gamesOrder.map((game) => (
                <SortableItem key={game.id} game={game} />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </Observer>
      <TabAdd />
      <Box sx={{ flex: 1 }} />

      <IconButton onClick={handleToggleVolume} sx={optionStore.window.minimalInterface ? { margin: "0px 2px", backgroundColor: "#2E2E2E90", width: "40px", height: "40px" } : { mb: 1 }} aria-label='toggle-volume'>
        <Observer>
          {() => (gameStore.isMuted ? <VolumeOff color={'error'} /> : <VolumeUp color={'primary'} />)}
        </Observer>
      </IconButton>
      <IconButton onClick={handleOpenOption} sx={optionStore.window.minimalInterface ? { margin: "0px 2px", backgroundColor: "#2E2E2E90", width: "40px", height: "40px" } : { mb: 1 }} aria-label='settings'>
        <Settings />
      </IconButton>
    </SideBarContainer>
  )
}
