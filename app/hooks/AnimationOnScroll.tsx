"use client";
import { motion, Transition } from "framer-motion";
import { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "scale";

interface AnimationOnSCrollProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  amount?: number;
};

const getInitial = (direction: Direction, distance: number) => {
  switch (direction) {
    case "left":
      return { opacity: 0, x: -distance };
    case "right":
      return { opacity: 0, x: distance };
    case "down":
      return { opacity: 0, y: -distance };
    case "scale":
      return { opacity: 0, scale: 0.9 };
    case "up":
    default:
      return { opacity: 0, y: distance };
  }
};

const AnimationOnScroll = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  distance = 40,
  amount = 0.2,
}: AnimationOnSCrollProps) => {
  const transition: Transition = {
    duration,
    delay,
    ease: "easeOut",
  };
   return (
    <motion.div
      initial={getInitial(direction, distance)}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{
        once: true, 
        amount,
      }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
};

export default AnimationOnScroll;