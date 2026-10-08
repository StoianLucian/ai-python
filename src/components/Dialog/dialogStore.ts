import type { ReactNode } from 'react';

export type ShowModalOptions = {
    title?: ReactNode
    content: ReactNode
    cancelLabel?: string
    submitLabel?: string
    submitColor?: 'primary' | 'error' | 'success' | 'warning' | 'info' | 'secondary'
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    onSubmit: () => void | Promise<void>
}

type DialogState = {
    options: ShowModalOptions | null
    isPending: boolean
}

let state: DialogState = { options: null, isPending: false };
const listeners = new Set<() => void>();

function setState(next: Partial<DialogState>) {
    state = { ...state, ...next };
    listeners.forEach((listener) => listener());
}

export const dialog = {
    show(options: ShowModalOptions) {
        setState({ options, isPending: false });
    },
    close() {
        if (state.isPending) return;
        setState({ options: null });
    },
    async submit() {
        const { options } = state;
        if (!options) return;
        try {
            setState({ isPending: true });
            await options.onSubmit();
            setState({ options: null, isPending: false });
        } catch {
            setState({ isPending: false });
        }
    },
    subscribe(listener: () => void) {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    },
    getSnapshot() {
        return state;
    },
};
