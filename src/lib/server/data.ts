import airtable from "./airtable";
import TTLCache from "@isaacs/ttlcache";
import { writeFile } from "node:fs/promises";

const debugShips = false;

const createShipGroup = (ship: Ship): ShipGroup => ({
  title: ship.title,
  created: new Date(ship.createdTime),
  totalDoubloons: ship.doubloonPayout || 0,
  totalHours: ship.creditedHours || 0,
  isInYswsBase: ship.isInYswsBase,
  ships: [ship],
});

const updateShipGroup = (group: ShipGroup, ship: Ship): void => {
  group.totalHours += ship.creditedHours || 0;
  group.totalDoubloons += ship.doubloonPayout;
  group.title = ship.title;
  group.isInYswsBase = ship.isInYswsBase;
  group.ships.push(ship);
};

// Cache ships per slack user with 5-minute TTL
export const shipsCache = new TTLCache<string, ShipGroup[]>({
  max: 1000,
  ttl: 300_000,
});

export const personCache = new TTLCache({
  ttl: 1000 * 60 * 4,
});
export function flushCaches(userId: string) {
  shipsCache.delete(`${userId}-all`);
  personCache.delete(userId);
}

export async function fetchShips(
  slackId: string,
  maxRecords?: number
): Promise<ShipGroup[]> {
  const cacheKey = `${slackId}-${maxRecords ?? "all"}`;
  const cached = shipsCache.get(cacheKey);
  if (cached) {
    if (debugShips) {
      await writeFile("ships.json", JSON.stringify(cached, null, 2));
    }
    return cached;
  }

  const filterFormula = `AND(
    '${slackId}' = {entrant__slack_id},
    {project_source} = 'high_seas',
    {ship_status} != 'deleted'
  )`;

  const unmappedShips = await airtable("ships")
    .select({
      filterByFormula: filterFormula,
      ...(maxRecords && { maxRecords }),
    })
    .all();
  if (debugShips) {
    await writeFile("ships.json", JSON.stringify(unmappedShips, null, 2));
  }

  const shipGroups: ShipGroup[] = [];
  const shipGroupMap = new Map<string, ShipGroup>();

  // Process ships in a single pass
  for (const record of unmappedShips) {
    const fields = record.fields as Record<string, unknown>;

    const ship: Ship = {
      id: record.id,
      autonumber: fields.autonumber as number,
      title: fields.title as string,
      repoUrl: fields.repo_url as string,
      deploymentUrl: fields.deploy_url as string,
      readmeUrl: fields.readme_url as string,
      screenshotUrl: fields.screenshot_url as string,
      voteRequirementMet: Boolean(fields.vote_requirement_met),
      voteBalanceExceedsRequirement: Boolean(
        fields.vote_balance_exceeds_requirement
      ),
      matchupsCount: fields.matchups_count as number,
      doubloonPayout: fields.doubloon_payout as number,
      shipType: fields.ship_type as ShipType,
      shipStatus: fields.ship_status as ShipStatus,
      wakatimeProjectNames: ((fields.wakatime_project_name as string) ?? "")
        .split("$$xXseparatorXx$$")
        .filter(Boolean),
      hours: fields.hours as number,
      creditedHours: fields.credited_hours as number,
      totalHours: fields.total_hours as number,
      createdTime: fields.created_time as string,
      updateDescription: fields.update_description as string | null,
      reshippedFromId: (fields.reshipped_from as string[])?.[0] ?? null,
      reshippedToId: (fields.reshipped_to as string[])?.[0] ?? null,
      reshippedAll: fields.reshipped_all as string[] | null,
      reshippedFromAll: fields.reshipped_from_all as string[] | null,
      paidOut: Boolean(fields.paid_out),
      yswsType: fields.yswsType as YswsType,
      feedback: fields.ai_feedback_summary as string | null,
      isInYswsBase: Boolean(fields.has_ysws_submission_id),
    };

    if (!ship.reshippedFromId) {
      const group = createShipGroup(ship);
      shipGroups.push(group);
      shipGroupMap.set(ship.id, group);
      continue;
    }

    const parentGroup = shipGroupMap.get(ship.reshippedFromId);
    if (parentGroup) {
      updateShipGroup(parentGroup, ship);
      shipGroupMap.set(ship.id, parentGroup);
    }
  }

  const finalGroups = shipGroups
    .map((group) => ({
      ...group,
      totalDoubloons: group.totalDoubloons * (group.isInYswsBase ? 1.1 : 1),
    }))
    .sort((a, b) => +new Date(b.created) - +new Date(a.created));

  // Update cache
  shipsCache.set(cacheKey, finalGroups);

  return finalGroups;
}

// #region Types
export type ShipType = "project" | "update";
export type ShipStatus = "shipped" | "staged" | "deleted";
export type YswsType =
  | "none"
  | "onboard"
  | "blot"
  | "sprig"
  | "bin"
  | "hackpad"
  | "llm"
  | "boba"
  | "cascade"
  | "retrospect"
  | "hackcraft"
  | "cider"
  | "browser buddy"
  | "cargo-cult"
  | "fraps"
  | "riceathon"
  | "counterspell"
  | "anchor"
  | "dessert"
  | "asylum";
export interface Ship extends EditableShipFields {
  id: string; // The Airtable row's ID.
  autonumber: number;
  // doubloonsPaid?: number;
  matchupsCount: number;
  hours: number | null;
  creditedHours: number | null;
  totalHours: number | null;
  voteRequirementMet: boolean;
  voteBalanceExceedsRequirement: boolean;
  doubloonPayout: number;
  shipType: ShipType;
  shipStatus: ShipStatus;
  wakatimeProjectNames: string[];
  createdTime: string;
  updateDescription: string | null;
  reshippedFromId: string | null;
  reshippedToId: string | null;
  reshippedAll: string[] | null;
  reshippedFromAll: string[] | null;
  paidOut: boolean;
  yswsType: YswsType;
  feedback: string | null;
  isInYswsBase: boolean;
}
export interface EditableShipFields {
  title: string;
  repoUrl: string;
  deploymentUrl?: string;
  readmeUrl: string;
  screenshotUrl: string;
}
export interface Person {
  fullName: string;
  recordId: string;
  email: string;
  autonumber: number;
  voteBalance: number;
  shipsAwaitingVoteRequirement: number;
  totalHoursLogged: number;
  doubloonsBalance: number;
}
export type ShipGroup = {
  title: string;
  created: Date;
  totalDoubloons: number;
  totalHours: number;
  isInYswsBase: boolean;
  ships: Ship[];
};
// #endregion Types
