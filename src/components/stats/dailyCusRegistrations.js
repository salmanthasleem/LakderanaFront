import { useState, useEffect } from "react";
import api from "../../api/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useSelector } from "react-redux";
import GraphContainer from "./graphContainer";
import { Box, TextField, Typography, IconButton } from '@mui/material'
import { checkRange } from '../../helpers/checkRange'
import { CSVLink } from 'react-csv';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

const DailyCustomerRegistrations = () => {
    const branchId = useSelector(state => state.branch.branchId)
    const [customers, setCustomers] = useState([])
    const [records, setRecords] = useState([])
    const [dateFrom, setDateFrom] = useState("")
    const [dateTo, setDateTo] = useState("")
    const [helper, setHelper] = useState("")

    const getCustomers = async () => {
        const URL = `/customer/all/`
        try {
            const response = await api.get(URL, {
                params: {
                    branchId: branchId
                }
            })
            const data = await response.data
            if (data.status === 1) {
                const rows = data.data.rows
                setCustomers(rows)
            } else {
                setCustomers([])
            }
        } catch (error) {
            const err = error.response.data
            const msg = err.message
            setCustomers([])

        }
    }

    const dailyRegistrationsCalculate = (from = "", to = "") => {
        if (customers) {
            const dates = customers.map(customer => new Date(customer.dateRegistered).toISOString().split("T")[0])
            const setOfDates = [...new Set(dates)]
            if (from && to && checkRange(from, to, setHelper)) {
                const fromDate = new Date(from)
                const toDate = new Date(to)
                const filteredDates = setOfDates.filter(date => fromDate <= new Date(date) && toDate >= new Date(date))
                const noOfRegistrationsDaily = filteredDates.map(date => ({ date, number: dates.filter(item => item === date).length }))
                setRecords(noOfRegistrationsDaily)
                setTimeout(() => setHelper(""), 2000)
            } else {
                const noOfRegistrationsDaily = setOfDates.map(date => ({ date, number: dates.filter(item => item === date).length }))
                setRecords(noOfRegistrationsDaily)
                setTimeout(() => setHelper(""), 2000)
            }
        } else {
            setRecords([])
            setTimeout(() => setHelper(""), 2000)
        }
    }

    useEffect(() => {
        if (dateFrom && dateTo) {
            dailyRegistrationsCalculate(dateFrom, dateTo)
        } else {
            dailyRegistrationsCalculate()
        }
    }, [dateFrom, dateTo])

    useEffect(() => {
        dailyRegistrationsCalculate()
    }, [customers])

    useEffect(() => {
        getCustomers()
    }, [branchId])

    return (

        <GraphContainer
            title="Daily Customer Registrations"
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
                        {records && <IconButton><CSVLink data={records}  ><FileDownloadOutlinedIcon fontSize="large" sx={{ margin: '1rem', fontSize: 40 }} /> </CSVLink></IconButton>}

                    </Box>
                    <Typography component="h4" variant="body1" sx={{ margin: '1rem', minHeight: '2rem' }}>{helper}</Typography>
                </Box>
            }
        >
            <BarChart
                width={500}
                height={300}
                data={records}
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
                <Bar dataKey="number" fill="#8884d8" />
            </BarChart>
        </GraphContainer>
    )
}

export default DailyCustomerRegistrations