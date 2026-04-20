"use client";
import { useState, useEffect } from "react";
import placeholder_img from "@/assets/images/photo-placeholder.png";

interface FileInputProps {
    errorMessage?: string;
    title?: string;
    fileUrl?: string;
    state: "edit" | "add" | "addToTable";
    onFileChange: (args?: { file?: File; file64?: string } | null) => void;
    handleRemoveImage?: () => void;
    disabled?: boolean;

    // NEW CONTROLS
    showCloseButton?: boolean;
    showEditButton?: boolean;
}

export default function FileInputImg({
    errorMessage,
    title,
    fileUrl,
    state = "add",
    onFileChange,
    disabled,
    handleRemoveImage = () => {},

    showCloseButton = true,  // default ON
    showEditButton = true,   // default ON
}: FileInputProps) {
    const [fileName, setFileName] = useState("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const resetImgUrlToPlaceholder = () => {
        onFileChange(null);

        if (fileUrl) {
            setImageUrl(fileUrl);
            return;
        }

        if (state === "edit") {
            setImageUrl(placeholder_img.src);
            return;
        }

        setImageUrl(null);
    };

    useEffect(() => {
        resetImgUrlToPlaceholder();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;

        if (!file) {
            setFileName("");
            resetImgUrlToPlaceholder();
            onFileChange?.(null);
            return;
        }

        setFileName(file.name);

        if (file.type.startsWith("image/")) {
            const reader = new FileReader();

            reader.onload = () => {
                const base64 = reader.result as string;
                setImageUrl(base64);

                onFileChange?.({
                    file,
                    file64: base64,
                });
            };

            reader.readAsDataURL(file);
        } else {
            resetImgUrlToPlaceholder();
            onFileChange?.(null);
        }
    };

    const removeImage = () => {
        setFileName("");
        setImageUrl(placeholder_img.src);

        onFileChange?.(null);
        handleRemoveImage();
    };

    return (
        <div>
            {title && <p className="mb-5">{title}</p>}

            <div className="relative w-fit rounded-2xl shadow-md">
                {/* INPUT */}
                <input
                    disabled={disabled}
                    type="file"
                    className="absolute inset-0 opacity-0 z-10 cursor-pointer"
                    onChange={handleFileChange}
                    accept="image/*,application/pdf"
                />

                {/* IMAGE */}
                <div className="relative flex items-center justify-center w-36 h-28">
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            className="w-full h-full object-contain rounded-2xl"
                        />
                    )}
                </div>

                {/* BUTTONS */}

                {/* ❌ CLOSE BUTTON (controlled) */}
                {state === "edit" && showCloseButton && (
                    <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gray-200 z-20"
                    >
                        <i className="mdi mdi-window-close"></i>
                    </button>
                )}

                {/* ✏️ EDIT BUTTON (independent) */}
                {state === "edit" && showEditButton && (
                    <button
                        type="button"
                        onClick={() => document.querySelector("input")?.click()}
                        className="absolute -bottom-2 -left-2 w-7 h-7 rounded-full bg-gray-200"
                    >
                        <i className="mdi mdi-pencil"></i>
                    </button>
                )}
            </div>

            {errorMessage && (
                <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
            )}
        </div>
    );
}