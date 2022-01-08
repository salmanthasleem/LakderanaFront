import { useState, useEffect } from "react";
import { Box, Divider } from "@mui/material";
import DailyTotalReservations from "../../components/stats/dailyTotalReservatons";
import ReservationTypeStats from "../../components/stats/reservationTypeStats";
import BranchField from "../../components/branchField";
import api from "../../api/api";
import { useSelector } from "react-redux";



const PaymentsFrontBoard = () => {
    const [data, setData] = useState([])
    const [helper, setHelper] = useState("")
    const branchId = useSelector(state => state.branch.branchId)
    const [totalReservation, setTotalReservations] = useState([])
    const [statsByType, setStatsByType] = useState([])

    const getReservation = async () => {
        try {
            const response = await api.get("/stats/getReservation/", {
                params: {
                    branchId: branchId
                }
            })
            const data = await response.data
            const message = await data.message
            setHelper(message)
            const rows = data.data.rows
            setData(rows)
            setTimeout(() => setHelper(""), 2000)
        } catch (error) {
            const err = error.response.data
            if (err) {
                const message = err.message
                setHelper(message)
                setData([])
                setTimeout(() => setHelper(""), 2000)

            }

        }
    }

    const handleData = () => {
        if (branchId && data.length > 0) {
            const subData = data[0].data
            const totalReservationsDaily = subData.map((item, i) => ({
                date: item.date,
                totalNumberOfReservations: item.totalNumberOfReservations,
            }))
            const reservationsByTypeDaily = subData.map((item, i) => ({
                date: item.date,
                reservationsByType: item.reservationsByType
            }))
            setTotalReservations(totalReservationsDaily)
            setStatsByType(reservationsByTypeDaily)
        } else if (data.length > 0) {
            const subData = data.map(elem => elem.data).flat()
            const setOfDates = [...new Set(subData.map(row => row.date))]
            const totalReservationsDaily = setOfDates.map((item, i) => ({
                date: item,
                totalNumberOfReservations: subData.filter(row => row.date === item).map(item => item.totalNumberOfReservations).reduce((value, item) => value += item),
            }))
            const reservationsByTypeDaily = setOfDates.map((item, i) => ({
                date: item,
                reservationsByType: subData.filter(row => row.date === item)
                    .map((item, i, arr) => {

                        return item.reservationsByType
                    })
                    .reduce((value, item, i, arr) => {
                        const keys = Object.keys(item)
                        keys.forEach(element => {
                            value[element] = value[element] ? value[element] + item[element] : item[element]
                        });
                        return value
                    }
                        , {
                            deluxe: 0,
                            normal: 0,
                        }
                    ),
            }))
            setTotalReservations(totalReservationsDaily)
            setStatsByType(reservationsByTypeDaily)
        }
        //console.log(subData)
    }

    useEffect(() => {
        getReservation()
    }, [branchId])

    useEffect(() => {
        if (data) {
            handleData()
        }
    }, [data])


    return (
        <Box>
            <BranchField sx={{ margin: '1rem' }} container={{ display: 'flex' }} />
            <Box sx={{ display: 'flex', margin: '1rem', height: '80vh', justifyContent: 'space-evenly' }}>

                <DailyTotalReservations data={totalReservation} />
                <Divider orientation="vertical" flexItem />
                <ReservationTypeStats data={statsByType} />
            </Box>
        </Box>
    )
}

export default PaymentsFrontBoard