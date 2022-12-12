import { Invoice, Service } from "@prisma/client";
import { Content, TableCell } from "pdfmake/interfaces";

export function generateContentTable(tableInformation: {
    services: Service[];
    invoice: Invoice;
}): Content {
    const tableBodyContent: TableCell[][] = [["Nombre", "Descripción"]];
    const formatter = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
    });

    for (const service of tableInformation.services) {
        tableBodyContent.push([service.name, service.description]);
    }

    tableBodyContent.push([
        "Valor de la cuenta",
        formatter.format(tableInformation.invoice.value),
    ]);

    tableBodyContent.push([
        "Valor de mora",
        formatter.format(tableInformation.invoice.latePaymentValue),
    ]);

    return {
        table: {
            widths: ["*", "auto"],
            body: tableBodyContent,
        },
    };
}
