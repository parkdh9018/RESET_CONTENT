import { Modal } from 'antd';
import { selectGameInfo } from 'app/gameInfo';
import { selectGameResult } from 'app/gameResult';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const GameResult = () => {
  const isInGame = useSelector(selectGameInfo).isInGame
  const gameResult = useSelector(selectGameResult)
  const navigate = useNavigate();
  // ※렌더링 되고 10초 지난후 라우터 이동
  useEffect(()=>{
    if (!isInGame&&gameResult) {
    setTimeout(() => {
      navigate('/rooms')
      // Todo:
      // 웹소켓 연결 끊기...? 자동으로 되는건지 잘모르겠다
      // 게임에 사용된 변수 초기화
      // 웹캠컴포넌트랑 채팅창 띄울까 고민중
      
    },10000)}
  },[isInGame, gameResult])
  return (
    <>
    <Modal
    title="대충 10초 정도 결과창 보이는중"
    open={!isInGame&&gameResult}
    width={1920}
    closable={false}>

    <div>
      <div>대충 10초 정도 결과창 보이는중</div>
      <div>{gameResult.win}가 이겼다!</div>
      {gameResult.players.map((player) => {
        <div>{player.id}:{player.role}</div>
      })}
    </div>
    </Modal>
    </>
  );
};

export default GameResult;