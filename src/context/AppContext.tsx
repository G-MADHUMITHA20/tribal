import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserSession } from '../types/user';
import { SchemeConfig } from '../types/scheme';
import { ApplicationRecord, ApplicationStatus } from '../types/application';
import { MOTA_SCHEMES } from '../data/schemes';
import { INITIAL_AUDIT_LOGS, SystemAuditLog } from '../data/mockAuditLogs';
import { INITIAL_GRIEVANCES, GrievanceRecord } from '../data/mockGrievances';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

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
  isLoadingApplications: boolean;
  applicationError: string | null;
  fetchApplications: () => Promise<void>;
  addApplication: (app: ApplicationRecord) => Promise<void>;
  updateApplicationStatus: (appId: string, newStatus: ApplicationRecord['status'], remarks?: string, officerName?: string) => Promise<void>;
  resolveApplicationDeficiency: (appId: string, updatedDocName: string) => Promise<void>;

  // Audit Logs
  auditLogs: SystemAuditLog[];
  addAuditLog: (log: Omit<SystemAuditLog, 'id' | 'timestamp'>) => void;

  // Grievances
  grievances: GrievanceRecord[];
  addGrievance: (g: Omit<GrievanceRecord, 'id' | 'submittedDate'>) => Promise<void>;
  updateGrievanceStatus: (id: string, status: GrievanceRecord['status'], remarks?: string) => Promise<void>;
}

function transformBackendApplication(app: any): ApplicationRecord {
  return {
    id: app.application_id || app._id,
    schemeId: app.scheme_id,
    schemeCode: app.scheme_id,
    schemeName: app.scheme_name || 'MoTA Scholarship Scheme',
    submissionDate: app.created_at ? new Date(app.created_at).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10),
    lastUpdated: app.updated_at ? new Date(app.updated_at).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10),
    currentStageIndex: 1,
    status: (app.status || 'SUBMITTED') as ApplicationStatus,
    applicant: {
      id: app.user_id,
      fullName: app.personal_details?.full_name || 'Beneficiary Applicant',
      fatherOrHusbandName: app.personal_details?.father_or_husband_name || '',
      gender: app.personal_details?.gender || 'FEMALE',
      dob: app.personal_details?.dob || '2000-01-01',
      aadhaarNumberMasked: app.personal_details?.aadhaar_masked || 'XXXX-XXXX-0000',
      category: (app.personal_details?.category || 'ST') as any,
      tribeCommunity: app.personal_details?.tribe_community || 'Scheduled Tribe',
      mobile: app.personal_details?.mobile || '',
      email: app.personal_details?.email || '',
      state: app.personal_details?.state || 'Jharkhand',
      district: app.personal_details?.district || 'Ranchi',
      pincode: app.personal_details?.pincode || '834001',
      disabilityStatus: 'NONE',
    },
    academic: {
      currentCourse: app.academic_details?.current_course || 'Higher Education',
      institutionName: app.academic_details?.institution_name || 'Institution of Eminence',
      institutionState: app.academic_details?.institution_state || 'Delhi',
      aisheCode: app.academic_details?.aishe_code || 'U-0001',
      rollNumber: app.academic_details?.roll_number || 'ST/2026/01',
      yearOfStudy: app.academic_details?.year_of_study || '1st Year',
      previousExamName: app.academic_details?.previous_exam_name || 'Qualifying Exam',
      previousExamPercentage: app.academic_details?.previous_exam_percentage || 80,
      passingYear: app.academic_details?.passing_year || '2024',
      boardOrUniversity: app.academic_details?.board_or_university || 'State University',
    },
    bank: {
      accountHolderName: app.financial_details?.account_holder_name || app.personal_details?.full_name || '',
      bankName: app.financial_details?.bank_name || 'State Bank of India',
      accountNumberMasked: app.financial_details?.account_number_masked || 'XXXXXX1234',
      ifscCode: app.financial_details?.ifsc_code || 'SBIN0001234',
      branchName: app.financial_details?.branch_name || 'Main Branch',
      isAadhaarSeeded: app.financial_details?.is_aadhaar_seeded ?? true,
      dbtVerifiedDate: '2026-01-10',
    },
    annualFamilyIncome: app.financial_details?.annual_family_income || 150000,
    documents: (app.documents || []).map((d: any, idx: number) => ({
      id: d.id || `DOC-${idx}`,
      documentCode: d.document_code || 'DOC',
      documentName: d.document_name || 'Certificate',
      fileUrl: d.file_url || '#',
      fileName: d.file_name || 'Document.pdf',
      fileSizeKB: d.file_size_kb || 450,
      uploadedAt: d.uploaded_at ? new Date(d.uploaded_at).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10),
      ocrExtracted: true,
      status: (d.status || 'VALID') as any,
      deficiencyReason: d.deficiency_notes,
    })),
    hasDeficiency: app.has_deficiency || app.status === 'DEFICIENT',
    deficiencyNotes: app.deficiency_notes,
    officerRemarks: app.officer_remarks,
    auditTrail: [
      {
        id: 'AUD-01',
        timestamp: app.created_at ? new Date(app.created_at).toISOString().replace('T', ' ').substring(0, 19) : new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: app.personal_details?.full_name || 'Citizen Applicant',
        actorRole: 'APPLICANT',
        action: 'Application Submitted on MoTA Portal',
        newStatus: (app.status || 'SUBMITTED') as ApplicationStatus,
        remarks: 'Digital application dossier successfully lodged with statutory Aadhaar seeding.'
      }
    ]
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: authUser, login, logout } = useAuth();

  const currentUser: UserSession = authUser
    ? {
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        role: authUser.role,
        designation:
          authUser.role === 'APPLICANT'
            ? 'ST Beneficiary (Aadhaar Verified)'
            : authUser.role === 'OFFICER'
            ? 'Deputy Secretary (Research & Scrutiny)'
            : 'Joint Secretary (Scholarships & DBT Mission)',
        department: authUser.role !== 'APPLICANT' ? 'Ministry of Tribal Affairs' : undefined,
      }
    : {
        id: '',
        name: 'Guest Citizen',
        email: '',
        role: 'APPLICANT',
        designation: 'Unauthenticated Visitor',
      };

  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState<number>(1);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [schemes, setSchemes] = useState<SchemeConfig[]>(MOTA_SCHEMES);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState<boolean>(false);
  const [applicationError, setApplicationError] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>(INITIAL_AUDIT_LOGS);
  const [grievances, setGrievances] = useState<GrievanceRecord[]>([]);

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

  // Fetch applications whenever authUser changes
  const fetchApplications = async () => {
    if (!authUser) {
      setApplications([]);
      setApplicationError(null);
      return;
    }

    setIsLoadingApplications(true);
    setApplicationError(null);

    try {
      if (authUser.role === 'APPLICANT') {
        const backendApps = await api.getMyApplications();
        setApplications(backendApps.map(transformBackendApplication));
      } else {
        const backendApps = await api.getAllApplications();
        setApplications(backendApps.map(transformBackendApplication));
      }
    } catch (err: any) {
      console.error('Failed to load applications from API:', err);
      setApplicationError(err.message || 'Unable to load applications from server.');
      setApplications([]);
    } finally {
      setIsLoadingApplications(false);
    }
  };

  // Fetch grievances when user logs in
  const fetchGrievances = async () => {
    if (!authUser) {
      setGrievances([]);
      return;
    }
    try {
      if (authUser.role === 'APPLICANT') {
        const myGrv = await api.getMyGrievances();
        setGrievances(
          myGrv.map((g: any) => ({
            id: g.grievance_id || g._id,
            applicantName: authUser.name,
            applicationId: g.application_id,
            schemeName: g.scheme_name,
            category: g.category,
            subject: g.subject,
            description: g.description,
            submittedDate: g.created_at ? new Date(g.created_at).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10),
            status: g.status,
            priority: 'HIGH',
            assignedOfficer: g.assigned_officer,
            resolutionRemarks: g.resolution_remarks,
          }))
        );
      } else {
        const allGrv = await api.getAllGrievances();
        setGrievances(
          allGrv.map((g: any) => ({
            id: g.grievance_id || g._id,
            applicantName: 'Applicant Citizen',
            applicationId: g.application_id,
            schemeName: g.scheme_name,
            category: g.category,
            subject: g.subject,
            description: g.description,
            submittedDate: g.created_at ? new Date(g.created_at).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10),
            status: g.status,
            priority: 'HIGH',
            assignedOfficer: g.assigned_officer,
            resolutionRemarks: g.resolution_remarks,
          }))
        );
      }
    } catch (err) {
      console.warn('Failed to load grievances:', err);
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchGrievances();
  }, [authUser?.id, authUser?.role]);

  const switchRole = async (role: UserRole) => {
    // For demo persona switching, login as pre-seeded officer/admin or logout
    if (role === 'OFFICER') {
      try {
        await login({ email: 'officer@mota.gov.in', password: 'Officer@2026' });
      } catch {
        console.warn('Could not auto-switch to officer account');
      }
    } else if (role === 'ADMIN') {
      try {
        await login({ email: 'admin@mota.gov.in', password: 'Admin@2026' });
      } catch {
        console.warn('Could not auto-switch to admin account');
      }
    } else {
      logout();
    }
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

  const addApplication = async (app: ApplicationRecord) => {
    try {
      const payload = {
        scheme_id: app.schemeCode,
        personal_details: {
          full_name: app.applicant.fullName,
          father_or_husband_name: app.applicant.fatherOrHusbandName,
          gender: app.applicant.gender,
          dob: app.applicant.dob,
          aadhaar_masked: app.applicant.aadhaarNumberMasked,
          category: app.applicant.category,
          tribe_community: app.applicant.tribeCommunity,
          mobile: app.applicant.mobile,
          email: app.applicant.email,
          state: app.applicant.state,
          district: app.applicant.district,
          pincode: app.applicant.pincode,
        },
        academic_details: {
          current_course: app.academic.currentCourse,
          institution_name: app.academic.institutionName,
          institution_state: app.academic.institutionState,
          aishe_code: app.academic.aisheCode,
          roll_number: app.academic.rollNumber,
          year_of_study: app.academic.yearOfStudy,
          previous_exam_name: app.academic.previousExamName,
          previous_exam_percentage: app.academic.previousExamPercentage,
          passing_year: app.academic.passingYear,
          board_or_university: app.academic.boardOrUniversity,
        },
        financial_details: {
          annual_family_income: app.annualFamilyIncome,
          bank_name: app.bank.bankName,
          account_holder_name: app.bank.accountHolderName,
          account_number_masked: app.bank.accountNumberMasked,
          ifsc_code: app.bank.ifscCode,
          branch_name: app.bank.branchName,
          is_aadhaar_seeded: app.bank.isAadhaarSeeded,
        },
        documents: (app.documents || []).map((d) => ({
          id: d.id,
          document_code: d.documentCode,
          document_name: d.documentName,
          file_name: d.fileName,
          file_url: d.fileUrl,
          file_size_kb: d.fileSizeKB,
          status: d.status,
        })),
        status: 'SUBMITTED',
      };

      const created = await api.createApplication(payload);
      const transformed = transformBackendApplication(created);
      setApplications((prev) => [transformed, ...prev]);
    } catch (err: any) {
      console.error('Failed to create application on server:', err);
      // Still update locally if offline
      setApplications((prev) => [app, ...prev]);
    }

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

  const updateApplicationStatus = async (
    appId: string,
    newStatus: ApplicationRecord['status'],
    remarks?: string,
    officerName?: string
  ) => {
    try {
      await api.updateApplicationStatusOfficer(appId, {
        status: newStatus,
        remarks,
        officer_name: officerName || currentUser.name,
      });
    } catch (err) {
      console.warn('Backend updateApplicationStatus failed:', err);
    }

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            status: newStatus,
            hasDeficiency: newStatus === 'DEFICIENCY_NOTIFIED',
            lastUpdated: new Date().toISOString().substring(0, 10),
            officerRemarks: remarks || app.officerRemarks,
          };
        }
        return app;
      })
    );
  };

  const resolveApplicationDeficiency = async (appId: string, updatedDocName: string) => {
    try {
      await api.updateApplication(appId, {
        status: 'SUBMITTED',
      });
    } catch (err) {
      console.warn('Backend resolveApplicationDeficiency failed:', err);
    }

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

          return {
            ...app,
            hasDeficiency: false,
            deficiencyNotes: undefined,
            status: 'RESUBMITTED' as const,
            lastUpdated: new Date().toISOString().substring(0, 10),
            documents: updatedDocs,
          };
        }
        return app;
      })
    );
  };

  const addAuditLog = (log: Omit<SystemAuditLog, 'id' | 'timestamp'>) => {
    const newRecord: SystemAuditLog = {
      ...log,
      id: 'LOG-' + Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAuditLogs((prev) => [newRecord, ...prev]);
  };

  const addGrievance = async (g: Omit<GrievanceRecord, 'id' | 'submittedDate'>) => {
    try {
      await api.lodgeGrievance({
        applicationId: g.applicationId,
        category: g.category,
        subject: g.subject,
        description: g.description,
      });
      fetchGrievances();
    } catch (err) {
      console.warn('Failed to lodge grievance to backend:', err);
      const newGrv: GrievanceRecord = {
        ...g,
        id: `GRV/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
        submittedDate: new Date().toISOString().substring(0, 10)
      };
      setGrievances((prev) => [newGrv, ...prev]);
    }
  };

  const updateGrievanceStatus = async (id: string, status: GrievanceRecord['status'], remarks?: string) => {
    try {
      await api.resolveGrievanceOfficer(id, {
        status,
        resolution_remarks: remarks,
      });
    } catch (err) {
      console.warn('Backend updateGrievanceStatus failed:', err);
    }

    setGrievances((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status, resolutionRemarks: remarks || g.resolutionRemarks } : g))
    );
  };

  // STRICT APPLICANT DATA ISOLATION:
  // Only find an application that explicitly belongs to the authenticated user.
  // NEVER fall back to applications[0] or another applicant's record!
  const currentApplicantApplication = authUser
    ? applications.find(
        (a) =>
          a.applicant.id === authUser.id ||
          (authUser.email && a.applicant.email.toLowerCase() === authUser.email.toLowerCase()) ||
          (authUser.name && a.applicant.fullName.toLowerCase() === authUser.name.toLowerCase())
      )
    : undefined;

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
        isLoadingApplications,
        applicationError,
        fetchApplications,
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
