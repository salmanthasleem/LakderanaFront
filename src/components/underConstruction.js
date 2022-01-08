import { Box, Typography } from '@mui/material'
import ConstructionIcon from '@mui/icons-material/Construction';



const UnderConstruction = ({ text, subText }) => {
    console.log(subText)
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 1, height: '80vh', backgroundColor: '#081627', color: 'white' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                <ConstructionIcon sx={{ fontSize: 100 }} />
                <Box>
                    <Typography component="h2" variant="h2" >{text}</Typography>
                    {subText && <Typography component="h4" variant="h5" >{subText}</Typography>}
                </Box>
            </Box>

        </Box>
    )
}


export default UnderConstruction