export const createPdfBlob = (bytes: Uint8Array): Blob => {
  return new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
};
