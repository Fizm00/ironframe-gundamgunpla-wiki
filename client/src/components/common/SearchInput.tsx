import { Search } from 'lucide-react';

interface SearchInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    focusColorClass?: string;
}

export function SearchInput({
    value,
    onChange,
    placeholder = "SEARCH...",
    focusColorClass = "focus:border-neon-cyan focus:ring-neon-cyan text-neon-cyan"
}: SearchInputProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    // Extract color for the icon group-focus-within
    const activeColorClass = focusColorClass.split(' ').find(c => c.startsWith('text-')) || "text-neon-cyan";

    return (
        <form onSubmit={handleSubmit} className="relative group">
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full md:w-80 bg-surface/50 border border-border text-foreground font-mono py-3 pl-12 pr-4 focus:outline-none focus:ring-1 transition-all ${focusColorClass}`}
            />
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:${activeColorClass} transition-colors w-5 h-5`} />
            <button type="submit" className="hidden" />
        </form>
    );
}
