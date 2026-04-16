"use client";
import { useEffect, useRef, useState } from "react";
import placeholder_img from "@/assets/images/photo-placeholder.png";

interface FileInputProps {
    errorMessage?: string;
    title?: string;
    fileUrl?: string;
    state: "edit" | "add" | "addToTable";
    onFileChange: (args?: { file?: File; file64?: string }) => void;
    handleRemoveImage?: () => void;
    disabled?: boolean;
}

export default function FileInputImg({
    errorMessage,
    title,
    fileUrl,
    state = "add",
    onFileChange,
    disabled,
    handleRemoveImage = () => { },
}: FileInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const [fileName, setFileName] = useState("");
    const [fileType, setFileType] = useState<string | null>(null);

    const imageUrl =
        fileUrl && fileUrl.length > 0
            ? fileUrl
            : state === "edit"
                ? placeholder_img.src
                : "";

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            setFileName("");
            setFileType(null);
            onFileChange(undefined);
            return;
        }

        setFileName(file.name);
        setFileType(file.type);

        if (file.type.startsWith("image/")) {
            const reader = new FileReader();

            reader.onload = () => {
                const base64 = reader.result as string;

                onFileChange({
                    file,
                    file64: base64,
                });
            };

            reader.readAsDataURL(file);
        } else {
            onFileChange(undefined);
        }

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const removeImage = () => {
        setFileName("");
        setFileType(null);

        onFileChange(undefined);
        handleRemoveImage?.();

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div>
            {title && <p className="text-foreground mb-5">{title}</p>}

            <div
                className={`relative ${state === "add"
                    ? "border-2 border-dashed rounded-lg"
                    : "rounded-2xl shadow-[0_0_0.5625rem_0.4375rem_rgb(0,0,0,0.07)] text-center"
                    } w-fit`}
            >
                <input
                    ref={inputRef}
                    disabled={disabled}
                    type="file"
                    className="size-full w-full absolute top-0 left-0 right-0 z-10 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept="image/*"
                />

                <div
                    className={`relative flex items-center justify-center ${state === "add" ? "w-80 h-24" : "w-36 h-28"
                        } gap-1`}
                >
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={fileName || "image"}
                            className={`w-full h-full object-contain ${state === "edit" ? "rounded-2xl" : ""
                                }`}
                        />
                    ) : (
                        state === "add" && (
                            <>
                                <i className="fa-regular fa-image text-foreground/50 text-lg" />
                                <span className="text-foreground/50 text-sm">
                                    ارفاق صورة
                                </span>
                            </>
                        )
                    )}
                </div>

                {state === "edit" && (
                    <>
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 w-7 h-7 z-20 bg-surface-light-800 rounded-full"
                        >
                            <i className="mdi mdi-window-close"></i>
                        </button>

                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="absolute -bottom-2 -left-2 w-7 h-7 bg-surface-light-800 rounded-full"
                        >
                            <span className="mdi mdi-pencil"></span>
                        </button>
                    </>
                )}
            </div>

            {errorMessage && (
                <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
            )}
        </div>
    );
}