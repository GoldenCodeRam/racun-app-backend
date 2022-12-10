import { Service } from "@prisma/client";
import { Content, TableCell } from "pdfmake/interfaces";

export function generateContentTable(tableInformation: {
    services: Service[];
}): Content {
    const tableBodyContent: TableCell[][] = [["Nombre", "Descripción"]];

    for (const service of tableInformation.services) {
        tableBodyContent.push([service.name, service.description]);
    }

    return {
        table: {
            widths: ["*", "auto"],
            body: tableBodyContent,
        },
    };
}
