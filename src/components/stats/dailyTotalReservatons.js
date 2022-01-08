import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import GraphContainer from "./graphContainer";
import { useSelector } from 'react-redux';
import { Box, Typography, TextField, IconButton } from '@mui/material'
import { useState, useEffect } from 'react';
import { checkRange } from '../../helpers/checkRange'
import { CSVLink } from 'react-csv';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

const DailyTotalReservations = ({ data }) => {
    const branchName = useSelector(state => state.branch.branchName)
    const [dateFrom, setDateFrom] = useState("")
    const [dateTo, setDateTo] = useState("")
    const [helper, setHelper] = useState("")
    const [allData, setData] = useState([])
    const [filtered, setFiltered] = useState([])


    const handleData = (from = "", to = "") => {
        if (allData) {
            const setOfDates = [...new Set(allData.map(data => data.date))]
            if (from && to && checkRange(from, to, setHelper)) {
                const fromDate = new Date(from)
                const toDate = new Date(to)
                const filteredDates = setOfDates.filter(date => fromDate <= new Date(date) && toDate >= new Date(date))
                const reservationsDaily = filteredDates.map(date => allData.find(item => item.date === date))
                setFiltered(reservationsDaily)
                setTimeout(() => setHelper(""), 2000)
            } else {
                setFiltered(allData)
                setTimeout(() => setHelper(""), 2000)
            }
        }
    }

    useEffect(() => {
        if (dateFrom && dateTo) {
            handleData(dateFrom, dateTo)
        } else {
            handleData()
        }
    }, [dateFrom, dateTo, allData])

    useEffect(() => {
        setData(data)
    }, [data])

    return (

        <GraphContainer
            title={"Daily Total Reservations" + `${branchName ? ` - ${branchName}` : ""}`}
            style={{ padding: '1rem' }}
            components={
                <Box>
                    <Box>
                        <TextField
                            type="date"
                            label="From"
                            onChange={(e, val) => {
                                if (e.target.value === "") {
                                    setDateTo(e.target.value)
                                    setDateFrom(e.target.value)
                                }
                                setDateFrom(e.target.value)
                            }}
                            value={dateFrom}
                            InputLabelProps={{
                                shrink: true
                            }}
                            sx={{ margin: '1rem' }}
                        />
                        <TextField
                            type="date"
                            onChange={(e, val) => setDateTo(e.target.value)}
                            label="To"
                            value={dateTo}
                            InputLabelProps={{
                                shrink: true
                            }}
                            sx={{ margin: '1rem' }}
                        />
                        {filtered && <IconButton><CSVLink data={filtered}  ><FileDownloadOutlinedIcon fontSize="large" sx={{ margin: '1rem', fontSize: 40 }} /> </CSVLink></IconButton>}
                    </Box>
                    <Typography component="h4" variant="body1" sx={{ margin: '1rem', minHeight: '2rem' }}>{helper}</Typography>
                </Box>
            }

        >
            <BarChart
                width={500}
                height={300}
                data={filtered}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalNumberOfReservations" fill="#8884d8" />
            </BarChart>
        </GraphContainer>
    )
}

export default DailyTotalReservations