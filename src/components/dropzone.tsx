"use client"
import React from 'react'
import { UploadDropzone } from "~/utils/uploadthing";

export const Dropzone:React.FC = () => {
    return (
        <UploadDropzone
            endpoint="imageUploader"
            // config={{ mode: "auto" }}
            onClientUploadComplete={(res) => {
              // Do something with the response
              res.map((file) => {
                console.log("File: ", file);
              });
              alert("Upload Completed");
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