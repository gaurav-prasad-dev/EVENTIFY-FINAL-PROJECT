import { fromJSON } from "postcss";
import { apiConnector } from "../../services/apiConnector";
import { homeEndpoints, movieEndpoints } from "../../services/apis";
const { GET_HOME_API } = homeEndpoints;
const {  SEARCH_MOVIES_API,  GET_MOVIE_DETAILS_API,GET_MOVIE_VIDEOS_API,GET_GENRES_API } = movieEndpoints; 


export const getHomeData = async () =>{
    try{

        const res = await apiConnector("GET",GET_HOME_API);

        return res;

    }catch(error){

        console.log("GET SHOWS ERROR:", error);
    }
}

export const searchMovies = async(query) =>{
    try{

        const res = await apiConnector("GET", SEARCH_MOVIES_API,null,{},{ query })
return res;
    }catch(error){
console.log("SEARCH MOVIES ERROR:", error);

    }
}

export const getMovieDetails = async(id) =>{
    try{

        const res = await apiConnector("GET", GET_MOVIE_DETAILS_API(id));

        return res.data;
    }catch(error){
        console.log("GEt movie details eror", error);


    }
}

export const getMovieVideos = async(id) =>{
    try{

        const res = await apiConnector("GET", GET_MOVIE_VIDEOS_API(id));

        return res;

    }catch(error){
         console.log("GET MOVIE VIDEOS ERROR:", error);

    }
}

export const getGenres = async() =>{
    try{

        const res = await apiConnector("GET", GET_GENRES_API);
        return res;

    }catch(error){
console.log("GEt genres error", error);
    }
}