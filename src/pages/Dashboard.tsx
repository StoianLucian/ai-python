import { Box, Typography } from "@mui/material";
import type { SvgIconComponent } from "@mui/icons-material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { APP_PATHS } from "../routing/routes";
import { TranslationKey } from "../../i18n";
import { useAuthContext } from "../api/context/authContext/AuthContext";

type CardTheme = { base: string; dark: string };

type DashboardItem = {
    title: string;
    route: string;
    icon: SvgIconComponent;
    theme: CardTheme;
};

const items: DashboardItem[] = [
    { title: "home", route: APP_PATHS.HOME, icon: HomeRoundedIcon, theme: { base: "#12876E", dark: "#0E6F5B" } },
    { title: "BOT", route: `${APP_PATHS.CHAT}/new`, icon: SmartToyRoundedIcon, theme: { base: "#E6B34D", dark: "#B8860B" } },
    { title: "profile", route: APP_PATHS.PROFILE, icon: PersonRoundedIcon, theme: { base: "#A78BFA", dark: "#7C3AED" } },
    { title: "settings", route: APP_PATHS.SETTINGS, icon: SettingsRoundedIcon, theme: { base: "#60A5FA", dark: "#1E40AF" } },
];

function DashboardCard({ item, featured }: { item: DashboardItem; featured: boolean }) {
    const { t } = useTranslation();
    const title = t(`${TranslationKey.DASHBOARD}.${item.title}`);
    const description = t(`${TranslationKey.DASHBOARD}.${item.title}Description`);
    const CardIcon = item.icon;

    return (
        <Link to={item.route} className="group block">
            <Box
                className="relative flex h-64 flex-col overflow-hidden rounded-2xl p-6 transition-shadow"
                sx={
                    featured
                        ? {
                            color: "#fff",
                            background: `linear-gradient(135deg, ${item.theme.base} 0%, ${item.theme.dark} 100%)`,
                            boxShadow: "0 12px 30px -12px rgba(14,111,91,0.55)",
                        }
                        : {
                            backgroundColor: "#fff",
                            boxShadow: "inset 0 0 0 1px #ECEAE4",
                            "&:hover": { boxShadow: "inset 0 0 0 1px #ECEAE4, 0 12px 30px -14px rgba(0,0,0,0.25)" },
                        }
                }
            >
                <CardIcon
                    aria-hidden
                    className="pointer-events-none absolute -bottom-6 -right-4 transition-transform group-hover:scale-105"
                    sx={{
                        fontSize: 180,
                        color: featured ? "rgba(255,255,255,0.18)" : item.theme.base,
                        opacity: featured ? 1 : 0.14,
                    }}
                />

                <Box className="flex items-start justify-end">
                    <CardIcon sx={{ fontSize: 32, color: featured ? "#fff" : item.theme.dark }} />
                </Box>

                <Box className="mt-4">
                    <Typography variant="h6" fontWeight={700} className="leading-tight">
                        {title}
                    </Typography>
                    <Typography
                        variant="body2"
                        className="mt-2 max-w-[16rem]"
                        sx={{ color: featured ? "rgba(255,255,255,0.85)" : "text.secondary" }}
                    >
                        {description}
                    </Typography>
                </Box>

                <Box className="relative mt-auto">
                    <ArrowForwardIcon
                        className="transition-transform group-hover:translate-x-1"
                        sx={{ color: featured ? "#fff" : "#1a1a1a" }}
                    />
                </Box>
            </Box>
        </Link>
    );
}

function Dashboard() {
    const { t } = useTranslation();
    const { user } = useAuthContext();

    return (
        <Box className="flex min-h-screen w-full flex-col items-center justify-center bg-[#FAF9F6] px-6 py-10 sm:px-10">
            <Box className="w-full max-w-5xl">
                <Typography variant="h4" fontWeight={800} className="mb-8">
                    {t(`${TranslationKey.DASHBOARD}.greeting`, { name: user?.username ?? "" }).replace(", !", "!")}
                </Typography>

                <Box className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item, index) => (
                        <DashboardCard key={item.title} item={item} featured={index % 2 === 0} />
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

export default Dashboard;
