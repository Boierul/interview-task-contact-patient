import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Descriptions, Skeleton, TreeSelect } from 'antd';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';

import "./styles.css"
import { PatientOverviewUrl } from '../urls';
import { usePatientData } from '../../../hooks/usePatientData';

export type PatientPageProps = RouteComponentProps<{ patientId: string }>;

export function PatientPage(props: PatientPageProps) {
  // Get the history object for navigation
  const history = useHistory();
  // Get the patient ID from the URL
  const patientId = props?.match?.params?.patientId;

  // Fetch all necessary patients' data
  const [currentPatientIndex, setCurrentPatientIndex] = useState(0);
  const {
    patient,
    loadingPatient,
    uncontactedPatients,
    stats,
    handleUpdateContacted,
  } = usePatientData(patientId);

  // Change the current index dynamically
  useEffect(() => {
    if (patientId && uncontactedPatients.length > 0) {
      const index = uncontactedPatients.findIndex((p) => p.id === patientId);
      if (index !== -1) {
        setCurrentPatientIndex(index);
      }
    }
  }, [patientId, uncontactedPatients]);

  const goToPreviousPatient = () => {
    if (currentPatientIndex > 0) {
      const previousIndex = currentPatientIndex - 1;
      const previousPatientId = uncontactedPatients[previousIndex].id;
      history.push(`/patient/${previousPatientId}`);
    }
  };

  // Keep track of the contacted/uncontacted - solving skipping one patient bug
  // Unorthodox, but it works
  const [isContactedForNext, setIsContactedForNext] = useState(false);
  const goToNextPatient = () => {
    if (currentPatientIndex < uncontactedPatients.length - 1) {
      const nextIndex = isContactedForNext
        ? currentPatientIndex
        : currentPatientIndex + 1;

      const nextPatientId = uncontactedPatients[nextIndex].id;
      history.push(`/patient/${nextPatientId}`);
    }
  };

  if (loadingPatient) {
    return <Skeleton />;
  }

  if (!patient) {
    return <p>No patient found for id: "{patientId}"</p>;
  }

  return (
    <main>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '50px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <Button
            icon={<LeftOutlined />}
            onClick={() => history.push(PatientOverviewUrl)}
          />

          <h1>
            ({currentPatientIndex + 1} of {stats.remainingPatientsCount}) |
            Patient SSN: {patient.ssn} | Contacted patients:{' '}
            {stats.contactedPatientsCount} | Total patients:{' '}
            {stats.totalPatientsCount}
          </h1>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <Button
            type="primary"
            onClick={goToPreviousPatient}
            icon={<LeftOutlined />}
            disabled={currentPatientIndex === 0}
          />
          <Button
            type="primary"
            onClick={() => {
              const newContactedState = !patient.contacted;
              setIsContactedForNext(newContactedState);
              handleUpdateContacted(newContactedState);
            }}
          >
            {patient.contacted ? 'Mark not contacted' : 'Mark contacted'}
          </Button>
          <Button
            type="primary"
            onClick={goToNextPatient}
            icon={<RightOutlined />}
            disabled={currentPatientIndex === uncontactedPatients.length - 1}
          />
        </div>
      </div>

      {/* Maybe as a solution to display more patients from the detailed page - i think it might get in handy */}
      {/*<TreeSelect*/}
      {/*  placeholder={'Patients'}*/}
      {/*  style={{*/}
      {/*    width: '200px',*/}
      {/*  }}*/}
      {/*  dropdownStyle={{*/}
      {/*    maxHeight: 400,*/}
      {/*    overflow: 'auto',*/}
      {/*  }}*/}
      {/*  treeDefaultExpandAll*/}
      {/*/>*/}

      <Descriptions>
        <Descriptions.Item label="First name">
          {patient.firstName}
        </Descriptions.Item>
        <Descriptions.Item label="Last name">
          {patient.lastName}
        </Descriptions.Item>
        <Descriptions.Item label="Contacted">
          {patient.contacted ? 'Yes' : 'No'}
        </Descriptions.Item>
        <Descriptions.Item label="Gender">
          {patient.gender?.name}
        </Descriptions.Item>
        <Descriptions.Item label="Patient created">
          {format(new Date(patient.created), 'dd-MM-yyyy')}
        </Descriptions.Item>
        <Descriptions.Item label="Patient updated">
          {format(new Date(patient.updated), 'dd-MM-yyyy')}
        </Descriptions.Item>
      </Descriptions>

      <p>
        <b>Current Patient Index (not contacted): {currentPatientIndex + 1}</b>
      </p>

      <p
        style={{
          fontSize: '18px',
        }}
      >
        <b>Uncontacted patients</b>
      </p>
      {/*TODO - redirect to detailed page*/}
      <ul className="patient-grid-container">
        {uncontactedPatients?.map((patient) => (
          <li
            key={patient.id}
            className="patient-card"
            onClick={() => history.push(``)}
          >
            <div className="patient-name">
              {patient.firstName} {patient.lastName}
            </div>
            <div className="patient-status">
              <span
                className={`status-tag ${
                  patient.contacted ? 'status-contacted' : 'status-uncontacted'
                }`}
              >
                {patient.contacted ? 'Contacted' : 'Not Contacted'}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/*<p*/}
      {/*  style={{*/}
      {/*    fontSize: '18px',*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <b>Contacted patients</b>*/}
      {/*</p>*/}
    </main>
  );
}

/* ------------------------------------------------------------------------------------------ */
/*    PRE-REFACTORING    */
/* ------------------------------------------------------------------------------------------ */

// import { LeftOutlined, RightOutlined } from '@ant-design/icons';
// import { DetailedPatientDto } from '@contact-patient/dtos';
// import { Button, Descriptions, Skeleton } from 'antd';
// import axios from 'axios';
// import { format } from 'date-fns';
// import { useEffect, useState } from 'react';
// import { RouteComponentProps, useHistory } from 'react-router-dom';
// import { PatientOverviewUrl } from '../urls';
//
// export type PatientPageProps = RouteComponentProps<{ patientId: string }>;
//
// export function PatientPage(props: PatientPageProps) {
//   // Get the history object for navigation
//   const history = useHistory();
//
//   // Get the patient ID from the URL
//   const patientId = props?.match?.params?.patientId;
//
//   // Detailed patient state
//   const [patient, setPatient] = useState<DetailedPatientDto>();
//
//   // State for loading detailed patient
//   const [loadingPatient, setLoadingPatient] = useState(false);
//
//   /* ------------------------------------------------------------------------------------------ */
//
//   // State for all the number of patients
//   const [totalPatients, setTotalPatients] = useState(0);
//   // State for all the patients that wasn't contacted
//   const [remainingPatients, setRemainingPatients] = useState(0);
//   // State for all the patients that were contacted
//   const [contactedPatients, setContactedPatients] = useState(0);
//
//   // Keep track of the remaining patient index
//   const [currentPatientIndex, setCurrentPatientIndex] = useState(0);
//   // Keep all unconnected patients
//   const [uncontactedPatients, setUncontactedPatients] = useState<DetailedPatientDto[]>([]);
//
//   /* ------------------------------------------------------------------------------------------ */
//
//
//   /**
//    * Fetch all unconnected patients.
//    */
//   useEffect(() => {
//     if (!patientId) {
//       return;
//     }
//
//     axios
//       .get(`http://localhost:3333/api/v1/patients?contacted=false`)
//       .then((response) => {
//         if (response?.data) {
//           setUncontactedPatients(response.data);
//         }
//       });
//   });
//
//   /* ------------------------------------------------------------------------------------------ */
//
//   /**
//    * Fetch contacted and remaining patients.
//    */
//   useEffect(() => {
//     if (!patientId) {
//       return;
//     }
//
//     // Contacted patients count
//     axios
//       .get(`http://localhost:3333/api/v1/patients/stats/count?contacted=true`)
//       .then((response) => {
//         if (response?.data) {
//           setContactedPatients(response.data);
//         }
//       });
//
//     // Remaining patients count (those not contacted)
//     axios
//       .get(`http://localhost:3333/api/v1/patients/stats/count?contacted=false`)
//       .then((response) => {
//         if (response?.data) {
//           setRemainingPatients(response.data);
//         }
//       });
//   }, [patient]);
//
//   /* ------------------------------------------------------------------------------------------ */
//
//   /**
//    * Fetch all patients count.
//    */
//   useEffect(() => {
//     if (!patientId) {
//       return;
//     }
//
//     axios
//       .get(`http://localhost:3333/api/v1/patients/stats/count`)
//       .then((response) => {
//         if (response?.data) {
//           setTotalPatients(response.data);
//         }
//       });
//   }, []);
//
//   /* ------------------------------------------------------------------------------------------ */
//
//   /**
//    * Fetch patient details when ID changes.
//    */
//   useEffect(() => {
//     if (!patientId) {
//       return;
//     }
//
//     setLoadingPatient(true);
//     // Fetch patient info
//     axios
//       .get(`http://localhost:3333/api/v1/patients/${patientId}`)
//       .then((response) => {
//         if (response?.data) {
//           setPatient(response.data);
//         }
//         setLoadingPatient(false);
//       });
//   }, [patientId]);
//
//   /* ------------------------------------------------------------------------------------------ */
//
//   /**
//    * Function for marking a patient as contacted or not contacted.
//    * @param newContactedValue
//    */
//   const markContacted = async (newContactedValue: boolean) => {
//     try {
//       const response = await axios.patch(
//         `http://localhost:3333/api/v1/patients/${patientId}`,
//         {
//           contacted: newContactedValue,
//         }
//       );
//
//       // Keep existing fields and updates only the changed fields
//       setPatient((prevPatient) => ({
//         ...prevPatient,
//         ...response.data,
//       }));
//
//     } catch (error) {
//       console.error('Error updating patient:', error);
//     }
//   };
//
//   /* ------------------------------------------------------------------------------------------ */
//
//   /**
//    * Function for going to the previous patient.
//    */
//   const goToPreviousPatient = () => {
//     if (currentPatientIndex > 0) {
//       const previousIndex = currentPatientIndex - 1;
//       const previousPatientId = uncontactedPatients[previousIndex].id;
//       history.push(`/patient/${previousPatientId}`);
//       setCurrentPatientIndex(previousIndex);
//     }
//   };
//
//   /**
//    * Function for going to the next patient.
//    */
//   const goToNextPatient = () => {
//     if (currentPatientIndex < uncontactedPatients.length - 1) {
//       const nextIndex = currentPatientIndex + 1;
//       const nextPatientId = uncontactedPatients[nextIndex].id;
//       history.push(`/patient/${nextPatientId}`);
//       setCurrentPatientIndex(nextIndex);
//     }
//   };
//
//   // If loading patient, show loading animation
//   if (loadingPatient) {
//     return <Skeleton />;
//   }
//
//   // If no patient found for id, show an error message
//   if (!patient) {
//     return <p>No patient found for id: "{patientId}"</p>;
//   }
//
//   return (
//     <div>
//       <div
//         style={{
//           display: 'flex',
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           marginBottom: '50px',
//         }}
//       >
//         <div
//           style={{
//             display: 'flex',
//             flexDirection: 'row',
//             justifyContent: 'center',
//             alignItems: 'center',
//             gap: '16px',
//           }}
//         >
//           <Button
//             icon={<LeftOutlined />}
//             onClick={() => history.push(PatientOverviewUrl)}
//           />
//           <h1>
//             ({currentPatientIndex + 1} of {remainingPatients}) | Patient SSN:{' '}
//             {patient.ssn} | Contacted patients: {contactedPatients} | Total
//             patients: {totalPatients}
//           </h1>
//         </div>
//
//         <div
//           style={{
//             display: 'flex',
//             flexDirection: 'row',
//             justifyContent: 'center',
//             alignItems: 'center',
//             gap: '16px',
//           }}
//         >
//           <Button
//             type="primary"
//             onClick={() => goToPreviousPatient()}
//             icon={<LeftOutlined />}
//             disabled={currentPatientIndex === 0}
//           />
//           <Button
//             type="primary"
//             onClick={() => markContacted(!patient.contacted)}
//           >
//             {patient.contacted ? 'Mark not contacted' : 'Mark contacted'}
//           </Button>
//           <Button
//             type="primary"
//             onClick={() => goToNextPatient()}
//             icon={<RightOutlined />}
//             disabled={currentPatientIndex === uncontactedPatients.length - 1}
//           />
//         </div>
//       </div>
//
//       <Descriptions>
//         <Descriptions.Item label="First name">
//           {patient.firstName}
//         </Descriptions.Item>
//         <Descriptions.Item label="Last name">
//           {patient.lastName}
//         </Descriptions.Item>
//         <Descriptions.Item label="Contacted">
//           {patient.contacted ? 'Yes' : 'No'}
//         </Descriptions.Item>
//         <Descriptions.Item label="Gender">
//           {patient.gender?.name}
//         </Descriptions.Item>
//         <Descriptions.Item label="Patient created">
//           {format(new Date(patient.created), 'dd-MM-yyyy')}
//         </Descriptions.Item>
//         <Descriptions.Item label="Patient updated">
//           {format(new Date(patient.updated), 'dd-MM-yyyy')}
//         </Descriptions.Item>
//       </Descriptions>
//
//       <p>
//         <b>Current Patient Index (not contacted): {currentPatientIndex + 1}</b>
//       </p>
//       <p>
//         <b>Uncontacted patients:</b>
//       </p>
//       <ul>
//         {uncontactedPatients?.map((patient: any) => (
//           <li key={patient.id}>
//             {patient.firstName} {patient.lastName} (
//             {patient.contacted ? 'Contacted' : 'Not Contacted'})
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
