import axios from 'axios';
import { DetailedPatientDto, PatientStatsDTO } from '@contact-patient/dtos';

/* API calls in a separate service file for better organization and reusability */
/* ------------------------------------------------------------------------------------------ */

// TODO - Use .env
const API_BASE_URL = 'http://localhost:3333/api/v1/patients';

/**
 * Fetches the details of a patient by their unique identifier
 * @param {string} patientId - UUID of the patient
 * @returns {Promise<DetailedPatientDto>} - The patient data retrieved from the API
 */
export const fetchPatient = async (
  patientId: string
): Promise<DetailedPatientDto> => {
  const response = await axios.get(`${API_BASE_URL}/${patientId}`);
  return response.data;
};

/**
 * Fetch the number of all patients
 * @returns {Promise<number>} - All patients count
 */
export const fetchAllPatientsCount = async (): Promise<number> => {
  const response = await axios.get(`${API_BASE_URL}/stats/count`);
  return response.data;
};

/**
 * Fetch the number of all contacted patients
 * @returns {Promise<number>} - All contacted patients count
 */
export const fetchContactedPatientsCount = async (): Promise<number> => {
  const response = await axios.get(
    `${API_BASE_URL}/stats/count?contacted=true`
  );
  return response.data;
};

/**
 * Fetch the number of all uncontacted patients
 * @returns {Promise<number>} - All contacted patients count
 */
export const fetchUncontactedPatientsCount = async (): Promise<number> => {
  const response = await axios.get(
    `${API_BASE_URL}/stats/count?contacted=false`
  );
  return response.data;
};

/**
 * Fetch patients that are not yet contacted
 * @returns {Promise<DetailedPatientDto[]>} - Array of data of all uncontacted patients
 */
export const fetchUncontactedPatients = async (): Promise<
  DetailedPatientDto[]
> => {
  const response = await axios.get(`${API_BASE_URL}?contacted=false`);
  return response.data;
};

/**
 * Fetch patients that are already contacted
 * @returns {Promise<DetailedPatientDto[]>} - Array of data of all contacted patients
 */
export const fetchContactedPatients = async (): Promise<
  DetailedPatientDto[]
> => {
  const response = await axios.get(`${API_BASE_URL}?contacted=true`);
  return response.data;
};

/**
 * Fetch patients' data:
 *  {number} totalPatientsCount - total count of patients
 *  {number} contactedPatientsCount - total count of all contacted patients
 *  {number} remainingPatientsCount - total count of all uncontacted patients
 * @returns {Promise<PatientStatsDTO>} - patients' stats
 */
export const fetchPatientStats = async (): Promise<PatientStatsDTO> => {
  const [total, contacted, remaining] = await Promise.all([
    fetchAllPatientsCount(),
    fetchContactedPatientsCount(),
    fetchUncontactedPatientsCount(),
  ]);
  return {
    totalPatientsCount: total,
    contactedPatientsCount: contacted,
    remainingPatientsCount: remaining,
  };
};

/**
 * Partially update (PATCH) patients' data:
 * @params {string} patientId - UUID of the patient
 * @params {boolean} contacted - Was patient contacted
 * @returns {Promise<DetailedPatientDto>} - all the previous patient info, with the field contacted changed
 */
export const updateContactedPatient = async (
  patientId: string,
  contacted: boolean
): Promise<DetailedPatientDto> => {
  const response = await axios.patch(`${API_BASE_URL}/${patientId}`, {
    contacted,
  });
  return response.data;
};
