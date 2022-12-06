import { HardwareOnZones, PrismaClient } from "@prisma/client";
import { Err, Ok, Result } from "ts-results";
import { ErrorResponse, Errors } from "../model/errors/errors";
import { withPrismaClient } from "./database";
import { HardwareDatabase } from "./hardwareDatabase";

export namespace HardwareOnZonesDatabase {
    export async function getHardwareOnZonesByZoneId(
        id: number
    ): Promise<Result<HardwareOnZones[], Error>> {
        try {
            return Ok(
                await withPrismaClient(async (prisma: PrismaClient) => {
                    return await prisma.hardwareOnZones.findMany({
                        where: {
                            zoneId: id,
                            endDate: null,
                        },
                        include: {
                            hardware: true,
                        },
                    });
                })
            );
        } catch (error: any) {
            return Err(error);
        }
    }

    export async function createHardwareOnZones(hardwareOnZonesData: {
        hardwareId: number;
        zoneId: number;
    }): Promise<Result<HardwareOnZones, ErrorResponse>> {
        try {
            return await withPrismaClient(async (prisma: PrismaClient) => {
                if (
                    await HardwareDatabase.isHardwareAvailable(
                        prisma,
                        hardwareOnZonesData.hardwareId
                    )
                ) {
                    return Ok(
                        await prisma.hardwareOnZones.create({
                            data: {
                                startDate: new Date(),
                                ...hardwareOnZonesData,
                            },
                        })
                    );
                } else {
                    return Err(Errors.getErrorFromCode("HAAE"));
                }
            });
        } catch (error: any) {
            return Err(Errors.getErrorFromCode(error));
        }
    }

    export async function deleteHardwareOnZone(
        id: number
    ): Promise<Result<HardwareOnZones, Error>> {
        try {
            return await withPrismaClient(async (prisma: PrismaClient) => {
                return Ok(
                    await prisma.hardwareOnZones.update({
                        where: {
                            id,
                        },
                        data: {
                            endDate: new Date(),
                        },
                    })
                );
            });
        } catch (error: any) {
            return Err(error);
        }
    }
}
