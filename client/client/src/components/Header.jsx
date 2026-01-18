import { useNavigate, useLocation } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { Typography, Stack } from "@mui/material"

const Header = ({ user, imgLoaded, setImgLoaded, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const commonFont = { fontFamily: '"Assistant", "Segoe UI", Arial, sans-serif' };

  const handleLogoutClick = () => {
    onLogout();
    navigate("/");
  };

  const renderUserAvatar = () => {
    if (!imgLoaded && user?.picture) {
      return <div className="user-avatar-placeholder" />
    }

    if (user?.picture) {
      return (
        <img
          src={user.picture || "/placeholder.svg"}
          alt={`תמונת פרופיל של ${user.name}`}
          className="user-avatar"
          style={{ opacity: imgLoaded ? 1 : 0 }}
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            e.target.style.display = "none"
            setImgLoaded(true)
          }}
          referrerPolicy="no-referrer"
        />
      )
    }

    return (
      <div className="user-avatar-initial" aria-label={`אות ראשונה של ${user?.name || "משתמש"}`}>
        {user?.name?.charAt(0).toUpperCase() || "?"}
      </div>
    )
  }

  return (
    <header className="header-bar" role="banner" style={commonFont}>

      <div className="user-info">
        {renderUserAvatar()}
        <span className="user-name">
          שלום, <strong>{user?.name || "משתמש"}</strong>
        </span>
      </div>

      <nav className="nav-buttons" role="navigation" aria-label="תפריט ניווט ראשי">
        <button
          className={`nav-btn button ${location.pathname === "/home" ? "active" : ""}`}
          onClick={() => navigate("/home")}
          aria-current={location.pathname === "/home" ? "page" : undefined}
        >
          <HomeIcon style={{ marginLeft: "5px", fontSize: "20px" }} />
          בית
        </button>

        <button
          className={`nav-btn button ${location.pathname === "/volunteersTable" ? "active" : ""}`}
          onClick={() => navigate("/volunteersTable")}
          aria-current={location.pathname === "/list" ? "page" : undefined}
        >
          <MenuIcon style={{ marginLeft: "5px", fontSize: "20px" }} />
          רשימת המתנדבות
        </button>
      </nav>

      <Stack direction="xs='row', md='row-reverse'" alignItems="center" spacing={2}>
        <button onClick={handleLogoutClick} className="logout-btn" aria-label="התנתקות מהמערכת" style={{ ...commonFont, margin: 0 }}>
          <LogoutIcon style={{ marginLeft: "5px", fontSize: "20px" }} />
          התנתקות
        </button>

        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          onClick={() => navigate("/home")}
          sx={{ cursor: 'pointer', pr: 2, pl: 1, mr: 1 }}
        >
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#1E293B', letterSpacing: '-0.5px', fontSize: '1.2rem', paddingLeft: "5px" }}>
            GiveTech
          </Typography>
          <AutoAwesomeIcon sx={{ color: '#007AFF', fontSize: 24 }} />
        </Stack>
      </Stack>

    </header>
  )
}

export default Header