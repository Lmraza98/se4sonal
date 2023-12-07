"use client"
import React from 'react'
import { UploadButton as Button } from "~/utils/uploadthing";

export const UploadButton:React.FC = () => {
    return (
        <Button
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