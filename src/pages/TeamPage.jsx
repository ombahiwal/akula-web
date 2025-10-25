import React from "react";
import "../styles/teampage.css";
// import {  pastMembers } from "../components/teamData"; // import both lists
import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useState} from "react";
import { getContent } from "../api/cfclient";

const TeamCard = ({ member }) => (
  <div className="team-card">
    <img className="team-photo" src={member.fields.memberImage} />
    <div className="team-info">
      <a href={member.fields.memberLink}><h3 className="team-name">{member.fields.memberNameEn}</h3></a>
      <a href={"mailto:"+(member.fields.memberEmail)}><p className="team-role">{member.fields.memberRole}</p></a>
    </div>
  </div>
);

const TeamPage = () => {
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
  
  return(
  <div className="d-flex overflow-hidden bg-black">
    <div className="flex-grow-1 p-2 overflow-auto d-flex">
      <Container>
        <Row className="g-2 justify-content-center">
          
          <Col>
            {/* --- CURRENT TEAM --- */}
            <div
              className="team-section bg-white text-black p-3 mb-4"
            >
              
              <div className="team-grid">
                 <div className="team-card-heading">
                  <div className="team-info">
                    <h2 className="team-title kyivserif mb-3">The AKULA Board</h2>
                  </div>
                </div>
                {data && data['boardMembers'].map((member) => {
                  
                      if (member.fields.pastMember == false){
                        return(<TeamCard key={member.id} member={member} />)
                      };
                    })}

                {/* {data && data['boardMembers'].map((member) => (
                  <TeamCard key={member.id} member={member} />
                ))} */}
              </div>
            </div>

            {/* --- PAST MEMBERS --- */}
            <div
              className="team-section bg-white text-black p-3"
            >
              
              <div className="team-grid">
                <div className="team-card-heading">
                  <div className="team-info">
                    <h2 className="team-title kyivserif mb-3">Past Members</h2>
                  </div>
                </div>
                  {data && data['boardMembers'].map((member) => {
                      if (member.fields.pastMember == true){
                        return(<TeamCard key={member.id} member={member} />)
                      };
                    })}
              </div>
            </div>
          </Col>
          
        </Row>
      </Container>
    </div>
  </div>);
}

export default TeamPage;
