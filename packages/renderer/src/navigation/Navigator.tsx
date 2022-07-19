import React, { useMemo } from 'react'
import { ChooseTeamScreen, MainScreen, OptionScreen, UnlockScreen, UpdaterScreen } from '@/screens'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Box } from '@mui/material'

export const Navigator = () => {
  const location = useLocation()
  const titleBarHeight = useMemo(() => (location.pathname === '/' ? window.titleBar!.height : '0px'), [location])

  return (
    <>
      {/* <TitleBar /> */}
      <Box sx={{ display: 'flex', height: `calc(100vh - ${titleBarHeight})` }}>
        <Routes>
          <Route path='/' element={<MainScreen />} />
          <Route path='updater' element={<UpdaterScreen />} />
          <Route path='option' element={<OptionScreen />} />
          <Route path='unlock' element={<UnlockScreen />} />
          <Route path='choose-team' element={<ChooseTeamScreen />} />
        </Routes>
      </Box>
    </>
  )
}
