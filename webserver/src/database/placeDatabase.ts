import { Place, PrismaClient } from "@prisma/client";
import { SearchResult, SEARCH_AMOUNT, withPrismaClient } from "./database";

export namespace PlaceDatabase {
    export async function searchPlace(
        search: string = "",
        skip?: number,
        take?: number
    ) {
        return await withPrismaClient<SearchResult<Place>>(
            async (prisma: PrismaClient) => {
                let whereQuery = null;

                if (search.length > 0) {
                    whereQuery = {
                        OR: [
                            {
                                name: {
                                    equals: search,
                                },
                            },
                        ],
                    };
                }

                const placesCount = await prisma.place.count({
                    where: whereQuery ?? {},
                });
                const place = await prisma.place.findMany({
                    where: whereQuery ?? {},
                    skip: skip ?? 0,
                    take: take ?? SEARCH_AMOUNT,
                });

                return {
                    search: place,
                    searchCount: placesCount,
                };
            }
        );
    }
}
