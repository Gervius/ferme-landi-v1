import { Egg, Bird, PiggyBank, CircleHelp } from 'lucide-react';

export const generationStrategy = {
    pondeuse: { label: 'Pondeuses', Icon: Egg, colorClass: 'text-primary' },
    chair: { label: 'Poulets de chair', Icon: Bird, colorClass: 'text-secondary' },
    porc: { label: 'Porcins', Icon: PiggyBank, colorClass: 'text-accent' },
} as const;

export const getGenerationDisplay = (type: string) => {
    return generationStrategy[type as keyof typeof generationStrategy] || { 
        label: type, 
        Icon: CircleHelp, 
        colorClass: 'text-muted-foreground' 
    };
};