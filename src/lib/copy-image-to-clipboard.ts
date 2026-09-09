const MIME_BY_EXTENSION: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
};

function mimeFromPath(path: string): string {
  const extension = path.split(".").pop()?.toLowerCase() ?? "";
  return MIME_BY_EXTENSION[extension] ?? "image/png";
}

async function blobToPng(blob: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("No se pudo preparar la imagen para copiar.");
  }

  context.drawImage(bitmap, 0, 0);
  bitmap.close();

  const png = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });

  if (!png) {
    throw new Error("No se pudo convertir la imagen a PNG.");
  }

  return png;
}

export async function copyImageToClipboard(src: string): Promise<void> {
  const response = await fetch(src);
  if (!response.ok) {
    throw new Error(`No se pudo leer la imagen (${response.status}).`);
  }

  let blob = await response.blob();
  const resolvedType =
    blob.type && blob.type !== "application/octet-stream"
      ? blob.type
      : mimeFromPath(src);

  if (blob.type !== resolvedType) {
    blob = blob.slice(0, blob.size, resolvedType);
  }

  const clipboardBlob =
    resolvedType === "image/png" ? blob : await blobToPng(blob);

  await navigator.clipboard.write([
    new ClipboardItem({ "image/png": clipboardBlob }),
  ]);
}
