import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [systemRunning, setSystemRunning] = useState(false);
  const [agentLogs, setAgentLogs] = useState([]);

  // Job Postings State
  const [jobPostings, setJobPostings] = useState([
    { id: 1, title: 'Senior React Developer', location: 'Remote', salary: '$120k-150k', status: 'active', description: 'Looking for an experienced React developer to join our team.', requirements: 'React, Node.js, TypeScript' },
    { id: 2, title: 'Product Manager', location: 'San Francisco', salary: '$140k-180k', status: 'active', description: 'Lead product strategy and development.', requirements: 'Product strategy, Analytics, Leadership' },
    { id: 3, title: 'Data Scientist', location: 'New York', salary: '$130k-160k', status: 'active', description: 'Analyze data to drive business insights.', requirements: 'Python, ML, Statistics' }
  ]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobForm, setJobForm] = useState({
    title: '',
    location: '',
    salary: '',
    description: '',
    requirements: '',
    status: 'active'
  });

  // Application State
  const [applicationForm, setApplicationForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    coverLetter: '',
    resume: null
  });
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  // Candidates State
  const [candidates, setCandidates] = useState([
    { 
      id: 1, 
      name: 'Sarah Chen', 
      role: 'Senior Developer', 
      score: 92, 
      status: 'screening',
      location: 'Seattle, WA',
      experience: '7 years',
      skills: ['React', 'Node.js', 'Python', 'AWS'],
      email: 'sarah.chen@email.com',
      appliedDate: '2025-08-20',
      emailSent: false
    },
    { 
      id: 2, 
      name: 'Marcus Johnson', 
      role: 'Product Manager', 
      score: 88, 
      status: 'engagement',
      location: 'Austin, TX',
      experience: '5 years',
      skills: ['Strategy', 'Analytics', 'Agile'],
      email: 'marcus.j@email.com',
      appliedDate: '2025-08-19',
      emailSent: true
    },
    { 
      id: 3, 
      name: 'Elena Rodriguez', 
      role: 'Data Scientist', 
      score: 95, 
      status: 'scheduling',
      location: 'Boston, MA',
      experience: '6 years',
      skills: ['Python', 'ML', 'TensorFlow'],
      email: 'elena.rodriguez@email.com',
      appliedDate: '2025-08-18',
      emailSent: true
    }
  ]);

  const agents = [
    { name: 'Sourcing Agent', status: systemRunning ? 'active' : 'idle', activity: 'Found 15 new candidates' },
    { name: 'Screening Agent', status: systemRunning ? 'processing' : 'idle', activity: 'Analyzing 8 resumes' },
    { name: 'Email Bot', status: systemRunning ? 'active' : 'idle', activity: 'Sent 12 automated emails' },
    { name: 'Scheduling Agent', status: systemRunning ? 'active' : 'idle', activity: 'Scheduled 3 interviews' }
  ];

  // Auto-send emails to new candidates
  useEffect(() => {
    if (systemRunning) {
      const interval = setInterval(() => {
        setCandidates(prev => prev.map(candidate => {
          if (!candidate.emailSent && Math.random() > 0.7) {
            setAgentLogs(prevLogs => [
              { time: new Date().toLocaleTimeString(), message: `Email Bot: Sent automated email to ${candidate.name}`, id: Date.now() },
              ...prevLogs.slice(0, 9)
            ]);
            return { ...candidate, emailSent: true };
          }
          return candidate;
        }));

        // Add random activity logs
        const activities = [
          'Sourcing Agent: Found new profile on LinkedIn',
          'Screening Agent: Completed resume analysis',
          'Email Bot: Sent personalized outreach email',
          'Scheduling Agent: Confirmed interview slot'
        ];
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        setAgentLogs(prev => [
          { time: new Date().toLocaleTimeString(), message: randomActivity, id: Date.now() },
          ...prev.slice(0, 9)
        ]);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [systemRunning]);

  // Job Management Functions
  const handleCreateJob = () => {
    setJobForm({
      title: '',
      location: '',
      salary: '',
      description: '',
      requirements: '',
      status: 'active'
    });
    setEditingJob(null);
    setShowJobForm(true);
  };

  const handleEditJob = (job) => {
    setJobForm(job);
    setEditingJob(job.id);
    setShowJobForm(true);
  };

  const handleSaveJob = () => {
    if (!jobForm.title.trim()) {
      alert('Please enter a job title');
      return;
    }

    if (editingJob) {
      setJobPostings(prev => prev.map(job => 
        job.id === editingJob ? { ...jobForm, id: editingJob } : job
      ));
    } else {
      const newJob = {
        ...jobForm,
        id: Date.now()
      };
      setJobPostings(prev => [...prev, newJob]);
    }

    setShowJobForm(false);
    setEditingJob(null);
    setJobForm({
      title: '',
      location: '',
      salary: '',
      description: '',
      requirements: '',
      status: 'active'
    });
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      setJobPostings(prev => prev.filter(job => job.id !== jobId));
    }
  };

  // Application Functions
  const handleApplicationSubmit = (e) => {
    e.preventDefault();
    
    if (!applicationForm.fullName || !applicationForm.email || !applicationForm.position) {
      alert('Please fill in all required fields');
      return;
    }

    // Create new candidate from application
    const newCandidate = {
      id: Date.now(),
      name: applicationForm.fullName,
      role: applicationForm.position,
      score: Math.floor(Math.random() * 20) + 75, // Random score 75-95
      status: 'sourced',
      location: 'Remote',
      experience: 'From Application',
      skills: ['Professional Skills'],
      email: applicationForm.email,
      appliedDate: new Date().toISOString().split('T')[0],
      emailSent: false
    };

    setCandidates(prev => [newCandidate, ...prev]);
    setApplicationSubmitted(true);
    
    // Add log entry
    setAgentLogs(prev => [
      { time: new Date().toLocaleTimeString(), message: `New application received: ${applicationForm.fullName} for ${applicationForm.position}`, id: Date.now() },
      ...prev.slice(0, 9)
    ]);

    // Reset form
    setApplicationForm({
      fullName: '',
      email: '',
      phone: '',
      position: '',
      coverLetter: '',
      resume: null
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setApplicationForm(prev => ({ ...prev, resume: file }));
    }
  };

  // Email Bot Function
  const sendAutomatedEmail = (candidateId) => {
    setCandidates(prev => prev.map(candidate => {
      if (candidate.id === candidateId) {
        setAgentLogs(prevLogs => [
          { time: new Date().toLocaleTimeString(), message: `Email Bot: Manual email sent to ${candidate.name}`, id: Date.now() },
          ...prevLogs.slice(0, 9)
        ]);
        return { ...candidate, emailSent: true };
      }
      return candidate;
    }));
  };

  const getStatusColor = (status) => {
    const colors = {
      'sourced': '#3B82F6',
      'screening': '#8B5CF6', 
      'engagement': '#10B981',
      'scheduling': '#F59E0B',
      'active': '#10B981',
      'processing': '#F59E0B',
      'idle': '#6B7280'
    };
    return colors[status] || '#6B7280';
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>AI Talent Acquisition System</h1>
            <p>Autonomous recruitment pipeline powered by intelligent agents</p>
          </div>
          <div className="settings-icon">⚙️</div>
        </div>
      </header>

      <nav className="nav-tabs">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'candidates', label: 'Candidates' },
          { id: 'jobs', label: 'Job Postings' },
          { id: 'apply', label: 'Apply Now' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard">
            <div className="system-control">
              <h2>System Control</h2>
              <button 
                onClick={() => setSystemRunning(!systemRunning)}
                className={`system-btn ${systemRunning ? 'stop' : 'start'}`}
              >
                {systemRunning ? 'Stop System' : 'Start System'}
              </button>
              <div className={`status ${systemRunning ? 'running' : 'stopped'}`}>
                <span className="status-dot"></span>
                {systemRunning ? 'Running' : 'Stopped'}
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="agents-panel">
                <h3>AI Agents</h3>
                {agents.map((agent, index) => (
                  <div key={index} className="agent-card">
                    <div className="agent-header">
                      <span className="agent-name">{agent.name}</span>
                      <span 
                        className="status-indicator"
                        style={{ backgroundColor: getStatusColor(agent.status) }}
                      ></span>
                    </div>
                    <p className="agent-activity">{agent.activity}</p>
                  </div>
                ))}

                <div className="activity-log">
                  <h4>Live Activity</h4>
                  <div className="log-items">
                    {agentLogs.map(log => (
                      <div key={log.id} className="log-item">
                        <span className="log-time">{log.time}</span>
                        <p>{log.message}</p>
                      </div>
                    ))}
                    {agentLogs.length === 0 && (
                      <p className="no-activity">Start system to see live activity</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="candidates-preview">
                <h3>Recent Candidates</h3>
                {candidates.slice(0, 4).map(candidate => (
                  <div key={candidate.id} className="candidate-card">
                    <div className="candidate-avatar">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="candidate-info">
                      <h4>{candidate.name}</h4>
                      <p>{candidate.role}</p>
                      <div className="candidate-meta">
                        <span className="score">Score: {candidate.score}%</span>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(candidate.status) }}
                        >
                          {candidate.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="candidates-page">
            <h2>All Candidates</h2>
            <div className="candidates-table">
              <table>
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Role</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Email Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map(candidate => (
                    <tr key={candidate.id}>
                      <td>
                        <div className="candidate-cell">
                          <div className="candidate-avatar small">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div>{candidate.name}</div>
                            <div style={{fontSize: '0.75rem', color: '#64748b'}}>{candidate.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{candidate.role}</td>
                      <td>
                        <div className="score-bar">
                          <div 
                            className="score-fill" 
                            style={{ width: `${candidate.score}%` }}
                          ></div>
                          <span>{candidate.score}%</span>
                        </div>
                      </td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(candidate.status) }}
                        >
                          {candidate.status}
                        </span>
                      </td>
                      <td>
                        <span className={candidate.emailSent ? 'email-sent' : 'email-pending'}>
                          {candidate.emailSent ? '✓ Sent' : '○ Pending'}
                        </span>
                      </td>
                      <td>
                        {!candidate.emailSent && (
                          <button 
                            onClick={() => sendAutomatedEmail(candidate.id)}
                            className="send-email-btn"
                          >
                            Send Email
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="jobs-page">
            <div className="page-header">
              <h2>Job Postings</h2>
              <button onClick={handleCreateJob} className="create-btn">
                Create Job Posting
              </button>
            </div>
            
            <div className="jobs-grid">
              {jobPostings.map(job => (
                <div key={job.id} className="job-card">
                  <h3>{job.title}</h3>
                  <div className="job-details">
                    <p>📍 {job.location}</p>
                    <p>💰 {job.salary}</p>
                    <p>{job.description}</p>
                  </div>
                  <div className="job-actions">
                    <button onClick={() => handleEditJob(job)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDeleteJob(job.id)} className="delete-btn">Delete</button>
                  </div>
                </div>
              ))}
            </div>

            {showJobForm && (
              <div className="modal-overlay" onClick={() => setShowJobForm(false)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>{editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}</h3>
                    <button onClick={() => setShowJobForm(false)} className="close-btn">×</button>
                  </div>
                  
                  <form onSubmit={(e) => { e.preventDefault(); handleSaveJob(); }}>
                    <div className="form-group">
                      <label>Job Title *</label>
                      <input
                        type="text"
                        value={jobForm.title}
                        onChange={(e) => setJobForm(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Location</label>
                        <input
                          type="text"
                          value={jobForm.location}
                          onChange={(e) => setJobForm(prev => ({ ...prev, location: e.target.value }))}
                        />
                      </div>
                      <div className="form-group">
                        <label>Salary</label>
                        <input
                          type="text"
                          value={jobForm.salary}
                          onChange={(e) => setJobForm(prev => ({ ...prev, salary: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Job Description</label>
                      <textarea
                        value={jobForm.description}
                        onChange={(e) => setJobForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Requirements</label>
                      <textarea
                        value={jobForm.requirements}
                        onChange={(e) => setJobForm(prev => ({ ...prev, requirements: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    
                    <div className="modal-actions">
                      <button type="submit" className="save-btn">
                        {editingJob ? 'Update Job' : 'Create Job'}
                      </button>
                      <button type="button" onClick={() => setShowJobForm(false)} className="cancel-btn">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'apply' && (
          <div className="apply-page">
            {applicationSubmitted ? (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h2>Application Submitted Successfully!</h2>
                <p>Thank you for your application. Our AI system will review your profile and send you an automated email shortly.</p>
                <button 
                  onClick={() => setApplicationSubmitted(false)} 
                  className="submit-another-btn"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <>
                <div className="apply-header">
                  <h2>Apply for a Position</h2>
                  <p>Submit your application and let our AI-powered system match you with the perfect role.</p>
                </div>
                
                <form onSubmit={handleApplicationSubmit} className="application-form">
                  <div className="form-group">
                    <label>Select Position *</label>
                    <select
                      value={applicationForm.position}
                      onChange={(e) => setApplicationForm(prev => ({ ...prev, position: e.target.value }))}
                      required
                    >
                      <option value="">Choose a position...</option>
                      {jobPostings.map(job => (
                        <option key={job.id} value={job.title}>
                          {job.title} - {job.location}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        value={applicationForm.fullName}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, fullName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        value={applicationForm.email}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={applicationForm.phone}
                      onChange={(e) => setApplicationForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Upload Resume/CV</label>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx"
                    />
                    {applicationForm.resume && (
                      <p className="file-selected">Selected: {applicationForm.resume.name}</p>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>Cover Letter</label>
                    <textarea
                      value={applicationForm.coverLetter}
                      onChange={(e) => setApplicationForm(prev => ({ ...prev, coverLetter: e.target.value }))}
                      placeholder="Tell us why you're interested in this role..."
                      rows={4}
                    />
                  </div>
                  
                  <button type="submit" className="submit-btn">
                    Submit Application
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;