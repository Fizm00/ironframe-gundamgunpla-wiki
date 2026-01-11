import { Shield, Zap, Move, Database, TrendingUp, Users } from 'lucide-react';

export const spotlightUnits = [
    { name: "RX-78-2 GUNDAM", image: "/RX-78-2.png", quote: "The prototype that turned the tide of the One Year War." },
    { name: "ZGMF-X20A STRIKE FREEDOM", image: "/StrikeFreedom.png", quote: "A golden-jointed mobile suit tuned for ultimate mobility." },
    { name: "RX-0 UNICORN GUNDAM", image: "/Unicorn.png", quote: "The Beast of Possibility. A key to Laplace's Box." }
];

export const manufacturers = [
    "ANAHEIM ELECTRONICS", "SNRI", "GEO NIC", "ZIMMAD", "MIP", "BOUHOO", "YASHIMA", "LOHM", "ANAHEIM", "SNRI", "GEO NIC", "ZIMMAD", "MIP"
];

export const timelinePeriods = [
    {
        id: 'uc',
        year: 'U.C. 0079',
        name: 'UNIVERSAL CENTURY',
        desc: 'The dawn of mobile suits. The One Year War changed humanity forever.',
        color: 'from-neon-blue to-neon-cyan',
        borderColor: 'border-neon-blue/50',
        shadow: 'shadow-neon-blue/20'
    },
    {
        id: 'ce',
        year: 'C.E. 70',
        name: 'COSMIC ERA',
        desc: 'Naturals vs Coordinators. A war driven by genetic destiny.',
        color: 'from-neon-blue to-neon-cyan',
        borderColor: 'border-neon-blue/50',
        shadow: 'shadow-neon-blue/20'
    },
    {
        id: 'pd',
        year: 'P.D. 323',
        name: 'POST DISASTER',
        desc: '300 years after the Calamity War. Iron and blood fuel the revolution.',
        color: 'from-neon-blue to-neon-cyan',
        borderColor: 'border-neon-blue/50',
        shadow: 'shadow-neon-blue/20'
    },
    {
        id: 'as',
        year: 'A.S. 122',
        name: 'AD STELLA',
        desc: 'A new frontier where corporations rule space and witches are cursed.',
        color: 'from-neon-blue to-neon-cyan',
        borderColor: 'border-neon-blue/50',
        shadow: 'shadow-neon-blue/20'
    }
];

export const rx78Specs = [
    { icon: Shield, label: 'ARMOR COMPOSITION', value: 'LUNA TITANIUM ALLOY', desc: 'High-tensile strength material capable of withstanding direct projectile impact.' },
    { icon: Zap, label: 'POWER OUTPUT', value: '1,380 kW', desc: 'Minovsky Ultracompact Fusion Reactor providing localized I-Field support.' },
    { icon: Move, label: 'THRUSTER OUTPUT', value: '55,500 kg', desc: 'Dual-mount backpack system with independent vernier control.' },
    { icon: Database, label: 'LEARNING COMPUTER', value: 'IC-N80', desc: 'Self-adapting pilot support system with accumulating combat data.' },
];

export const bentoFeatures = [
    {
        title: "Gunpla Database",
        desc: "Complete catalog of commercial kits from HG to PG.",
        icon: Database,
        color: "text-neon-blue",
        bg: "bg-neon-blue/10",
        border: "border-neon-blue/20",
        colSpan: "col-span-12 md:col-span-8",
        link: "/gunpla",
        image: "/assets/showcase/Showcase2.png"
    },
    {
        title: "Faction Intel",
        desc: "Deep dives into military history.",
        icon: Shield,
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
        colSpan: "col-span-12 md:col-span-4",
        link: "/factions",
        image: "/assets/showcase/Showcase1.png"
    },
    {
        title: "Pilot Profiles",
        desc: "ACES of the One Year War.",
        icon: Users,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        colSpan: "col-span-12 md:col-span-4",
        link: "/pilots",
        image: "/assets/showcase/Showcase3.png"
    },
    {
        title: "Mobile Suit Catalog",
        desc: "Track kit prices and rarity in real-time.",
        icon: TrendingUp,
        color: "text-orange-400",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20",
        colSpan: "col-span-12 md:col-span-8",
        link: "/mobile-suits",
        image: "/assets/showcase/Showcase4.png"
    }
];

export const showcaseScreenshots = [
    '/assets/showcase/Showcase1.png',
    '/assets/showcase/Showcase2.png',
    '/assets/showcase/Showcase3.png',
    '/assets/showcase/Showcase4.png',
    '/assets/showcase/Showcase5.png',
    '/assets/showcase/Showcase6.png',
];
