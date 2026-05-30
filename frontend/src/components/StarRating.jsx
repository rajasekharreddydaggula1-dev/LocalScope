import React from 'react';
import { Star, StarHalf } from 'lucide-react';

export default function StarRating({ rating = 0, onRatingChange = null, size = 16 }) {
  const stars = [];
  const roundedRating = Math.round(rating * 2) / 2;

  for (let i = 1; i <= 5; i++) {
    const isInteractive = onRatingChange !== null;
    
    let starIcon;
    if (i <= rating) {
      starIcon = <Star size={size} fill="currentColor" className={isInteractive ? "star-interactive" : ""} />;
    } else if (i - 0.5 === roundedRating) {
      starIcon = <StarHalf size={size} fill="currentColor" className={isInteractive ? "star-interactive" : ""} />;
    } else {
      starIcon = <Star size={size} className={isInteractive ? "star-interactive" : ""} />;
    }

    if (isInteractive) {
      stars.push(
        <span
          key={i}
          onClick={() => onRatingChange(i)}
          style={{ color: 'var(--warning)', cursor: 'pointer', display: 'inline-flex' }}
        >
          {starIcon}
        </span>
      );
    } else {
      stars.push(
        <span key={i} style={{ color: 'var(--warning)', display: 'inline-flex' }}>
          {starIcon}
        </span>
      );
    }
  }

  return <div className="business-rating-stars">{stars}</div>;
}
