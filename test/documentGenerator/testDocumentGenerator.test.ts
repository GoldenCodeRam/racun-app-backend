import { generateInvoice } from "../../src/documentGenerator/invoice/invoiceGenerator";
import fs from "fs";

import { faker } from "@faker-js/faker";

describe("testing", () => {
    test("testing something", () => {
        generateInvoice(
            {
                client: {
                    id: 1,
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    address: faker.address.streetAddress(),
                    document: faker.random.numeric(9),
                    email: faker.internet.email(),
                    phone: faker.phone.number(),
                },
                generationDate: new Date(),
                services: [
                    {
                        id: 1,
                        description: faker.lorem.paragraph(),
                        name: faker.company.name(),
                    },
                ],
                invoice: {
                    generationDate: new Date(),
                    adjustment: 10,
                    contractId: 1,
                    id: 1,
                    paymentDate: new Date(),
                    periodEnd: new Date(),
                    periodStart: new Date(),
                    latePaymentValue: 0,
                    status: 0,
                    suspensionDate: new Date(),
                    value: 1000,
                },
                qrCode: faker.random.numeric(9),
            },
            (document) => {
                document.pipe(fs.createWriteStream("temp/invoice_test.pdf"));
            }
        );
    });
});

function generateInvoiceElements(): {
    description: string;
    amount: number;
    price: number;
}[] {
    const invoiceElements: {
        description: string;
        amount: number;
        price: number;
    }[] = [];

    for (let i = 0; i < parseInt(faker.random.numeric()); i++) {
        invoiceElements.push({
            description: faker.lorem.paragraph(),
            amount: parseInt(faker.random.numeric()),
            price: parseInt(faker.random.numeric(9)),
        });
    }

    return invoiceElements;
}
