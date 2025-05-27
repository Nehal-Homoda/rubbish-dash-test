"use client";
import Image from "next/image";
import { useRef, useState } from "react";
interface FileInputProps {
  errorMessage?: string;
  onFileChange: (file: File | null) => void;
}
export default function FileInput(props: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    props.onFileChange(file);
    if (file) {
      setFileType(file.type);
      setFileName(file.name);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
    }
  };
  return (
    <>
      <div>
        <input
          type="file"
          name=""
          className="hidden"
          ref={inputRef}
          onChange={handleFileChange}
        />
        <div
          className="w-full relative border-2 border-dashed rounded-md flex items-center justify-center py-6 gap-1 cursor-pointer"
          onClick={handleClick}
        >
          {fileType?.startsWith("image/") && imageUrl ? (
            <Image
              src={imageUrl}
              fill
              alt={fileName}
              className="object-contain"
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

        {fileType !== "application/pdf" && fileName && (
          <p className="text-foreground/70 text-center mt-2">{fileName}</p>
        )}
        {props.errorMessage && (
          <p className="err-msg text-red-600 text-sm">{props.errorMessage}</p>
        )}
      </div>
    </>
  );
}
