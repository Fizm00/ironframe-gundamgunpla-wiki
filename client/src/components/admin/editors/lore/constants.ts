export const SECTION_KEYS = {
    production: [
        'Model number', 'Code name', 'Type', 'Completed',
        'First deployment', 'Manufacturer', 'Operator'
    ] as const,
    development: [
        'Developed from', 'Developed into'
    ] as const,
    specifications: [
        'Crew', 'Cockpit location', 'Standard weight', 'Full weight',
        'Sensors', 'Cockpit', 'Height', 'Armor materials'
    ] as const,
    performance: [
        'Power plant', 'Power output', 'Propulsion', 'Flight system',
        'Max speed', '180° turn time', 'Thrust to weight'
    ] as const
};
