import 'styles/styles.css'
import ChatComponent from 'components/webchat/ChatComponent'
import MissionComponent from '../mission/missionComponent'
import { selectGameInfo } from "app/gameInfo"
import { selectMissionInfo } from "app/missionInfo"
import { useSelector } from "react-redux"
import { action } from "app/store"
import { selectMe } from 'app/me'
import { useKeyboardControls } from "@react-three/drei";

const ImageButton = () => {

  const isAdjacentMeetingBtn = useSelector(selectGameInfo).isAdjacentMeetingBtn
  const isAdjacentMissionBtn = useSelector(selectMissionInfo).isAdjacentMissionBtn
  const me = useSelector(selectMe).player
  const adjustPlayer = useSelector(selectMe).adjustPlayer

  const chatButtonActivate = () => {
    action('gameInfo/setChatModalOpen', true)
  }
  const actButtonActivate = () => {
    if (isAdjacentMeetingBtn) {
      action('START_MEETING_REQUEST')
      console.log('전송')
    } else if (isAdjacentMissionBtn) {
      action('gameInfo/setMissionModalOpen', true)
    } 
  }
  const closeButtonActivate = () => {
    action('gameInfo/setChatModalOpen', false)
  }
  const killButtonActivate = () => {
    if(adjustPlayer)  {
      action('KILL_REQUEST', {to : adjustPlayer})
      action('me/setAdjustPlayer', null);
    }
  }

  const [, get] = useKeyboardControls()
  const { actKey, killKey, reportKey, escKey, chatKey } = get()
  if (actKey) {
    actButtonActivate()
  } else if (chatKey) {
    chatButtonActivate()
  } else if (escKey) {
    closeButtonActivate()
  } else if (killKey) {
    killButtonActivate()
  } else if (reportKey) {
    //reportButtonActivate()
  }

  return (
    <>
    {me.isAlive===true?
    <>
      {/* {me.isAlive === true? */}
      {/* 버튼의 가로세로 비율은 8:5로 지정할 것 (원본 560x350px) */}
      <button
        className="imgBtn floatingComponent"
        id="chatBtn"
        onClick={chatButtonActivate}
        >
          <img className="imgBtnIcon" src="/btnIcons/iconChat1.png" alt="채팅"/>
      </button>
      <ChatComponent/>
      <button
        className={"imgBtnNoHover floatingComponent " + ((isAdjacentMeetingBtn || isAdjacentMissionBtn) ? "imgBtnReady" : "")}
        id="actBtn"
        onClick={actButtonActivate}>
        <img className="imgBtnIcon" src="/btnIcons/iconAct1.png" alt="행동"/>
      </button>
      <button
        className="imgBtn floatingComponent"
        id="reportBtn"
        onClick={undefined}
        >
          <img className="imgBtnIcon" src="/btnIcons/iconReport1.png" alt="신고"/>
      </button>
      <MissionComponent/>
      {me.role === "MAFIA"?
      <button
        className={"imgBtnNoHover floatingComponent " + (adjustPlayer ? "imgBtnReady" : "")}
        id="killBtn"
        onClick={killButtonActivate}
      >
        <img className="imgBtnIcon" src="/btnIcons/iconKill1.png" alt="살해"/>
      </button>
      :<div></div>}
    </>
    :<></>}
    </>
  );
};


export default ImageButton;