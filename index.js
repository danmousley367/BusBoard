const axios = require('axios').default;

const APP_ID = "tfl_key"
const APP_KEY = "c918382153274eef95ca07f91a280c17"
axios.get(`https://api.tfl.gov.uk/StopPoint/490008660N/Arrivals?app_id=${APP_ID}&app_key=${APP_KEY}`)
    .then((response) => {
        console.log(response)
    })
    .catch((error) => {
        console.log(error)
    })
    .then(() => {
        // next function
    })