import { List, ListItemButton, ListItemText, Paper, Popper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../i18n';

type MentionItem = {
    id: string;
    label: string;
    slug: string
};

type MentionContainerProps = {
    anchor: any;
    items: MentionItem[] | null;
    onSelect: (item: MentionItem) => void;
    firstItemRef: any;
    onEscape?: () => void;
};

function MentionContainer({ anchor, items, onSelect, firstItemRef, onEscape }: MentionContainerProps) {
    const { t } = useTranslation();

    // Move focus between items with the arrow keys once the list is focused.
    // Enter/Space selection is handled by ListItemButton (a MUI ButtonBase).
    const handleKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
        if (event.key === "Escape") {
            event.preventDefault();
            onEscape?.();
            return;
        }

        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

        const buttons = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(".MuiListItemButton-root")
        );
        if (buttons.length === 0) return;

        event.preventDefault();

        const currentIndex = buttons.indexOf(document.activeElement as HTMLElement);
        const delta = event.key === "ArrowDown" ? 1 : -1;
        const nextIndex = (currentIndex + delta + buttons.length) % buttons.length;

        buttons[nextIndex]?.focus();
    };

    return (
        <Popper
            open={!!anchor}
            anchorEl={anchor}
            placement="top"
            modifiers={[
                {
                    name: "offset",
                    options: {
                        offset: [0, 50], // x, y
                    },
                },
            ]}
        >
            <Paper>
                <List onKeyDown={handleKeyDown} className='max-h-80 min-w-50 overflow-auto h-min-30'>
                    {items?.length === 0 ? (
                        <ListItemButton disabled>
                            <ListItemText primary={t(translations.aiChat.noItemsFound)} />
                        </ListItemButton>
                    ) : (
                        items?.map((item, index) => (
                            <ListItemButton
                                key={item.id}
                                onClick={() => onSelect(item)}
                                ref={index === 0 ? firstItemRef : null}
                            >
                                <ListItemText>
                                    {item.label}
                                </ListItemText>
                            </ListItemButton>
                        ))
                    )}
                </List>
            </Paper>
        </Popper>
    )
}

export default MentionContainer