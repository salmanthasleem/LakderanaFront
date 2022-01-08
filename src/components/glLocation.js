import { useState, useEffect } from "react";
import { Autocomplete, TextField, Typography } from "@mui/material";
import { setQueryAsync } from "../redux/slicers/gLocation"
import { useDispatch, useSelector } from "react-redux";


const loadScript = (url) => {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
};

const Location = ({ errors, helpers, sx }) => {
    const [places, setPlaces] = useState([])
    const dispatch = useDispatch()
    const query = useSelector(state => state.gLocation.query)

    const handleScript = (query) => {
        const options = {
            types: ['(cities)'],
            componentRestrictions: { 'country': ['LK'] },
        }


        var autocomplete = new window.google.maps.places.AutocompleteService()
        autocomplete.getPlacePredictions({
            input: query,
            ...options
        }, (predictions, status) => {
            if (status != window.google.maps.places.PlacesServiceStatus.OK || !predictions) {
                return
            }

            const places = predictions.map(place => place.description)
            setPlaces(places)
        })


    }

    useEffect(() => {
        if (query) {
            handleScript(query)
        }
    }, [query])

    useEffect(() => {
        loadScript(
            `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_PLACESAPI}&libraries=places&callback=initMap`
        );
    }, [])

    console.log(query)
    return (
        <>
            <Autocomplete
                freeSolo
                disableClearable
                options={places}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Location"
                        name="location"
                        InputProps={{
                            ...params.InputProps,
                            type: 'search',
                        }}
                    />
                )}
                onInputChange={(e, val) => {
                    if (val) {
                        dispatch(setQueryAsync(val))
                    } else {
                        dispatch(setQueryAsync())
                    }
                }}
                onChange={(e, val) => {
                    dispatch(setQueryAsync(val))
                }}
                inputValue={query}
                loading={places ? false : true}
                value={query}
                label="Location"
                name="location"
                sx={sx}
            />
            {errors &&
                <Typography color="red"  >
                    {helpers}
                </Typography>}
        </>
    )
}


export default Location