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
        console.log(`- The ${this.route} to ${this.destination} will arrive in ${this.timeToArrival} mins.`)
    }
}

const sortBuses = (busData) => {
    return busData.sort((a, b) => {
        return a.timeToStation - b.timeToStation
    })
}

// NW5 1TL
const postCode = readlineSync.question('Please enter your post code: ')

const getPostCodeData = (postCode) => {
    axios.get(`https://api.postcodes.io/postcodes/${postCode}`)
        .then((response) => {
            getBusStopCodes([response.data.result.latitude, response.data.result.longitude])
        })
        .catch((error) => {
            console.log(error)
        })
}

getPostCodeData(postCode)

const sortStopsByDistance = (stops) => {
    return stops.sort((a, b) => {
        return a.distance - b.distance
    })
}

const getBusStopCodes = (latAndLon) => {
    const [lat, lon] = latAndLon

    axios.get(`https://api.tfl.gov.uk/Stoppoint?lat=${lat}&lon=${lon}&stoptypes=NaptanBusCoachStation,NaptanPublicBusCoachTram&radius=500`)
        .then((response) => {
            const stopPoints = response.data.stopPoints
            const sortedStops = sortStopsByDistance(stopPoints)
            const nearestStops = sortedStops.slice(0, 2)

            nearestStops.forEach(async (stop) => {
                getBuses(stop.naptanId)
                    .then((buses) => {
                        console.log(`${stop.commonName} is a distance of ${stop.distance.toFixed(2)}m away. The next buses are:`)
                        buses.forEach((bus) => bus.listBus())
                    })
            })
        })
        .catch((error) => {
            console.log(error)
        })
}

const getBuses = (busStopCodes) => {
    return axios.get(`https://api.tfl.gov.uk/StopPoint/${busStopCodes}/Arrivals?app_id=${APP_ID}&app_key=${APP_KEY}`)
        .then((response) => {
            const sortedData = sortBuses(response.data)
            const nextFiveBuses = sortedData.slice(0, 5)
            const buses = []

            nextFiveBuses.forEach((busData) => {
                const bus = new Bus(busData.lineName, busData.destinationName, busData.timeToStation)
                buses.push(bus)
            })

            return buses
        })
        .catch((error) => {
            console.log(error)
        })
}