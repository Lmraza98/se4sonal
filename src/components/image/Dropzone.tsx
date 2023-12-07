"use client"
import React from 'react'
import { UploadDropzone } from "~/utils/uploadthing";

interface DropzoneProps {
  setUploadedImageId: (id: number) => void;
}
export const Dropzone:React.FC<DropzoneProps> = ({ setUploadedImageId }) => {
    return (
        <UploadDropzone
            endpoint="uploadImage"
            // config={{ mode: "auto" }}
            onClientUploadComplete={(res) => {
              // Do something with the response
              res.map((file) => {
                console.log("File: ", file.serverData.imageId);
                setUploadedImageId(file.serverData.imageId)
              });
              // setUploadedImageId(res)
              // alert("Upload Completed");
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
            onUploadBegin={(name) => {
              // Do something once upload begins
              console.log("Uploading: ", name);
            }}
          />
    )
}