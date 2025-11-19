import * as React from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog'
import { Slider } from './ui/slider'
import { UploadIcon, CropIcon, Loader2Icon } from 'lucide-react'
import { Label } from './ui/label'

interface ImageUploaderProps {
    onUpload?: (file: File) => Promise<string>
    imageUploadUrl?: string
    onUrlChange: (url: string) => void
    currentUrl?: string
}

export function ImageUploader({ onUpload, imageUploadUrl, onUrlChange, currentUrl }: ImageUploaderProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [imageSrc, setImageSrc] = React.useState<string | null>(null)
    const [crop, setCrop] = React.useState({ x: 0, y: 0 })
    const [zoom, setZoom] = React.useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(null)
    const [isUploading, setIsUploading] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                setImageSrc(reader.result?.toString() || null)
                setIsOpen(true)
            })
            reader.readAsDataURL(file)
        }
    }

    const onCropComplete = React.useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image()
            image.addEventListener('load', () => resolve(image))
            image.addEventListener('error', (error) => reject(error))
            image.setAttribute('crossOrigin', 'anonymous')
            image.src = url
        })

    const getCroppedImg = async (
        imageSrc: string,
        pixelCrop: Area
    ): Promise<Blob> => {
        const image = await createImage(imageSrc)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
            throw new Error('No 2d context')
        }

        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        )

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'))
                    return
                }
                resolve(blob)
            }, 'image/jpeg')
        })
    }

    const handleSave = async () => {
        if (!imageSrc || !croppedAreaPixels || (!onUpload && !imageUploadUrl)) return

        setIsUploading(true)
        try {
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
            const file = new File([croppedBlob], "cropped-image.jpg", { type: "image/jpeg" })

            let url = ''
            if (onUpload) {
                url = await onUpload(file)
            } else if (imageUploadUrl) {
                const formData = new FormData()
                formData.append('file', file)
                const response = await fetch(imageUploadUrl, {
                    method: 'POST',
                    body: formData,
                })

                if (!response.ok) {
                    throw new Error('Upload failed')
                }

                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const data = await response.json()
                    url = data.url || data.secure_url || data.data?.url
                } else {
                    url = await response.text()
                }
            }

            if (url) {
                onUrlChange(url)
                setIsOpen(false)
                setImageSrc(null)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!onUpload && !imageUploadUrl}
                >
                    <UploadIcon className="size-4 mr-2" />
                    Upload Image
                </Button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onFileChange}
                    accept="image/*"
                    className="hidden"
                />
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Crop Image</DialogTitle>
                    </DialogHeader>
                    <div className="relative h-[400px] w-full bg-neutral-900 rounded-md overflow-hidden">
                        {imageSrc && (
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={4 / 3}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        )}
                    </div>
                    <div className="py-4">
                        <Label>Zoom</Label>
                        <Slider
                            value={[zoom]}
                            min={1}
                            max={3}
                            step={0.1}
                            onValueChange={(value) => setZoom(value[0])}
                            className="mt-2"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isUploading}>
                            {isUploading && <Loader2Icon className="size-4 mr-2 animate-spin" />}
                            Save & Upload
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
