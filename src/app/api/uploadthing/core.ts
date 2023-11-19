import { createUploadthing, type FileRouter } from "uploadthing/next";
import { db } from "@app/server/db";
const f = createUploadthing();
 
// const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {

  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "16MB", contentDisposition: 'inline', maxFileCount: 10 } })
    // Set permissions and file types for this FileRoute
    // .middleware(async ({ req }) => {
    //   // // This code runs on your server before upload
    //   // const user = await auth(req);
 
    //   // // If you throw, the user will not be able to upload
    //   // if (!user) throw new Error("Unauthorized");
 
    //   // // Whatever is returned here is accessible in onUploadComplete as `metadata`
    //   // return { userId: user.id };
    // })
    .onUploadComplete( async ({  file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("file url", file.url);
      await db.image.create({
        data: {
          url: file.url,
          fileKey: file.key,
          fileName: file.name,
          fileSize: file.size,
          updatedAt: new Date(),
          createdAt: new Date(),
        }
      })
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { 
        fileUrl: file.url,
        fileName: file.name,
        fileSize: file.size,
        fileKey: file.key
      };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;