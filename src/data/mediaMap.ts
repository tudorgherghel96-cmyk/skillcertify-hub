import { mediaUrl } from '@/lib/media';

interface LessonMedia {
  video?: string;
  images: { src: string; alt: string }[];
}

export const welcomeMedia = {
  video: mediaUrl('welcome/welcome_video_1.mp4'),
  hero: mediaUrl('welcome/welcome_photo_1.jpeg'),
  stats: mediaUrl('welcome/welcome_photo_2.jpeg'),
};

export const examMedia = {
  pathway: mediaUrl('exam/exam_photo_1.png'),
  cscsCard: mediaUrl('exam/exam_photo_2.png'),
  careerProgression: mediaUrl('exam/exam_photo_3.png'),
};

export const lessonMedia: Record<string, LessonMedia> = {
  "1.1": {
    video: mediaUrl('module1/1.1_video'),
    images: [
      { src: mediaUrl('module1/1.1_photo_1.jpeg'), alt: 'Wet floor slip hazard on construction walkway' },
      { src: mediaUrl('module1/1.1_photo_2.png'), alt: 'Stack of bricks on uneven ground' },
      { src: mediaUrl('module1/1.1_photo_3.png'), alt: 'Scaffold pole across walkway — trip hazard' },
      { src: mediaUrl('module1/1.1_photo_4.png'), alt: 'Paint tins near drainage — environmental hazard' },
      { src: mediaUrl('module1/1.1_photo_5.png'), alt: 'Power cables across wet surface — electrical hazard' },
      { src: mediaUrl('module1/1.1_photo_6.jpeg'), alt: 'Hazard vs Risk comparison infographic' },
    ]
  },
  "1.2": {
    images: [
      { src: mediaUrl('module1/1.2_photo_1.jpeg'), alt: 'Worker filling out risk assessment on clipboard' },
      { src: mediaUrl('module1/1.2_photo_2.jpeg'), alt: 'Construction site with hazards highlighted' },
      { src: mediaUrl('module1/1.2_photo_3.jpeg'), alt: 'CDM Regulations 2015 document' },
      { src: mediaUrl('module1/1.2_photo_4.jpeg'), alt: 'Legal prosecution graphic' },
    ]
  },
  "1.3": {
    images: [
      { src: mediaUrl('module1/1.3_photo_1.jpeg'), alt: 'Worker reading method statement on site' },
      { src: mediaUrl('module1/1.3_photo_2.jpeg'), alt: 'Risk Assessment vs Method Statement side-by-side' },
      { src: mediaUrl('module1/1.3_photo_3.jpeg'), alt: 'Excavator near underground cables' },
      { src: mediaUrl('module1/1.3_photo_4.jpeg'), alt: 'Worker signing method statement checklist' },
    ]
  },
  "1.4": {
    images: [
      { src: mediaUrl('module1/1.4_photo_1.png'), alt: 'Hammer falling near worker — near miss scenario' },
      { src: mediaUrl('module1/1.4_photo_2.png'), alt: 'Accident vs Near Miss vs Hazard infographic' },
      { src: mediaUrl('module1/1.4_photo_3.png'), alt: 'Unsafe ladder on uneven ground' },
      { src: mediaUrl('module1/1.4_photo_4.jpeg'), alt: 'RIDDOR regulations graphic' },
    ]
  },
  "1.5": {
    images: [
      { src: mediaUrl('module1/1.5_photo_1.jpeg'), alt: 'All four safety sign types on wall' },
      { src: mediaUrl('module1/1.5_photo_2.png'), alt: 'Red prohibition sign — no naked flames' },
      { src: mediaUrl('module1/1.5_photo_3.png'), alt: 'Yellow warning triangle — electrical hazard' },
      { src: mediaUrl('module1/1.5_photo_4.jpeg'), alt: 'Blue mandatory sign — ear defenders' },
      { src: mediaUrl('module1/1.5_photo_6.jpeg'), alt: 'Hazard sticker on machinery' },
    ]
  },
  "1.6": {
    images: [
      { src: mediaUrl('module1/1.6_photo_1.jpeg'), alt: 'Sunny vs rainy construction site — dynamic risk' },
      { src: mediaUrl('module1/1.6_photo_2.jpeg'), alt: 'Worker stopping work, assessing changed conditions' },
      { src: mediaUrl('module1/1.6_photo_3.jpeg'), alt: 'Unexpected pipes discovered during excavation' },
    ]
  },
  "1.7": {
    images: [
      { src: mediaUrl('module1/1.7_photo_1.jpeg'), alt: 'Exposed electrical cable during excavation' },
      { src: mediaUrl('module1/1.7_photo_2.jpeg'), alt: 'Overhead power cables near scaffolding' },
      { src: mediaUrl('module1/1.7_photo_3.png'), alt: 'Full PPE set laid out on table' },
      { src: mediaUrl('module1/1.7_photo_4.jpeg'), alt: 'Hierarchy of controls pyramid' },
      { src: mediaUrl('module1/1.7_photo_5.jpeg'), alt: 'Fire extinguisher types: Red, Cream, Black, Blue' },
    ]
  },
  "1.8": {
    images: [
      { src: mediaUrl('module1/1.8_photo_1.jpeg'), alt: 'Worker washing hands at site facilities' },
      { src: mediaUrl('module1/1.8_photo_2.jpeg'), alt: 'Clean vs dirty welfare facilities comparison' },
    ]
  },
  "2.1": {
    video: mediaUrl('module2/2.1_video'),
    images: [
      { src: mediaUrl('module2/2.1_photo_1.jpg'), alt: 'Spine anatomy during lifting' },
      { src: mediaUrl('module2/2.1_photo_2.jpeg'), alt: 'Worker with back pain on site' },
      { src: mediaUrl('module2/2.1_photo_4.jpeg'), alt: 'Safety board — zero injuries' },
    ]
  },
  "2.2": {
    video: mediaUrl('module2/2.2_video_'),
    images: [
      { src: mediaUrl('module2/2.2_photo_2.jpeg'), alt: 'Wrong vs right lifting technique comparison' },
      { src: mediaUrl('module2/2.2_photo_3.jpeg'), alt: 'Correct foot positioning for lifting' },
      { src: mediaUrl('module2/2.2_photo_4.jpeg'), alt: 'Worker carrying box close to body' },
    ]
  },
  "2.3": {
    images: [
      { src: mediaUrl('module2/2.3_photo_1.jpeg'), alt: 'Lifting aids: hand truck, pallet truck, wheelbarrow' },
      { src: mediaUrl('module2/2.3_photo_2.jpeg'), alt: 'Worker operating pallet truck' },
      { src: mediaUrl('module2/2.3_photo_3.jpeg'), alt: 'Worker reporting faulty equipment' },
      { src: mediaUrl('module2/2.3_photo_4.jpeg'), alt: 'Fraying lifting straps — inspection' },
    ]
  },
  "2.4": {
    images: [
      { src: mediaUrl('module2/2.4_photo_1.jpeg'), alt: 'Tidy vs cluttered storage comparison' },
      { src: mediaUrl('module2/2.4_photo_2.jpeg'), alt: 'Gas cylinders stored upright, chained' },
    ]
  },
  "3.1": {
    images: [
      { src: mediaUrl('module3/3.1_photo_1.jpeg'), alt: 'Working at height scenarios montage' },
      { src: mediaUrl('module3/3.1_photo_2.jpeg'), alt: '35 deaths from falls — impact statistic' },
    ]
  },
  "3.2": {
    video: mediaUrl('module3/3.2_video'),
    images: [
      { src: mediaUrl('module3/3.2_photo_1.png'), alt: '1-in-4 ladder angle rule diagram' },
      { src: mediaUrl('module3/3.2_photo_2.jpeg'), alt: 'Three points of contact on ladder' },
    ]
  },
  "3.3": {
    images: [
      { src: mediaUrl('module3/3.3_photo_1.jpeg'), alt: 'Professional scaffolding with guardrails' },
      { src: mediaUrl('module3/3.3_photo_2.jpeg'), alt: 'Scaffold inspection tag — safe to use' },
      { src: mediaUrl('module3/3.3_photo_3.jpeg'), alt: 'Dangerous scaffold — spot the hazards' },
    ]
  },
  "3.4": {
    images: [
      { src: mediaUrl('module3/3.4_photo_1.jpeg'), alt: 'Fragile roof with danger signs' },
      { src: mediaUrl('module3/3.4_photo_2.jpeg'), alt: 'Internal void with edge protection' },
      { src: mediaUrl('module3/3.4_photo_3.jpeg'), alt: 'Worker wearing fall arrest harness' },
      { src: mediaUrl('module3/3.4_photo_4.jpeg'), alt: 'MEWP/cherry picker in use' },
    ]
  },
  "4.1": {
    images: [
      { src: mediaUrl('module4/4.1_photo_1.png'), alt: 'Hazardous substances on construction site' },
      { src: mediaUrl('module4/4.1_photo_2.jpeg'), alt: 'GHS hazard symbols grid' },
      { src: mediaUrl('module4/4.1_photo_3.jpeg'), alt: '3 routes into body: inhalation, absorption, ingestion' },
      { src: mediaUrl('module4/4.1_photo_4.jpeg'), alt: 'Worker cutting concrete — silica dust' },
    ]
  },
  "4.2": {
    images: [
      { src: mediaUrl('module4/4.2_photo_1.jpeg'), alt: 'Asbestos warning signs and barriers' },
      { src: mediaUrl('module4/4.2_photo_2.png'), alt: '3 types of asbestos: Blue, Brown, White' },
      { src: mediaUrl('module4/4.2_photo_3.jpeg'), alt: 'Where asbestos is found in buildings' },
    ]
  },
  "4.3": {
    images: [
      { src: mediaUrl('module4/4.3_photo_1.png'), alt: 'Impaired worker on site' },
      { src: mediaUrl('module4/4.3_photo_3.png'), alt: 'Worker wearing hearing protection' },
      { src: mediaUrl('module4/4.3_photo_4.jpeg'), alt: 'Vibration white finger symptoms' },
    ]
  },
  "5.1": {
    video: mediaUrl('module5/5.1_video'),
    images: [
      { src: mediaUrl('module5/5.1_photo_1.jpeg'), alt: 'Blind spots around excavator diagram' },
      { src: mediaUrl('module5/5.1_photo_2.jpeg'), alt: 'Banksman guiding reversing vehicle' },
    ]
  },
  "5.2": {
    images: [
      { src: mediaUrl('module5/5.2_photo_1.png'), alt: 'Exclusion zone barriers around crane' },
      { src: mediaUrl('module5/5.2_photo_2.png'), alt: 'Site map: pedestrian, vehicle, exclusion zones' },
      { src: mediaUrl('module5/5.2_photo_3.jpeg'), alt: 'Emergency stop button close-up' },
      { src: mediaUrl('module5/5.2_photo_4.png'), alt: 'Banksman hand signals series' },
    ]
  },
};

// Helper to get module thumbnail for dashboard
export const moduleThumbnails: Record<number, string> = {
  1: lessonMedia["1.1"].images[0].src,
  2: lessonMedia["2.1"].images[0].src,
  3: lessonMedia["3.1"].images[0].src,
  4: lessonMedia["4.1"].images[0].src,
  5: lessonMedia["5.1"].images[0].src,
};
