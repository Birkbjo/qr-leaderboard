"use client";
import QRCodeStyling from "qr-code-styling";
import { useEffect, useRef } from "react";

type QRCodeProps = {
    url: string;
};

const qrCodeStyling = new QRCodeStyling({
    width: 300,
    height: 300,
    dotsOptions: {
        color: "#4267b2",
        type: "rounded",
    },
});

const getUrl = (url: string) => {
    if (url.includes("http")) {
        return url;
    }
    console.log({url})
    console.log(window.location.origin)
    return `${window.location.origin}${url}`;
};

export const QRCode = ({ url }: QRCodeProps) => {
    const qrCodeDivRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        qrCodeStyling.update({
            data: getUrl(url),
        });
        if (qrCodeDivRef.current) {
            qrCodeStyling.append(qrCodeDivRef.current);
        }
    }, [url]);

    return (
        <div>
            <div ref={qrCodeDivRef}></div>
        </div>
    );
};
