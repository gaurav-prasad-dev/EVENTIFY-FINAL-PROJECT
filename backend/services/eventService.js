const axios = require("axios");
const { EVENT_BASE_URL, API_KEY } = require("../config/eventApi");

exports.getEventsByCategory = async(keyword) => {
    try{

        const response = await axios.get(`${EVENT_BASE_URL}/events.json`,{
            params:{
                apikey: API_KEY,
                keyword: keyword,
                countryCode:"US",
                size:20,
            },
        })

          // ✅ DEFINE events properly
    const events = response.data._embedded?.events || [];
         // 🔹 Log the response data
    console.log("Ticketmaster API response:", response.data);
 // Ticketmaster wraps events inside _embedded.events
   return events.map((event) => ({
    id:event.id,
    title: event.name,
    image:event.images?.[0]?.url,
    date: event.dates?.start?.localDate,
    time: event.dates?.start?.localTime,
    venue: event._embedded?.venues?.[0]?.name,
    city: event._embedded?.venues?.[0]?.city?.name,

   }))
   
    }catch(error){
        console.log("EVENT API ERROR", error.message);
        throw error;

    }
}



exports.getMusicEvents = () => exports.getEventsByCategory("music");
exports.getSportsEvents = () => exports.getEventsByCategory("sports");
exports.getComedyEvents = () => exports.getEventsByCategory("comedy");