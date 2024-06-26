import React from 'react';
import { Table } from 'react-bootstrap';
import styled from 'styled-components';

const MilestoneTable = ({ milestones, title = 'Milestones' }) => {
  const TableHeader = styled.th`
    background: #27aab9 !important;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    color: #ffffff;
  `;

  const TableData = styled.td``;

  const Key = styled.div`
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    color: var(--proposal-nav-color);
  `;

  const Value = styled.div`
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;
    color: var(--proposal-nav-color);
  `;

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <TableHeader>{title}</TableHeader>
        </tr>
      </thead>
      <tbody>
        {milestones?.map((milestone, index) => (
          <tr key={index}>
            <TableData>
              <Key>{milestone.name || 'N/A'}</Key>
              <Value>`{milestone.duration || 'N/A'} months`</Value>
            </TableData>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default MilestoneTable;
