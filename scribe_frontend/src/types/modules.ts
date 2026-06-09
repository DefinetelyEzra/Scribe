export type ThemeName = 'spirit' | 'tactical' | 'sketch' | 'ink';

export interface ModuleControl {
    id: string;
    label: string;
    type: 'slider' | 'select' | 'toggle' | 'color';
    defaultValue: number | string | boolean;
    min?: number;
    max?: number;
    step?: number;
    options?: { value: string; label: string }[];
}

export interface ScribeModule {
    id: string;
    name: string;
    description: string;
    icon: string;
    controls: ModuleControl[];
    render: (params: Record<string, unknown>, theme: ThemeName) => React.ReactNode;
}