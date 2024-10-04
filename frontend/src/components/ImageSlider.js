import React, { useState } from "react";
import { Box, IconButton, Image, useBreakpointValue } from "@chakra-ui/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const images = [
  "./images/main_img.jpg",
  "./images/main7_img.jpg",
  "./images/main3_img.jpg",
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const sliderHeight = useBreakpointValue({
    base: "294px",
    sm: "350",
    md: "500px",
  });

  return (
    <Box
      top="-22px"
      position="relative"
      width="full"
      height={sliderHeight}
      overflow="hidden"
    >
      <IconButton
        icon={<FaArrowLeft />}
        aria-label="Previous Slide"
        position="absolute"
        left="10px"
        top="30%"
        transform="translateY(-50%)"
        onClick={prevSlide}
        zIndex={1}
      />
      <IconButton
        icon={<FaArrowRight />}
        aria-label="Next Slide"
        position="absolute"
        right="10px"
        top="30%"
        transform="translateY(-50%)"
        onClick={nextSlide}
        zIndex={1}
      />
      {images.map((image, index) => (
        <Image
          key={index}
          src={image}
          alt={`Slide ${index}`}
          position="absolute"
          top="0"
          left={`${(index - currentIndex) * 100}%`}
          width="150%"
          height={{ base: "250px", sm: "250px", md: "420px" }}
          transition="left 0.5s ease-in-out"
        />
      ))}
    </Box>
  );
};

export default ImageSlider;
