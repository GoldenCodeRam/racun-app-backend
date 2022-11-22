import { Content } from "pdfmake/interfaces";
import { images } from "../utils/resources";

// This constant is used to determine the size of the QR code, if the
// content is bigger than this, the code will not be recoginzable
// by a QR code reader.
//
// TODO: This should'nt be here. As this is more like business logic than
// rendering logic, but it also is for the QR code rendering so idk.
export const MAX_QR_CODE_CONTENT_SIZE = 16;

export function generateHeader(headerInformation: {
    qrCode: string;
    invoiceId: number;
    generationDate: Date;
}): Content {
    return [
        {
            marginBottom: 8,
            table: {
                widths: ["auto", "*", "auto"],
                body: [
                    [
                        {
                            margin: [0, 12],
                            svg: images.logo_svg,
                            width: 130,
                        },
                        {
                            margin: [0, 15],
                            text: "Cuenta de cobro",
                            alignment: "center",
                            fontSize: 32,
                        },
                        generateQRCode(headerInformation.qrCode),
                    ],
                ],
            },
            layout: "noBorders",
        },
        // FIXME: This could be moved in the future to a single file, but as this
        // is very simple, it can stay here.
        {
            marginBottom: 8,
            table: {
                widths: ["auto", "*"],
                body: [
                    ["Cuenta de cobro", headerInformation.invoiceId.toString()],
                    ["Fecha", headerInformation.generationDate.toString()],
                ],
            },
        },
    ];
}

function generateQRCode(qrCodeContent: string): Content {
    // TODO: Generate an error if the code is bigger than
    // MAX_QR_CODE_CONTENT_SIZE.
    return {
        qr: qrCodeContent,
        fit: 100,
        version: 1,
        mask: 7,
        eccLevel: "H",
        mode: "numeric",
    };
}
