const { sleep } = require('@temporalio/workflow');
const activities = require('../activities/index.js');

// TVR Registration Workflow
async function TVRRegistrationWorkflow(application) {
  console.log(`Starting TVR Registration workflow for application: ${application.applicationId}`);

  try {
    // Step 1: Initial Review (2 hours)
    console.log('Step 1: Performing initial review...');
    await sleep('2 hours');
    const initialReview = await activities.performInitialReview(application);
    
    if (!initialReview.approved) {
      return { status: 'rejected', reason: initialReview.reason || 'Application incomplete' };
    }

    // Step 2: Zoning Verification (1 day)
    console.log('Step 2: Verifying zoning...');
    await sleep('1 day');
    const zoningResult = await activities.verifyZoning(application.propertyId);
    
    if (!zoningResult.compliant) {
      return { status: 'rejected', reason: 'Zoning violation detected' };
    }

    // Step 3: NCUC Processing (if required, 3-7 days)
    if (application.requiresNCUC) {
      console.log('Step 3: Processing NCUC application...');
      await sleep('3 days');
      const ncucResult = await activities.processNCUC(application);
      
      if (!ncucResult.approved) {
        return { status: 'rejected', reason: 'NCUC denied' };
      }
    }

    // Step 4: Inspection Scheduling (2-3 days)
    console.log('Step 4: Scheduling inspection...');
    await sleep('2 days');
    const inspection = await activities.scheduleInspection(application);

    // Step 5: Final Approval (1-2 days)
    console.log('Step 5: Final approval process...');
    await sleep('1 day');
    const finalApproval = await activities.finalizeRegistration(application, inspection);
    
    return { 
      status: 'approved', 
      registrationId: finalApproval.id,
      approvedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('TVR Registration workflow failed:', error);
    return { status: 'rejected', reason: 'Workflow error occurred' };
  }
}

// Complaint Investigation Workflow
async function ComplaintInvestigationWorkflow(complaint) {
  console.log(`Starting Complaint Investigation workflow for complaint: ${complaint.complaintId}`);

  try {
    // Step 1: Initial Assessment (1 day)
    console.log('Step 1: Initial assessment...');
    await sleep('1 day');
    const assessment = await activities.performInitialAssessment(complaint);
    
    if (!assessment.requiresInvestigation) {
      return { status: 'compliant', completedAt: new Date().toISOString() };
    }

    // Step 2: Evidence Collection (3-7 days)
    console.log('Step 2: Collecting evidence...');
    await sleep('3 days');
    const evidence = await activities.collectEvidence(complaint);

    // Step 3: Site Visit (2-3 days)
    console.log('Step 3: Conducting site visit...');
    await sleep('2 days');
    const siteVisit = await activities.conductSiteVisit(complaint, evidence);

    // Step 4: Investigation Report (2-3 days)
    console.log('Step 4: Generating investigation report...');
    await sleep('2 days');
    const report = await activities.generateInvestigationReport(complaint, evidence, siteVisit);

    // Step 5: Violation Determination (1-2 days)
    console.log('Step 5: Determining violations...');
    await sleep('1 day');
    const determination = await activities.determineViolations(report);

    // Step 6: Notice Generation (1 day)
    console.log('Step 6: Generating notice...');
    await sleep('1 day');
    const notice = await activities.generateNotice(complaint, determination);

    return {
      status: determination.hasViolations ? 'violated' : 'compliant',
      violationId: determination.hasViolations ? (notice.violationId || undefined) : undefined,
      evidence,
      report: report,
      completedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Complaint Investigation workflow failed:', error);
    return { status: 'pending', reason: 'Workflow error occurred' };
  }
}

// Violation Appeal Workflow
async function ViolationAppealWorkflow(appeal) {
  console.log(`Starting Violation Appeal workflow for appeal: ${appeal.appealId}`);

  try {
    // Step 1: Document Review (3-5 days)
    console.log('Step 1: Reviewing documents...');
    await sleep('3 days');
    const documentReview = await activities.reviewAppealDocuments(appeal);

    if (!documentReview.valid) {
      return { status: 'upheld', decision: 'Invalid appeal documentation', reason: 'Documentation incomplete' };
    }

    // Step 2: Legal Review (1-2 weeks)
    console.log('Step 2: Legal review...');
    await sleep('7 days');
    const legalReview = await activities.performLegalReview(appeal, documentReview);

    // Step 3: Hearing Scheduling (1 week)
    console.log('Step 3: Scheduling hearing...');
    await sleep('7 days');
    const hearing = await activities.scheduleHearing(appeal, legalReview);

    // Step 4: Decision Making (3-5 days)
    console.log('Step 4: Making decision...');
    await sleep('3 days');
    const decision = await activities.makeAppealDecision(appeal, hearing);

    // Step 5: Notification (1 day)
    console.log('Step 5: Notifying parties...');
    await sleep('1 day');
    await activities.notifyAppealDecision(appeal, decision);

    return {
      status: decision.upheld ? 'upheld' : 'overturned',
      decision: decision.reasoning,
      decidedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Violation Appeal workflow failed:', error);
    return { status: 'pending', reason: 'Workflow error occurred' };
  }
}

// Annual Inspection Workflow
async function AnnualInspectionWorkflow(inspection) {
  console.log(`Starting Annual Inspection workflow for inspection: ${inspection.inspectionId}`);

  try {
    // Step 1: Scheduling (2-3 days)
    console.log('Step 1: Scheduling inspection...');
    await sleep('2 days');
    const scheduling = await activities.scheduleInspectionDate(inspection);

    if (!scheduling.success) {
      return { status: 'rescheduled', report: 'Scheduling conflict - needs rescheduling', reason: 'Scheduling conflict' };
    }

    // Step 2: On-site Inspection (1 day)
    console.log('Step 2: Conducting on-site inspection...');
    await sleep('1 day');
    const onSiteInspection = await activities.conductOnSiteInspection(inspection);

    // Step 3: Report Generation (1-2 days)
    console.log('Step 3: Generating inspection report...');
    await sleep('1 day');
    const report = await activities.generateInspectionReport(inspection, onSiteInspection);

    // Step 4: Follow-up Required (if needed)
    if (report.requiresFollowUp) {
      console.log('Step 4: Scheduling follow-up...');
      await sleep('3 days');
      const followUp = await activities.scheduleFollowUp(inspection, report);
      
      return {
        status: followUp.compliant ? 'compliant' : 'violated',
        report: report.summary,
        violations: report.violations,
        inspectedAt: new Date().toISOString()
      };
    }

    // Step 5: Compliance Verification (1 day)
    console.log('Step 5: Verifying compliance...');
    await sleep('1 day');
    const compliance = await activities.verifyCompliance(report);

    return {
      status: compliance.compliant ? 'compliant' : 'violated',
      report: report.summary,
      violations: compliance.violations,
      inspectedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Annual Inspection workflow failed:', error);
    return { status: 'rescheduled', reason: 'Workflow error occurred' };
  }
}

module.exports = {
  TVRRegistrationWorkflow,
  ComplaintInvestigationWorkflow,
  ViolationAppealWorkflow,
  AnnualInspectionWorkflow
};
