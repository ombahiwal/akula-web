import React from "react";
import "../styles/teampage.css";
import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useState} from "react";
import { getContent } from "../api/cfclient";
import { useTranslation } from 'react-i18next';

const TeamCard = ({ member }) => (
  <div className="team-card">
    <div className="team-photo-wrapper">
      <img className="team-photo" src={member.fields.memberImage} alt={member.fields.memberNameEn} />
      <div className="team-photo-overlay"></div>
    </div>
    <div className="team-info">
      <a href={member.fields.memberLink || "#"} className="team-name-link">
        <h3 className="team-name">{member.fields.memberNameEn}</h3>
      </a>
      <a href={"mailto:"+(member.fields.memberEmail)} className="team-role-link">
        <p className="team-role">{member.fields.memberRole}</p>
      </a>
    </div>
  </div>
);

const TeamPage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState({boardMembers:[]});
   useEffect(() => {
      getContent("info_section").then((data_resp)  => {
              setData(data_resp);
              window.scrollTo({
                top: 0,
                behavior: "smooth", // or "auto"
              });
          });
    }, []);
  
  const currentMembers = data?.boardMembers?.filter(member => member.fields.pastMember === false) || [];
  const pastMembers = data?.boardMembers?.filter(member => member.fields.pastMember === true) || [];

  return(
  <div className="d-flex overflow-hidden bg-black">
    <div className="flex-grow-1 p-2 overflow-auto bg-white">
      <Container>
        <Row className="g-2 justify-content-center">
          <Col>
            {/* --- CURRENT TEAM --- */}
            <div className="team-section bg-white text-black mb-4">
              <div className="team-section-header">
                <h2 className="team-title kyivserif mb-3">{t('team.title')}</h2>
                <p className="team-section-subtitle">{t('team.subtitle')}</p>
              </div>
              
              {currentMembers.length > 0 ? (
                <Row className="g-3">
                  {currentMembers.map((member) => (
                    <Col key={member.id} xs={6} sm={6} md={6} lg={4} xl={3}>
                      <TeamCard member={member} />
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="team-empty">
                  <p>{t('team.noMembers')}</p>
                </div>
              )}
            </div>

            {/* --- PAST MEMBERS --- */}
            {pastMembers.length > 0 && (
              <div className="team-section bg-white text-black">
                <div className="team-section-header">
                  <h2 className="team-title kyivserif mb-3">{t('team.pastMembersTitle')}</h2>
                  <p className="team-section-subtitle">{t('team.pastMembersSubtitle')}</p>
                </div>
                
                <Row className="g-3">
                  {pastMembers.map((member) => (
                    <Col key={member.id} xs={6} sm={6} md={6} lg={4} xl={3}>
                      <TeamCard member={member} />
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  </div>);
}

export default TeamPage;
