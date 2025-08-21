import React from "react";
import { Button } from "./ui/button";

const PaginationComponent = ({ data, onPageChange }) => {
    if (!data || !data.links || data.links.length <= 3) return null;

    return (
        <div className="flex items-center gap-1 my-6 justify-end mr-4">
            {data.links.map((link, index) => {
                // Ambil nomor halaman dari URL
                let pageNumber = null;
                if (link.url) {
                    const urlParams = new URLSearchParams(link.url.split("?")[1]);
                    pageNumber = urlParams.get("page");
                }

                // Cek apakah tombol ini adalah ellipsis
                const isEllipsis = link.label === "...";

                return isEllipsis ? (
                    <span key={index} className="px-2">
                        ...
                    </span>
                ) : (
                    <Button
                        key={index}
                        variant={link.active ? "default" : "outline"}
                        size="sm"
                        disabled={!link.url}
                        onClick={() => pageNumber && onPageChange(Number(pageNumber))}
                        dangerouslySetInnerHTML={{ __html: link.label }} // agar &laquo; &raquo; tetap tampil
                    />
                );
            })}
        </div>
    );
};

export default PaginationComponent;
