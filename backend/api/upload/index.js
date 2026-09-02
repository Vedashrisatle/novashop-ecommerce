import { auth, admin } from "../../lib/auth.js";
import { corsMw, ok } from "../../lib/http.js";
import cloudinary from "../../lib/cloudinary.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

function parts(req) {
  return new Promise((resolve, reject) => {
    const contentType = req.headers["content-type"] || "";

    const boundary = contentType.match(/boundary=([^;]+)/)?.[1];

    if (!boundary) {
      return reject(new Error("multipart/form-data required"));
    }

    const chunks = [];

    req.on("data", (chunk) => {
      chunks.push(chunk);
    });

    req.on("end", () => {
      try {
        const buffer = Buffer.concat(chunks);
        const separator = Buffer.from("--" + boundary);

        const sections = [];
        let start = 0;

        while (true) {
          const index = buffer.indexOf(separator, start);

          if (index < 0) {
            break;
          }

          const nextIndex = buffer.indexOf(
            separator,
            index + separator.length
          );

          if (nextIndex < 0) {
            break;
          }

          sections.push(
            buffer.subarray(index + separator.length, nextIndex)
          );

          start = nextIndex;
        }

        let file = null;
        let folder = "products";

        for (const section of sections) {
          const headerEnd = section.indexOf(
            Buffer.from("\r\n\r\n")
          );

          if (headerEnd < 0) {
            continue;
          }

          const headers = section
            .subarray(0, headerEnd)
            .toString();

          const body = section.subarray(
            headerEnd + 4,
            section.length - 2
          );

          const name = headers.match(
            /name="([^"]+)"/
          )?.[1];

          const filename = headers.match(
            /filename="([^"]+)"/
          )?.[1];

          if (name === "folder") {
            folder = body.toString().trim();
          }

          if (filename) {
            const type =
              headers.match(
                /Content-Type:\s*([^\r\n]+)/i
              )?.[1] || "";

            file = {
              body,
              type,
              filename,
            };
          }
        }

        if (!file) {
          return reject(new Error("Image required"));
        }

        resolve({
          file,
          folder,
        });
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

export default async (req, res) => {
  corsMw(req, res, async () => {
    if (!ok(req, res, ["POST"])) {
      return;
    }

    auth(req, res, () =>
      admin(req, res, async () => {
        try {
          const { file, folder } = await parts(req);

          const validImage = /^image\/(jpeg|png|webp|gif)$/i.test(
            file.type
          );

          const maxSize = 5 * 1024 * 1024;

          if (!validImage || file.body.length > maxSize) {
            return res.status(400).json({
              message:
                "Invalid image or image exceeds 5MB",
            });
          }

          const cloudinaryFolder =
            folder === "banners"
              ? "ecommerce/banners"
              : "ecommerce/products";

          const result = await new Promise(
            (resolve, reject) => {
              cloudinary.uploader
                .upload_stream(
                  {
                    folder: cloudinaryFolder,
                  },
                  (error, uploaded) => {
                    if (error) {
                      reject(error);
                    } else {
                      resolve(uploaded);
                    }
                  }
                )
                .end(file.body);
            }
          );

          return res.json({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        } catch (error) {
          console.error("Cloudinary upload error:", error);

          return res.status(400).json({
            message:
              error.message || "Upload failed",
          });
        }
      })
    );
  });
};