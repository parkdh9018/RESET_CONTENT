package com.project.arc205.game.room;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.project.arc205.game.dummy.DummyPlayer;
import com.project.arc205.game.dummy.DummyRoom;
import com.project.arc205.game.gamecharacter.model.entity.Player;
import com.project.arc205.game.gamedata.model.entity.GameSetting;
import com.project.arc205.game.room.model.entity.Room;
import com.project.arc205.game.room.model.exception.PlayerIdAlreadyExistException;
import com.project.arc205.game.room.model.exception.RoomIsFullException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class RoomTests {

    private Player getPlayerOf(String name) {
        return Player.create(name, name);
    }

//    @Test
//    @DisplayName("룸 생성 시 방 작성자가 players에 포함된다.")
//    void masterIncludedInRoomWhenCreateRoomTest() {
//        Player master = getPlayerOf("master");
//        Room room = Room.create("test", master);
//
//        assertThat(room.getPlayers().containsValue(master), is(true));
//    }

//    @Test
//    @DisplayName("룸 생성 시 방 작성자에 룸이 세팅된다.")
//    void roomSetToMasterWhenCreateRoomTest() {
//        Player master = getPlayerOf("master");
//        Room room = Room.create("test", master);
//
//        assertThat(master.getRoom(), is(equalTo(room)));
//    }

    @Test
    @DisplayName("룸에 참가하면 관계가 양방향으로 저장된다.")
    void playerJoinRoomTest() {
        Player master = getPlayerOf("master");
        Room room = Room.create("test", master);
        Player player = getPlayerOf("join");

        room.enter(player);

        assertThat(room.getPlayers().containsValue(player), is(true));
        assertThat(player.getRoom(), is(equalTo(room)));
    }

    @Test
    @DisplayName("룸에 이름이 중복인 사용자가 참여하면 예외를 발생한다.")
    void playerJoinRoomReturnFalseIfConflictTest() {
        Player master = getPlayerOf("master");
        Room room = Room.create("test", master);
        String playerId = "join";
        Player player1 = getPlayerOf(playerId);
        Player player2 = getPlayerOf(playerId);
        room.enter(player1);

        assertThrows(PlayerIdAlreadyExistException.class,
                () -> room.enter(player2));
    }

    @Test
    @DisplayName("게임 설정 변경")
    void gameSettingUpdate() {
        Room room = Room.create("update setting", getPlayerOf("master"));
        GameSetting incoming = new GameSetting();
        GameSetting gameSetting = room.getGameSetting();
        incoming.setMaxPlayers(10000000);
        gameSetting.update(incoming);

        assertThat(room.getGameSetting().getMaxPlayers(), is(equalTo(incoming.getMaxPlayers())));
    }

    @Test
    @DisplayName("게임 설정 변경 시 값이 null일 경우 무시된다")
    void gameSettingUpdateIgnoredWhenValueIsNull() {
        Room room = Room.create("update setting", getPlayerOf("master"));
        GameSetting incoming = new GameSetting();
        incoming.setMaxPlayers(null);
        GameSetting gameSetting = room.getGameSetting();
        int originalMaxPlayers = gameSetting.getMaxPlayers();
        gameSetting.update(incoming);
        assertThat(room.getGameSetting().getMaxPlayers(), is(equalTo(originalMaxPlayers)));
    }

    @Test
    @DisplayName("자리가 없는 방에 입장 시 예외가 발생한다")
    void exceptionWillThrowWhenPlayerEnterFullRoom() {
        GameSetting gameSetting = new GameSetting();
        gameSetting.setMaxPlayers(1);
        Room testRoom = DummyRoom.createTestRoomWithGameSetting("testRoom", gameSetting);
        testRoom.enter(DummyPlayer.getTestPlayer("testPlayer1"));

        assertThrows(RoomIsFullException.class,
                () -> testRoom.enter(DummyPlayer.getTestPlayer()));
    }

}
