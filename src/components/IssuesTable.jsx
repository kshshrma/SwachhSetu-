import React, { useState } from 'react';

const mockIssues = [
  {
    id: 1,
    district: 'Central Delhi',
    state: 'Delhi',
    mla: 'Arvind Kejriwal',
    status: 'Unsolved',
    image: 'https://images.unsplash.com/photo-1598409395914-f442b5887259?auto=format&fit=crop',
    issueType: 'Garbage',
    severity: 'High',
    reports: 5,
  },
  {
    id: 2,
    district: 'Gurugram',
    state: 'Haryana',
    mla: 'Manohar Lal Khattar',
    status: 'Solved',
    image: 'https://images.unsplash.com/photo-1549419163-1463e2a2221b?auto=format&fit=crop',
    issueType: 'Potholes',
    severity: 'Medium',
    reports: 3,
  },
  {
    id: 3,
    district: 'Noida',
    state: 'Uttar Pradesh',
    mla: 'Pankaj Singh',
    status: 'Unsolved',
    image: 'https://images.unsplash.com/photo-1582234032486-13d853e390c5?auto=format&fit=crop',
    issueType: 'Water Clogging',
    severity: 'Low',
    reports: 1,
  },
  {
    id: 4,
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    mla: 'Rajnath Singh',
    status: 'Unsolved',
    image: 'https://images.unsplash.com/photo-1581457176214-41d3e8392182?auto=format&fit=crop',
    issueType: 'Construction Debris',
    severity: 'High',
    reports: 4,
  },
  {
    id: 5,
    district: 'Jaipur',
    state: 'Rajasthan',
    mla: 'Diya Kumari',
    status: 'Unsolved',
    image: 'https://images.unsplash.com/photo-1581457176214-41d3e8392182?auto=format&fit=crop',
    issueType: 'Garbage',
    severity: 'Medium',
    reports: 2,
  },
  {
    id: 6,
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    mla: 'S. Satyanarayana',
    status: 'Solved',
    image: 'https://images.unsplash.com/photo-1549419163-1463e2a2221b?auto=format&fit=crop',
    issueType: 'Potholes',
    severity: 'High',
    reports: 5,
  },
];

const IssuesTable = () => {
  const [issues, setIssues] = useState(mockIssues);
  const [filterState, setFilterState] = useState('All');
  const [filterIssueType, setFilterIssueType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const handleToggleStatus = (id) => {
    setIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue.id === id
          ? { ...issue, status: issue.status === 'Unsolved' ? 'Solved' : 'Unsolved' }
          : issue
      )
    );
  };

  const filteredIssues = issues.filter((issue) => {
    // Check if the issue matches all three filter criteria
    const stateMatch = filterState === 'All' || issue.state === filterState;
    const issueTypeMatch = filterIssueType === 'All' || issue.issueType === filterIssueType;
    const statusMatch = filterStatus === 'All' || issue.status === filterStatus;

    return stateMatch && issueTypeMatch && statusMatch;
  });

  return (
    <section className="mla-table-section" id="issues">
      <h2>Reported Issues</h2>
      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="state-filter">Filter by State:</label>
          <select
            id="state-filter"
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="issue-filter-select"
          >
            <option value="All">All States</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Rajasthan">Rajasthan</option>
            
            <option value="Delhi">Delhi</option>
            
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="issue-type-filter">Filter by Issue Type:</label>
          <select
            id="issue-type-filter"
            value={filterIssueType}
            onChange={(e) => setFilterIssueType(e.target.value)}
            className="issue-filter-select"
          >
            <option value="All">All Types</option>
            <option value="Garbage">Garbage</option>
            <option value="Potholes">Potholes</option>
            <option value="Construction Debris">Construction Debris</option>
            <option value="Water Clogging">Water Clogging</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="issue-filter-select"
          >
            <option value="All">All</option>
            <option value="Solved">Solved</option>
            <option value="Unsolved">Unsolved</option>
          </select>
        </div>
      </div>
      <div className="table-container-div">
        <table className="issues-data-table">
          <thead>
            <tr>
              {/* <th className="table-header-cell">S.No</th> */}
              <th className="table-header-cell">District, State</th>
              <th className="table-header-cell">MLA</th>
              <th className="table-header-cell">Issue Status</th>
              {/* <th className="table-header-cell">Issues (Image)</th> */}
              <th className="table-header-cell">Issue Type</th>
              {/* <th className="table-header-cell">Severity</th>
              <th className="table-header-cell">Reports</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredIssues.map((issue) => (
              <tr key={issue.id} className="table-data-row">
                {/* <td>{issue.id}</td> */}
                <td>{issue.district}, {issue.state}</td>
                <td>{issue.mla}</td>
                <td>
                  <button
                    onClick={() => handleToggleStatus(issue.id)}
                    className={`status-toggle-button ${issue.status.toLowerCase()}-status`}
                  >
                    {issue.status}
                  </button>
                </td>
                {/* <td>
                  <img src={issue.image} alt={issue.issueType} className="issue-image-cell" />
                </td> */}
                <td>{issue.issueType}</td>
                {/* <td>{issue.severity}</td>
                <td>{issue.reports}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default IssuesTable;