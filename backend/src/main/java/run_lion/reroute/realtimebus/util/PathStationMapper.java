package run_lion.reroute.realtimebus.util;

import run_lion.reroute.realtimebus.constant.StationIds;

public class PathStationMapper {

    public static String resolveFromNode(String from, String to) {

        if (from.equals("KNUT")) return StationIds.KNUT;
        if (from.equals("TERMINAL")) return StationIds.TERMINAL;

        // 출발지가 STATION(충주역)
        if (from.equals("STATION")) {
            if (to.equals("KNUT")) return StationIds.STATION_TO_KNUT;
            if (to.equals("TERMINAL")) return StationIds.STATION_TO_TERMINAL;
        }

        throw new IllegalArgumentException("Invalid from/to combination");
    }

    public static String resolveToNode(String from, String to) {

        if (to.equals("KNUT")) return StationIds.KNUT;
        if (to.equals("TERMINAL")) return StationIds.TERMINAL;

        // 도착지가 STATION(충주역)
        if (to.equals("STATION")) {
            if (from.equals("KNUT")) return StationIds.STATION_TO_KNUT;
            if (from.equals("TERMINAL")) return StationIds.STATION_TO_TERMINAL;
        }

        throw new IllegalArgumentException("Invalid from/to combination");
    }
}