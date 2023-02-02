import { call, put, takeEvery, take, takeLatest, select, fork } from 'redux-saga/effects'
import { eventChannel, buffers } from 'redux-saga'
import { createClient, send, connectClient } from 'api';


//////////////////////// 채널 관련

function* initializeStompChannel(action) {
  yield call(startStomp, action);
}

function createEventChannel(client, roomId, player) {

  return eventChannel(emit => {
    const onReceivedMessage = (message) => {emit(message);}
    
    connectClient(client, roomId, player, onReceivedMessage);

    return () => {
      client.unsubscribe();
    }
  }, buffers.expanding(3000) || buffers.none());
}

function* startStomp(action) {

  const stompClient = yield call(createClient)
  stompClient.debug = null;

  const stateMe = yield select(state => state.me);

  const channel = yield call(createEventChannel, stompClient, action.payload.roomId, stateMe.player);

  // 채널 전송하는 함수들 묶음
  yield fork(sendChannel, stompClient, action.payload.roomId);

  // 게임 시작 알림 받기 전까지 대기
  while(true) {
    const res = yield take(channel);
    const body = JSON.parse(res.body);
    
    if(body.type === 'GAME' && body.operation === 'START') {
      yield put({type : "gameInfo/setInGame", payload: true})
      break;
    }
    
  }


  while (true) {

    try {
      const res = yield take(channel);
      const body = JSON.parse(res.body)

      yield channelHandling[body.type](body.operation, body.data);

    } catch (e) {
      console.error("Sagas recive error!!")
      console.error(e.message);
      channel.close();

    } 
  }
}


const channelHandling = {
  CHARACTER: function* (operation, data) {
    switch (operation) {
      case 'MOVE':

        const stateMe = yield select(state => state.me);

        if(stateMe.player.id !== data.player.id) {
          const otherPlayerData = {
            player : {id : data.player.id, isVoted : false, isAlive : true}, 
            location : data.location
          }
          yield put({type : "others/setOtherPlayer", payload: otherPlayerData})
        }
        break;
    
      default:
        break;
    }
  },
  MEETING: function* (operation, data) {
    switch (operation) {
      // 미팅 시작 알림 받음
      case 'START':
        yield put({type : "gameInfo/setInMeeting", payload: true})
        break;
      // 투표 시작 알림 받음 
      case 'START_VOTING':
        yield put({type : "gameInfo/setInVote", payload: true})
        break;
      // 투표 알림 받음
      case 'VOTE':
        yield put({type: "others/setVote", payload: {id : data.playerId, value : true}})
        break;
      // 회의 종료
      case 'END':
        yield put({type : "voteInfo/setVoteResult", payload: data})
        yield put({type : "gameInfo/setInVote", payload: false})
        yield put({type : "gameInfo/setInVoteResult", payload: true})

        // 투표 관련 초기화

        const stateMe = yield select(state => state.me);

        yield put({type : "others/setAllVoteFalse"})
        yield put({type : "me/setPlayer", payload: {...stateMe.player, isVoted: false}})

        break;
      default:
        break;
    }
  }
}

/////////////////////////////////
/////////////////// 클라이언트 -> 서버 소켓 전송
function* sendChannel(client, roomId) {
  yield takeEvery("GAME_START_REQUEST", gameStart, client, roomId);
  yield takeEvery("LOCAITION_SEND_REQUEST", locationSend, client, roomId);
  yield takeEvery("START_MEETING_REQUEST", startMeeting, client, roomId);
  yield takeEvery("VOTE_REQUEST", vote, client, roomId)
}

// 게임 시작 요청
function* gameStart(client, roomId, action) {
  yield call(send, client, "game/start", roomId)
}

// 이동 정보 전송 요청
function* locationSend(client, roomId, action) {

  const stateMe = yield select(state => state.me);
  yield put({type : "me/changeLocation", payload : action.payload})
  yield call(send, client, "move", roomId, stateMe)
}

// 미팅 시작 요청
function* startMeeting(client, roomId, action) {
  yield call(send, client, "meeting/start", roomId)
}

// 투표 요청
function* vote(client, roomId, action) {
  const stateMe = yield select(state => state.me);
  yield put({type: "me/setPlayer", payload: {...stateMe.player, isVoted: true}})
  yield call(send, client, "meeting/vote", roomId, {from : stateMe.player.id, to : action.payload})
}

function* mySaga() {
  yield takeLatest("SOCKET_CONNECT_REQUEST", initializeStompChannel);
}

export default mySaga;