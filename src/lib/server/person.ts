import TTLCache from "@isaacs/ttlcache";
import airtable from "./airtable";
import type { FieldSet, Record as AirtableRecord } from "airtable";
import type { Person } from "./data";

export const personCache = new TTLCache({
  ttl: 1000 * 60 * 4,
});

function mapRawPerson(person: FieldSet, recordId: string): Person {
  return {
    fullName: person.full_name as string,
    email: person.email as string,
    autonumber: person.autonumber as number,
    voteBalance: person.vote_balance as number,
    shipsAwaitingVoteRequirement:
      person.ships_awaiting_vote_requirement as number,
    totalHoursLogged: person.total_hours_logged as number,
    doubloonsBalance: person.doubloons_balance as number,
    doubloonsReceived: person.doubloons_received as number,
    doubloonsSpent: person.doubloons_spent as number,
    averageDoubloonsPerHour: person.average_doubloons_per_hour as number,
    voteCount: person.vote_count as number,
    realMoneySpent:
      (person.total_real_money_we_spent as number) ||
      (person.fair_market_value as number),
    recordId,
  };
}

export async function fetchPerson(userId: string) {
  const cachedPerson = personCache.get(userId) as AirtableRecord<FieldSet>;
  if (cachedPerson) return mapRawPerson(cachedPerson.fields, cachedPerson.id);
  const people = await airtable("people")
    .select({
      filterByFormula: `{slack_id} = "${userId}"`,
    })
    .all();

  const person = people[0];
  personCache.set(userId, person);
  console.log("personMiddleware - person not cached");
  return mapRawPerson(person.fields, person.id);
}
