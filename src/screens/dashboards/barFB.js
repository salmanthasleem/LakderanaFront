import { useState, useEffect } from "react";
import { Box, Divider } from "@mui/material";
import BranchField from "../../components/branchField";
import api from "../../api/api";
import { useSelector } from "react-redux";
import DailyBarSalesTotal from "../../components/stats/dailyBarTotalSales";
import DailyBarSalesByType from "../../components/stats/barSalesByType";
import DailyBarSalesByDrink from "../../components/stats/barSalesByDrink";


const BarFrontBoard = () => {
    const [data, setData] = useState([])
    const [helper, setHelper] = useState("")
    const branchId = useSelector(state => state.branch.branchId)
    const [totalSales, setTotalSales] = useState([])
    const [salesByType, setSalesByType] = useState([])
    const [salesByDrink, setSalesByDrink] = useState([])


    const getBar = async () => {
        try {
            const response = await api.get("/stats/getBarStats/", {
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
            console.log(error)
            const err = error.response ? error.response.data : null
            if (err) {
                const message = err.message
                setHelper(message)
                setData([])
                setTimeout(() => setHelper(""), 2000)

            }

        }
    }

    const handleData = () => {
        if (data.length > 0) {
            const subData = data.map(elem => elem.data).flat()
            const setOfDates = [...new Set(subData.map(row => row.date))]
            const totalSalesDaily = setOfDates.map((item, i) => {
                return {
                    date: item,
                    totalSales: subData.filter(row => row.date === item).map(item => item.totalNumberOfSales).reduce((val, item) => val += item),
                }
            })
            const salesByType = setOfDates.map((item, i) => {
                return {
                    date: item,
                    salesByType: subData.filter(row => row.date === item).map((item, i, arr) => item.salesByType)
                        // .flat()
                        .reduce((value, item, i, arr) => {
                            const keys = Object.keys(item)
                            // console.log(arr)
                            // console.log(value, i)
                            keys.forEach(element => {
                                value[element] = value[element] ? value[element] + item[element] : item[element]
                            });
                            // console.log(value, i)
                            return value
                        }, {
                            Alcohol: 0
                        })
                }
            })
            const salesByDrink = setOfDates.map((item, i) => ({
                date: item,
                salesByDrink: subData.filter(row => row.date === item)
                    .map((item, i, arr) => {
                        return item.salesByDrink
                    }).filter(item => item.length > 0 ? item : null)
                    .flat()
                    .reduce((value, piece, index, array) => {
                        const type = piece.type
                        if (value.hasOwnProperty(type)) {
                            piece.items.forEach(drink => {
                                const beverage = drink.drink
                                const quantity = drink.quantity
                                const sales = drink.sales
                                const findIndex = value[type].findIndex(itm => itm.drink == beverage && itm.quantity == quantity)
                                if (findIndex >= 0) {
                                    let found = value[type][findIndex]
                                    found.sales += sales
                                    value[type] = [...value[type].slice(0, findIndex), found, ...value[type].slice(findIndex + 1)]

                                } else {
                                    value[type] = [...value[type], drink]
                                }
                            });
                            return value

                        } else {
                            value[type] = piece.items
                            return value
                        }
                    }, {})
            }))
            if (totalSalesDaily) setTotalSales(totalSalesDaily)
            if (salesByType) setSalesByType(salesByType)
            if (salesByDrink) setSalesByDrink(salesByDrink)
        } else {
            setTotalSales([])
            setSalesByType([])
            setSalesByDrink([])
        }
    }

    useEffect(() => {
        getBar()
    }, [branchId])

    useEffect(() => {
        if (data) {
            handleData()
        }
    }, [data, branchId])

    // console.log(salesByType)
    //console.log(salesByDrink)
    // console.log(totalSales)
    // console.log(data)
    return (
        <Box>
            <BranchField sx={{ margin: '1rem' }} container={{ display: 'flex' }} />
            <Box sx={{ display: 'flex', margin: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <DailyBarSalesTotal data={totalSales} />
                <DailyBarSalesByType data={salesByType} />
                <DailyBarSalesByDrink data={salesByDrink} />
                <Divider orientation="vertical" flexItem />

                {/* <ReservationTypeStats data={statsByType} /> */}
            </Box>
        </Box>
    )
}

export default BarFrontBoard