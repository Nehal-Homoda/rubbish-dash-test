"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import galleryimg from "@/assets/images/gallery.png"

interface FileInputProps {
  errorMessage?: string;
  title?: string;
  fileUrl?: string;
  state: "edit" | "add" | "addToTable";
  onFileChange: (file) => void;
  handleRemoveImage?: () => void
}

export default function FileInput({
  errorMessage,
  title,
  fileUrl,
  state = "add",
  onFileChange,
  handleRemoveImage
}: FileInputProps) {
  const [fileName, setFileName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUrl && fileUrl) {
      if (fileUrl.endsWith(".pdf")) {
        setFileType("application/pdf");
        const parts = fileUrl.split("/");
        setFileName(parts[parts.length - 1]);
        setImageUrl(null);
      } else if (fileUrl.match(/\.(jpeg|jpg|png|gif|webp)$/i)) {
        setFileType("image/*");
        setImageUrl(fileUrl);
        const parts = fileUrl.split("/");
        setFileName(parts[parts.length - 1]);
      }
    }
  }, [fileUrl, imageUrl]);

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
            onFileChange(base64);
          }
        };
        reader.readAsDataURL(file);
      } else {
        setImageUrl(null);
        if (onFileChange) onFileChange(null);
      }
    } else {
      setFileName("");
      setFileType(null);
      setImageUrl(null);
      if (onFileChange) onFileChange(null);
    }
  };
  const removeImage = () => {
    setFileName("");
    setFileType(null);
    setImageUrl(null);
    if (onFileChange) onFileChange(null);
    handleRemoveImage()
  }
  return (
    <>
      {title && <p className="text-foreground mb-5">{title}</p>}
      <div
        className={`relative  ${state === "add"
          ? "border-2 border-dashed rounded-lg "
          : " rounded-2xl shadow-[0_0_0.5625rem_0.4375rem_rgb(0,0,0,0.07)] text-center"
          } w-fit`}
      >
        <input
          type="file"
          className="size-full w-full absolute top-0 left-0 right-0 z-50 opacity-0 cursor-pointer "
          onChange={handleFileChange}
          accept="image/*,application/pdf"
          title={fileName}
        />

        <div
          className={` relative  flex items-center justify-center ${state === "add" ? " w-80 h-24" : " w-36 h-28"
            } gap-1 `}
        >
          {fileType?.startsWith("image/") && imageUrl ? (
            <Image
              src={imageUrl}
              fill
              alt={fileName}
              className={`object-cover ${state === "add" ? "" : "rounded-2xl"
                } `}
            />
          ) : fileType === "application/pdf" && fileName ? (
            <p className="text-foreground/50 text-sm text-center">{fileName}</p>
          ) : state === "add" ? (
            <>
              <i className="fa-regular fa-image text-foreground/50  text-lg"></i>
              <span className="text-foreground/50 text-sm">
                ارفاق صورة التحويل
              </span>
            </>
          ) : (
            <>
              {/* <i className="fa-regular fa-image text-foreground/50 text-3xl"></i> */}
            </>
          )}
        </div>
        {state === "edit" && (
          <div className="" >
            <i onClick={removeImage} className="mdi mdi-window-close cursor-pointer absolute -top-2 -right-2 text-surface bg-surface-light-800 p-2 text-sm rounded-full"></i>
            <i className="fa-solid fa-pen cursor-pointer absolute -bottom-2 -left-2 text-surface bg-surface-light-800  p-2 text-sm rounded-full"></i>
          </div>
        )}
        {state === "addToTable" && (
          <div className="w-full">
            <i className="fa-solid fa-plus cursor-pointer absolute -bottom-2 -left-2 text-surface bg-surface-light-800  p-2 text-sm rounded-full"></i>

            {/* <div className=""> */}
            <div className="w-10 h-10 absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] ">
              <img className="w-full h-full object-contain" src={galleryimg.src} alt="" />
            </div>

            {/* </div> */}
          </div>
        )}
        {errorMessage && (
          <p className="err-msg text-red-600 text-sm">{errorMessage}</p>
        )}
      </div>
      {fileType !== "application/pdf" && fileName && (
        <p className="text-foreground/70 mt-2">{fileName}</p>
      )}
      {fileType === "application/pdf" && fileName && fileUrl && (
        <Link
          href={fileUrl}
          target="_blank"
          className="text-foreground mt-2 underline hover:text-foreground/70"
        >
          {fileName}
        </Link>
      )}
    </>
  );
}
