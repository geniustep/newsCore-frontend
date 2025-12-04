'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Photo {
  id: string;
  url: string;
  title: string;
  caption?: string;
}

interface Gallery {
  id: string;
  title: string;
  photos: Photo[];
}

interface PhotoGalleryProps {
  galleries: Gallery[];
}

export default function PhotoGallery({ galleries }: PhotoGalleryProps) {
  const t = useTranslations();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  if (!galleries || galleries.length === 0) return null;

  const openLightbox = (gallery: Gallery, photoIndex: number) => {
    setSelectedGallery(gallery);
    setCurrentPhotoIndex(photoIndex);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedGallery(null);
    setCurrentPhotoIndex(0);
  };

  const nextPhoto = () => {
    if (selectedGallery) {
      setCurrentPhotoIndex((prev) =>
        prev === selectedGallery.photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevPhoto = () => {
    if (selectedGallery) {
      setCurrentPhotoIndex((prev) =>
        prev === 0 ? selectedGallery.photos.length - 1 : prev - 1
      );
    }
  };

  return (
    <>
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-8">
            <ImageIcon className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold">{t('sections.photoGalleries')}</h2>
          </div>

          {/* Galleries Grid */}
          <div className="space-y-8">
            {galleries.map((gallery) => (
              <div key={gallery.id}>
                <h3 className="text-xl font-bold mb-4">
                  {gallery.title}
                  <span className="text-sm font-normal text-gray-500 ml-3">
                    ({gallery.photos.length} {t('gallery.photos')})
                  </span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {gallery.photos.slice(0, 6).map((photo, index) => (
                    <button
                      key={photo.id}
                      onClick={() => openLightbox(gallery, index)}
                      className="group relative aspect-square bg-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && selectedGallery && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation */}
          <button
            onClick={prevPhoto}
            className="absolute left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            aria-label="Previous"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <button
            onClick={nextPhoto}
            className="absolute right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            aria-label="Next"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Image */}
          <div className="max-w-6xl max-h-[90vh] px-16">
            <img
              src={selectedGallery.photos[currentPhotoIndex].url}
              alt={selectedGallery.photos[currentPhotoIndex].title}
              className="max-w-full max-h-[80vh] object-contain"
            />
            <div className="text-white text-center mt-4">
              <h3 className="text-xl font-bold mb-2">
                {selectedGallery.photos[currentPhotoIndex].title}
              </h3>
              {selectedGallery.photos[currentPhotoIndex].caption && (
                <p className="text-white/80">
                  {selectedGallery.photos[currentPhotoIndex].caption}
                </p>
              )}
              <p className="text-white/60 mt-2 text-sm">
                {currentPhotoIndex + 1} / {selectedGallery.photos.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
