"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import galleryimg from "@/assets/images/gallery.png";
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
    const [fileName, setFileName] = useState("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [fileType, setFileType] = useState<string | null>(null);

    const resetImgUrlToPlaceholder = () => {
        onFileChange(undefined);
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
        if (file) {
            setFileType(file.type);
            setFileName(file.name);

            if (file.type.startsWith("image/")) {
                const reader = new FileReader();

                reader.onload = () => {
                    const base64 = reader.result as string;
                    setImageUrl(reader.result as string);
                    if (onFileChange) {
                        onFileChange({ file: file, file64: base64 });
                    }
                };
                reader.readAsDataURL(file);
            } else {
                resetImgUrlToPlaceholder();
                if (onFileChange) onFileChange();
            }
        } else {
            setFileName("");
            setFileType(null);
            resetImgUrlToPlaceholder();
            if (onFileChange) onFileChange();
        }
    };
    const removeImage = () => {
        setFileName("");
        setFileType(null);
        resetImgUrlToPlaceholder();
        onFileChange();
        handleRemoveImage();
    };
    return (
        <>
            <div className="">
                {title && <p className="text-foreground mb-5">{title}</p>}
                <div
                    className={`relative  ${state === "add"
                            ? "border-2 border-dashed rounded-lg "
                            : " rounded-2xl shadow-[0_0_0.5625rem_0.4375rem_rgb(0,0,0,0.07)] text-center"
                        } w-fit`}
                >
                    <input disabled={disabled}
                        type="file"
                        className="size-full w-full absolute top-0 left-0 right-0 z-10 opacity-0 cursor-pointer "
                        onChange={handleFileChange}
                        accept="image/*,application/pdf"
                        title={fileName}
                    />

                    <div
                        className={` relative  flex items-center justify-center ${state === "add" ? " w-80 h-24" : " w-36 h-28"
                            } gap-1 `}
                    >
                        {state === "add" && !imageUrl && (
                            <>
                                <i className="fa-regular fa-image text-foreground/50  text-lg"></i>
                                <span className="text-foreground/50 text-sm">
                                    ارفاق صورة التحويل
                                </span>
                            </>
                        )}
                        <>
                            {imageUrl && (
                                <img
                                    src={imageUrl}
                                    alt={fileName}
                                    className={`w-full h-full object-contain ${state === "add" ? "" : "rounded-2xl"
                                        } `}
                                />
                            )}
                        </>
                    </div>
                    {state === "edit" && (
                        <div className="">
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute -top-2 -right-2 w-7 h-7 z-20 text-surface bg-surface-light-800 text-sm rounded-full"
                            >
                                <i className="mdi mdi-window-close"></i>
                            </button>
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute -bottom-2 -left-2 w-7 h-7 text-surface bg-surface-light-800 text-sm rounded-full"
                            >
                                <span className="mdi mdi-pencil"></span>
                            </button>
                        </div>
                    )}
                </div>
                {errorMessage && (
                    <p className="text-start err-msg text-red-600 text-sm mt-2">
                        {errorMessage}
                    </p>
                )}
            </div>
        </>
    );
}
