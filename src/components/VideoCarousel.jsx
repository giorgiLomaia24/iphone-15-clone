import React, { useEffect, useRef, useState } from 'react';
import { hightlightsSlides } from '../constants';
import gsap from 'gsap';
import { pauseImg, playImg, replayImg } from '../utils';
import { useGSAP } from '@gsap/react';

const VideoCarousel = () => {
    const videoRef = useRef([]);
    const videoDivRef = useRef([]);
    const videoSpanRef = useRef([]);

    const [video, setVideo] = useState({
        isEnd: false,
        startPlay: false,
        videoId: 0,
        isLastVideo: false,
        isPlaying: false
    });
    const [loadedData, setLoadedData] = useState([]);
    const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video;

    useGSAP(() => {
        gsap.to('#slider', {
            transform: `translateX(${-100 * videoId}%)`,
            duration: 2,
            ease: 'power2.inOut'
        });
        gsap.to('#video', {
            scrollTrigger: {
                trigger: '#video',
                toggleActions: 'restart none none none'
            },
            onComplete: () => {
                setVideo((prev) => ({
                    ...prev,
                    startPlay: true,
                    isPlaying: true
                }));
            }
        });
    }, [isEnd, videoId]);

    useEffect(() => {
        if (loadedData.length > 3) {
            const currentVideo = videoRef.current[videoId];
            if (currentVideo && typeof currentVideo.play === 'function') {
                if (!isPlaying) {
                    currentVideo.pause();
                } else if (startPlay) {
                    currentVideo.play();
                }
            }
        }
    }, [startPlay, videoId, isPlaying, loadedData]);

    const handleLoadedMetaData = (i, e) => {
        setLoadedData((prev) => [...prev, e]);
    };

    useEffect(() => {
        let currentProgress = 0;
        let span = videoSpanRef.current;
        if (span[videoId]) {
            let anim = gsap.to(span[videoId], {
                onUpdate: () => {
                    const progress = Math.ceil(anim.progress() * 100);
                    if (progress !== currentProgress) {
                        currentProgress = progress;
                        gsap.to(videoDivRef.current[videoId], {
                            width: window.innerWidth < 760 ? '10vw' : window.innerWidth < 1200 ? '10vw' : '4vw'
                        });
                        gsap.to(span[videoId], {
                            width: `${currentProgress}%`,
                            backgroundColor: 'white'
                        });
                    }
                },
                onComplete: () => {
                    if (isPlaying) {
                        gsap.to(videoDivRef.current[videoId], {
                            width: '12px'
                        });
                        gsap.to(span[videoId], {
                            backgroundColor: '#afafaf'
                        });
                    }
                }
            });

            if (videoId === 0) {
                anim.restart();
            }

            const animUpdate = () => {
                const videoElement = videoRef.current[videoId];
                if (videoElement && videoElement.duration) {
                    const progress = videoElement.currentTime / videoElement.duration;
                    anim.progress(progress);
                }
            };
            if (isPlaying) {
                gsap.ticker.add(animUpdate);
            } else {
                gsap.ticker.remove(animUpdate);
            }
        }
    }, [videoId, startPlay]);

    const handleProcess = (type, i) => {
        switch (type) {
            case "video-end":
                setVideo((pre) => ({ ...pre, isEnd: true, videoId: i + 1 }));
                break;

            case "video-last":
                setVideo((pre) => ({ ...pre, isLastVideo: true }));
                break;

            case "video-reset":
                setVideo((pre) => ({ ...pre, videoId: 0, isLastVideo: false }));
                break;

            case "pause":
                setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
                break;

            case "play":
                setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
                break;

            default:
                return video;
        }
    };

    const handleProgressBarClick = (index) => {
        const currentVideo = videoRef.current[videoId];
        if (currentVideo && videoId !== index) {       
            currentVideo.pause();
        }

        // Update state to switch to the new video
        setVideo((prev) => ({
            ...prev,
            videoId: index,
            startPlay: true,
            isPlaying: true,
            isEnd: false,
            isLastVideo: index === hightlightsSlides.length - 1
        }));
    };




    return (
        <>
            <div className="flex items-center">
                {hightlightsSlides.map((list, i) => (
                    <div key={i} id='slider' className='sm:pr-20 pr-10'>
                        <div className="video-carousel_container">
                            <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                                <video
                                    id='video'
                                    playsInline
                                    preload='auto'
                                    muted
                                    ref={(el) => (videoRef.current[i] = el)}
                                    onPlay={() => {
                                        setVideo((prev) => ({ ...prev, isPlaying: true }));
                                    }}
                                    onEnded={() => {
                                        if (i !== hightlightsSlides.length - 1) {
                                            handleProcess('video-end', i);
                                        } else {
                                            handleProcess('video-last', i);
                                        }
                                    }}
                                    onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                                >
                                    <source src={list.video} type='video/mp4' />
                                </video>
                            </div>
                            <div className="absolute top-11 left-[5%] z-10">
                                {list.textLists.map((text, j) => (
                                    <p key={j} className="md:text-2xl text-xl font-medium">{text}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="relative flex-center mt-10">
                <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
                    {videoRef.current.map((_, i) => (
                        <span key={i}
                            className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
                            ref={(el) => (videoDivRef.current[i] = el)}
                            onClick={() => handleProgressBarClick(i)} // Add click handler
                        >
                            <span
                                ref={(el) => (videoSpanRef.current[i] = el)}
                                className="absolute h-full w-full rounded-full"
                            ></span>
                        </span>
                    ))}
                </div>
                <button className="control-btn">
                    <img
                        src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
                        alt={isLastVideo ? 'replay' : !isPlaying ? 'play' : 'pause'}
                        onClick={() => isLastVideo ? handleProcess('video-reset') : handleProcess('play')}
                    />
                </button>
            </div>
        </>
    );
};

export default VideoCarousel;
