import React, { useState, useCallback, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Modal from 'react-modal';

const CircularImageCrop = () => {
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [crop, setCrop] = useState<any | null>(null);
  const [completedCrop, setCompletedCrop] = useState<any>(null);
  const [zoom, setZoom] = useState(1);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const canvasRef = useRef(null);

  const onSelectFile = (e:any) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setSelectedImage(reader.result));
      reader.readAsDataURL(e.target.files[0]);
      setModalIsOpen(true);
    }
  };

  const onCropChange = (newCrop:any) => {
    setCrop(newCrop);
  };

  const onCompleteCrop = (crop:any) => {
    setCompletedCrop(crop);
  };

  const onZoomChange = (e:any) => {
    setZoom(Number(e.target.value));
  };

  const createCircularCrop = useCallback((image:any) => {
    const aspect = 1; // Circular aspect ratio
    return centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 44 / image.width * 100,
        },
        aspect,
        image.width,
        image.height
      ),
      image.width,
      image.height
    );
  }, []);

  const handleImageLoad = (e:any) => {
    setCrop(createCircularCrop(e.currentTarget));
  };

  const saveCroppedImage = () => {
    if (!completedCrop || !canvasRef.current || !selectedImage) return;

    const canvas:any = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = new Image();

    image.src = selectedImage;
    image.onload = () => {
      canvas.width = 44;
      canvas.height = 44;
      ctx.clearRect(0, 0, 44, 44);
      ctx.drawImage(
        image,
        completedCrop.x,
        completedCrop.y,
        completedCrop.width,
        completedCrop.height,
        0,
        0,
        44,
        44
      );
      // You can now save the canvas as an image or process it further
      const croppedImage = canvas.toDataURL('image/png');
      console.log('Cropped Image:', croppedImage);
    };
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={onSelectFile} />

      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        {selectedImage && (
          <div>
            <ReactCrop
              crop={crop}
              onChange={onCropChange}
              onComplete={onCompleteCrop}
              aspect={1}
              circularCrop
            >
              <img
                src={selectedImage}
                onLoad={handleImageLoad}
                alt="Crop preview"
                style={{ transform: `scale(${zoom})` }}
              />
            </ReactCrop>

            <div>
              <label>Zoom: </label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={onZoomChange}
              />
            </div>

            <button onClick={saveCroppedImage}>Accept</button>
            <button onClick={() => setModalIsOpen(false)}>Cancel</button>
          </div>
        )}
      </Modal>

      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default CircularImageCrop;
