import { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ZAxis, Legend } from 'recharts';
import GraphContainer from "./graphContainer";
import { useSelector } from 'react-redux';
import { Box, TextField, IconButton } from '@mui/material'
import { CSVLink } from 'react-csv';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
const randomColor = require('randomcolor')



const DailyBarSalesByDrink = ({ data }) => {
    const branchName = useSelector(state => state.branch.branchName)
    const [date, setDate] = useState("")
    const [chart, setChart] = useState([])


    const handleData = (date) => {
        if (date) {
            const filter = data.filter(item => item.date === date).map(item => item.salesByDrink).map(element => {
                const keys = Object.keys(element)
                keys.forEach(key => {
                    element[key] = element[key].map(item => ({ ...item, type: key }))
                })
                return Object.values(element)
            }).flat(2)
                .map(item => ({ x: Number(item.quantity.replace("L", "").trim()), y: item.sales, z: item.drink, p: item.type }))

            const alcs = filter.map(item => item.p).map(item => ({
                type: item,
                items: filter.filter(obj => obj.p === item)
            })).reduce((value, current) => {
                const findIndex = value.findIndex(item => item.type === current.type)
                if (findIndex >= 0) {
                    value[findIndex].items = [...value[findIndex].items, ...current.items]
                    return value
                } else {
                    return [...value, current]
                }
            }, [])
            console.log(alcs)
            setChart(alcs)
        }
    }

    useEffect(() => {
        handleData(date)
    }, [date])

    useEffect(() => {
        const date = new Date().toISOString().split("T")[0].trim()
        setDate(date)
    }, [])

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p >{payload[0].payload.z}</p>
                    <p >{`${payload[1].name} : ${payload[1].value}`}</p>
                    <p >{`${payload[0].name} : ${payload[0].value}L`}</p>
                </div>
            );
        }

        return null;
    };

    //console.log(data)
    return (
        <GraphContainer
            title={"Daily Sales By Beverage " + `${branchName ? ` - ${branchName}` : ""}`}
            components={
                <Box sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                    <TextField
                        type="date"
                        onChange={(e, val) => setDate(e.target.value)}
                        value={date}
                        sx={{ margin: '1rem' }}
                    />
                    {chart.length > 0 && <IconButton><CSVLink data={chart}  ><FileDownloadOutlinedIcon fontSize="large" sx={{ margin: '1rem', fontSize: 40 }} /> </CSVLink></IconButton>}

                </Box>
            }
            values={date}
        >
            <ScatterChart
                width={500}
                height={500}
                margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                }}
            >
                <XAxis type="number" dataKey="x" name="quantity" unit="L" />
                <YAxis type="number" dataKey="y" name="sales" />
                <YAxis type="text" dataKey="z" name="drink" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} payload={chart} content={<CustomTooltip />} />
                {
                    chart.map(scatter => <Scatter name={scatter.type} data={scatter.items} fill={randomColor({
                        luminosity: 'dark',
                        format: 'rgb',
                        alpha: 1 // e.g. 'rgba(9, 1, 107, 0.5)',
                    })} />)
                }
                {/* <Scatter name="A school" data={chart} fill="#8884d8" /> */}
                <Legend height={5} margin={{ bottom: 0 }} align="right" verticalAlign="bottom" />
            </ScatterChart>
        </GraphContainer>
    )
}

export default DailyBarSalesByDrink