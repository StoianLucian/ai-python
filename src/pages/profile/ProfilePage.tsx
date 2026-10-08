import { Box, Toolbar } from '@mui/material'
import Sidebar from '../../components/sidebar/Sidebar'
import DailyPage from '../daily/DailyPage'

// Profile is a sidebar-driven layout; DailyPage is its default content pane.
// The sidebar lives here (not in App) so it only shows inside the profile area.
function ProfilePage() {
    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
                {/* Spacer so content clears the absolutely-positioned top-right
                    ProfileMenu button (mirrors the Sidebar's own spacer). Without
                    it the menu overlaps the header filters on narrower screens. */}
                <Toolbar />
                <DailyPage />
            </Box>
        </Box>
    )
}

export default ProfilePage
