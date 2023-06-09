import SockJS from "sockjs-client"
import axios from "axios"
import { over } from "stompjs"
import { useNavigate } from "react-router-dom"

const BASE_URL = `${ process.env.REACT_APP_IP_ADDRESS ? process.env.REACT_APP_IP_ADDRESS : 'http://localhost:8080'}/api/v1`

const SUBSCRIBE_URL = '/sub/room'
const PUBLISHER_URL = '/pub/room'

const createClient = () => {
  console.log("--createClient")
  const socket = new SockJS(`${BASE_URL}/ws`);
  const stomp_client = over(socket);

  return stomp_client;
}

const connectClient = (client, topic, player, callback) => {
  console.log("--connectClient")
  client.connect({playerId : player.id}, 
  () => {
    client.subscribe(topic, callback, {playerId : player.id});
  }, 
  () => {
    client.unsubscribe();
  })
}


const send = (client, action, roomId, data) => {
  client.send(`${PUBLISHER_URL}/${roomId}/${action}`, {}, JSON.stringify(data));
}


const roomRequest = (roomId) => {
  return axios.get(`${BASE_URL}/rooms/${roomId}`);
}

const roomListRequest = () => {
  return axios.get(`${BASE_URL}/rooms/`);
}

const RoomMake = (body) => {
  const navigate = useNavigate();
  axios.post(`${BASE_URL}/rooms`,body)
  .then(res =>{
    navigate('/')
    return('응답')
  })
}

export { createClient, send, connectClient, roomRequest, roomListRequest, RoomMake };
