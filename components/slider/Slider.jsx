import { useState, useEffect, useRef } from 'react';

// Example slides data
const slides = [
  {
    id: 1,
    image: 'https://www.bleepstatic.com/content/hl-images/2021/08/25/WhatsApp.jpg',
    title: 'Join Whatsapp Community',
    description: 'Join Our Whatsapp Community to stay updated !',
    href: '/',
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/1920x600/3d3d3d/ffffff?text=Join+Mining+Point',
    title: 'More Features Coming Soon....',
    description: 'We go beyond notes. Lowstack is a complete stack that empowers you to skill up.',
    href: '/',
  },
];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const sliderRef = useRef(null);
  const draggedRef = useRef(false);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleSlideClick = (e, href) => {
    // Prevent navigation if user was dragging
    if (draggedRef.current) {
      e.preventDefault();
      return;
    }
    if (href) {
      window.location.href = href;
    }
  };

  // Touch/Mouse event handlers
  const getPositionX = (e) => {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  };

  const handleDragStart = (e) => {
    // Prevent default to avoid unwanted behaviors
    if (e.type === 'mousedown') {
      e.preventDefault();
    }
    
    setIsDragging(true);
    draggedRef.current = false;
    setStartPos(getPositionX(e));
    setPrevTranslate(-currentIndex * sliderRef.current.offsetWidth);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    
    const currentPosition = getPositionX(e);
    const diff = currentPosition - startPos;
    
    // Mark as dragged if moved more than 5px
    if (Math.abs(diff) > 5) {
      draggedRef.current = true;
    }
    
    setCurrentTranslate(prevTranslate + diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const movedBy = currentTranslate - prevTranslate;
    const threshold = sliderRef.current.offsetWidth / 4;

    // Determine next slide based on drag direction
    if (movedBy < -threshold) {
      // Dragged left - go to next slide (with loop)
      const newIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
      setCurrentIndex(newIndex);
    } else if (movedBy > threshold) {
      // Dragged right - go to previous slide (with loop)
      const newIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
      setCurrentIndex(newIndex);
    }

    // Reset dragged flag after a short delay
    setTimeout(() => {
      draggedRef.current = false;
    }, 100);
  };

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) {
        nextSlide();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isDragging]);

  // Update translate when index changes
  useEffect(() => {
    if (sliderRef.current && !isDragging) {
      setCurrentTranslate(-currentIndex * sliderRef.current.offsetWidth);
      setPrevTranslate(-currentIndex * sliderRef.current.offsetWidth);
    }
  }, [currentIndex, isDragging]);

  return (
    <div className="relative w-[100%] mx-auto h-64 sm:h-80 md:h-96 lg:h-[400px] overflow-hidden rounded-lg shadow-lg">
      {/* Slides Container */}
      <div 
        ref={sliderRef}
        className="flex h-full select-none"
        style={{ 
          transform: isDragging 
            ? `translateX(${currentTranslate}px)` 
            : `translateX(-${currentIndex * 100}%)`,
          transition: isDragging ? 'none' : 'transform 500ms ease-in-out',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="min-w-full h-full bg-cover bg-center relative cursor-pointer"
            style={{ backgroundImage: `url(${slide.image})` }}
            onClick={(e) => handleSlideClick(e, slide.href)}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-neutral bg-opacity-50"></div>
            
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 text-white">
                {slide.title}
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white max-w-2xl">
                {slide.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-primary hover:bg-primary/90 p-2 sm:p-3 rounded-full text-primary-content transition-colors duration-200 z-20"
        aria-label="Previous slide"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-primary hover:bg-primary/90 p-2 sm:p-3 rounded-full text-primary-content transition-colors duration-200 z-20"
        aria-label="Next slide"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              currentIndex === index ? 'bg-primary' : 'bg-base-300 hover:bg-base-200'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;