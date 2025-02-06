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
            items.push({
              id: record.get("identifier") as string,
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
              fairMarketValue: Number(record.get("fair_market_value")) || 0,
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
