import { useEffect, useState } from 'react';
import {
  fetchPatient,
  fetchUncontactedPatients,
  fetchPatientStats,
  updateContactedPatient,
} from '../services/patientService';
import { DetailedPatientDto } from '@contact-patient/dtos';


// Extracted the data-fetching logic into a custom hook to make the component cleaner and more reusable
/* ------------------------------------------------------------------------------------------ */

/**
 * Custom hook to fetch and manage patient data.
 * @param {string} patientId - UUID of the patient
 * @returns {{
 *   patient: DetailedPatientDto;
 *   loadingPatient: boolean;
 *   uncontactedPatients: DetailedPatientDto[];
 *   stats: {
 *     totalPatientsCount: number;
 *     contactedPatientsCount: number;
 *     remainingPatientsCount: number;
 *   };
 *   handleUpdateContacted: (newContactedValue: boolean) => Promise<void>;
 * }} - The state and functions related to patient data
 */
export const usePatientData = (patientId: string)=> {
  const [patient, setPatient] = useState<DetailedPatientDto>();
  const [loadingPatient, setLoadingPatient] = useState(false);
  const [uncontactedPatients, setUncontactedPatients] = useState<DetailedPatientDto[]>([]);
  const [stats, setStats] = useState({
    totalPatientsCount: 0,
    contactedPatientsCount: 0,
    remainingPatientsCount: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      setLoadingPatient(true);

      try {
        const [patientData, uncontactedData, statsData] = await Promise.all([
          fetchPatient(patientId),
          fetchUncontactedPatients(),
          fetchPatientStats(),
        ]);

        setPatient(patientData);
        setUncontactedPatients(uncontactedData);
        setStats(statsData);

      } catch (error) {
        console.error('Error loading patient data:', error);
      } finally {
        setLoadingPatient(false);
      }
    }

    if (patientId) {
      loadData().then();
    }
  }, [patientId]);

  /**
   * Helper function (could be exported somewhere else)
   *
   * Updates the patient's contacted status and refreshes patient statistics
   * @param {boolean} newContactedValue - The new contacted status of the patient
   * @returns {Promise<void>} - used in the detailed patient page
   */
  const handleUpdateContacted = async (newContactedValue: boolean): Promise<void> => {
    try {
      const updatedPatient = await updateContactedPatient(patientId, newContactedValue);
      setPatient((prevPatient) => ({
        ...prevPatient,
        ...updatedPatient,
      }));

      // Re-fetch the stats and uncontacted patients list
      const [updatedStats, updatedUncontactedPatients] = await Promise.all([
        fetchPatientStats(),
        fetchUncontactedPatients(),
      ]);

      setStats(updatedStats);
      setUncontactedPatients(updatedUncontactedPatients);

    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  return {
    patient,
    loadingPatient,
    uncontactedPatients,
    stats,
    handleUpdateContacted,
  };
};
