
import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string): ImagePlaceholder => {
    const found = PlaceHolderImages.find((img) => img.id === id);
    if (found) return found;

    const path = id.startsWith('/') ? id : `/${id}`;
    const cleanLabel = id.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');

    return {
        id,
        description: cleanLabel || 'Dashboard Desktop',
        imageUrl: id.includes('.') ? path : '/Dashboard_Desktop.png',
        imageHint: cleanLabel || 'dashboard desktop',
    };
};

export const studentData = {
    name: 'Evan Pranawa Armansyah',
    major: 'Rekayasa Perangkat Lunak & Cybersecurity',
    bio: 'A tech enthusiast based in Bogor, Indonesia. Currently still in school but I\'ve worked on various personal projects including home class servers and network mapping that have helped me develop a strong foundation in Cybersecurity. I also have experience in music industry such as performing on stage, playing with DAW and many more',
    profilePicture: getImage('profile'),
};

export const projects = [
    {
        id: 'project-1',
        title: 'Teachable Machine Demo',
        category: 'code',
        description: 'A team project demonstrating machine learning with Google\'s Teachable Machine, allowing users to train a model to recognize images.',
        technologies: ['HTML', 'Tailwind CSS', 'React.js', 'Google Stitch'],
        image: getImage('project-music'),
        gallery: [
            getImage('project-music'),
            getImage('Teachablemachine2.png'),
            getImage('Teachablemachine3.png'),
            getImage('erpeel.jpeg')
        ],
        url: 'https://tim-erpeel.netlify.app/',
        githubUrl: 'https://github.com/Evan52436/Website-Erpeel',
        content: 'A demonstration of a machine learning model built by our team. Features realtime browser image recognition model training.'
    },
    {
        id: 'project-2',
        title: `Portfolio Website (Legacy)`,
        category: 'code',
        description: 'My old personal portfolio website built with HTML, CSS and JavaScript. This responsive site was Handmade by Me to show off my skill.',
        technologies: ['HTML', 'CSS', 'JavaScript', 'Vercel'],
        image: getImage('project-code'),
        gallery: [
            getImage('project-code'),
            getImage('project-music'),
            getImage('project-webapp'),
            getImage('profile')
        ],
        url: 'https://legacy.evanpranawa.my.id',
        githubUrl: 'https://github.com',
        content: 'My Personal HandMade Portofolio featuring custom responsive design, smooth transitions, and showcased projects.'
    },
    {
        id: 'project-3',
        title: 'Decoupled Storage System',
        category: 'code',
        description: 'A CRUD Storage system with JavaScript and TypeScript FrontEnd and ARMBIAN Network Attached Storage (NAS)',
        technologies: ['Docker', 'MinIO', 'SupaBase', 'JavaScript', 'TypeScript'],
        image: getImage('Dashboard_Desktop.png'),
        gallery: [
            getImage('Dashboard_Desktop.png'),
            getImage('Admin Panel_Desktop.png'),
            getImage('Upload File Prompt_Desktop.png'),
            getImage('Delete File Prompt_Desktop.png'),
            getImage('Password Prompt Admin_Desktop.png')
        ],
        url: 'https://storage.ackteams.com',
        githubUrl: 'https://github.com/Evan52436/file-pooling',
        content: 'Decoupled architecture separation between frontend client interfaces and backend Armbian NAS minIO object storage instances.'
    },
    {
        id: 'project-4',
        title: 'Hackathon at GDG Binus',
        category: 'code',
        description: 'A Hackathon Project built while attending the event "Google Developer Group" at Binus Alam Sutera.',
        technologies: ['GDG', 'PostgreSQL', 'TypeScript', 'JavaScript'],
        image: getImage('ruanglokal_dashboard.png'),
        gallery: [
            getImage('ruanglokal_dashboard.png'),
            getImage('ruanglokal_guru.png'),
            getImage('ruanglokal_muridbaca.png'),
            getImage('ruanglokal_murid-landing.png'),
            getImage('ruanglokal_dashboard.png')
        ],
        url: 'https://hackathon.ackteams.com/',
        githubUrl: 'https://github.com/Evan52436/Hackaton_GDG-Binus',
        content: 'A helper for both student and teacher to build/play quiz'
    },
    {
        id: 'project-5',
        title: 'Truck Packer Simulator',
        category: 'code',
        description: 'A Prototype Project for a competition held by President University',
        technologies: ['Three.js', 'Flask', 'TypeScript', 'JavaScript'],
        image: getImage('PREVIEW.png'),
        gallery: [
            getImage('truckpolos.png'),
            getImage('truckisi1.png'),
            getImage('truckisi2.png'),
            getImage('truckisi3.png'),
            getImage('truckisi4.png')
        ],
        url: 'https://packer.evanpranawa.my.id/',
        githubUrl: 'https://github.com/Evan52436/truck-packer-ui',
        content: 'A Prototype Project to fit as many box into a truck.'
    },
    {
        id: 'project-6',
        title: 'Top 10 Clash of Cyberheist',
        category: 'competition',
        description: 'Positioned in top 10 on a province class Cybersecurity competition',
        technologies: ['Python', 'HackerRank', 'MyDigiLearn'],
        image: getImage('project-webapp'),
        gallery: [
            getImage('project-webapp'),
            getImage('sertifkelompok.png'),
        ],
        url: '#',
        githubUrl: 'https://github.com',
        content: 'Competed in province-level Cybersecurity challenges covering cryptography, web exploitation, and reverse engineering.'
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
        },
        {
            company: 'Praktik Kerja Lapangan (PKL) / Internship',
            role: 'Internship',
            period: 'Upcoming',
            description: 'Ongoing Internship Process at BRIN (Badan Riset dan Inovasi Nasional). Starting on January 2027 Until June 2027 (Estimated to be 6 Months)',
        },
    ],
    skills: skills
};
