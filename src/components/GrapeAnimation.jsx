// import React, { useEffect, useRef } from 'react';
// import lottie from 'lottie-web';
// import animationData from '../assets/Illustrations/Animation 01/drawkit-grape-animation-1-LOOP.json'

// const GrapeAnimation = () => {
//   const animationContainer = useRef(null);

//   useEffect(() => {
//     const animation = lottie.loadAnimation({
//       container: animationContainer.current,
//       renderer: 'svg',
//       loop: true,
//       autoplay: true,
//       animationData: animationData,
//     });

//     return () => {
//       animation.destroy();
//     };
//   }, []);

//   return (
//     <div
//       ref={animationContainer}
//       className="w-64 h-80 mx-auto" // Tailwind classes for styling
//     ></div>
//   );
// };

// export default GrapeAnimation;

// Placeholder component for GrapeAnimation
const GrapeAnimation = ({ className }) => {
  return (
    <div className={`w-32 h-32 mx-auto mb-6 ${className}`}>
      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 rounded-full animate-pulse flex items-center justify-center">
        <span className="text-white font-bold text-lg">🍇</span>
      </div>
    </div>
  )
}

export default GrapeAnimation
