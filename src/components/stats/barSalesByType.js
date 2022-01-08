import { LineChart, Legend, Line, XAxis, YAxis, Tooltip } from 'recharts';
import GraphContainer from "./graphContainer";
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Box, TextField, Typography, IconButton } from '@mui/material'
import { checkRange } from '../../helpers/checkRange'
import { CSVLink } from 'react-csv';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
const randomColor = require('randomcolor')

const DailyBarSalesByType = ({ data }) => {
    const branchName = useSelector(state => state.branch.branchName)
    const [initialData, setInitialData] = useState([])
    const [initialLines, setInitialLines] = useState([])
    const [lines, setLines] = useState([])
    const [filteredData, setFiltered] = useState([])
    const [dateFrom, setDateFrom] = useState("")
    const [dateTo, setDateTo] = useState("")
    const [helper, setHelper] = useState("")

    useEffect(() => {
        const filterData = data ? data.map(item => ({ date: item.date, ...item.salesByType })) : { date: "", other: "" }
        const lines = data ? [...new Set(data.map(item => Object.keys(item.salesByType)).flat())] : []
        //console.log("data", data)
        setInitialData(filterData)
        setFiltered(filterData)
        setInitialLines(lines)
        setLines(lines)
    }, [data])

    const handleData = (from = "", to = "") => {
        if (initialData) {
            const setOfDates = [...new Set(initialData.map(data => data.date))]
            if (from && to && checkRange(from, to, setHelper)) {
                const fromDate = new Date(from)
                const toDate = new Date(to)
                const filteredDates = setOfDates.filter(date => fromDate <= new Date(date) && toDate >= new Date(date))
                const filteredData = filteredDates.map(date => initialData.find(item => item.date === date))
                const filteredLines = data ? [...new Set(data.filter(item => fromDate <= new Date(item.date) && toDate >= new Date(item.date)).map(item => Object.keys(item.salesByType)).flat())] : []
                console.log(filteredLines)
                setFiltered(filteredData)
                setLines(filteredLines)
                setTimeout(() => setHelper(""), 2000)
            } else {
                setFiltered(initialData)
                setLines(initialLines)
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
    }, [dateFrom, dateTo, initialData])


    return (

        <GraphContainer
            title={"Daily Sales By Beverage Type " + `${branchName ? ` - ${branchName}` : ""}`}
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
                        {filteredData && <IconButton><CSVLink data={filteredData}  ><FileDownloadOutlinedIcon fontSize="large" sx={{ margin: '1rem', fontSize: 40 }} /> </CSVLink></IconButton>}

                    </Box>
                    <Typography component="h4" variant="body1" sx={{ margin: '1rem', minHeight: '2rem' }}>{helper}</Typography>
                </Box>
            }
        >
            <LineChart width={730} height={250} data={filteredData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <Legend height={5} margin={{ bottom: 0 }} align="right" verticalAlign="bottom" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                {
                    lines.map((line, i) => <Line type="monotone" dataKey={line} stroke={randomColor({
                        luminosity: 'dark',
                        format: 'rgb',
                        alpha: 1 // e.g. 'rgba(9, 1, 107, 0.5)',
                    })} />)
                }
            </LineChart>
        </GraphContainer>
    )
}

export default DailyBarSalesByType