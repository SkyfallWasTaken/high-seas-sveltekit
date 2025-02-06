import { WAKA_API_KEY } from "$env/static/private";
import type { Person, ShipGroup } from "./data";

interface WakaTimeSummaryItem {
  key: string;
  total: number;
}

interface WakaTimeSummary {
  projects: WakaTimeSummaryItem[];
  categories: WakaTimeSummaryItem[];
  editors: WakaTimeSummaryItem[];
  languages: WakaTimeSummaryItem[];
}

async function getWakaSummary(userId: string) {
  const response = await fetch(
    `https://waka.hackclub.com/api/summary?interval=high_seas&user=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${WAKA_API_KEY}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error(`WakaTime API returned ${response.status}`);
  }
  return (await response.json()) as WakaTimeSummary;
}

export interface Wrapped {
  wakatime: {
    mostUsedEditor: WakaTimeSummaryItem;
    mostUsedLanguage: WakaTimeSummaryItem;
    projectWithMostHours: WakaTimeSummaryItem;
    totalCodingSeconds: number;
  };
  highSeas: {
    doubloonsReceived: number;
    doubloonsSpent: number;
    averageDoubloonsPerHour: number;
    shipsCount: number;
    mostSuccessfulShip: {
      name: string;
      totalHours: number;
      totalSeconds: number;
      totalDoubloons: number;
    };
    voteCount: number;
    averageVoteTime: number;
    realMoneySpent: number;
  };
}
export async function getWrappedData(
  userId: string,
  person: Person,
  shipGroups: ShipGroup[]
): Promise<Wrapped> {
  const result: Partial<Wrapped> = {};

  const wakatime = await getWakaSummary(userId);
  const mostUsedEditor = wakatime.editors.reduce((prev, current) =>
    prev.total > current.total ? prev : current
  );
  const mostUsedLanguage = wakatime.languages.reduce((prev, current) =>
    prev.total > current.total ? prev : current
  );
  const projectWithMostHours = wakatime.projects.reduce((prev, current) =>
    prev.total > current.total ? prev : current
  );
  const totalCodingSeconds =
    wakatime.categories.find((cat) => cat.key === "coding")?.total || 0;

  result.wakatime = {
    mostUsedEditor,
    mostUsedLanguage,
    projectWithMostHours,
    totalCodingSeconds,
  };

  const mostSuccessfulShip = shipGroups.reduce((prev, current) =>
    prev.totalDoubloons / prev.totalHours >
    current.totalDoubloons / current.totalHours
      ? prev
      : current
  );
  result.highSeas = {
    doubloonsReceived: person.doubloonsReceived,
    doubloonsSpent: person.doubloonsSpent,
    averageDoubloonsPerHour: person.averageDoubloonsPerHour,
    shipsCount: shipGroups.length,
    mostSuccessfulShip: {
      name: mostSuccessfulShip.title,
      totalSeconds: mostSuccessfulShip.totalHours * 60 * 60,
      totalHours: mostSuccessfulShip.totalHours,
      totalDoubloons: mostSuccessfulShip.totalDoubloons,
    },
    voteCount: person.voteCount,
    averageVoteTime: person.averageVoteTime,
    realMoneySpent: person.realMoneySpent,
  };

  return result as Wrapped;
}
