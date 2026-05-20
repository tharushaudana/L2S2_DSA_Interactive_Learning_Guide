import { useState, useRef, useEffect, useCallback } from 'react';

export function useAnimationStepper(steps) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // multiplier: 0.5, 1, 2
  const timerRef = useRef(null);

  const getDelay = () => 800 / speed;

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (!steps || steps.length === 0) return;
    stop();
    setIsPlaying(true);

    let step = currentStep < steps.length - 1 ? currentStep + 1 : 0;
    if (currentStep === steps.length - 1) {
      setCurrentStep(-1);
      step = 0;
    }

    setCurrentStep(step);

    timerRef.current = setInterval(() => {
      step++;
      if (step >= steps.length) {
        stop();
      } else {
        setCurrentStep(step);
      }
    }, getDelay());
  }, [steps, currentStep, speed, stop]);

  const pause = useCallback(() => {
    stop();
  }, [stop]);

  const reset = useCallback(() => {
    stop();
    setCurrentStep(-1);
  }, [stop]);

  const stepForward = useCallback(() => {
    if (!steps) return;
    stop();
    setCurrentStep(s => Math.min(s + 1, steps.length - 1));
  }, [steps, stop]);

  const stepBack = useCallback(() => {
    stop();
    setCurrentStep(s => Math.max(s - 1, -1));
  }, [stop]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  // Restart with new speed if currently playing
  useEffect(() => {
    if (isPlaying && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCurrentStep(s => {
          const next = s + 1;
          if (next >= steps.length) {
            stop();
            return s;
          }
          return next;
        });
      }, getDelay());
    }
  }, [speed]);

  const currentStepData = steps && currentStep >= 0 ? steps[currentStep] : null;
  const isComplete = steps && currentStep === steps.length - 1;

  return {
    currentStep,
    currentStepData,
    isPlaying,
    isComplete,
    speed,
    totalSteps: steps ? steps.length : 0,
    play,
    pause,
    reset,
    stepForward,
    stepBack,
    setSpeed,
  };
}
