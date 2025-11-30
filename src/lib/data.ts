import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string): ImagePlaceholder => {
    return PlaceHolderImages.find((img) => img.id === id) || PlaceHolderImages[0];
};

export const studentData = {
    name: 'Evan Pranawa Armansyah',
    major: 'Computer Science & Music',
    bio: 'A tech enthusiast based in Bogor, Indonesia. Currently still in school but I\'ve worked on various personal projects including home class servers and network mapping that have helped me develop a strong foundation in Cybersecurity. I also have experience in music industry such as performing on stage, playing with DAW and many more',
    profilePicture: getImage('profile'),
};

export const projects = [
    {
        id: 'project-1',
        title: 'Symphony OS',
        category: 'code',
        description: 'A custom-built, lightweight operating system kernel designed for real-time audio processing. Explores low-level system programming and memory management.',
        technologies: ['C++', 'Assembly', 'Linux Kernel'],
        image: getImage('project-code'),
        content: 'int main() { printf("Hello, Symphony OS!"); return 0; }'
    },
    {
        id: 'project-2',
        title: 'Generative Lo-fi Beats',
        category: 'music',
        description: 'An album of lo-fi hip-hop tracks generated using a custom-trained machine learning model. The model learns patterns from classic tracks to create new, original compositions.',
        technologies: ['Python', 'Magenta', 'Ableton Live'],
        image: getImage('project-music'),
        content: 'A sample of the generative music produced by the model.'
    },
    {
        id: 'project-3',
        title: 'Web-Based Synthesizer',
        category: 'code',
        description: 'An interactive synthesizer built with the Web Audio API. Users can create and manipulate sounds directly in their browser, with support for MIDI keyboards.',
        technologies: ['React', 'TypeScript', 'Web Audio API'],
        image: getImage('project-webapp'),
        content: 'const audioCtx = new (window.AudioContext || window.webkitAudioContext)();'
    }
];

export const skills = [
    { name: 'JavaScript', proficiency: 90, category: 'code' },
    { name: 'Python', proficiency: 85, category: 'code' },
    { name: 'C++', proficiency: 75, category: 'code' },
    { name: 'HTML/CSS', proficiency: 95, category: 'code' },
    { name: 'React', proficiency: 80, category: 'code' },
    { name: 'Piano', proficiency: 95, category: 'music' },
    { name: 'Guitar', proficiency: 80, category: 'music' },
    { name: 'Music Theory', proficiency: 90, category: 'music' },
    { name: 'Ableton Live', proficiency: 85, category: 'music' },
    { name: 'Figma', proficiency: 70, category: 'software' },
];

export const resume = {
    education: [
        {
            institution: 'Vocational High School of Arts & Technology',
            degree: 'Diploma, Computer Science & Music',
            period: '2021 - Present',
        }
    ],
    experience: [
        {
            company: 'Indie Game Studio (Freelance)',
            role: 'Sound Designer & Tools Developer',
            period: 'Summer 2023',
            description: 'Composed adaptive soundtracks for a 2D platformer and developed a custom Unity plugin to manage audio assets.',
        }
    ],
    skills: skills
};
