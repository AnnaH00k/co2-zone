"use client";

import { useEffect } from "react";
import Link from 'next-intl/link';
import { useTranslations } from "next-intl";


export default function Footer() {

    const t = useTranslations('Footer')

    useEffect(() => {
        if (window.location.hostname === 'annah00k.github.io') {
            const links = document.querySelectorAll('.github-page-link');
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href) {
                    link.setAttribute('href', href.startsWith('/co2-zone') ? href : '/co2-zone' + href);
                }
            });
        }
    }, []);

    return (
        <footer className="flex mt-[5vh] w-full overflow-hidden  justify-center shadow-top-xl  py-6 px-2 bg-blueExtraDark border border-blueDark border-solid border-1">
            <ul className="">
                <Link className="m-2 text-blueExtraLight github-page-link" href="/datasecurity">{t("datasecurity")} </Link>
                <Link className="m-2 text-blueExtraLight github-page-link" href="/impressum">{t("impressum")} </Link>
                <Link className="m-2 text-blueExtraLight github-page-link" href="/contact">{t("contact")} </Link>
            </ul>
        </footer>
    );
}
