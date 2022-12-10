import { Place, PrismaClient } from "@prisma/client";
import { SearchResult, SEARCH_AMOUNT, withPrismaClient } from "./database";

export namespace PlaceDatabase {
    export async function getPlaceById(id: number) {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            return await prisma.place.findUnique({
                where: {
                    id,
                },
            });
        });
    }

    export async function getPlaces() {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            return await prisma.place.findMany();
        });
    }

    export async function searchPlace(
        search: string = "",
        skip?: number,
        take?: number
    ) {
        return await withPrismaClient<SearchResult<Place>>(
            async (prisma: PrismaClient) => {
                let whereQuery: any = {
                    // This is to show only the cities from Boyacá, if we
                    // need to add more places, we have to figure out how
                    // to do this from the frontend. But for now it will be
                    // like this.
                    OR: [
                        {
                            parentPlaceId: 5,
                        },
                        {
                            parentPlaceId: 26,
                        },
                    ],
                };

                if (search.length > 0) {
                    whereQuery.AND = [
                        {
                            name: {
                                contains: search,
                            },
                        },
                    ];
                }

                const placesCount = await prisma.place.count({
                    where: whereQuery ?? {},
                });
                const place = await prisma.place.findMany({
                    where: whereQuery ?? {},
                    skip: skip ?? 0,
                    take: take ?? SEARCH_AMOUNT,
                    include: {
                        parentPlace: true,
                        places: true,
                    },
                });

                return {
                    search: place,
                    searchCount: placesCount,
                };
            }
        );
    }
}
