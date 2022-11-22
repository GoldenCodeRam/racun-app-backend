import { Request, Response } from "express";
import { logMotion } from "../../audit/audit";
import { InvoiceDatabase } from "../../database/invoiceDatabase";
import { InvoiceModel } from "../../model/invoice";
import { ApiEndpoint } from "../apiEndpoint";
import { authorize, authorizeOnRole } from "../auth";

export class InvoicesApiEndpoint extends ApiEndpoint {
    constructor() {
        super("invoices");
    }

    public registerMethods(app: any): void {
        app.post(
            this.getUrlWithExtension("create"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response) => {
                const invoiceData =
                    InvoiceModel.invoiceDataFromInvoiceBodyRequest(
                        request.body
                    );

                const invoice = await InvoiceDatabase.createInvoice(
                    invoiceData
                );
                response.send(invoice);
            }
        );
    }
}
