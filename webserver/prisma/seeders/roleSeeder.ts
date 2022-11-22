import { PrismaClient } from "@prisma/client";
import { DEFAULT_ROLES } from "../../src/model/role";
import { DefaultSeeder } from "./seeder";

export class RoleSeeder implements DefaultSeeder {
    async seed(prisma: PrismaClient) {

        // This right here is very important, as we take the max value of the
        // default roles and save that ID for the sequence of IDs generated
        // later.
        const startSequenceId = Object.values(DEFAULT_ROLES).reduce(
            (previous, current) => {
                return previous.id > current.id ? previous : current;
            }
        );

        for (const role of Object.values(DEFAULT_ROLES)) {
            await prisma.role.upsert({
                where: { id: role.id },
                update: {},
                create: {
                    id: role.id,
                    name: role.name,
                },
            });
        }

        // If we don't do this, imagine we have 5 default roles, with 1, 2, 3, 4
        // and 5 being their IDs respectively. If we don't update the sequence
        // the next added role will start with an ID of 1, and we don't want that.
        //
        // If we update the sequence to start at the greater ID plust one, the
        // next created role will start at an ID of 6.
        //
        // This can be improved in the future, but this is a nice work arround
        // this problem.
        await prisma.$executeRawUnsafe(
            `alter sequence "Role_id_seq" start with ${
                startSequenceId.id + 1
            } restart`
        );
    }
}
