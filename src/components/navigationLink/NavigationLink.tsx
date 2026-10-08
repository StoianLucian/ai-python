
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";

type LinkProps = {
    to: string
    linkText: string
}

function NavigationLink({ to, linkText }: LinkProps) {
    return (
        <Link component={RouterLink} to={to}>
            {linkText}
        </Link>
    )
}

export default NavigationLink