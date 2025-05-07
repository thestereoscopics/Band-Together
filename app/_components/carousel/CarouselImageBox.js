"use client";

import React from "react";
import {
  DotButton,
  useDotButton,
} from "@/app/_components/carousel/CarouselDotButtons";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "@/app/_components/carousel/CarouselArrowButtons";
import useEmblaCarousel from "embla-carousel-react";
import CarouselSlide from "@/app/_components/carousel/CarouselSlide";

export default function CarouselImageBox({
  slides,
  options,
  keyName,
  isAlbum = false,
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section className='mb-8 w-full'>
      <div className='overflow-hidden' ref={emblaRef}>
        <div className='flex touch-pan-y touch-pinch-zoom -ml-4 '>
          {slides.map((slide, index) => (
            <CarouselSlide
              key={`${slide.id}-${index}`}
              slide={slide}
              keyName={keyName}
              isAlbum={isAlbum}
            />
          ))}
        </div>
      </div>
      <div className='grid grid-cols-[auto_1fr] justify-between gap-5 mt-6'>
        <div className='grid-cols-2 gap-2 items-center text-primary-100 hidden'>
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
        <div className='flex flex-wrap justify-end items-center gap-1 -mr-[calc((1.25rem-1rem)/2)]'>
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={`appearance-none bg-transparent touch-manipulation inline-flex items-center justify-center cursor-pointer border-0 p-0 m-0 w-5 h-5 rounded-full ${
                index === selectedIndex
                  ? "shadow-[inset_0_0_0_0.2rem_theme(colors.primary.100)]"
                  : "shadow-[inset_0_0_0_0.2rem_theme(colors.primary.600)]"
              }`}
            >
              <span className='flex items-center justify-center w-[1rem] h-[1rem] rounded-full'></span>
            </DotButton>
          ))}
        </div>
      </div>
    </section>
  );
}
