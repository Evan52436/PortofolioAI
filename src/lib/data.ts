
import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string): ImagePlaceholder => {
    return PlaceHolderImages.find((img) => img.id === id) || PlaceHolderImages[0];
};

export const studentData = {
    name: 'Evan Pranawa Armansyah',
    major: 'Rekayasa Perangkat Lunak',
    bio: 'A tech enthusiast based in Bogor, Indonesia. Currently still in school but I\'ve worked on various personal projects including home class servers and network mapping that have helped me develop a strong foundation in Cybersecurity. I also have experience in music industry such as performing on stage, playing with DAW and many more',
    profilePicture: getImage('profile'),
};

export const projects = [
    {
        id: 'project-1',
        title: 'Portfolio Website',
        category: 'code',
        description: 'My old personal portfolio website built with HTML, CSS and JavaScript. This responsive site was Handmade by Me to show off my skill.',
        technologies: ['HTML', 'CSS', 'JavaScript'],
        image: getImage('project-code'),
        url: 'https://evanpranawa.my.id/',
        content: 'My Personal HandMade Portofolio.'
    },
    {
        id: 'project-2',
        title: 'Teachable Machine Demo',
        category: 'code',
        description: 'A team project demonstrating machine learning with Google\'s Teachable Machine, allowing users to train a model to recognize images.',
        technologies: ['HTML', 'Tailwind CSS', 'React.js', 'Google Stitch'],
        image: getImage('project-music'),
        url: 'https://tim-erpeel.netlify.app/',
        content: 'A demonstration of a machine learning model built by our team.'
    },
    {
        id: 'project-3',
        title: 'Top 10 Clash of Cyberheist',
        category: 'competition',
        description: 'Positioned in top 10 on a province class Cybersecurity competition',
        technologies: ['Pyton', 'HackerRank', 'MyDigiLearn'],
        image: getImage('project-webapp'),
        url: '#',
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
