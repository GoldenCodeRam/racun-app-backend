import { generateInvoice } from "../../src/documentGenerator/invoice/invoiceGenerator";
import fs from "fs";

import { faker } from "@faker-js/faker";
import { MAX_QR_CODE_CONTENT_SIZE } from "../../src/documentGenerator/invoice/header";

describe("testing", () => {
    test("testing something", () => {
        generateInvoice(
            {
                invoiceId: parseInt(faker.random.numeric(3)),
                generationDate: new Date(),
                client: {
                    id: parseInt(faker.random.numeric(3)),
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    email: faker.internet.email(),
                    phone: faker.phone.number(),
                    document: faker.random.numeric(9),
                    address: faker.address.streetAddress(),
                },
                billingPeriod: {
                    periodStart: faker.date.past(),
                    periodEnd: faker.date.recent(),
                },
                paymentDate: faker.date.soon(),
                suspensionDate: faker.date.future(),

                // This number is important, as is the maximum number the QR code
                // can generate a code to.
                qrCode: parseInt(
                    faker.random.numeric(MAX_QR_CODE_CONTENT_SIZE)
                ),

                invoiceElements: generateInvoiceElements(),
                totalValue: parseInt(faker.random.numeric(9)),
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
