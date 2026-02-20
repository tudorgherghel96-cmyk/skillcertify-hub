import { mediaUrl } from '@/lib/media';

interface LessonMedia {
  video?: string;
  images: { src: string; alt: string }[];
}

export const welcomeMedia = {
  hero: mediaUrl('welcome1/welcome_photo_1.webp'),
  stats: mediaUrl('welcome1/welcome_photo_2.webp'),
};

export const examMedia = {
  pathway: mediaUrl('exam1/exam_photo_1.webp'),
  cscsCard: mediaUrl('exam1/exam_photo_2.webp'),
  careerProgression: mediaUrl('exam1/exam_photo_3.webp'),
};

export const lessonMedia: Record<string, LessonMedia> = {
  "1.1": {
    images: [
      { src: mediaUrl('module1_1/1.1_photo_1.webp'), alt: 'Wet floor slip hazard on construction walkway' },
      { src: mediaUrl('module1_1/1.1_photo_2.webp'), alt: 'Stack of bricks on uneven ground' },
      { src: mediaUrl('module1_1/1.1_photo_3.webp'), alt: 'Scaffold pole across walkway — trip hazard' },
      { src: mediaUrl('module1_1/1.1_photo_4.webp'), alt: 'Paint tins near drainage — environmental hazard' },
      { src: mediaUrl('module1_1/1.1_photo_5.webp'), alt: 'Power cables across wet surface — electrical hazard' },
      { src: mediaUrl('module1_1/1.1_photo_6.webp'), alt: 'Hazard vs Risk comparison infographic' },
    ]
  },
  "1.2": {
    images: [
      { src: mediaUrl('module1_1/1.2_photo_1.webp'), alt: 'Worker filling out risk assessment on clipboard' },
      { src: mediaUrl('module1_1/1.2_photo_2.webp'), alt: 'Construction site with hazards highlighted' },
      { src: mediaUrl('module1_1/1.2_photo_3.webp'), alt: 'CDM Regulations 2015 document' },
      { src: mediaUrl('module1_1/1.2_photo_4.webp'), alt: 'Legal prosecution graphic' },
    ]
  },
  "1.3": {
    images: [
      { src: mediaUrl('module1_1/1.3_photo_1.webp'), alt: 'Worker reading method statement on site' },
      { src: mediaUrl('module1_1/1.3_photo_2.webp'), alt: 'Risk Assessment vs Method Statement side-by-side' },
      { src: mediaUrl('module1_1/1.3_photo_3.webp'), alt: 'Excavator near underground cables' },
      { src: mediaUrl('module1_1/1.3_photo_4.webp'), alt: 'Worker signing method statement checklist' },
    ]
  },
  "1.4": {
    images: [
      { src: mediaUrl('module1_1/1.4_photo_1.webp'), alt: 'Hammer falling near worker — near miss scenario' },
      { src: mediaUrl('module1_1/1.4_photo_2.webp'), alt: 'Accident vs Near Miss vs Hazard infographic' },
      { src: mediaUrl('module1_1/1.4_photo_3.webp'), alt: 'Unsafe ladder on uneven ground' },
      { src: mediaUrl('module1_1/1.4_photo_4.webp'), alt: 'RIDDOR regulations graphic' },
    ]
  },
  "1.5": {
    images: [
      { src: mediaUrl('module1_1/1.5_photo_1.webp'), alt: 'All four safety sign types on wall' },
      { src: mediaUrl('module1_1/1.5_photo_2.webp'), alt: 'Red prohibition sign — no naked flames' },
      { src: mediaUrl('module1_1/1.5_photo_3.webp'), alt: 'Yellow warning triangle — electrical hazard' },
      { src: mediaUrl('module1_1/1.5_photo_4.webp'), alt: 'Blue mandatory sign — ear defenders' },
      { src: mediaUrl('module1_1/1.5_photo_5.webp'), alt: 'Green safe condition sign — first aid' },
      { src: mediaUrl('module1_1/1.5_photo_6.webp'), alt: 'Hazard sticker on machinery' },
    ]
  },
  "1.6": {
    images: [
      { src: mediaUrl('module1_1/1.6_photo_1.webp'), alt: 'Sunny vs rainy construction site — dynamic risk' },
      { src: mediaUrl('module1_1/1.6_photo_2.webp'), alt: 'Worker stopping work, assessing changed conditions' },
      { src: mediaUrl('module1_1/1.6_photo_3.webp'), alt: 'Unexpected pipes discovered during excavation' },
    ]
  },
  "1.7": {
    images: [
      { src: mediaUrl('module1_1/1.7_photo_1.webp'), alt: 'Exposed electrical cable during excavation' },
      { src: mediaUrl('module1_1/1.7_photo_2.webp'), alt: 'Overhead power cables near scaffolding' },
      { src: mediaUrl('module1_1/1.7_photo_3.webp'), alt: 'Full PPE set laid out on table' },
      { src: mediaUrl('module1_1/1.7_photo_4.webp'), alt: 'Hierarchy of controls pyramid' },
      { src: mediaUrl('module1_1/1.7_photo_5.webp'), alt: 'Fire extinguisher types: Red, Cream, Black, Blue' },
    ]
  },
  "1.8": {
    images: [
      { src: mediaUrl('module1_1/1.8_photo_1.webp'), alt: 'Worker washing hands at site facilities' },
      { src: mediaUrl('module1_1/1.8_photo_2.webp'), alt: 'Clean vs dirty welfare facilities comparison' },
    ]
  },
  "2.1": {
    images: [
      { src: mediaUrl('module2_2/2.1_photo_1.webp'), alt: 'Spine anatomy during lifting' },
      { src: mediaUrl('module2_2/2.1_photo_2.webp'), alt: 'Worker with back pain on site' },
      { src: mediaUrl('module2_2/2.1_photo_4.webp'), alt: 'Safety board — zero injuries' },
    ]
  },
  "2.2": {
    images: [
      { src: mediaUrl('module2_2/2.2_photo_2.webp'), alt: 'Wrong vs right lifting technique comparison' },
      { src: mediaUrl('module2_2/2.2_photo_3.webp'), alt: 'Correct foot positioning for lifting' },
      { src: mediaUrl('module2_2/2.2_photo_4.webp'), alt: 'Worker carrying box close to body' },
    ]
  },
  "2.3": {
    images: [
      { src: mediaUrl('module2_2/2.3_photo_1.webp'), alt: 'Lifting aids: hand truck, pallet truck, wheelbarrow' },
      { src: mediaUrl('module2_2/2.3_photo_2.webp'), alt: 'Worker operating pallet truck' },
      { src: mediaUrl('module2_2/2.3_photo_3.webp'), alt: 'Worker reporting faulty equipment' },
      { src: mediaUrl('module2_2/2.3_photo_4.webp'), alt: 'Fraying lifting straps — inspection' },
    ]
  },
  "2.4": {
    images: [
      { src: mediaUrl('module2_2/2.4_photo_1.webp'), alt: 'Tidy vs cluttered storage comparison' },
      { src: mediaUrl('module2_2/2.4_photo_2.webp'), alt: 'Gas cylinders stored upright, chained' },
    ]
  },
  "3.1": {
    images: [
      { src: mediaUrl('module3_3/3.1_photo_1.webp'), alt: 'Working at height scenarios montage' },
      { src: mediaUrl('module3_3/3.1_photo_2.webp'), alt: '35 deaths from falls — impact statistic' },
    ]
  },
  "3.2": {
    images: [
      { src: mediaUrl('module3_3/3.2_photo_1.webp'), alt: '1-in-4 ladder angle rule diagram' },
      { src: mediaUrl('module3_3/3.2_photo_2.webp'), alt: 'Three points of contact on ladder' },
    ]
  },
  "3.3": {
    images: [
      { src: mediaUrl('module3_3/3.3_photo_1.webp'), alt: 'Professional scaffolding with guardrails' },
      { src: mediaUrl('module3_3/3.3_photo_2.webp'), alt: 'Scaffold inspection tag — safe to use' },
      { src: mediaUrl('module3_3/3.3_photo_3.webp'), alt: 'Dangerous scaffold — spot the hazards' },
    ]
  },
  "3.4": {
    images: [
      { src: mediaUrl('module3_3/3.4_photo_1.webp'), alt: 'Fragile roof with danger signs' },
      { src: mediaUrl('module3_3/3.4_photo_2.webp'), alt: 'Internal void with edge protection' },
      { src: mediaUrl('module3_3/3.4_photo_3.webp'), alt: 'Worker wearing fall arrest harness' },
      { src: mediaUrl('module3_3/3.4_photo_4.webp'), alt: 'MEWP/cherry picker in use' },
    ]
  },
  "4.1": {
    images: [
      { src: mediaUrl('module4_4/4.1_photo_1.webp'), alt: 'Hazardous substances on construction site' },
      { src: mediaUrl('module4_4/4.1_photo_2.webp'), alt: 'GHS hazard symbols grid' },
      { src: mediaUrl('module4_4/4.1_photo_3.webp'), alt: '3 routes into body: inhalation, absorption, ingestion' },
      { src: mediaUrl('module4_4/4.1_photo_4.webp'), alt: 'Worker cutting concrete — silica dust' },
    ]
  },
  "4.2": {
    images: [
      { src: mediaUrl('module4_4/4.2_photo_1.webp'), alt: 'Asbestos warning signs and barriers' },
      { src: mediaUrl('module4_4/4.2_photo_2.webp'), alt: '3 types of asbestos: Blue, Brown, White' },
      { src: mediaUrl('module4_4/4.2_photo_3.webp'), alt: 'Where asbestos is found in buildings' },
    ]
  },
  "4.3": {
    images: [
      { src: mediaUrl('module4_4/4.3_photo_1.webp'), alt: 'Impaired worker on site' },
      { src: mediaUrl('module4_4/4.3_photo_3.webp'), alt: 'Worker wearing hearing protection' },
      { src: mediaUrl('module4_4/4.3_photo_4.webp'), alt: 'Vibration white finger symptoms' },
    ]
  },
  "5.1": {
    images: [
      { src: mediaUrl('module5_5/5.1_photo_1.webp'), alt: 'Blind spots around excavator diagram' },
      { src: mediaUrl('module5_5/5.1_photo_2.webp'), alt: 'Banksman guiding reversing vehicle' },
    ]
  },
  "5.2": {
    images: [
      { src: mediaUrl('module5_5/5.2_photo_1.webp'), alt: 'Exclusion zone barriers around crane' },
      { src: mediaUrl('module5_5/5.2_photo_2.webp'), alt: 'Site map: pedestrian, vehicle, exclusion zones' },
      { src: mediaUrl('module5_5/5.2_photo_3.webp'), alt: 'Emergency stop button close-up' },
      { src: mediaUrl('module5_5/5.2_photo_4.webp'), alt: 'Banksman hand signals series' },
    ]
  },
};

// Helper to get module thumbnail for dashboard
// Uses actual hero images from the lesson-images Supabase bucket
import { getLessonMediaUrl } from '@/lib/media';

export const moduleThumbnails: Record<number, string> = {
  1: getLessonMediaUrl('hero-M1-L1-construction-site-hazards.jpeg', 'lesson-images'),
  2: getLessonMediaUrl('hero-M2-L2-safe-lifting.jpeg', 'lesson-images'),
  3: getLessonMediaUrl('hero-M3-L1-working-at-height.jpeg', 'lesson-images'),
  4: getLessonMediaUrl('hero-M4-L1-coshh.jpeg', 'lesson-images'),
  5: getLessonMediaUrl('hero-M5-L1-banksman.jpeg', 'lesson-images'),
};
