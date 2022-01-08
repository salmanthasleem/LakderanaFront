import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/api";
import { TextField, Autocomplete, Box } from "@mui/material";
import { setNameAsync, setPriceAsync, setQuantityAsync, setTypeAsync, setStockAsync } from '../redux/slicers/beverage'
import { setCostAsync } from "../redux/slicers/addItemModalSlice";



const BeverageField = ({ sx, container, isName, isPrice, isQuantity, isCost, branchId, isStock }) => {
    const beverage = useSelector(state => state.beverage)
    const dispatch = useDispatch()
    const [beverages, setBeverages] = useState([])
    const [helper, setHelper] = useState("")
    const [filter, setFilter] = useState([])
    const [selectType, setSelectType] = useState("")
    const [selectName, setSelectName] = useState("")
    const [selectQuantity, setSelectQuantity] = useState("")
    const [selectCost, setSelectCost] = useState("")
    const name = beverage.name
    const type = beverage.type
    const quantity = beverage.quantity
    const price = beverage.price
    const cost = beverage.cost
    const stock = beverage.stock

    const showName = isName ? isName : true
    const showPrice = isPrice ? isPrice : true
    const showCost = isCost ? isCost : true
    const showStock = isStock ? isStock : true
    const showQuantity = isQuantity ? isQuantity : true

    const handleType = (val) => {
        if (val) {
            const type = val
            dispatch(setTypeAsync(type))
            const filter = beverages.filter(drink => drink.type === type)
            const names = filter.map(row => row.name)
            setFilter(filter)
            setSelectName([...new Set(names)])
        }
    }

    const handleName = (val) => {

        if (val) {
            const name = val
            dispatch(setNameAsync(name))
            const filtered = filter.filter(drink => drink.name === name && drink.type === type)
            setFilter(filtered)
            const quantity = filtered.map(row => row.quantity)
            setSelectQuantity([...new Set(quantity)])
            //selectQuantity.current = [...new Set(quantity)]
        }
    }

    const handleQuantity = (val) => {
        if (val && filter.length > 0) {
            const quantity = val
            dispatch(setQuantityAsync(quantity))
            const filtered = filter.filter(drink => drink.quantity === quantity && drink.name === name && drink.type === type)
            const cost = filtered.map(row => row.cost)
            setSelectCost([...new Set(cost)])
            //selectCost.current = [...new Set(cost)]
            //const price = filtered[0].price
        }
    }

    const handleCost = (val) => {
        if (val && filter.length > 0) {
            const cost = val
            dispatch(setCostAsync(cost))
            const filtered = filter.filter(drink => drink.cost === cost && drink.quantity === quantity && drink.name === name && drink.type === type)
            const price = filtered[0].price
            const stock = filtered[0].stock
            dispatch(setPriceAsync(price))
            dispatch(setStockAsync(stock))
        }
    }

    const handleTypeInput = (e, val) => {
        if (val) {
            dispatch(setNameAsync())
            dispatch(setQuantityAsync())
            dispatch(setPriceAsync())
            dispatch(setCostAsync())
        } else {
            dispatch(setNameAsync())
            dispatch(setPriceAsync())
            dispatch(setQuantityAsync())
            dispatch(setCostAsync())
            dispatch(setTypeAsync())
            const names = beverages.map(row => row.name)
            setSelectName([...new Set(names)])
            //selectName.current = [...new Set(names)]
        }
    }

    const handleNameInput = (e, val) => {
        if (val) {
            dispatch(setQuantityAsync())
            dispatch(setPriceAsync())
            dispatch(setCostAsync())
        } else {
            dispatch(setNameAsync())
            dispatch(setPriceAsync())
            dispatch(setQuantityAsync())
            dispatch(setCostAsync())
            const filtered = beverages.filter(drink => drink.type === type)
            const quantity = filtered.map(row => row.quantity)
            setSelectQuantity([...new Set(quantity)])
            setFilter(filtered)
        }
    }

    const handleQuantityInput = (e, val) => {
        if (val) {
            dispatch(setPriceAsync())
            dispatch(setCostAsync())
        } else {
            dispatch(setPriceAsync())
            dispatch(setQuantityAsync())
            dispatch(setCostAsync())
            const filtered = beverages.filter(drink => drink.type === type && drink.name === name)
            const cost = filtered.map(row => row.cost)
            setSelectCost(...new Set(cost))
            setFilter(filtered)
        }
    }

    const handleCostInput = (e, val) => {
        if (val) {
            dispatch(setPriceAsync())
            dispatch(setStockAsync())
        } else {
            dispatch(setPriceAsync())
            dispatch(setCostAsync())
            dispatch(setStockAsync())
            const filtered = beverages.filter(drink => drink.type === type && drink.name === name && drink.quantity === quantity)
            setFilter(filtered)
        }
    }

    const getAllBeverages = async () => {
        try {
            const response = await api.get("/bar/getStock/", {
                params: {
                    branchId
                }
            })
            const data = await response.data.data
            const message = await response.data.message
            const isAvailable = await data.isAvailable
            const rows = data.data
            if (isAvailable && rows) {
                setBeverages(rows)
                setFilter(rows)
                setSelectType([...new Set(rows.map(row => row.type))])
                //selectType.current = [...new Set(rows.map(row => row.type))]
            }
            setHelper(message)
        } catch (error) {
            const data = await error.response.data
            const message = data.message
            if (message) {
                setHelper(message)
            }
        }
    }

    useEffect(async () => {
        const prevname = name
        const prevtype = type
        const prevquantity = quantity
        const prevcost = cost
        await getAllBeverages()
        await handleType(prevtype)
        await handleName(prevname)
        await handleQuantity(prevquantity)
        await handleCost(prevcost)

    }, [stock])

    useEffect(() => {
        getAllBeverages()
    }, [branchId])


    return (
        <Box sx={container}>
            <Autocomplete
                disablePortal
                options={selectType || []}
                renderInput={(params) => <TextField {...params} label="Search / Select Beverage Type" />}
                onChange={(e, val) => handleType(val)}
                onInputChange={handleTypeInput}
                sx={sx}
                disabled={branchId ? false : true}
                value={type}
            />
            {showName && <Autocomplete
                disablePortal
                options={selectName || []}
                renderInput={(params) => <TextField {...params} label="Search / Select Beverage Name" />}
                sx={sx}
                onChange={(e, val) => handleName(val)}
                onInputChange={handleNameInput}
                disabled={type ? false : true}
                value={name}
            />}
            {showQuantity && <Autocomplete
                disablePortal
                options={selectQuantity || []}
                renderInput={(params) => <TextField {...params} label="Quantity" />}
                sx={sx}
                onChange={(e, val) => handleQuantity(val)}
                onInputChange={handleQuantityInput}
                disabled={name ? false : true}
                value={quantity}
            />}
            {showCost && <Autocomplete
                disablePortal
                options={selectCost || []}
                renderInput={(params) => <TextField {...params} label="Cost" />}
                sx={sx}
                onChange={(e, val) => handleCost(val)}
                onInputChange={handleCostInput}
                disabled={quantity ? false : true}
                value={cost}
            />}
            {showPrice && <TextField
                label="Price"
                value={price}
                sx={sx}

                disabled
            />}
            {showStock && <TextField
                label="Available Units"
                value={stock}
                sx={sx}

                disabled
            />}
        </Box>
    )
}


export default BeverageField