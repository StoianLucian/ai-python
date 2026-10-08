import { useSyncExternalStore } from 'react';
import Dialog from './Dialog';
import { dialog } from './dialogStore';

/**
 * Mounted once at the app root. Subscribes to the external dialog store and is
 * the only component that re-renders when a dialog opens/closes. Trigger a
 * dialog from anywhere (components or plain modules) via `dialog.show({...})`.
 */
export default function DialogHost() {
    const { options, isPending } = useSyncExternalStore(dialog.subscribe, dialog.getSnapshot);

    if (!options) return null;

    return (
        <Dialog
            open={true}
            onClose={dialog.close}
            onSubmit={dialog.submit}
            title={options.title}
            content={options.content}
            cancelLabel={options.cancelLabel}
            submitLabel={options.submitLabel}
            submitColor={options.submitColor}
            maxWidth={options.maxWidth}
            isPending={isPending}
        />
    );
}
