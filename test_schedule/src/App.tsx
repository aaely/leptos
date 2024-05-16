import React from 'react';
import Landing from './Pages/Landing'
import useWebSocket from './hooks/useWebSocket';
import { useRecoilValue } from 'recoil';
import { currentView } from './Recoil/router';
import { animated, useTransition } from 'react-spring';
import EditTrailer from './Pages/EditTrailer';
import AssignDoor from './Pages/AssignDoor'

const hashMap = new Map([
  ['landing', <Landing />],
  ['editTrailer', <EditTrailer />],
  ['assignDoor', <AssignDoor />]
])

function App() {

  const view: string = useRecoilValue(currentView)

  useWebSocket()

  const transition = useTransition(view, {
    from: {opacity: 0, scale: 0},
    enter: {opacity: 1, scale: 1},
    leave: {opacity: 0, scale: 0},
  })

  return transition((style, i) => {
    return (
      <div style={{position: 'absolute', width: '100vw', height: '100vh'}}>
        <animated.div style={style}>
          {hashMap.get(i)}
        </animated.div>
      </div>
    )
  })
}

export default App
