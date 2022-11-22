import { Request, Response } from "express";
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

    public registerMethods(app: any): void {
        app.post(
            this.getUrlWithExtension("create"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response) => {
                const contractInformation = request.body;
                const result = await ContractDatabase.createContract({
                    value: contractInformation.value,
                    status: true,
                    dateStart: new Date(contractInformation.dateStart),
                    dateEnd: contractInformation.dateEnd
                        ? new Date(contractInformation.dateEnd)
                        : undefined,
                    clientAccountId: contractInformation.clientAccountId,
                    placeId: contractInformation.placeId,
                    serviceId: contractInformation.serviceId,
                });

                response.send(result);
            }
        );

        app.get(
            this.getUrlWithExtension("by-client-account/:clientAccountId"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response) => {
                const clientAccountId = parseInt(
                    request.params["clientAccountId"]
                );

                const contracts =
                    await ContractDatabase.getContractsByClientAccount(
                        clientAccountId
                    );

                response.send(contracts);
            }
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
                            documentPipe.pipe(response);
                        }
                    );
                }
            }
        );
    }
}
