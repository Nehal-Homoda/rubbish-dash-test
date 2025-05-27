"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface FileInputProps {
  errorMessage?: string;
  title: string;
  onFileChange: (file: File | null) => void;
  fileUrl?: string;
}

export default function FileInput(props: FileInputProps) {
  const [fileName, setFileName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUrl && props.fileUrl) {
      if (props.fileUrl.endsWith(".pdf")) {
        setFileType("application/pdf");
        const parts = props.fileUrl.split("/");
        setFileName(parts[parts.length - 1]);
        setImageUrl(null);
      } else if (props.fileUrl.match(/\.(jpeg|jpg|png|gif|webp)$/i)) {
        setFileType("image/*");
        setImageUrl(props.fileUrl);
        const parts = props.fileUrl.split("/");
        setFileName(parts[parts.length - 1]);
      }
    }
  }, [props.fileUrl, imageUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    props.onFileChange(file);
    if (file) {
      setFileType(file.type);
      setFileName(file.name);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          setImageUrl(reader.result as string);
        };
      } else {
        setImageUrl(null);
      }
    } else {
      setFileName("");
      setFileType(null);
      setImageUrl(null);
    }
  };

  return (
    <>
      <p className="text-foreground mb-5">{props.title}</p>
      <div className="relative overflow-hidden  w-fit">
        <input
          type="file"
          className="size-full absolute top-0 left-0 right-0 z-50 opacity-0 cursor-pointer "
          onChange={handleFileChange}
          accept="image/*,application/pdf"
          title={fileName}
        />
        <div className="relative border-2 border-dashed rounded-lg flex items-center justify-center w-80 h-24 gap-1">
          {fileType?.startsWith("image/") && imageUrl ? (
            <Image
              src={imageUrl}
              fill
              alt={fileName}
              className="object-contain"
              sizes="(max-width: 320px) 100vw, 320px"
            />
          ) : fileType === "application/pdf" && fileName ? (
            <p className="text-foreground/50 text-sm text-center">{fileName}</p>
          ) : (
            <>
              <span className="mdi mdi-image-outline text-foreground/50 text-lg"></span>
              <span className="text-foreground/50 text-sm">
                ارفاق صورة التحويل
              </span>
            </>
          )}
        </div>

      
        {props.errorMessage && (
          <p className="err-msg text-red-600 text-sm">{props.errorMessage}</p>
        )}
      </div>  {fileType !== "application/pdf" && fileName && (
          <p className="text-foreground/70 mt-2">{fileName}</p>
        )}
        {fileType === "application/pdf" && fileName && props.fileUrl && (
          <Link
            href={props.fileUrl}
            target="_blank"
            className="text-foreground mt-2 underline hover:text-foreground/70"
          >
            {fileName}
          </Link>
        )}
    </>
  );
}
