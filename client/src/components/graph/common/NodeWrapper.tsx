import React from 'react';

type NodeWrapperProps = {
    children: React.ReactNode;
    selected?: boolean;
    onClick?: () => void;
};

export const NodeWrapper = ({ children, selected, onClick }: NodeWrapperProps) => (
    <div
        onClick={onClick}
        className={`relative transition-all duration-500 ease-out ${selected ? 'scale-110 z-50' : 'scale-100 z-10 hover:z-40 hover:scale-105'}`}
    >
        {children}
    </div>
);
