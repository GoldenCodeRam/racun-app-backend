import { DateTime } from "luxon";

export const DEFAULT_CONFIG: {
    [key: string]: {
        key: string;
        value: string;
    };
} = {
    invoiceGenerationDay: {
        key: "invoiceGenerationDay",
        value: getNextInvoiceGenerationDate(new Date()).toString(),
    },
};

export function getNextInvoiceGenerationDate(currentDate: Date): Date {
    return DateTime.fromJSDate(currentDate)
        .plus({
            months: 1,
        })
        .toJSDate();
}
