import { Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { useSupportSettings } from '@/hooks/admin/useSettings';

export function SettingsSupport() {
    const { supportTicket, setSupportTicket, submitTicket, isLoading, message } = useSupportSettings();

    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-200 py-4 px-6 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                    Submit a Ticket
                </h3>
            </div>

            {message && (
                <div className={`mx-6 mt-6 flex items-center gap-2 rounded-lg p-4 ${message.type === 'success' ? 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400' : 'bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400'}`}>
                    {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    {message.text}
                </div>
            )}

            <form onSubmit={submitTicket} className="p-6">
                <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">Ticket Subject</label>
                    <input
                        type="text"
                        placeholder="e.g., Feature Request, Bug Report"
                        value={supportTicket.subject}
                        onChange={(e) => setSupportTicket({ ...supportTicket, subject: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 bg-transparent py-3 px-5 font-normal outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-brand-500"
                    />
                </div>
                <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">Message</label>
                    <textarea
                        rows={4}
                        placeholder="Describe your issue or request..."
                        value={supportTicket.message}
                        onChange={(e) => setSupportTicket({ ...supportTicket, message: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 bg-transparent py-3 px-5 font-normal outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-brand-500"
                    ></textarea>
                </div>
                <button disabled={isLoading} className="flex w-full items-center justify-center rounded-lg bg-brand-500 p-3 font-medium text-white hover:bg-brand-600 hover:shadow-lg transition-all duration-300 disabled:opacity-50">
                    <Mail className="w-4 h-4 mr-2" /> Submit Ticket
                </button>
            </form>
        </div>
    );
}
