import type { NavItem } from '../types';

export const app099NavItems: NavItem[] = [
    {
        label: "Katalozi",
        children: [
            { label: "Operateri", page: "katalog-operatera" },
            { label: "Korisnici", page: "katalog-korisnika" },
        ],
    },
    { 
        label: "Obrada",
        children: [
            { label: "Prava pristupa", page: "prava-pristupa" },
        ] 
    },
    { label: "Pregledi" },
    { label: "Izvješća" },
    { label: "Parametri" },
    { label: "Alati" },
    { label: "Servis" },
    { label: "Pomoć" },
];

export const app147NavItems: NavItem[] = [
    {
        label: "Katalozi",
        children: [
            {
                label: "Zakonski obrasci",
                children: [
                    {
                        label: "PR-RAS",
                        children: [{ label: "Katalog AOP-a", page: "katalog-aopa" }],
                    },
                    {
                        label: "OBVEZE",
                        children: [{ label: "Katalog AOP-a", page: "katalog-aopa-obveze" }],
                    },
                ],
            },
        ],
    },
    { label: "Obrada" },
    { label: "Pregledi" },
    { label: "Izvješća" },
    { 
        label: "Parametri",
        children: [
            { label: "Parametri aplikacije", page: "parametri-aplikacije" }
        ]
    },
    { 
        label: "Alati",
        children: [
            { label: "Inicijalno punjenje kataloga AOP-a", page: "inicijalno-punjenje-aopa" }
        ] 
    },
    { label: "Servis" },
    { label: "Pomoć" },
];

export const defaultNavItems: NavItem[] = [
    { label: "Katalozi" },
    { label: "Obrada" },
    { label: "Pregledi" },
    { label: "Izvješća" },
    { label: "Parametri" },
    { label: "Alati" },
    { label: "Servis" },
    { label: "Pomoć" },
];