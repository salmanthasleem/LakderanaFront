import axios from 'axios';


const api = axios.create({
    baseURL: 'https://lakderana.as.r.appspot.com/api'
})

export default api