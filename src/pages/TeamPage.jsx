import React from "react";
import "../styles/TeamPage.css";
import { teamMembers, pastMembers } from "../components/teamData"; // import both lists
import { Container, Row, Col } from "react-bootstrap";

const TeamCard = ({ member }) => (
  <div className="team-card">
    <img className="team-photo" src={member.photoUrl} alt={member.name} />
    <div className="team-info">
      <h3 className="team-name">{member.name}</h3>
      <p className="team-role">{member.role}</p>
    </div>
  </div>
);

const TeamPage = () => (
  <div className="d-flex overflow-hidden bg-black">
    <div className="flex-grow-1 p-2 overflow-auto d-flex">
      <Container>
        <Row className="g-2 justify-content-center">
          <Col>
            {/* --- CURRENT TEAM --- */}
            <div
              className="team-section bg-white text-black p-3 mb-4"
              
            >
              <h2 className="team-title kyivserif mb-3">The AKULA Board</h2>
              <div className="team-grid">
                {teamMembers.map((member) => (
                  <TeamCard key={member.id} member={member} />
                ))}
              </div>
            </div>

            {/* --- PAST MEMBERS --- */}
            <div
              className="team-section bg-white text-black p-3"
            >
              <h2 className="team-title kyivserif mb-3">Past Members</h2>
              <div className="team-grid">
                {pastMembers.map((member) => (
                  <TeamCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          </Col>
          
        </Row>
      </Container>
    </div>
  </div>
);

export default TeamPage;
