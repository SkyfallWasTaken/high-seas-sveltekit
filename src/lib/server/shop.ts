import airtable from "./airtable";

export interface ShopItem {
  id: string;
  recordId: string;
  name: string;
  subtitle: string | null;
  imageUrl: string | null;
  enabledUs: boolean | null;
  enabledEu: boolean | null;
  enabledIn: boolean | null;
  enabledXx: boolean | null;
  enabledCa: boolean | null;
  enabledAll: boolean | null;
  enabledAu: boolean | null;
  priceUs: number;
  priceGlobal: number;
  fulfilledAtEnd: boolean;
  comingSoon: boolean;
  outOfStock: boolean;
  minimumHoursEstimated: number;
  maximumHoursEstimated: number;
  description: string | null;
  customs_likely: boolean | null;
  fulfillment_description: string | null;
  links: string[] | null[];
  limited_qty: boolean | null;
  filloutBaseUrl: string;
  fairMarketValue: number;
}

let shopCache: ShopItem[] | null = null;
let shopCacheExpiry: number | null = null;

const shopValueLookups: Record<string, number> = {
  item_orph_pico: 4.0,
  item_hack_club_microsd_card_28: 3.0,
  item_hot_chocolate: 2.0,
  item_logic_analyzer_17: 12.69,
  item_orph_pico_soldered: 5.0,
  item_raspberry_pi_13_us: 15.0,
  item_raspberry_pi_13_intl: 20.0,
  item_cube: 29.0,
  item_pinecil_20: 25.99,
  item_github_notebook_37: 12.0,
  item_blah_j_5: 9.99,
  item_github_keycaps_38: 20.0,
  item_ham_radio: 17.27,
  item_lockpick_set_31: 30.0,
  item_hack_club_socks__34: 30.0,
  item_factorio: 35.0,
  item_india_knockoff_dremel: 20.0,
  item_fudge: 17.95,
  item_ham_radio_intl_2: 18.0,
  item_dremel_4300_kit_33: 25.0,
  item_raspberry_pi_5_45: 62.0,
  item_logitech_mx_master_3s: 100.0,
  item_logitech_mx_master_3s_india: 102.49,
  item_github_stanley_tumbler_40: 70.0,
  item_system76_launch_keyboard_48: 225.0,
  item_flipper_32: 169.0,
  item_ben_eater_8bit_kit: 300.0,
  item_bambu_lab_a1_mini_49: 199.0,
  item_100mhz_oscilloscope_53: 319.0,
  item_ipad_46: 448.0,
  item_mac_m4_mini: 599.0,
  item_framework_laptop_13_factory_seconds_53: 900.0,
  item_macbook_air_54: 899.0,
  item_defcon_ticket_55: 2750.0,
};

export async function getShop(): Promise<ShopItem[]> {
  const items: ShopItem[] = [];

  return new Promise((resolve, reject) => {
    if (shopCache !== null && shopCacheExpiry && shopCacheExpiry > Date.now()) {
      console.log("Returning cached shop");
      return resolve(shopCache);
    }

    airtable("shop_items")
      .select({
        filterByFormula: `AND(
          unlisted = FALSE(),
          {enabled_main_game} = TRUE()
        )`,
        sort: [{ field: "tickets_us", direction: "asc" }],
      })
      .eachPage(
        (records, fetchNextPage) => {
          for (const record of records) {
            const identifier = record.get("identifier") as string;
            items.push({
              id: identifier,
              recordId: record.id,
              name: record.get("name") as string,
              subtitle: record.get("subtitle") as string | null,
              imageUrl: record.get("image_url") as string | null,
              enabledUs: Boolean(record.get("enabled_us")) as boolean,
              enabledEu: Boolean(record.get("enabled_eu")) as boolean,
              enabledIn: Boolean(record.get("enabled_in")) as boolean,
              enabledXx: Boolean(record.get("enabled_xx")) as boolean,
              enabledCa: Boolean(record.get("enabled_ca")) as boolean,
              enabledAll: Boolean(record.get("enabled_all")) as boolean,
              enabledAu: Boolean(record.get("enabled_au")) as boolean,
              priceUs: Number(record.get("tickets_us")) as number,
              priceGlobal: Number(record.get("tickets_global")) as number,
              fulfilledAtEnd: Boolean(
                record.get("fulfilled_at_end")
              ) as boolean,
              comingSoon: Boolean(record.get("coming_soon")) as boolean,
              outOfStock: Boolean(record.get("out_of_stock")) as boolean,
              minimumHoursEstimated: Number(
                record.get("minimum_hours_estimated")
              ),
              maximumHoursEstimated: Number(
                record.get("maximum_hours_estimated")
              ),
              description: record.get("description") as string | null,
              customs_likely: Boolean(record.get("customs_likely")) as boolean,
              fulfillment_description: record.get("fulfillment_description") as
                | string
                | null,
              links: [
                record.get("third_party_link_us") as string,
                record.get("third_party_link_eu") as string,
                record.get("third_party_link_in") as string,
                record.get("third_party_link_ca") as string,
              ],
              limited_qty: Boolean(record.get("limited_qty")) as boolean,
              filloutBaseUrl: record.get("fillout_base_url") as string,
              fairMarketValue:
                Number(record.get("fair_market_value")) ||
                shopValueLookups[identifier] ||
                0,
            });
          }

          fetchNextPage();
        },
        (err) => {
          if (err) reject(err);
          shopCache = items;
          shopCacheExpiry = Date.now() + 5 * 60 * 1000;
          console.log("Updated shop cache");
          resolve(items);
        }
      );
  });
}

export async function getShopItem(id: string): Promise<ShopItem | null> {
  const items = await getShop();
  return items.find((item) => item.id === id) || null;
}
