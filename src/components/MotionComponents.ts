import {motion, MotionProps} from "framer-motion";

const MotionDiv = motion.div as React.FC<React.HTMLAttributes<HTMLDivElement> & MotionProps>;
const MotionSpan = motion.span as React.FC<React.HTMLAttributes<HTMLSpanElement> & MotionProps>;
const MotionButton = motion.button as React.FC<React.HTMLAttributes<HTMLButtonElement> & MotionProps>;
const MotionInput = motion.input as React.FC<React.HTMLAttributes<HTMLInputElement> & MotionProps>;
const MotionLabel = motion.label as React.FC<React.HTMLAttributes<HTMLLabelElement> & MotionProps>;


export {MotionDiv, MotionSpan, MotionButton, MotionInput, MotionLabel};