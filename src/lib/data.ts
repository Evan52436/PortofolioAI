
import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string): ImagePlaceholder => {
    return PlaceHolderImages.find((img) => img.id === id) || PlaceHolderImages[0];
};

export const studentData = {
    name: 'Evan Pranawa Armansyah',
    major: 'Rekayasa Perangkat Lunak & Audio Engineering',
    bio: 'A tech enthusiast based in Bogor, Indonesia. Currently still in school but I\'ve worked on various personal projects including home class servers and network mapping that have helped me develop a strong foundation in Cybersecurity. I also have experience in music industry such as performing on stage, playing with DAW and many more',
    profilePicture: getImage('profile'),
};

export const projects = [
    {
        id: 'project-1',
        title: 'Portfolio Website',
        category: 'code',
        description: 'A personal portfolio website built with Next.js and Tailwind CSS. This responsive site was created to showcase my skills, projects, and professional journey.',
        technologies: ['Next.js', 'Tailwind CSS', 'Google AI Studio', 'TypeScript'],
        image: getImage('project-code'),
        content: 'This is the website you are currently viewing.'
    },
    {
        id: 'project-2',
        title: 'Teachable Machine Demo',
        category: 'code',
        description: 'A team project demonstrating machine learning with Google\'s Teachable Machine, allowing users to train a model to recognize images.',
        technologies: ['HTML', 'Tailwind CSS', 'React.js', 'Google Stitch'],
        image: getImage('project-music'),
        content: 'A demonstration of a machine learning model built by our team.'
    },
    {
        id: 'project-3',
        title: 'Web-Based Synthesizer',
        category: 'code',
        description: 'An interactive synthesizer built with the Web Audio API. Users can create and manipulate sounds directly in their browser, with support for MIDI keyboards.',
        technologies: ['React', 'TypeScript', 'Web Audio API'],
        image: getImage('project-webapp'),
        content: 'const audioCtx = new (window.AudioContext || window.webkitAudioContext)();'
    },
    {
        id: 'project-4',
        title: 'Interactive Music Visualizer',
        category: 'code',
        description: 'A real-time music visualizer that uses p5.js to create stunning geometric patterns based on audio input. Deployed as a static web page.',
        technologies: ['p5.js', 'JavaScript', 'HTML5 Canvas'],
        image: getImage('project-visualizer'),
        content: 'function draw() { background(0); ellipse(width / 2, height / 2, 50, 50); }'
    },
    {
        id: 'project-5',
        title: 'Cybersecurity CTF Tools',
        category: 'code',
        description: 'A collection of Python scripts for automating common Capture The Flag (CTF) challenges, including cryptography and network analysis.',
        technologies: ['Python', 'Cryptography', 'Networking'],
        image: getImage('project-ctf'),
        content: 'A collection of Python scripts for automating common Capture The Flag (CTF) challenges.'
    },
    {
        id: 'project-6',
        title: 'Acoustic EP "City Lights"',
        category: 'music',
        description: 'A 5-track acoustic EP written, performed, and produced independently. Features intricate guitar work and heartfelt lyrics.',
        technologies: ['Acoustic Guitar', 'Vocals', 'Logic Pro X'],
        image: getImage('project-acoustic'),
        content: 'A 5-track acoustic EP.'
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
            institution: 'SD Islam At-Taqwa',
            degree: 'Elementary School',
            period: '2015 - 2021',
        },
        {
            institution: 'SMP School Of Universe',
            degree: 'Middle School',
            period: '2022 - 2024',
        },
        {
            institution: 'SMK Plus Pelita Nusantara',
            degree: 'Vocational High School',
            period: '2025 - Present',
        }
    ],
    experience: [
        {
            company: 'Personal Project',
            role: 'Building a small home server',
            period: 'Ongoing',
            description: 'Designed and built a home lab server for hosting various services, including a media server, local file storage, and a private cloud. This project involved hardware selection, OS installation (Linux), network configuration, and containerization with Docker.',
        },
        {
            company: 'School Project',
            role: 'School E-commerce System',
            period: 'Ongoing',
            description: 'Focused on the front-end (UI/UX) development for an e-commerce platform for a school project. The work included designing and implementing product listings, a shopping cart, and user authentication flows. This project demonstrated skills in front-end development and creating an intuitive user interface.'
        }
    ],
    skills: skills
};
