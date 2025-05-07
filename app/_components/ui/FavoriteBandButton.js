"use client";
import { HeartIcon } from "@heroicons/react/24/outline";
import { saveFavoriteBand } from "@/app/_lib/data-service";
import { useState } from "react";

export default function FavoriteBandButton({
  imageURL,
  id,
  name,
  isFavorite,
  isButton,
}) {
  const [isFavoriteButton, setIsFavoriteButton] = useState(isFavorite);
  async function handleClick(event) {
    event.preventDefault();
    setIsFavoriteButton((prev) => !prev);

    try {
      const bandData = {
        id,
        name,
        image: imageURL,
        source: "spotify",
      };
      await saveFavoriteBand({ bandData, isFavoriteButton: !isFavoriteButton });
      console.log(`${name} saved as favorite!`);
    } catch (error) {
      console.error("Failed to save favorite band:", error);
    }
  }

  return (
    <button
      className={`flex ${
        isButton
          ? "px-4 py-2 bg-primary-600 rounded-full text-backgroundhover:bg-primary-800 gap-2"
          : "w-4 h-auto"
      } ${isFavoriteButton ? "text-secondary-100" : "text-primary-100"}`}
      onClick={handleClick}
    >
      <HeartIcon
        className={`w-4 h-auto ${isFavoriteButton ? "fill-red-400" : ""}`}
      />
      {isButton
        ? isFavoriteButton
          ? " Remove Favorite"
          : " Add Favorite"
        : ""}
    </button>
  );
}
