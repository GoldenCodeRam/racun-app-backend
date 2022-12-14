export namespace InvoiceModel {
    export enum InvoiceStatus {
        PENDING,
        PAID,
        LATE,
    }

    export type InvoiceBodyRequest = {
        clientAccountId: number;
        contractId: number;
        periodStart: string;
        periodEnd: string;
        paymentDate: string;
        suspensionDate: string;
        value: number;
        status: number;

        adjustment?: number;
    };

    export type InvoiceData = {
        generationDate: Date;
        periodStart: Date;
        periodEnd: Date;
        paymentDate: Date;
        suspensionDate: Date;
        value: number;
        latePaymentValue: number;
        adjustment: number;
        status: InvoiceStatus;
        contractId: number;
    };

    export function invoiceDataFromInvoiceBodyRequest(
        invoiceBodyRequest: InvoiceBodyRequest
    ): InvoiceData {
        return {
            generationDate: new Date(),
            periodStart: new Date(invoiceBodyRequest.periodStart),
            periodEnd: new Date(invoiceBodyRequest.periodEnd),
            paymentDate: new Date(invoiceBodyRequest.paymentDate),
            suspensionDate: new Date(invoiceBodyRequest.suspensionDate),
            value: invoiceBodyRequest.value,
            latePaymentValue: 0,
            adjustment: invoiceBodyRequest.adjustment ?? 0,
            status: invoiceBodyRequest.status,
            contractId: invoiceBodyRequest.contractId,
        };
    }
}
