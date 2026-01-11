import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ExploreIcon from '@mui/icons-material/Explore';

const HomeInfoPage = () => {
  const navigate = useNavigate();
  const commonFont = { fontFamily: '"Assistant", "Segoe UI", Arial, sans-serif' };

  return (
    <div className="home-page-container" style={commonFont}>

      <div className="table-container" style={{ textAlign: 'right', padding: '40px' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
          <HomeIcon style={{ fontSize: '40px', color: 'var(--primary-dark)' }} />
          <h2 style={{ ...commonFont, color: 'var(--primary-dark)', margin: 0 }}>ברוכים הבאים ל-GiveTech <br /> GiveTech - פלטפורמת מתנדבות</h2>
        </div>

        <p style={{ ...commonFont, fontSize: '1.2rem', color: 'var(--text-dark)', lineHeight: '1.8' }}>
          האתר שלנו מרכז את כל המתנדבות הזמינות בתחומי ההייטק והטכנולוגיה.<br />
          כאן תוכלו למצוא נשות מקצוע המעוניינות לתרום מהידע והניסיון שלהם למען הקהילה.
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '30px 0' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div className="info-card">
            <InfoIcon style={{ color: 'var(--primary-dark)' }} />
            <h3 style={commonFont}>מה המטרה?</h3>
            <p style={commonFont}>חיבור יעיל ומהיר בין מי שמחפש סיוע טכנולוגי לבין מתנדבות מנוסות.</p>
          </div>

          <div className="info-card">
            <ExploreIcon style={{ color: 'var(--primary-dark)' }} />
            <h3 style={commonFont}>איך זה עובד?</h3>
            <p style={commonFont}>חוקרים את רשימת המתנדבות, בוחנים את תחומי ההתמחות ויוצרים קשר ישיר.</p>
          </div>
        </div>

        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
          <button
            className="nav-btn active"
            style={{
              ...commonFont,
              padding: '15px 40px',
              fontSize: '18px',
              height: 'auto',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer'
            }}
            onClick={() => navigate("/list")}
          >
            התחילו לחקור את המתנדבות
          </button>
        </div>
      </div>

      <style>{`
        .home-page-container {
          max-width: 900px;
          margin: 40px auto;
          animation: fadeIn 0.5s ease;
        }
        .info-card {
          padding: 20px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-light);
          transition: transform 0.2s ease;
        }
        .info-card:hover {
          transform: translateY(-5px);
          border-color: var(--primary-light);
        }
        .info-card h3 {
          color: var(--primary-dark);
          margin: 10px 0;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default HomeInfoPage;