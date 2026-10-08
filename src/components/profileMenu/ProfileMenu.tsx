import { Button, FormControlLabel, Menu, Radio, RadioGroup, Stack } from "@mui/material"
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLogout } from "../../api/hooks/tanstack/useLogout";
import ChevronDownIcon from '@mui/icons-material/ExpandMore';
import { useAuthContext } from "../../api/context/authContext/AuthContext";
import { translations } from "../../../i18n";

function ProfileMenu() {
    const { t, i18n } = useTranslation();
    const [anchorEl, setAnchorEl] = useState(null);
    const [value, setValue] = useState(i18n.language);
    const { user, isAuthenticated } = useAuthContext();

    function handleClick(event: any) {
        setAnchorEl(event.currentTarget); // anchor the menu to this button
    }

    function handleClose() {
        setAnchorEl(null); // close menu
    }

    function handleLanguageChange(event: string) {
        setValue(event); // anchor the menu to this button
        i18n.changeLanguage(event);
    }

    const { mutateAsync: handleLogout } = useLogout();

    return (
        <div style={{ position: "absolute", top: "0", right: "0", padding: "1rem" }}>
            <Button onClick={handleClick} aria-label={t(translations.profileMenu.expandAria)}>
                {user?.username || t(translations.profileMenu.notLoggedIn)}
                <div style={{ "translate": 102 }}></div>
                <ChevronDownIcon sx={{
                    transform: !!anchorEl ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                }} />
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <RadioGroup value={value} onChange={(e) => { handleLanguageChange(e.target.value) }} style={{ padding: "1rem" }}>
                    <FormControlLabel value="ro" control={<Radio />} label={t("profileMenu.ro")} />
                    <FormControlLabel value="en" control={<Radio />} label={t("profileMenu.en")} />
                </RadioGroup>
                <Stack>
                    {isAuthenticated && <Button onClick={() => { handleLogout(), setAnchorEl(null) }}>{t("profileMenu.logout")}</Button>}
                </Stack>

            </Menu>
        </div>
    )
}

export default ProfileMenu