"use client";

import { CustomEase } from "gsap/CustomEase";
import { Flip } from "gsap/Flip";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(CustomEase, Flip, ScrollTrigger);
CustomEase.create("aone", "0.2, 0, 0, 1");

export { gsap };
