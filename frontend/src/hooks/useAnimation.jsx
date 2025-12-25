import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

export const useScrollAnimation = (options = {}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    ...options
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return [ref, controls];
};

export const useFadeIn = (delay = 0) => {
  return {
    initial: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: delay * 0.1,
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };
};

export const useStaggerChildren = (delay = 0.1) => {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: delay
      }
    }
  };
};

export const useParallax = (intensity = 0.1) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      setOffset({
        x: x * intensity,
        y: y * intensity
      });
    };

    const element = ref.current;
    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [intensity]);

  return [ref, offset];
};

export const AnimatedSection = ({ children, className = '', delay = 0, ...props }) => {
  const [ref, controls] = useScrollAnimation();
  const fadeIn = useFadeIn(delay);

  return (
    <motion.section
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={fadeIn}
      {...props}
    >
      {children}
    </motion.section>
  );
};

export const AnimatedDiv = ({ children, className = '', delay = 0, ...props }) => {
  const [ref, controls] = useScrollAnimation();
  const fadeIn = useFadeIn(delay);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={fadeIn}
      {...props}
    >
      {children}
    </motion.div>
  );
};
