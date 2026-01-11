
import type { UseFormRegister, Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface AdminSectionProps {
    title: string;
    children: React.ReactNode;
}

export function AdminSection({ title, children }: AdminSectionProps) {
    return (
        <div className="bg-gray-50 dark:bg-gray-950 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
            <h2 className="text-xl font-orbitron text-gray-900 dark:text-white mb-4">{title}</h2>
            {children}
        </div>
    );
}

interface AdminInputProps<T extends FieldValues> {
    label: string;
    name: Path<T>;
    register: UseFormRegister<T>;
    rules?: RegisterOptions<T>;
    placeholder?: string;
    className?: string;
    fullWidth?: boolean;
}

export function AdminInput<T extends FieldValues>({ label, name, register, rules, placeholder, className, fullWidth = true }: AdminInputProps<T>) {
    return (
        <div className={fullWidth ? 'w-full' : ''}>
            <label className="block text-xs font-mono text-gray-500 dark:text-gray-400 mb-1 uppercase">{label}</label>
            <input
                {...register(name, rules)}
                className={`w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-2 focus:border-brand-500 outline-none text-gray-900 dark:text-white ${className || ''}`}
                placeholder={placeholder}
            />
        </div>
    );
}

interface AdminTextAreaProps<T extends FieldValues> extends Omit<AdminInputProps<T>, 'className'> {
    heightClass?: string;
}

export function AdminTextArea<T extends FieldValues>({ label, name, register, rules, placeholder, heightClass = "h-24" }: AdminTextAreaProps<T>) {
    return (
        <div>
            <label className="block text-xs font-mono text-gray-500 dark:text-gray-400 mb-1 uppercase">{label}</label>
            <textarea
                {...register(name, rules)}
                className={`w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-2 focus:border-brand-500 outline-none text-gray-900 dark:text-white ${heightClass}`}
                placeholder={placeholder}
            />
        </div>
    );
}

interface AdminListInputProps<T extends FieldValues> {
    label: string;
    name: Path<T>;
    control: Control<T>;
    description?: string;
}

export function AdminListInput<T extends FieldValues>({ label, name, control, description }: AdminListInputProps<T>) {
    return (
        <div className="mb-6">
            <label className="block text-xs font-mono text-brand-500 mb-2 uppercase font-bold">{label}</label>
            <Controller
                control={control}
                name={name}
                render={({ field: { value, onChange } }) => (
                    <textarea
                        className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-3 h-32 text-sm focus:border-brand-500 outline-none font-mono text-gray-900 dark:text-white"
                        placeholder={`Enter ${label.toLowerCase()}, one per line...`}
                        value={Array.isArray(value) ? value.join('\n') : value}
                        onChange={(e) => onChange(e.target.value.split('\n').filter((s: string) => s.trim()))}
                    />
                )}
            />
            {description && <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
        </div>
    );
}

interface AdminImageUploadProps {
    currentImageUrl?: string;
    selectedImage: File | null;
    onImageSelect: (file: File) => void;
}

export function AdminImageUpload({ currentImageUrl, selectedImage, onImageSelect }: AdminImageUploadProps) {
    return (
        <div className="md:col-span-2">
            <label className="block text-xs font-mono text-gray-500 dark:text-gray-400 mb-2">Display Image</label>
            <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700">
                {currentImageUrl && !selectedImage && (
                    <div className="relative group">
                        <img src={currentImageUrl} alt="Current" className="w-20 h-20 object-cover rounded border border-gray-200 dark:border-gray-600" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-white">Current</div>
                    </div>
                )}
                <div className="flex-1">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files?.[0]) {
                                onImageSelect(e.target.files[0]);
                            }
                        }}
                        className="block w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-brand-500/10 file:text-brand-500
                            hover:file:bg-brand-500/20 cursor-pointer"
                    />
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2">
                        Selected: {selectedImage ? selectedImage.name : 'No file selected'}
                    </p>
                </div>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Standard 16:9 or 4:3 aspect ratio recommended.</p>
        </div>
    );
}
