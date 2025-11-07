import type { NavItem } from '../types';

export const app099NavItems: NavItem[] = [
    {
        label: "Katalozi",
        children: [
            { label: "Operateri", page: "katalog-operatera" },
        ],
    },
    { label: "Obrada" },
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
                ],
            },
        ],
    },
    { label: "Obrada" },
    { label: "Pregledi" },
    { label: "Izvješća" },
    { label: "Parametri" },
    { label: "Alati" },
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