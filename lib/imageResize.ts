export async function resizeImage(
    file: File,
    maxSize = 256
): Promise<Blob> {
    const img = document.createElement("img")
    img.src = URL.createObjectURL(file)

    await new Promise((res) => (img.onload = res))

    const canvas = document.createElement("canvas")
    const scale = Math.min(maxSize / img.width, maxSize / img.height)

    canvas.width = img.width * scale
    canvas.height = img.height * scale

    const ctx = canvas.getContext("2d")!
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    return new Promise((resolve) =>
        canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.7)
    )
}
