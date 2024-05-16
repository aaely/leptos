import React, { useEffect } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { currentTruck as t } from '../Recoil/trucks'
import { currentView } from '../Recoil/router';
import { scac as s, scheduledDate as sd, lastFreeDate as fd, scheduledTime as st} from '../Recoil/forms';
import './CSS/EditTrailer.css'
import Button from '@mui/material/Button'
import { Box } from '@mui/material';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import {SiMoleculer, SiCheckmarx} from 'react-icons/si'
import {FaDollarSign} from 'react-icons/fa'
import { getCiscos, recent } from '../Recoil/trucks';
import { get_load_info } from '../queries/get_load_info';
import axios from 'axios';

function ScheduleTruckForm() {
    const [currentTruck, setCurrentTruck] = useRecoilState(t)
    const currentDate = new Date(Date.now()).toLocaleDateString();
    const [scac, setScac] = useRecoilState(s)
    const [scheduledDate, setScheduledDate] = useRecoilState(sd)
    const [lastFreeDate, setLastFreeDate] = useRecoilState(fd)
    const [scheduledTime, setScheduledTime] = useRecoilState(st)
    const [r, setR] = useRecoilState(recent)
    //const formattedDate = `${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
    const view = useSetRecoilState(currentView)

    const handleChange = ({target: { id, value}}: any) => {
        switch(id) {
            case 'scac':
                setScac(value)
                break;
            case 'scheduledDate': 
                setScheduledDate(value)
                break;
            case 'lastFreeDate':
                setLastFreeDate(value)
                break;
            case 'scheduledTime':
                setScheduledTime(value)
                break;
            default: break;
        }
    }

    useEffect(() => {
        (async() => {
            try{
                const res = await get_load_info(currentTruck.TrailerID)
                console.log(res)
            } catch(error) {
                console.log(error)
            }
        })()
    })

    const setDetails = async () => {
        view('landing')
        const recentTrucks = [...r]
        const next = {
            TrailerID: currentTruck.TrailerID,
            ScheduleDate: scheduledDate,
            ScheduleTime: scheduledTime,
        }
        recentTrucks.push(next)
        setR(recentTrucks)
        try {
            const params = {
                TrailerID: currentTruck.TrailerID,
                ScheduleTime: scheduledTime,
                ScheduledDate: scheduledDate,
                RequestDate: currentDate,
                LastFreeDate: lastFreeDate,
                CarrierCode: scac,
            }
            const res = await axios.post('http://localhost:5555/api/set_schedule', params)
        } catch(error) {
            console.log(error)
        }
    }

    return(
        <Box className='container'>
            <h1>Schedule Trailer: {currentTruck.TrailerID}</h1>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                <InputLabel htmlFor="scac">SCAC</InputLabel>
                <Input
                id='scac'
                type='text'
                value={scac}
                onChange={handleChange}
                placeholder='UNIV'
                startAdornment={
                    <InputAdornment position='start'>
                        <SiMoleculer/>
                    </InputAdornment>
                }
                />
                </FormControl>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                <InputLabel htmlFor="lastFreeDate">Last Free Date</InputLabel>
                <Input
                id='lastFreeDate'
                type='date'
                value={lastFreeDate}
                onChange={handleChange}
                startAdornment={
                    <InputAdornment position='start'>
                        <FaDollarSign/>
                    </InputAdornment>
                }
                />
                </FormControl>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                <InputLabel htmlFor="scheduledDate">Scheduled Date</InputLabel>
                <Input
                id='scheduledDate'
                type='date'
                value={scheduledDate}
                onChange={handleChange}
                startAdornment={
                    <InputAdornment position='start'>
                        <SiCheckmarx/>
                    </InputAdornment>
                }
                />
                </FormControl>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                <InputLabel htmlFor="scheduledTime">Scheduled Time</InputLabel>
                <Input
                id='scheduledTime'
                type='text'
                value={scheduledTime}
                onChange={handleChange}
                placeholder='7:00'
                startAdornment={
                    <InputAdornment position='start'>
                        <SiMoleculer/>
                    </InputAdornment>
                }
                />
                </FormControl>
                <Button variant='contained' color='success' onClick={() => setDetails()}>Set Details</Button>
                <Button variant='contained' color='error' onClick={() => view('landing')}>Back</Button>
        </Box>
    )
}

export default ScheduleTruckForm