import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  productName?: string
}

const ImageGallery = ({ images, productName = "Product" }: ImageGalleryProps) => {
  return (
    <div className="flex items-start relative justify-center">
      <div className="flex flex-col w-full max-w-[520px] gap-y-4">
        {images.map((image, index) => {
          return (
            <Container
              key={image.id}
              className="relative aspect-square w-full max-w-[420px] mx-auto overflow-hidden bg-ui-bg-subtle rounded-large"
              id={image.id}
            >
              {!!image.url && (
                <Image
                  src={image.url}
                  priority={index <= 2 ? true : false}
                  className="absolute inset-0 rounded-rounded"
                  alt={`${productName} - Image ${index + 1}`}
                  fill
                  sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                  style={{
                    objectFit: "cover",
                  }}
                />
              )}
            </Container>
          )
        })}
      </div>
    </div>
  )
}

export default ImageGallery
