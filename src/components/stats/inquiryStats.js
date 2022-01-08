import { useState, useEffect } from "react";
import api from "../../api/api";
import { Tooltip, Legend, PieChart, Pie, Cell, } from 'recharts';
import { useSelector } from "react-redux";
import GraphContainer from './graphContainer'
import { CSVLink } from 'react-csv';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Box, TextField, Typography, IconButton } from '@mui/material'

const data2 = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
];

const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, startAngle, endAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" style={{ fontSize: 40 }} >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const CustomerInquiryStats = () => {
    const branchId = useSelector(state => state.branch.branchId)
    const [customers, setCustomers] = useState([])
    const [pieData, setpieData] = useState([])
    const [records, setRecords] = useState([])
    const [helper, setHelper] = useState("")



    const getInquiries = async () => {
        try {
            const response = await api.get(`/customer/inquiry/`, {
                params: {
                    branchId: branchId,
                }
            })
            const data = response.data.data.rows
            const message = response.data.message
            setHelper(message)

            setCustomers(data)
        } catch (error) {
            const errorData = error.response.data
            const message = errorData.message
            setHelper(message)
            setCustomers([])
        }
    }

    const calculatePie = () => {
        if (customers) {
            const pie = customers.map(customer => customer.status)
            const setOfPie = [...new Set(pie)]
            const records = setOfPie.map(element => ({ name: element, value: pie.filter(item => item === element).length }))
            setpieData(records)
        } else {
            setpieData([
                {
                    name: "Open",
                    value: 0
                },
                {
                    name: "Close",
                    value: 0
                },
                {
                    name: "Processing",
                    value: 0
                },
            ])
        }
    }



    useEffect(() => {
        calculatePie()
    }, [customers])

    useEffect(() => {
        getInquiries()
    }, [branchId])


    return (
        <GraphContainer
            title="Customer Inquiry Statistitcs"
            style={{ padding: '1rem' }}
            components={
                <Box>
                    <Box>
                        {pieData && <IconButton sx={{ transform: 'translateX(50%)' }} ><CSVLink data={pieData}  ><FileDownloadOutlinedIcon fontSize="large" sx={{ margin: '1rem', fontSize: 40 }} /> </CSVLink></IconButton>}
                    </Box>
                    <Typography component="h4" variant="body1" sx={{ margin: '1rem', minHeight: '2rem' }}>{helper}</Typography>
                </Box>
            }
        >
            <PieChart width={400} height={400}>
                <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={400}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </GraphContainer>
    )
}

export default CustomerInquiryStats