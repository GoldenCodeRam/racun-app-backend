import { Request, Response } from "express";
import JSZip from "jszip";
import { logMotion } from "../../audit/audit";
import { ContractDatabase } from "../../database/contractDatabase";
import { InvoiceDatabase } from "../../database/invoiceDatabase";
import { generateInvoice } from "../../documentGenerator/invoice/invoiceGenerator";
import { InvoiceModel } from "../../model/invoice";
import { ApiEndpoint } from "../apiEndpoint";
import { authorize, authorizeOnRole } from "../auth";

export class ContractsApiEndpoint extends ApiEndpoint {
    constructor() {
        super("contracts");
    }

    public getElements(app: any): void {
        app.get(
            this.getUrl(),
            authorize,
            authorizeOnRole,
            async (_request: Request, response: Response) => {
                const elements = await ContractDatabase.getContracts();

                response.send(elements);
            }
        );
    }

    public searchElements(_app: any): void {}

    public getElementById(app: any): void {
        app.get(
            this.getUrlWithExtension(":contractId"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response) => {
                const contractId = parseInt(request.params["contractId"]);

                const contract = await ContractDatabase.getContractById(
                    contractId
                );

                response.send(contract);
            }
        );
    }

    public createElement(app: any): void {
        app.post(
            this.getUrlWithExtension("create"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response, next: any) => {
                const contractInformation = request.body;
                const result = await ContractDatabase.createContract({
                    value: contractInformation.value,
                    status: true,
                    dateStart: new Date(contractInformation.dateStart),
                    clientAccountId: contractInformation.clientAccountId,
                    currentDebt: 0,
                    placeId: contractInformation.placeId,
                    serviceId: contractInformation.serviceId,
                });

                response.locals.result = result;

                next();
            },
            this.sendObjectResponse
        );
    }

    public updateElement(app: any): void {
        app.put(
            this.getUrlWithExtension("update/:contractId"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response) => {
                const contractId = parseInt(request.params["contractId"]);
                const changes = request.body;

                const result = await ContractDatabase.updateContract(
                    contractId,
                    changes
                );
                response.send(result);
            }
        );
    }

    public deleteElement(app: any): void {
        app.delete(
            this.getUrlWithExtension("delete/:contractId"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response) => {
                const contractId = parseInt(request.params["contractId"]);
                const result = await ContractDatabase.deleteContract(
                    contractId
                );

                response.send(result);
            }
        );
    }

    public registerCustomMethods(app: any): void {
        app.post(
            this.getUrlWithExtension("terminateContract"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response, next: any) => {
                const contractId = parseInt(request.body.contractId);

                const result = await ContractDatabase.terminateContract(
                    contractId
                );

                response.locals.result = result;

                next();
            },
            this.sendOkResponse
        );

        app.get(
            this.getUrlWithExtension("by-client-account/:clientAccountId"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response, next: any) => {
                const clientAccountId = parseInt(
                    request.params["clientAccountId"]
                );

                const result =
                    await ContractDatabase.getContractByClientAccount(
                        clientAccountId
                    );

                response.locals.result = result;

                next();
            },
            this.sendObjectResponse
        );
        app.post(
            this.getUrlWithExtension("generate-invoice/:clientContractId"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response) => {
                const clientContractId = parseInt(
                    request.params["clientContractId"]
                );
                const invoiceData =
                    InvoiceModel.invoiceDataFromInvoiceBodyRequest(
                        request.body
                    );

                const invoice = await InvoiceDatabase.createInvoice(
                    invoiceData
                );

                const clientContract = await ContractDatabase.getContractById(
                    clientContractId
                );

                if (invoice && clientContract) {
                    response.contentType("application/pdf");

                    // TODO: This is not entirely correct rn.
                    generateInvoice(
                        {
                            generationDate: new Date(),
                            invoice: invoice,
                            client: clientContract.clientAccount.client,
                            services: [clientContract.service],
                            qrCode: `${clientContractId}${invoice.id}`,
                        },
                        (documentPipe) => {
                            const zip = new JSZip();

                            zip.file(invoice.id.toString(), documentPipe);

                            zip.generateNodeStream({
                                streamFiles: true,
                            }).pipe(response);
                        }
                    );
                }
            }
        );
    }
}
