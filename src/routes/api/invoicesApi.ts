import { Request, Response } from "express";
import JSZip from "jszip";
import { logMotion } from "../../audit/audit";
import { ContractDatabase } from "../../database/contractDatabase";
import { InvoiceDatabase } from "../../database/invoiceDatabase";
import { generateInvoice } from "../../documentGenerator/invoice/invoiceGenerator";
import { InvoiceModel } from "../../model/invoice";
import { ApiEndpoint } from "../apiEndpoint";
import { authorize, authorizeOnRole } from "../auth";

export class InvoicesApiEndpoint extends ApiEndpoint {
    constructor() {
        super("invoices");
    }

    public getElements(app: any): void {
        app.get(
            this.getUrlWithExtension("findAll"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response, next: any) => {
                const result = await InvoiceDatabase.getInvoices();
                response.locals.result = result;

                next();
            },
            this.sendObjectResponse
        );
    }

    public searchElements(_app: any): void {}

    public getElementById(app: any): void {
        app.get(
            this.getUrlWithExtension("findOne/:invoiceId"),
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

                if (changes.status === InvoiceModel.InvoiceStatus.PAID) {
                    await ContractDatabase.makeInvoicePayment(changes)
                }

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

    public registerCustomMethods(app: any): void {
        app.get(
            this.getUrlWithExtension("generate-invoices"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response) => {
                const zip = new JSZip();
                const invoices = await InvoiceDatabase.getInvoices();

                if (invoices.ok) {
                    response.contentType("application/zip");
                    new Promise<void>((resolve, reject) => {
                        try {
                            for (const invoice of invoices.val) {
                                generateInvoice(
                                    {
                                        generationDate: new Date(
                                            invoice.generationDate
                                        ),
                                        invoice: invoice,
                                        client: invoice.contract.clientAccount
                                            .client,
                                        services: [invoice.contract.service],
                                        qrCode: `${invoice.id}-${invoice.contractId}-${invoice.contract.clientAccountId}`,
                                    },
                                    (documentPipe) => {
                                        zip.file(
                                            `${invoice.id}-${invoice.contractId}-${invoice.contract.clientAccountId}.pdf`,
                                            documentPipe
                                        );
                                    }
                                );
                            }
                            resolve();
                        } catch (error) {
                            reject();
                        }
                    })
                        .then(() => {
                            zip.generateNodeStream({
                                streamFiles: true,
                            }).pipe(response);
                        })
                        .catch(() => {
                            response.sendStatus(500);
                        });
                }
            }
        );

        app.post(
            this.getUrlWithExtension("findWithQrCode"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response, next: any) => {
                const qrCode = (request.body.qrCode as string).split("-");

                const result = await InvoiceDatabase.findOne(
                    parseInt(qrCode[0])
                );
                response.locals.result = result;

                next();
            },
            this.sendObjectResponse
        );
    }
}
