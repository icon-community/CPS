import React from 'react';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import styles from './MilestoneTest.module.scss';
import './style.css';
import { FaCircle, FaStar } from 'react-icons/fa';
import { AiFillStar, AiFillCiCircle } from 'react-icons/ai';
import { MdStars } from 'react-icons/md';

function LeftTabsExample() {
  const milestones = [
    {
      name: 'Name 1',
      description:
        'description1description1description1description1description1description1description1description1description1description1description1',
    },
    {
      name: 'Name 2',
      description:
        'description2description2description2description2description2description2description2description2description2description2description2',
    },
    {
      name: 'Name 3',
      description:
        'description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3description3',
    },
  ];
  return (
    <div className='container border border-dark mt-3'>
      <div className={styles.heading}>MILESTONES</div>
      <Tab.Container id='left-tabs-example' defaultActiveKey='tab1'>
        <Row>
          {/* left column */}
          <Col sm={12} md={3} className={styles.leftCol}>
            <Nav
              variant='pills'
              contentClassName={styles['tab']}
              className={styles.flexColumn}
            >
              {milestones.map((milestone, index) => (
                <Nav.Item key={index} className={styles.navItem}>
                  <Nav.Link
                    eventKey={`tab${index + 1}`}
                    className={styles.rectangle}
                  >
                    <MdStars className={styles.icon} />
                    {milestone.name} {/* Display milestone name here */}
                    <h6 className={styles.smallText}>Milestone {index + 1}</h6>
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Col>
          {/* right column */}
          <Col sm={12} md={9} className={styles.rightCol}>
            <Tab.Content>
              <div className={styles.description}>Description</div>

              {milestones.map((milestone, index) => (
                <Tab.Pane
                  key={index}
                  eventKey={`tab${index + 1}`}
                  className={styles.descContent}
                >
                  {milestone.description}
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}

export default LeftTabsExample;
