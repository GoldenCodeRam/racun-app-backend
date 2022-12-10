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

    public getElements(app: any): void {
        app.get(
            this.getUrl(),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response) => {
                const result = await InvoiceDatabase.getInvoices();

                response.send(result);
            }
        );
    }

    public searchElements(_app: any): void {}

    public getElementById(app: any): void {
        app.get(
            this.getUrlWithExtension(":invoiceId"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response) => {
                const invoiceId = parseInt(request.params["invoiceId"]);
                const result = await InvoiceDatabase.getInvoiceById(invoiceId);

                response.send(result);
            }
        );
    }

    public createElement(app: any): void {
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

    public updateElement(app: any): void {
        app.put(
            this.getUrlWithExtension("update/:invoiceId"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response) => {
                const invoiceId = parseInt(request.params["invoiceId"]);
                const changes = InvoiceModel.invoiceDataFromInvoiceBodyRequest(
                    request.body
                );

                const invoice = await InvoiceDatabase.updateInvoice(
                    invoiceId,
                    changes
                );

                response.send(invoice);
            }
        );
    }

    public deleteElement(app: any): void {
        app.delete(
            this.getUrlWithExtension("delete/:invoiceId"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response) => {
                const invoiceId = parseInt(request.params["invoiceId"]);

                const result = await InvoiceDatabase.deleteInvoice(invoiceId);

                response.send(result);
            }
        );
    }

    public registerCustomMethods(_app: any): void {}
}
