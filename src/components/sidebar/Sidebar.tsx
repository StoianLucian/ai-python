import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SummarizeRoundedIcon from "@mui/icons-material/SummarizeRounded";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../api/context/authContext/AuthContext";
import { APP_PATHS } from "../../routing/routes";
import { translations } from "../../../i18n";

export const SIDEBAR_WIDTH = 220;

type NavItem = {
    labelKey: string;
    to: string;
    icon: typeof SummarizeRoundedIcon;
};

const navItems: NavItem[] = [
    { labelKey: translations.sidebar.home, to: APP_PATHS.HOME, icon: HomeRoundedIcon },
    { labelKey: translations.sidebar.summary, to: APP_PATHS.PROFILE, icon: SummarizeRoundedIcon },
];

function Sidebar() {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuthContext();
    const { pathname } = useLocation();

    if (!isAuthenticated) return null;

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: SIDEBAR_WIDTH,
                flexShrink: 0,
                "& .MuiDrawer-paper": { width: SIDEBAR_WIDTH, boxSizing: "border-box" },
            }}
        >
            {/* Spacer so nav items clear the top-right ProfileMenu button row. */}
            <Toolbar />
            <List>
                {navItems.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                        <ListItemButton
                            key={item.to}
                            component={RouterLink}
                            to={item.to}
                            selected={pathname === item.to}
                        >
                            <ListItemIcon>
                                <ItemIcon />
                            </ListItemIcon>
                            <ListItemText primary={t(item.labelKey)} />
                        </ListItemButton>
                    );
                })}
            </List>
        </Drawer>
    );
}

export default Sidebar;
