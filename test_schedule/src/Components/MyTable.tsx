/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { trucks as trk, currentTruck as ct, getCiscos } from '../Recoil/trucks'
import { trailers } from '../Recoil/queries'
import { currentView } from '../Recoil/router'
import { Button } from 'react-bootstrap'
import axios from 'axios'
import { getTrucks } from '../queries/getTrucks'
import './CSS/MyTable.css'


export default function MyTable() {
  const [trucks, setTrucks] = useRecoilState(trk)
  const trl = useRecoilValue(trailers)
  const setView = useSetRecoilState(currentView)
  const [loading, setLoading] = useState(true)
  const setCurrentTruck = useSetRecoilState(ct)

  const updateView = (tr: any, screen: string) => {
    setView(screen)
    setCurrentTruck(tr)
  }

  useEffect(() => {
    (async () => {
      try {
        const trks = await getTrucks()
        setTrucks(trks)
      } catch(error) {
        console.log(error)
      }
    })()
  }, [])

  const Hot = async (idx: number, trl: string) => {
    let i: number
    let updatedTrucks = trucks.map((trk: any, index: number) => {
      if (index === idx) {
        i = idx
        // Clone the Schedule object and update its IsHot property
        let updatedSchedule = { ...trk.Schedule, IsHot: !trk.Schedule.IsHot };
        // Return a new truck object with the updated Schedule
        return { ...trk, Schedule: updatedSchedule };
      }
      return trk;
    });
    setTrucks(updatedTrucks);
    try {
      const res = await axios.post('http://localhost:5555/api/hot_trailer', {param: trl})
    } catch(error) {
      console.log(error)
    }
  }

  const Arrived = async (idx: number, trl: string) => {
    let i: number
    let updatedTrucks = trucks.map((trk: any, index: number) => {
      if (index === idx) {
        i = idx
        // Clone the Schedule object and update its IsHot property
        let updatedSchedule = { ...trk.Schedule, ArrivalTime: new Date(Date.now()).toLocaleTimeString() };
        // Return a new truck object with the updated Schedule
        return { ...trk, Schedule: updatedSchedule };
      }
      return trk;
    });
    setTrucks(updatedTrucks);
    try {
      const res = await axios.post('http://localhost:5555/api/set_arrivalTime', {param: trl})
    } catch(error) {
      console.log(error)
    }
  }

  const renderLocations: any = (locations: any) => {
    let txt: string = ''
    for(let i = 0; i < locations.length; i++) {
        if (locations[i] === '18008') {
            txt = txt + ' AR'
        }
        if (locations[i] === '18044') {
            txt = txt + ' FF'
        }
        if (locations[i] === '22010') {
            txt = txt + ' 40'
        }
    }
    return txt.trim()
  }


  const renderTrucks = () => {
      return trucks?.map((tr: any, index: number) => {
        return(
          <tr key={index} style={{ backgroundColor: tr.Schedule.IsHot ? 'red' : 'inherit' }}>
              <td>{index + 1}</td>
              <td>{tr.Schedule.RequestDate}</td>
              <td><a onClick={() => updateView(tr, 'editTrailer')}>{tr.TrailerID}</a></td>
              <td>{tr.Schedule.CarrierCode}</td>
              <td>{renderLocations(tr.CiscoIDs)}</td>
              <td>{tr.Schedule.LastFreeDate}</td>
              <td>{tr.Schedule.ScheduleDate}</td>
              <td>{tr.Schedule.ScheduleTime}</td>
              <td>{tr.Schedule.ArrivalTime.length === 0 ? <Button variant='success' onClick={() => Arrived(index, tr.TrailerID)}>Check In</Button> : tr.Schedule.ArrivalTime}</td>
              <td>{tr.Schedule.DoorNumber}</td>
              <td>{tr.Schedule.IsHot ? <Button variant='success' onClick={() => Hot(index, tr.TrailerID)}>Mark Not Hot</Button> : <Button variant='danger' onClick={() => Hot(index, tr.TrailerID)}>Mark Hot</Button>}</td>
          </tr>          
        )
      });
  }

    return(
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Request Date</th>
              <th>Trailer ID</th>
              <th>SCAC</th>
              <th>Plant</th>
              <th>Last Free Day</th>
              <th>Scheduled Date</th>
              <th>Scheduled Time</th>
              <th>Arrival Time</th>
              <th>Door</th>
              <th>Hot?</th>
            </tr>
          </thead>
          <tbody>
            {renderTrucks()}
          </tbody>
        </table>
    )
}