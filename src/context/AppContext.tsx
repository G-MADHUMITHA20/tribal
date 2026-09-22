import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserSession } from '../types/user';
import { SchemeConfig } from '../types/scheme';
import { ApplicationRecord } from '../types/application';
import { MOTA_SCHEMES } from '../data/schemes';
import { INITIAL_MOCK_APPLICATIONS } from '../data/mockApplications';
import { INITIAL_AUDIT_LOGS, SystemAuditLog } from '../data/mockAuditLogs';
import { INITIAL_GRIEVANCES, GrievanceRecord } from '../data/mockGrievances';

interface AppContextType {
  // Authentication & Role
  currentUser: UserSession;
  switchRole: (role: UserRole) => void;

  // Language
  language: 'EN' | 'HI';
  setLanguage: (lang: 'EN' | 'HI') => void;

  // Accessibility
  fontSizeMultiplier: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;

  // Schemes (Dynamic Configuration)
  schemes: SchemeConfig[];
  updateScheme: (updated: SchemeConfig) => void;
  addScheme: (newScheme: SchemeConfig) => void;

  // Applications
  applications: ApplicationRecord[];
  currentApplicantApplication: ApplicationRecord | undefined;
  addApplication: (app: ApplicationRecord) => void;
  updateApplicationStatus: (appId: string, newStatus: ApplicationRecord['status'], remarks?: string, officerName?: string) => void;
  resolveApplicationDeficiency: (appId: string, updatedDocName: string) => void;

  // Audit Logs
  auditLogs: SystemAuditLog[];
  addAuditLog: (log: Omit<SystemAuditLog, 'id' | 'timestamp'>) => void;

  // Grievances
  grievances: GrievanceRecord[];
  addGrievance: (g: Omit<GrievanceRecord, 'id' | 'submittedDate'>) => void;
  updateGrievanceStatus: (id: string, status: GrievanceRecord['status'], remarks?: string) => void;
}

const DEFAULT_USERS: Record<UserRole, UserSession> = {
  APPLICANT: {
    id: 'USR-APP-01',
    name: 'Sunita Soren',
    email: 'sunita.soren@research.du.ac.in',
    role: 'APPLICANT',
    designation: 'ST Research Scholar (National Fellowship Applicant)'
  },
  OFFICER: {
    id: 'USR-OFF-02',
    name: 'Shri Manoj Kumar',
    email: 'fellowship-tribal@nic.in',
    role: 'OFFICER',
    designation: 'Deputy Secretary (Research & Scrutiny)',
    department: 'MoTA New Delhi'
  },
  ADMIN: {
    id: 'USR-ADM-03',
    name: 'Dr. Navaljit Kapoor',
    email: 'jointsec-mota@gov.in',
    role: 'ADMIN',
    designation: 'Joint Secretary (Scholarships & DBT Mission)',
    department: 'Ministry of Tribal Affairs'
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserSession>(DEFAULT_USERS.APPLICANT);
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState<number>(1);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [schemes, setSchemes] = useState<SchemeConfig[]>(MOTA_SCHEMES);
  const [applications, setApplications] = useState<ApplicationRecord[]>(INITIAL_MOCK_APPLICATIONS);
  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>(INITIAL_AUDIT_LOGS);
  const [grievances, setGrievances] = useState<GrievanceRecord[]>(INITIAL_GRIEVANCES);

  // Apply font size scale
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSizeMultiplier * 100}%`;
  }, [fontSizeMultiplier]);

  // Apply high contrast
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const switchRole = (role: UserRole) => {
    setCurrentUser(DEFAULT_USERS[role]);
  };

  const increaseFontSize = () => {
    setFontSizeMultiplier((prev) => Math.min(prev + 0.1, 1.3));
  };

  const decreaseFontSize = () => {
    setFontSizeMultiplier((prev) => Math.max(prev - 0.1, 0.85));
  };

  const resetFontSize = () => {
    setFontSizeMultiplier(1);
  };

  const toggleHighContrast = () => {
    setHighContrast((prev) => !prev);
  };

  const updateScheme = (updated: SchemeConfig) => {
    setSchemes((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    addAuditLog({
      actor: currentUser.name,
      role: currentUser.role,
      action: 'Scheme Rule Config Updated',
      applicationId: updated.code,
      schemeCode: updated.code,
      previousStatus: 'ACTIVE_V1',
      newStatus: 'UPDATED_RULESET',
      reason: `Configuration criteria modified for ${updated.name}`,
      ipAddress: '10.14.88.10 (NIC Internal)'
    });
  };

  const addScheme = (newScheme: SchemeConfig) => {
    setSchemes((prev) => [...prev, newScheme]);
  };

  const addApplication = (app: ApplicationRecord) => {
    setApplications((prev) => [app, ...prev]);
    addAuditLog({
      actor: app.applicant.fullName,
      role: 'APPLICANT',
      action: 'New Application Submitted',
      applicationId: app.id,
      schemeCode: app.schemeCode,
      previousStatus: 'DRAFT',
      newStatus: app.status,
      remarks: `Applied for ${app.schemeName}`,
      reason: `Applied for ${app.schemeName}`,
      ipAddress: '164.100.24.112'
    });
  };

  const updateApplicationStatus = (
    appId: string,
    newStatus: ApplicationRecord['status'],
    remarks?: string,
    officerName?: string
  ) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const prevStatus = app.status;
          const updatedTrail = [
            {
              id: 'AUD-' + Math.random().toString(36).substring(2, 7),
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
              actor: officerName || currentUser.name,
              actorRole: currentUser.role,
              action: `Status transition to ${newStatus}`,
              previousStatus: prevStatus,
              newStatus,
              remarks: remarks || 'Action processed by competent officer'
            },
            ...app.auditTrail
          ];
          return {
            ...app,
            status: newStatus,
            hasDeficiency: newStatus === 'DEFICIENCY_NOTIFIED',
            lastUpdated: new Date().toISOString().substring(0, 10),
            officerRemarks: remarks || app.officerRemarks,
            auditTrail: updatedTrail
          };
        }
        return app;
      })
    );

    addAuditLog({
      actor: officerName || currentUser.name,
      role: currentUser.role,
      action: `Application Status Changed to ${newStatus}`,
      applicationId: appId,
      schemeCode: appId.includes('NF') ? 'MOTA-NF-04' : 'MOTA-NSTE-03',
      previousStatus: 'PRIOR',
      newStatus,
      reason: remarks || 'Officer administrative action',
      ipAddress: '10.14.88.22'
    });
  };

  const resolveApplicationDeficiency = (appId: string, updatedDocName: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const updatedDocs = app.documents.map((d) =>
            d.status === 'DEFICIENT'
              ? {
                  ...d,
                  fileName: updatedDocName,
                  status: 'VALID' as const,
                  deficiencyReason: undefined,
                  uploadedAt: new Date().toISOString().substring(0, 10)
                }
              : d
          );

          const updatedTrail = [
            {
              id: 'AUD-' + Math.random().toString(36).substring(2, 7),
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
              actor: app.applicant.fullName,
              actorRole: 'APPLICANT' as const,
              action: 'Deficiency Rectified (Document Re-uploaded)',
              previousStatus: app.status,
              newStatus: 'RESUBMITTED' as const,
              remarks: `Applicant uploaded corrected document: ${updatedDocName}`
            },
            ...app.auditTrail
          ];

          return {
            ...app,
            hasDeficiency: false,
            deficiencyNotes: undefined,
            status: 'RESUBMITTED' as const,
            lastUpdated: new Date().toISOString().substring(0, 10),
            documents: updatedDocs,
            auditTrail: updatedTrail
          };
        }
        return app;
      })
    );

    addAuditLog({
      actor: currentUser.name,
      role: 'APPLICANT',
      action: 'Deficiency Resolved & Resubmitted',
      applicationId: appId,
      schemeCode: 'MOTA-NSTE-03',
      previousStatus: 'DEFICIENCY_NOTIFIED',
      newStatus: 'RESUBMITTED',
      reason: `Uploaded replacement document: ${updatedDocName}`,
      ipAddress: '164.100.12.80'
    });
  };

  const addAuditLog = (log: Omit<SystemAuditLog, 'id' | 'timestamp'>) => {
    const newRecord: SystemAuditLog = {
      ...log,
      id: 'LOG-' + Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAuditLogs((prev) => [newRecord, ...prev]);
  };

  const addGrievance = (g: Omit<GrievanceRecord, 'id' | 'submittedDate'>) => {
    const newGrv: GrievanceRecord = {
      ...g,
      id: `GRV/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
      submittedDate: new Date().toISOString().substring(0, 10)
    };
    setGrievances((prev) => [newGrv, ...prev]);
  };

  const updateGrievanceStatus = (id: string, status: GrievanceRecord['status'], remarks?: string) => {
    setGrievances((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status, resolutionRemarks: remarks || g.resolutionRemarks } : g))
    );
  };

  const currentApplicantApplication = applications.find(
    (a) => a.applicant.fullName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])
  ) || applications[0];

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchRole,
        language,
        setLanguage,
        fontSizeMultiplier,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
        highContrast,
        toggleHighContrast,
        schemes,
        updateScheme,
        addScheme,
        applications,
        currentApplicantApplication,
        addApplication,
        updateApplicationStatus,
        resolveApplicationDeficiency,
        auditLogs,
        addAuditLog,
        grievances,
        addGrievance,
        updateGrievanceStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
