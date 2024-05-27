import React, { useRef, useEffect } from 'react';

const VideoComponent = ({ videoSrc, onVideoEnd, className }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    const handleVideoEnd = () => {
      onVideoEnd();
    };

    video.addEventListener('ended', handleVideoEnd);

    return () => {
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, [onVideoEnd]);

  return (
    <div className={className}>
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        loop={false}
        muted
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default VideoComponent;