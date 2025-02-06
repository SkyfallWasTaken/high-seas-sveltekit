// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      slackSession?: import("./lib/server/db/schema").SlackSession;
      ships?: import("./lib/server/data").ShipGroup[];
      shopItems: import("./lib/server/shop").ShopItem[];
      person?: import("./lib/server/data").Person;
      startTime: number;
    }
    interface PageData {
      slackSession?: import("./lib/server/db/schema").SlackSession;
      ships?: import("./lib/server/data").ShipGroup[];
      shopItems: import("./lib/server/shop").ShopItem[];
      wrapped?: import("./lib/server/wrapped").Wrapped;
      person?: {
        autonumber: number;
        voteBalance: number;
        shipsAwaitingVoteRequirement: number;
        totalHoursLogged: number;
        doubloonsBalance: number;
      };
    }
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
