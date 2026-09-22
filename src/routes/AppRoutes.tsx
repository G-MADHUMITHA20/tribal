import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { ApplicantLayout } from '../layouts/ApplicantLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { SchemesPage } from '../pages/public/SchemesPage';
import { SchemeDetailPage } from '../pages/public/SchemeDetailPage';
import { ResourcesPage } from '../pages/public/ResourcesPage';
import { AboutPage } from '../pages/public/AboutPage';
import { ContactPage, HelpPage } from '../pages/public/ContactPage';

// Applicant Pages
import { ApplicantAuthPage } from '../pages/applicant/ApplicantAuthPage';
import { ApplicantDashboardPage } from '../pages/applicant/ApplicantDashboardPage';
import { ApplicationWizardPage } from '../pages/applicant/ApplicationWizardPage';
import { StatusTrackerPage } from '../pages/applicant/StatusTrackerPage';
import { MyDocumentsPage } from '../pages/applicant/MyDocumentsPage';
import { ApplicantGrievancesPage } from '../pages/applicant/ApplicantGrievancesPage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { ApplicationQueuePage } from '../pages/admin/ApplicationQueuePage';
import { DocVerificationPage } from '../pages/admin/DocVerificationPage';
import { SelectionBoardPage } from '../pages/admin/SelectionBoardPage';
import { SchemeConfiguratorPage } from '../pages/admin/SchemeConfiguratorPage';
import { AuditLogsPage } from '../pages/admin/AuditLogsPage';
import { GrievanceQueuePage } from '../pages/admin/GrievanceQueuePage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Public MoTA Portal Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/schemes" element={<SchemesPage />} />
        <Route path="/schemes/:id" element={<SchemeDetailPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/grievances" element={<ApplicantGrievancesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/applicant/login" element={<ApplicantAuthPage />} />
        <Route path="/applicant/register" element={<ApplicantAuthPage />} />
      </Route>

      {/* 2. Applicant Citizen Portal Routes */}
      <Route path="/applicant" element={<ApplicantLayout />}>
        <Route path="dashboard" element={<ApplicantDashboardPage />} />
        <Route path="apply" element={<ApplicationWizardPage />} />
        <Route path="status" element={<StatusTrackerPage />} />
        <Route path="documents" element={<MyDocumentsPage />} />
        <Route path="grievances" element={<ApplicantGrievancesPage />} />
      </Route>

      {/* 3. Officer & Admin Governance Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="applications" element={<ApplicationQueuePage />} />
        <Route path="verification" element={<DocVerificationPage />} />
        <Route path="deficiencies" element={<DocVerificationPage />} />
        <Route path="selection" element={<SelectionBoardPage />} />
        <Route path="scheme-configurator" element={<SchemeConfiguratorPage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
        <Route path="grievances" element={<GrievanceQueuePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
