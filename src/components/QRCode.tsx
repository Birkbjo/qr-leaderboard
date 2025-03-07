"use client";
import QRCodeStyling from "qr-code-styling";
import { useEffect, useRef, useState } from "react";

type QRCodeProps = {
    url: string;
};


const getUrl = (url: string) => {
    "use client"
    if (url.includes("http")) {
        return url;
    }
    if(window?.location?.origin) {
        return `${window.location.origin}${url}`;

    }
    return url
};

export const QRCode = ({ url }: QRCodeProps) => {
    const [qrCode, setQrCode] = useState<QRCodeStyling | null>(() => {
        if(typeof window === "undefined") {
            return null;
        }
        return new QRCodeStyling({
            width: 250,
            height: 250,
            type: 'canvas',
            data: getUrl(url),
            image: './logo.png',
            dotsOptions: {
                // color: "#1ee277",
                type: "rounded",
            },
        });
    });
    const qrCodeDivRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if(!qrCode) {
            return;
        }
        qrCode.update({
            data: getUrl(url),
        });
        if (qrCodeDivRef.current) {
            qrCode.append(qrCodeDivRef.current);
        }
    }, [qrCode, url]);

    return (
            <div ref={qrCodeDivRef}></div>
    );
};
