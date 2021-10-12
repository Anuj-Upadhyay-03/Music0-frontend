//Author: Fenil Shah
//Created on: 21st July,2021
import Axios from 'axios';

export const  AddToHistory = async (trackId,userId) =>{
    const requestBody = {
        userId:userId,
        trackId:trackId
    }
    await Axios({
        method:'post',
        url:'https://csci-5709-musico-backend.herokuapp.com/addToHistory',
        data:requestBody
    });
}