import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React from 'react';
import { explore1Img, explore2Img, exploreVideo } from '../utils';
import { useGSAP } from '@gsap/react';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Features = () => {
    const videoRef = useRef();
    useGSAP(() => {
        gsap.to("#exploreVideo", {
            scrollTrigger: {
                trigger: '#exploreVideo',
                start: '-10% 85%',
                toggleActions: 'play pause reverse restart',
            },
            onComplete: () => {
                videoRef.current?.play();
            }
        });
        gsap.to("#features-title", {
            opacity: 1,
            y: 0,
            ease: "power2.out", 
            scrollTrigger: {
                trigger: '#features-title',
                start: 'top 85%',
                end: 'bottom top', 
                scrub: 1.5, 
                toggleActions: 'play none none none',
            },
        });
        gsap.to(".g_text", {
            opacity: 1,
            y: 0,
            ease: "power2.out", 
            duration:1,
            scrollTrigger: {
                trigger: '.g_text',
                toggleActions: 'restart reverse restart reverse',
            },
        });
        gsap.to(".g_grow", {
            opacity: 1,
            scale: 1,
            ease: 'power1',
            scrollTrigger: {
                trigger: '.g_grow',
                toggleActions: 'restart reverse restart reverse',
                start: 'top 85%',
                end: 'bottom top', 
                scrub: 5.5,      
            },
        });
    }, []); // Empty dependency array ensures this runs once

    return (
        <section className='h-full common-padding bg-zinc relative overflow-hidden'>
            <div className="screen-max-width">
                <h1 id="features-title" className='section-heading'>
                    explore the full story.
                </h1>
            </div>
            <div className="flex flex-col justify-center items-center overflow-hidden">
                <div className="mt-32 mb-24 pl-24">
                    <h2 className="text-5xl lg:tex-7xl font-semibold ">iPhone</h2>
                    <h2 className="text-5xl lg:tex-7xl font-semibold ">forged in titanium.</h2>
                </div>
                <div className="flex-center  flex-col sm:px-10">
                    <div className="flex items-center h-[50vh] w-full ">
                        <video playsInline id='exploreVideo' preload='none' ref={videoRef} muted autoPlay  className='w-full h-full object-cover object-center'>
                            <source src={exploreVideo} />
                        </video>
                    </div>
                    <div className="flex flex-col w-full relative">
                        <div className="feature-video-container">
                            <div className="overflow-hidden flex-1 h-[50vh]">
                                <img src={explore1Img} alt="titanium" className="feature-video g_grow" />
                            </div> 
                            <div className="overflow-hidden flex-1 h-[50vh]">
                                <img src={explore2Img} alt="titanium2" className="feature-video g_grow" />
                            </div> 
                        </div>
                        <div className="feature-text-container">
                            <div className="flex flex-center">
                                <p className="feature-text g_text">
                                    iPhone 15 pro is {' '}
                                    <span className='text-white'>
                                    the first iPhone to feature an aerospace‑grade titanium design
                                    </span>
                                    , using the same alloy that spacecraft use for missions to Mars.
                                </p>
                            </div>
                            <div className="flex flex-center">
                                <p className="feature-text g_text">
                                Titanium has one of the best strength‑to‑weight ratios of any metal, making these our  {' '}
                                    <span className='text-white'>
                                    ightest Pro models ever
                                    </span>
                                    . You’ll notice the difference the moment you pick one up.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
