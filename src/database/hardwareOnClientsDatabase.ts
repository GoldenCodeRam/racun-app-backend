import { HardwareOnClients, PrismaClient } from "@prisma/client";
import { Err, Ok, Result } from "ts-results";
import { ErrorResponse, Errors } from "../model/errors/errors";
import { withPrismaClient } from "./database";
import { HardwareDatabase } from "./hardwareDatabase";

export namespace HardwareOnClientsDatabase {
    export async function getHardwareOnClientByClientAccountId(
        id: number
    ): Promise<Result<HardwareOnClients[], Error>> {
        try {
            return Ok(
                await withPrismaClient(async (prisma: PrismaClient) => {
                    return await prisma.hardwareOnClients.findMany({
                        where: {
                            clientAccountId: id,
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

    export async function createHardwareOnClient(hardwareOnClientsData: {
        hardwareId: number;
        clientAccountId: number;
    }): Promise<Result<HardwareOnClients, ErrorResponse>> {
        try {
            // TODO: See if the hardware is not assigned before
            return await withPrismaClient(async (prisma: PrismaClient) => {
                if (
                    await HardwareDatabase.isHardwareAvailable(
                        prisma,
                        hardwareOnClientsData.hardwareId
                    )
                ) {
                    return Ok(
                        await prisma.hardwareOnClients.create({
                            data: {
                                startDate: new Date(),
                                ...hardwareOnClientsData,
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

    export async function deleteHardwareOnClient(
        id: number
    ): Promise<Result<HardwareOnClients, ErrorResponse>> {
        try {
            return await withPrismaClient(async (prisma: PrismaClient) => {
                return Ok(
                    await prisma.hardwareOnClients.update({
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
            return Err(Errors.getErrorFromCode(error));
        }
    }
}
