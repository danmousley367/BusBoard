const axios = require('axios').default;

const APP_ID = "tfl_key"
const APP_KEY = "c918382153274eef95ca07f91a280c17"

const readlineSync = require("readline-sync");

class Bus {
    constructor(route, destination, timeToArrival) {
        this.route = route
        this.destination = destination
        this.timeToArrival = timeToArrival
    }

    listBus = () => {
        console.log(`The ${this.route} to ${this.destination} will arrive in ${this.timeToArrival} mins.`)
    }
}

const sortBuses = (busData) => {
    return busData.sort((a, b) => {
        return a.timeToStation - b.timeToStation
    })
}

// 490008660N
const busStopCode = readlineSync.question('Please enter your bus stop code: ')

axios.get(`https://api.tfl.gov.uk/StopPoint/${busStopCode}/Arrivals?app_id=${APP_ID}&app_key=${APP_KEY}`)
    .then((response) => {
        const sortedData = sortBuses(response.data)
        const nextFiveBuses = sortedData.slice(0, 5)
        const busTimes = []

        nextFiveBuses.forEach((busData) => {
            const bus = new Bus(busData.lineName, busData.destinationName, busData.timeToStation)
            busTimes.push(bus)
        })

        busTimes.forEach((bus) => bus.listBus())
    })
    .catch((error) => {
        console.log(error)
    })