package com.project.arc205.game.dummy;

import com.project.arc205.common.model.Location;
import com.project.arc205.game.gamecharacter.model.entity.GameCharacter;
import com.project.arc205.game.gamedata.model.entity.GameData;
import com.project.arc205.game.gamedata.model.entity.GameSetting;
import com.project.arc205.game.room.model.entity.Room;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class DummyGameData {

    public static GameData getTestGameDataWithGameCharacter(
            Map<String, GameCharacter> gameCharacterMap) {
        return GameData.of(UUID.randomUUID(), new GameSetting(), gameCharacterMap,
                new Location(0.0, 0.0));
    }

    public static GameData getEmptyTestGameDataFromRoom(Room testRoom) {
        return GameData.of(testRoom.getId(), new GameSetting(), new HashMap<>(),
                new Location(0.0, 0.0));
    }
}
